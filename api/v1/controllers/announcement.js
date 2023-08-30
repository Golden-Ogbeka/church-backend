const { getUserDetails } = require('./../../../functions/auth');
const { getPaginationOptions } = require('./../../../utils/pagination');
const { validationResult } = require('express-validator');
const { getDateFilters } = require('../../../functions/filters');

const Controller = () => {
  const GetAllAnnouncements = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const paginationOptions = getPaginationOptions(req, { priority: -1 }); //sort by priority

      // find all announcements

      const announcementsData = await AnnouncementsModel.paginate(
        getDateFilters(req),
        paginationOptions
      );

      return res.status(200).json({
        message: 'All Announcements Retrieved',
        data: announcementsData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const AddAnnouncement = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      //   Check for image image
      const imageFile = req.file;
      if (!imageFile)
        return res.status(404).json({ message: 'No image uploaded' });

      let { details, priority, title } = req.body;

      const userDetails = await getUserDetails(req);
      const newAnnouncement = new AnnouncementsModel({
        details,
        priority,
        title,
        image: imageFile.path,
        createdBy: userDetails.fullname,
        updatedBy: userDetails.fullname,
      });

      await newAnnouncement.save();

      return res.status(200).json({
        message: 'Announcement added successfully',
        announcement: newAnnouncement,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const ViewAnnouncement = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find announcement

      const announcementData = await AnnouncementsModel.findById(id);

      if (!announcementData)
        return res.status(404).json({ message: 'Announcement not found' });

      return res.status(200).json({
        message: 'Announcement retrieved successfully',
        announcement: announcementData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const UpdateAnnouncement = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let { details, priority, title } = req.body;

      const { id } = req.params;

      const userDetails = await getUserDetails(req);

      // Check if Announcement exists for this date
      const existingAnnouncement = await AnnouncementsModel.findById(id);

      if (!existingAnnouncement)
        return res.status(404).json({ message: 'Announcement not found' });

      existingAnnouncement.title = title;
      existingAnnouncement.details = details
        ? details
        : existingAnnouncement.details;
      existingAnnouncement.priority = priority;
      existingAnnouncement.image = req.file
        ? req.file.path
        : existingAnnouncement.image;
      existingAnnouncement.updatedBy = userDetails.fullname;

      await existingAnnouncement.save();

      return res.status(200).json({
        message: 'Announcement updated successfully',
        announcement: existingAnnouncement,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const DeleteAnnouncement = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find announcement

      const announcementData = await AnnouncementsModel.findById(id);

      if (!announcementData)
        return res.status(404).json({ message: 'Announcement not found' });

      await AnnouncementsModel.findByIdAndDelete(id);

      return res.status(200).json({
        message: 'Announcement deleted Successfully',
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    GetAllAnnouncements,
    AddAnnouncement,
    ViewAnnouncement,
    DeleteAnnouncement,
    UpdateAnnouncement,
  };
};

module.exports = Controller;
