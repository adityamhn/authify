export const encodeQuery = (query: string) => {
  return encodeURIComponent(query).replace(/%20/g, "+");
};

export const decodeQuery = (encodedQuery: string) => {
  return decodeURIComponent(encodedQuery.replace(/\+/g, " "));
};
