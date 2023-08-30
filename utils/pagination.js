const myCustomLabels = {
  totalDocs: 'totalResults',
  docs: 'results',
  limit: 'resultsPerPage',
  page: 'currentPage',
  nextPage: 'nextPage',
  prevPage: 'prevPage',
  totalPages: 'totalPages',
  // pagingCounter: 'slNo',
  meta: 'pagination',
};

const getPaginationOptions = (req, sortBy) => {
  const { page = 1, limit } = req.query;

  const defaultLimit = Number(process.env.PAGE_LIMIT);

  const pageOptions = {
    page,
    limit: limit || defaultLimit,
    customLabels: myCustomLabels,
    sort: sortBy ? sortBy : { createdAt: -1 },
  };

  return pageOptions;
};

module.exports = { getPaginationOptions };
