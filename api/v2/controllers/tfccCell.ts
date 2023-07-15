import { getResponseVariables } from './../../../functions/pagination';
import { getUserDetails } from '../../../functions/auth';
import { TFCCType } from '../../../types/index';
import { getPaginationOptions } from '../../../utils/pagination';
import { validationResult } from 'express-validator';
import express from 'express';
import { TFFDocumentType } from '../../v1/models/tfcc.model';
import {
  getDateFilters,
  getSequelizeDateFilters,
} from '../../../functions/filters';
import { TFCCCellModel, TFCCCellModelAttributes } from '../models/tfccCell';
import { paginate } from '../../../functions/pagination';
import { ChurchesModel } from '../models/churches';
import { TFCCZoneModel } from '../models/tfccZone';
import { TFCCLeaderModel } from '../models/tfccLeader';

export default () => {
  const GetAllCells = async (
    req: express.Request<
      never,
      never,
      never,
      { page: number; limit: number; from: string; to: string }
    >,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { from, to, limit, page } = req.query;

      // find all cells

      const cellsData = await TFCCCellModel.findAndCountAll({
        include: [ChurchesModel, TFCCZoneModel],
        order: [['zone_id', 'ASC']],
        ...getSequelizeDateFilters({ from, to }),
        ...paginate({ limit, page }),
      });

      return res.status(200).json({
        message: 'All Cells Retrieved',
        data: getResponseVariables(cellsData, limit),
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewCell = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find cell

      const cellData = await TFCCCellModel.findByPk(id, {
        include: [ChurchesModel, TFCCZoneModel],
      });

      if (!cellData) return res.status(404).json({ message: 'Cell not found' });

      return res.status(200).json({
        message: 'Cell retrieved successfully',
        cell: cellData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const AddCell = async (
    req: express.Request<never, never, TFCCCellModelAttributes>,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { church_id, zone_id, host_address, cell_leader_id } = req.body;

      const cellLeader = await TFCCLeaderModel.findByPk(cell_leader_id);

      if (!cellLeader)
        return res.status(404).json({ message: 'Cell Leader not found' });

      const cellData = await TFCCCellModel.create({
        church_id,
        zone_id,
        host_address,
        cell_leader: cellLeader.firstname + ' ' + cellLeader.lastname,
        cell_leader_id,
        phone: cellLeader.mobile,
        email: cellLeader.email,
      });

      return res.status(200).json({
        message: 'TFCC Cell added',
        cell: cellData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateCell = async (
    req: express.Request<{ id: string }, never, TFCCCellModelAttributes>,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let { church_id, zone_id, host_address, cell_leader_id } = req.body;

      const { id } = req.params;

      // Check if Cell exists
      const existingCell: TFCCCellModelAttributes | null =
        await TFCCCellModel.findByPk(id);

      if (!existingCell)
        return res.status(404).json({ message: 'Cell not found' });

      const cellLeader = await TFCCLeaderModel.findByPk(cell_leader_id);

      if (!cellLeader)
        return res.status(404).json({ message: 'Cell Leader not found' });

      existingCell.church_id = church_id;
      existingCell.zone_id = zone_id;
      existingCell.host_address = host_address;
      existingCell.cell_leader =
        cellLeader.firstname + ' ' + cellLeader.lastname;
      existingCell.cell_leader_id = cell_leader_id;
      existingCell.phone = cellLeader.mobile;
      existingCell.email = cellLeader.email;

      await existingCell.save();

      return res.status(200).json({
        message: 'Cell updated successfully',
        cell: existingCell,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteCell = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find cell

      const cellData = await TFCCCellModel.findByPk(id);

      if (!cellData) return res.status(404).json({ message: 'Cell not found' });

      await TFCCCellModel.destroy({ where: { cell_id: id } });

      return res.status(200).json({
        message: 'Cell deleted Successfully',
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  return {
    GetAllCells,
    AddCell,
    ViewCell,
    UpdateCell,
    DeleteCell,
  };
};
