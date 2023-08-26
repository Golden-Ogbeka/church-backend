const DEFAULT_PAGE_LIMIT = 20;

const paginate = ({ page, limit = DEFAULT_PAGE_LIMIT }) => {
  if (!page) {
    throw Error('Please select a page');
  }

  // in case page is less than or equal to zero, change to 1
  if (page <= 0) {
    page = 1;
  }
  const offset = (page - 1) * limit;

  return {
    offset,
    limit: Number(limit), // it's coming in as a string,
  };
};

const getPages = (data, limit) => {
  const pages = Math.ceil(data.count / (limit || DEFAULT_PAGE_LIMIT));

  return pages;
};

const getResponseVariables = (data, limit) => {
  const pages = getPages(data, limit | DEFAULT_PAGE_LIMIT);

  const response = {
    data: data.rows,
    totalResults: data.count,
    totalPages: pages,
    limit: limit | DEFAULT_PAGE_LIMIT,
  };

  return response;
};

module.exports = {
  DEFAULT_PAGE_LIMIT,
  paginate,
  getResponseVariables,
  getPages,
};
