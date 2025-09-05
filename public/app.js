window.onload = function () {
  checkAuth();
  buildInitialUI();
  if (APP.loggedIn) {
    getInitalData();
  } else {
    createAutUI();
  }
};

function getInitalData () {
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
  APP.logbookData = data;
  APP.maxPage = getMaxPageNum(APP.logbookData);
  APP.currentPage = APP.maxPage;
  APP.dataForPage = getPageData(APP.maxPage);
}

function createAutUI () {
  createLoginForm();
}

function createMainUI () {
  createActionButtons();
  createSearchParams();
  createTable();
  populateTable(APP.dataForPage);
  buildPagination();
  updatePaginationUI();
  buildModal();
  const { dataForSubtotal, dataForTotal } = getTotalsForPage();
  populateTableFooter(dataForSubtotal, dataForTotal);
}

function addNewRowToTable(data) {
  populateRow(data);
  APP.logbookData.push(data);
  APP.dataForPage.push(data);
  localStorage.setItem('logbook', JSON.stringify(APP.logbookData));
}

function updateRowInTable(obj) {
  const id = obj.id;
  const tableRowEl = _dom.id(`row-${id}`);
  const rowChildren = Array.from(tableRowEl.children);

  rowChildren.forEach(el => {
    Object.keys(obj).forEach(key => {
      if (el.className.includes('td-')) {
        const tdKey = el.className.split('td-')[1];
        if (key === tdKey) {
          el.innerHTML = obj[key];
        }
      }
    });
  });

  APP.dataForPage.forEach((o) => {
    if (o.id === id) {
      Object.keys(o).forEach((k) => {
        o[k] = obj[k];
      });
    }
  });
}

function getPageData(pageNum) {
  let dataForPage = [];

  APP.logbookData.forEach((o) => {
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
      // console.log('ITEM VALUE', {item, key, filterValue, itemValue});

      // Handle string properties with a "LIKE" comparison (case-insensitive includes)
      if (typeof itemValue === 'string' && typeof filterValue === 'string') {
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }

      // Handle numeric properties with dynamic operators
      if (
        typeof itemValue === 'number' &&
        typeof filterValue === 'object' &&
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
        typeof itemValue === 'number' &&
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

