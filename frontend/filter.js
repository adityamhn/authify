function advanceFilter(q, toFind) {
    // Initialize an object to store filter values
    const filters = {};
  
    // Split the query string into parts
    const parts = q.split(/\s+/);
  
    // Initialize the search term as an empty array
    const searchTermParts = [];
    let processFilters = true;
  
    // Iterate through the parts to extract filters and search terms
    for (const part of parts) {
      if (processFilters) {
        let found = false;
  
        // Check if the part starts with a valid filter
        for (const filter of toFind) {
          if (part.startsWith(`${filter}=`)) {
            const filterValue = part.slice(filter.length + 1);
  
            // Initialize the filter as an array if it doesn't exist
            if (!filters[filter]) {
              filters[filter] = [];
            }
  
            // Add the filter value to the array
            filters[filter].push(filterValue);
            found = true;
            break;
          }
        }
  
        // If the part doesn't match any filter, stop processing filters
        if (!found) {
          processFilters = false;
          searchTermParts.push(part);
        }
      } else {
        searchTermParts.push(part);
      }
    }
  
    // Combine the search term parts back into a single string
    const searchTerm = searchTermParts.join(' ');
  
    return { filters, searchTerm };
  }
  
  // Example usage:
  const query = "role=admin tenant=bugbase tenant=mmt resource=profile user=aditya xyz role=viewer";
  const validFilters = ["role", "resource", "user"];
  const { filters, searchTerm } = advanceFilter(query, validFilters);
  console.log("Filters:", filters);
  console.log("Search Term:", searchTerm);
  