import { express } from 'express';

export { };

declare global {
  interface TypedRequestBody<T> extends express.Request {
    body: T
  }
  interface TypedRequestQuery<T extends Query> extends express.Request {
    query: T
  }
}