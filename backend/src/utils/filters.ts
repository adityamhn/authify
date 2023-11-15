interface advanceFilter {
  q: string;
  toFind: string[];
}

export const advanceFilter = ({ q, toFind }: advanceFilter) => {
  const filters: any = {};
  const parts = q.split(/\s+/);

  const searchTermParts = [];
  let processFilters = true;

  for (const part of parts) {
    if (processFilters) {
      let found = false;

      for (const filter of toFind) {
        if (part.startsWith(`${filter}=`)) {
          const filterValue = part.slice(filter.length + 1);

          if (!filters[filter]) {
            filters[filter] = [];
          }

          filters[filter].push(filterValue);
          found = true;
          break;
        }
      }

      if (!found) {
        processFilters = false;
        searchTermParts.push(part);
      }
    } else {
      searchTermParts.push(part);
    }
  }

  const searchTerm = searchTermParts.join(" ");

  console.log({ filters, searchTerm });

  return { filters, searchTerm };
};
