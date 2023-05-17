import express from 'express';
const { Op } = require('sequelize');

export const getDateFilters = (
  req: express.Request<
    never,
    never,
    never,
    { page: number; limit: number; from: string; to: string }
  >
) => {
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

export const getSequelizeDateFilters = ({
  from,
  to,
  variableName = 'createdAt',
}: {
  from: string;
  to: string;
  variableName?: string;
}) => {
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
