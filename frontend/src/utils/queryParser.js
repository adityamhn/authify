export const encodeQuery = (query) => {
  return encodeURIComponent(query).replace(/%20/g, "+");
};

export const decodeQuery = (encodedQuery) => {
  return decodeURIComponent(encodedQuery.replace(/\+/g, " "));
};
