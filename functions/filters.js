const { Op } = require('sequelize');

const getDateFilters = (req) => {
  const { from, to } = req.query;
  let filters = {};

  if (from && to) {
    filters = {
      date: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    };
  } else {
    filters = {};
  }

  return filters;
};

const getSequelizeDateFilters = ({ from, to, variableName = 'createdAt' }) => {
  let filters = {};

  if (from && to) {
    filters = {
      [variableName]: {
        [Op.gte]: new Date(from),
        [Op.lte]: new Date(to),
      },
    };
  } else {
    filters = {};
  }

  return filters;
};

module.exports = {
  getDateFilters,
  getSequelizeDateFilters,
};
