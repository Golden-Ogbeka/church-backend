const { getUserDetails } = require('./../../../functions/auth');
const { getPaginationOptions } = require('./../../../utils/pagination');
const { validationResult } = require('express-validator');
const TFCCModel = require('../models/tfcc.model');
const { getDateFilters } = require('../../../functions/filters');

const Controller = () => {
  const GetAllCenters = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      // sort by address
      const paginationOptions = getPaginationOptions(req, {
        address: 1,
      });

      // find all centers

      const centersData = await TFCCModel.paginate(
        getDateFilters(req),
        paginationOptions
      );

      return res.status(200).json({
        message: 'All Centers Retrieved',
        data: centersData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const ViewCenter = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find center

      const centerData = await TFCCModel.findById(id);

      if (!centerData)
        return res.status(404).json({ message: 'Center not found' });

      return res.status(200).json({
        message: 'Center retrieved successfully',
        center: centerData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const AddCenter = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { cellLeader, phoneNumber, address, zone } = req.body;

      const centerData = new TFCCModel({
        cellLeader,
        phoneNumber,
        address,
        zone,
      });
      await centerData.save();

      return res.status(200).json({
        message: 'TFCC Center added',
        center: centerData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const UpdateCenter = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let { cellLeader, phoneNumber, address, zone } = req.body;

      const { id } = req.params;

      const userDetails = await getUserDetails(req);

      // Check if Center exists
      const existingCenter = await TFCCModel.findById(id);

      if (!existingCenter)
        return res.status(404).json({ message: 'Center not found' });

      existingCenter.cellLeader = cellLeader;
      existingCenter.phoneNumber = phoneNumber;
      existingCenter.address = address;
      existingCenter.zone = zone;

      existingCenter.updatedBy = userDetails.fullname;

      await existingCenter.save();

      return res.status(200).json({
        message: 'Center updated successfully',
        center: existingCenter,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const DeleteCenter = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find center

      const centerData = await TFCCModel.findById(id);

      if (!centerData)
        return res.status(404).json({ message: 'Center not found' });

      await TFCCModel.findByIdAndDelete(id);

      return res.status(200).json({
        message: 'Center deleted Successfully',
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    GetAllCenters,
    AddCenter,
    ViewCenter,
    UpdateCenter,
    DeleteCenter,
  };
};

module.exports = Controller;
