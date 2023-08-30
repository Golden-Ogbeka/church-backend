const { validationResult } = require('express-validator');
const { DepartmentModel } = require('../models/department');

const Controller = () => {
  const GetAllDepartments = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      // find all departments
      const departmentsData = await DepartmentModel.findAll({
        order: [['id', 'ASC']],
      });

      return res.status(200).json({
        message: 'All Departments Retrieved',
        data: departmentsData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewDepartment = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find department
      const departmentData = await DepartmentModel.findByPk(id);

      if (!departmentData)
        return res.status(404).json({ message: 'Department not found' });

      return res.status(200).json({
        message: 'Department retrieved',
        department: departmentData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const AddDepartment = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { names } = req.body;

      // check if department exists
      let existingDepartment = await DepartmentModel.findOne({
        where: { names },
      });
      if (existingDepartment && Object.keys(existingDepartment.toJSON()).length)
        return res.status(400).json({ message: 'Department already exists' });

      let newDepartment = await DepartmentModel.create({
        names,
      });

      return res.status(200).json({
        message: 'Department Added',
        department: newDepartment,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateDepartment = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { names } = req.body;
      const { id } = req.params;

      // check if department exists
      let existingDepartment = await DepartmentModel.findByPk(id);
      if (!existingDepartment)
        return res.status(400).json({ message: 'Department not found' });

      // Check if other department exists with this name
      if (names) {
        const existingDepartmentWithName = await DepartmentModel.findOne({
          where: { names },
        });
        if (
          existingDepartmentWithName &&
          JSON.stringify(existingDepartmentWithName) !==
            JSON.stringify(existingDepartment)
        )
          return res
            .status(400)
            .json({ message: 'Department with this name already exists' });
      }

      existingDepartment.names = names || existingDepartment.names;
      existingDepartment.save();

      return res.status(200).json({
        message: 'Department Updated',
        department: existingDepartment,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteDepartment = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // check if department exists
      let existingDepartment = await DepartmentModel.findByPk(id);
      if (!existingDepartment)
        return res.status(400).json({ message: 'Department not found' });

      await existingDepartment.destroy();

      return res.status(200).json({
        message: 'Department Deleted',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  return {
    GetAllDepartments,
    ViewDepartment,
    AddDepartment,
    DeleteDepartment,
    UpdateDepartment,
  };
};

module.exports = Controller;
