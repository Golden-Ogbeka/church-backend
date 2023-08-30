const { ObjectId } = require('mongodb');

const isValidAPI = async (value) => {
  const API_KEY = process.env.API_KEY;
  if (API_KEY !== value) {
    throw new Error('Invalid API key');
  }

  return true;
};

const isValidObjectId = (id) => {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ID');
  }
  return true;
};
const isValidSource = (source) => {
  if (!['web', 'mobile'].includes(source)) {
    throw new Error('Source should be either web or mobile');
  }
  return true;
};
const isValidEventType = (type) => {
  if (!['offline', 'online'].includes(type)) {
    throw new Error('Event Type should be either offline or online');
  }
  return true;
};

const isValidStatus = (status) => {
  if (!['pending', 'approved', 'declined', 'archived'].includes(status)) {
    throw new Error(
      'Status should be either pending, approved, declined, archived'
    );
  }
  return true;
};

module.exports = {
  isValidAPI,
  isValidObjectId,
  isValidSource,
  isValidEventType,
  isValidStatus,
};
