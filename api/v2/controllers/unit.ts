import { validationResult } from 'express-validator';
import express from 'express';
import { DepartmentModel } from '../models/department';
import { UnitModel, UnitModelAttributes } from '../models/unit';

export default () => {
  const GetAllUnits = async (
    req: express.Request<never, never, never, never>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      // find all units
      const unitsData = await UnitModel.findAll({
        include: [DepartmentModel],
        order: [['id', 'ASC']],
      });

      return res.status(200).json({
        message: 'All Units Retrieved',
        data: unitsData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const ViewUnit = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find unit
      const unitData = await UnitModel.findByPk(id);

      if (!unitData) return res.status(404).json({ message: 'Unit not found' });

      return res.status(200).json({
        message: 'Unit retrieved',
        unit: unitData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const AddUnit = async (
    req: express.Request<never, never, UnitModelAttributes>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { u_names, dept_id } = req.body;

      // check if unit exists
      let existingUnit = await UnitModel.findOne({ where: { u_names } });
      if (existingUnit && Object.keys(existingUnit.toJSON()).length)
        return res.status(400).json({ message: 'Unit already exists' });

      // check if department exists
      let existingDepartment = await DepartmentModel.findByPk(dept_id);
      if (!existingDepartment)
        return res.status(400).json({ message: "Department doesn't exist" });

      let newUnit = await UnitModel.create({
        u_names,
        dept_id,
      });

      return res.status(200).json({
        message: 'Unit Added',
        unit: newUnit,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const UpdateUnit = async (
    req: express.Request<{ id: string }, never, UnitModelAttributes>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { u_names, dept_id } = req.body;
      const { id } = req.params;

      // check if unit exists
      let existingUnit = await UnitModel.findByPk(id);
      if (!existingUnit)
        return res.status(400).json({ message: 'Unit not found' });

      // Check if other unit exists with this name
      if (u_names) {
        const existingUnitWithName = await UnitModel.findOne({
          where: { u_names },
        });
        if (
          existingUnitWithName &&
          JSON.stringify(existingUnitWithName) !== JSON.stringify(existingUnit)
        )
          return res
            .status(400)
            .json({ message: 'Unit with this name already exists' });
      }

      if (dept_id) {
        // check if department exists
        let existingDepartment = await DepartmentModel.findByPk(dept_id);
        if (!existingDepartment)
          return res.status(400).json({ message: "Department doesn't exist" });
      }

      existingUnit.u_names = u_names || existingUnit.u_names;
      existingUnit.dept_id = dept_id || existingUnit.dept_id;

      existingUnit.save();

      return res.status(200).json({
        message: 'Unit Updated',
        unit: existingUnit,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const DeleteUnit = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // check if unit exists
      let existingUnit = await UnitModel.findByPk(id);
      if (!existingUnit)
        return res.status(400).json({ message: 'Unit not found' });

      await existingUnit.destroy();

      return res.status(200).json({
        message: 'Unit Deleted',
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    GetAllUnits,
    ViewUnit,
    AddUnit,
    DeleteUnit,
    UpdateUnit,
  };
};
