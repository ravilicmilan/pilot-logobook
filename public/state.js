function setState(newObjVal) {
  const arr = Object.entries(newObjVal);

  arr.forEach((a) => {
    const [key, value] = a;
    APP[key] = value;
  });
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function addNewSearchParam(searchParams) {
  // { searchKey: '', operator: '', searchValue: ''  }
  const oldSearchParams = [...APP.searchParams];
  oldSearchParams.push(searchParams);
  setState({ searchParams: oldSearchParams });
}

function updateSearchParams(id, searchParams) {
  const oldSearchParams = [...APP.searchParams];
  oldSearchParams.forEach((param) => {
    if (param.id === id) {
      Object.keys(searchParams).forEach((key) => {
        param[key] = searchParams[key];
      });
    }
  });

  setState({ searchParams: oldSearchParams });
}

function removeSearchParams(id) {
  const oldSearchParams = [...APP.searchParams];
  const newSearchParams = oldSearchParams.filter((search) => search.id !== id);
  setState({ searchParams: newSearchParams });
}
