function setState (newObjVal) {
  const arr = Object.entries(newObjVal);

  arr.forEach(a => {
    const [key, value] = a;
    APP[key] = value;
  });
}

function deepCopy (obj) {
  return JSON.parse(JSON.stringify(obj));
}

function addNewSearchParam (searchParams) {
  // { searchKey: '', operator: '', searchValue: ''  }
  const oldSearchParams = [...APP.searchParams];
  if (oldSearchParams.length > 0) {
    const keyExists = oldSearchParams.find(o => o.searchKey === searchParams.searchKey);
    if (!keyExists) {
      oldSearchParams.push(searchParams);
    }
  } else {
    oldSearchParams.push(searchParams);
  }
  
  setState({ searchParams: oldSearchParams });
}

function updateSearchParams (id, searchParams) {
  const oldSearchParams = [...APP.searchParams];
  oldSearchParams.forEach((param, idx) => {
    if (idx === parseInt(id)) {
      Object.keys(searchParams).forEach(key => {
        param[key] = searchParams[key];
      });
    }
  });

  setState({ searchParams: oldSearchParams });
}

function removeSearchParams (id) {
  const oldSearchParams = [...APP.searchParams];
  // const newSearchParams = oldSearchParams.splice(id, 1);
  const newSearchParams = oldSearchParams.filter((key, idx) => idx !== parseInt(id));
  setState({ searchParams: newSearchParams });
}