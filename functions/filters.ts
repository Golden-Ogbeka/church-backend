import express from 'express';

export const getDateFilters = (req: express.Request<never, never, never, { page: number, limit: number, from: string, to: string }>) => {
  const { from, to } = req.query
  let filters = {}

  if (from && to) {
    filters = {
      date: {
        $gte: new Date(from),
        $lte: new Date(to)
      }
    }

  }
  else {
    filters = {}
  }

  return filters
}