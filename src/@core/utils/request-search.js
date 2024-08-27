export const requestSearch = (query, data) => {
  const searchRegex = new RegExp(`.*${query}.*`, "ig");

  const filteredRows = data?.filter((o) => {
    return Object.keys(o)?.some((k) => {
      return searchRegex?.test(o[k]?.toString());
    });
  });

  return filteredRows;
};
