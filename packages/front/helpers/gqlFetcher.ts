import { request } from "graphql-request";

export const gqlFetcher = (query: string) =>
  request("https://api.zora.co/graphql", query);
