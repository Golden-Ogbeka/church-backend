const { getResponseVariables } = require('./../../../functions/pagination');
const { validationResult } = require('express-validator');
const { getSequelizeDateFilters } = require('../../../functions/filters');
const { TFCCCellModel } = require('../models/tfccCell');
const { paginate } = require('../../../functions/pagination');
const { ChurchesModel } = require('../models/churches');
const { TFCCZoneModel } = require('../models/tfccZone');
const { TFCCLeaderModel } = require('../models/tfccLeader');

const Controller = () => {
  const GetAllCells = async (req, res) => {
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
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewCell = async (req, res) => {
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
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const AddCell = async (req, res) => {
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
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateCell = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let { church_id, zone_id, host_address, cell_leader_id } = req.body;

      const { id } = req.params;

      // Check if Cell exists
      const existingCell = await TFCCCellModel.findByPk(id);

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
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteCell = async (req, res) => {
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
    } catch (error) {
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

module.exports = Controller;
