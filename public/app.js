window.onload = function () {
  checkAuth();
  buildInitialUI();
  if (APP.loggedIn) {
    getInitalData();
  } else {
    createAutUI();
  }
};

function getInitalData() {
  const data = localStorage.getItem('logbook');
  if (!data) {
    // console.log('GET DATA FROM SERVER!');
    getAllDataFromServer();
  } else {
    setInitialData(JSON.parse(data));
    createMainUI();
  }
}

function setInitialData(data) {
  const maxPage = getMaxPageNum(data);

  setState({
    logbookData: data,
    maxPage,
    currentPage: maxPage,
    dataForPage: getPageData(maxPage, data),
  });
}

function createAutUI() {
  createLoginForm();
}

function createMainUI() {
  createActionButtons();
  createSearchParams();
  createTable();
  populateTable(APP.dataForPage);
  buildPagination();
  updatePaginationUI();
  buildModal();
  createLogbookForm();
  createPrintModal();
  const { dataForSubtotal, dataForTotal } = getTotalsForPage();
  populateTableFooter(dataForSubtotal, dataForTotal);

  const searchParams = getSearchFromUrl();
  if (searchParams) {
    executeSearch(searchParams);
  }
}

function addNewRowToTable(data) {
  populateRow(data);
  const oldLogbookData = [...APP.logbookData];
  const oldDataForPage = [...APP.dataForPage];
  oldLogbookData.push(data);
  oldDataForPage.push(data);
  setState({ logbookData: oldLogbookData, dataForPage: oldDataForPage });
  localStorage.setItem('logbook', JSON.stringify(oldLogbookData));
}

function updateRowInTable(obj) {
  const id = obj.id;
  const tableRowEl = _dom.id(`row-${id}`);
  const rowChildren = Array.from(tableRowEl.children);

  rowChildren.forEach((el) => {
    Object.keys(obj).forEach((key) => {
      if (el.className.includes('td-')) {
        const tdKey = el.className.split('td-')[1];
        if (key === tdKey) {
          el.innerHTML = obj[key];
        }
      }
    });
  });

  const oldDataForPage = [...APP.dataForPage];

  oldDataForPage.forEach((o) => {
    if (o.id === id) {
      Object.keys(o).forEach((k) => {
        o[k] = obj[k];
      });
    }
  });

  setState({ dataForPage: oldDataForPage });
}

function getPageData(pageNum, data) {
  let dataForPage = [];

  data.forEach((o) => {
    if (parseInt(o.page_num) === pageNum) {
      dataForPage.push(o);
    }
  });

  return dataForPage;
}

function getMaxPageNum(data) {
  let pageNum = 0;

  data.forEach((o) => {
    if (o.page_num > pageNum) {
      pageNum = o.page_num;
    }
  });

  return pageNum;
}

function findRecordById(id) {
  const data = APP.dataForPage.find((o) => o.id === id);
  return data;
}

function findRecordsByQuery(query) {
  return APP.logbookData.filter((item) => {
    return Object.entries(query).every(([key, filterValue]) => {
      const itemValue = item[key];
      // console.log('ITEM VALUE', { item, key, filterValue, itemValue });

      // Handle string properties with a "LIKE" comparison (case-insensitive includes)
      if (typeof itemValue === 'string' && typeof filterValue === 'string') {
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }

      // Handle numeric properties with dynamic operators
      if (
        (typeof itemValue === 'number' ||
          typeof itemValue === 'string' ||
          typeof filterValue === 'object') &&
        filterValue.operator
      ) {
        switch (filterValue.operator) {
          case '>':
            return itemValue > filterValue.value;
          case '>=':
            return itemValue >= filterValue.value;
          case '<':
            return itemValue < filterValue.value;
          case '<=':
            return itemValue <= filterValue.value;
          case '=':
          case '==':
            return itemValue === filterValue.value;
          case '!=':
            return itemValue !== filterValue.value;
        }
      }

      // Handle numeric ranges
      // The `filterValue` is an object with operator 'between' and a value array [min, max]
      if (
        (typeof itemValue === 'number' || typeof itemValue === 'string') &&
        typeof filterValue === 'object' &&
        filterValue.operator &&
        filterValue.operator === 'between'
      ) {
        const [min, max] = filterValue.value;
        return itemValue >= min && itemValue <= max;
      }

      // Handle exact matches for all other types
      return itemValue === filterValue;
    });
  });
}

function getTotalsForPage() {
  const dataForSubtotal = calculateTotals(APP.dataForPage);
  const filteredData = APP.logbookData.filter(
    (o) => o.page_num <= APP.currentPage
  );
  const dataForTotal = calculateTotals(filteredData);

  return { dataForSubtotal, dataForTotal };
}

function getTotalsForData(data) {
  const totals = calculateTotals(data);
  return { totals };
}

function resetSearch() {
  setState({ searchParams: [] });
  const { dataForSubtotal, dataForTotal } = getTotalsForPage();
  _dom
    .queryAll(UI.searchParamsWrapper, '.search-row-params')
    .forEach((node) => node.remove());
  const data = getPageData(APP.maxPage, APP.logbookData);
  populateTable(data);
  populateTableFooter(dataForSubtotal, dataForTotal);
}
