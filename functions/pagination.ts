import { Model } from 'sequelize';

export const DEFAULT_PAGE_LIMIT = 20;

export const paginate = ({
  page,
  limit = DEFAULT_PAGE_LIMIT,
}: {
  page: number;
  limit: number;
}) => {
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

export const getPages = (
  data: { rows: Model<any, any>[]; count: number },
  limit: number
) => {
  const pages = Math.ceil(data.count / (limit || DEFAULT_PAGE_LIMIT));

  return pages;
};

export const getResponseVariables = (
  data: {
    rows: Model<any, any>[];
    count: number;
  },
  limit: number
) => {
  const pages = getPages(data, limit);

  const response = {
    data: data.rows,
    totalResults: data.count,
    totalPages: pages,
  };

  return response;
};
