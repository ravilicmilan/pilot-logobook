function handleCloseForm(e) {
  // console.log('CLOSE FORM');
  toggleModal();
}

function toggleLoader() {
  _dom.toggleClass(UI.loader, 'show');
}

function handlePostNewEntry(data) {
  // console.log('UBACI NOV REKORD');
  insertNewRecord(data)
    .then((res) => {
      addNewRowToTable(res[0]);
    })
    .catch((err) => {
      console.log('GRESKA INSERT', err);
    });
}

function handleRecordEditClick(e) {
  const id = parseInt(this.id.split('edit-btn-')[1]);
  setState({ editMode: true, currentId: id });
  const data = findRecordById(id);

  Object.keys(data).forEach((key) => {
    if (key !== 'id') {
      const inputField = _dom.id(`input-${key}`);
      inputField.value = data[key];
    }
  });

  toggleModal();
}

function changePage(pageNum) {
  const data = getPageData(parseInt(pageNum), APP.logbookData);
  // APP.dataForPage = data;
  setState({ dataForPage: data });
  populateTable(data);
  updatePaginationUI();
  const { dataForSubtotal, dataForTotal } = getTotalsForPage();
  populateTableFooter(dataForSubtotal, dataForTotal);
}

function handleFirstPage(e) {
  if (APP.currentPage > 1) {
    APP.currentPage = 1;
    changePage(1);
  }
}

function handlePrevPage(e) {
  let newPage = APP.currentPage - 1;
  if (newPage > 1) {
    // APP.currentPage = newPage;
    setState({ currentPage: newPage });
    changePage(newPage);
  }
}

function handleNextPage(e) {
  let newPage = APP.currentPage + 1;
  if (newPage <= APP.maxPage) {
    // APP.currentPage = newPage;
    setState({ currentPage: newPage });
    changePage(newPage);
  }
}

function handleLastPage(e) {
  if (APP.currentPage < APP.maxPage) {
    // APP.currentPage = APP.maxPage;
    setState({ currentPage: APP.maxPage });
    changePage(APP.maxPage);
  }
}

function getAllDataFromServer() {
  UI.tableWrapper && UI.tableWrapper.remove();
  UI.paginationWrapper && UI.paginationWrapper.remove();
  UI.modal && UI.modal.remove();
  UI.searchParamsWrapper && UI.searchParamsWrapper.remove();
  UI.buttonsWrapper && UI.buttonsWrapper.remove();

  getAllRecords()
    .then((data) => {
      localStorage.setItem('logbook', JSON.stringify(data));
      setInitialData(data);
      createMainUI();
    })
    .catch((err) => {
      console.log('ERROR GET ALL RECORDS', err);
    });
}

function handleFormSubmit(e) {
  e.preventDefault();
  console.log(e);
  const formData = new FormData(UI.logbookForm);
  const data = Object.fromEntries(formData);
  console.log(data);
  if (APP.editMode) {
    data.id = APP.currentId;
    handleUpdateData(data);
  } else {
    handlePostNewEntry(data);
  }

  toggleModal();
}

function handleNewEntryButtonClick(e) {
  // APP.editMode = false;
  setState({ editMode: false });
  tableColumnKeys.forEach((obj) => {
    const arr = Object.entries(obj);
    const key = arr[0][0];
    const inputField = _dom.id(`input-${key}`);
    inputField.value = '';
  });

  _dom.id('input-page_num').value = APP.currentPage;
  toggleModal();
}

function handleUpdateData(data) {
  updateRecord(data)
    .then((res) => {
      const data = res[0];
      updateRowInTable(data);
      const logbookData = JSON.parse(localStorage.getItem('logbook'));
      logbookData.forEach((obj) => {
        if (obj.id === data.id) {
          Object.keys(obj).forEach((key) => {
            obj[key] = data[key];
          });
        }
      });
      localStorage.setItem('logbook', JSON.stringify(logbookData));
      // APP.logbookData = logbookData;
      // APP.dataForPage = getPageData(APP.currentPage);
      setState({
        logbookData,
        dataForPage: getPageData(APP.currentPage, logbookData),
      });

      const subTotalData = calculateTotals(APP.dataForPage);
      const totalData = calculateTotals(APP.logbookData);
      populateTableFooter(subTotalData, totalData);
    })
    .catch((err) => {
      console.log('UPDATE ERROR:', err);
    });
}

function handleRefreshButtonClick(e) {
  getAllDataFromServer();
}

function handleToggleSearchButtonClick(e) {
  toggleSearchParams();
  if (_dom.hasClass(UI.searchParamsWrapper, 'show')) {
    UI.toggleSearchBtn.innerHTML = 'HIDE SEARCH';
  } else {
    if (APP.searchMode) {
      togglePagination();
    }

    // APP.searchMode = false;
    setState({ searchMode: false });
    UI.toggleSearchBtn.innerHTML = 'SHOW SEARCH';
    const { dataForSubtotal, dataForTotal } = getTotalsForPage();

    populateTableFooter(dataForSubtotal, dataForTotal);
  }
}

function handleFindButtonClick() {
  // APP.searchMode = true;
  setState({ searchMode: true });
  const obj = {};
  APP.searchParams.forEach((param) => {
    const { searchKey, operator, searchValue } = param;
    if (searchValue && searchValue !== null && searchValue !== '') {
      if (operator === '=') {
        obj[searchKey] = searchValue; // WHERE column LIKE %somestring%
      } else if (operator === '<>') {
        const searchValArr = searchValue
          .split(/[,;]/)
          .map((item) => item.trim());
        obj[searchKey] = { operator: 'between', value: searchValArr };
      } else {
        obj[searchKey] = { operator, value: searchValue };
      }
    }
  });

  const data = findRecordsByQuery(obj);
  populateTable(data);
  togglePagination();
  const { totals } = getTotalsForData(data);
  populateTableFooter(null, totals);
}

function handleLoginButtonClick(e) {
  const formData = new FormData(UI.loginForm);
  const data = Object.fromEntries(formData);

  loginUser(data)
    .then((res) => {
      // APP.loggedIn = true;
      setState({ loggedIn: true });
      getInitalData();
      hideLoginUI();
    })
    .catch((err) => {
      console.log('LOGIN ERROR!', err);
    });
}

function hideLoginUI() {
  UI.loginForm.style.display = 'none';
}

function handleDestiantionDepartureTimeBlur(e) {
  const formData = new FormData(UI.logbookForm);
  const data = Object.fromEntries(formData);
  const departureTime = data.departure_time;
  const destinationTime = data.destination_time;

  if (departureTime && destinationTime) {
    const timeFotTotal = timeDiff(departureTime, destinationTime);
    _dom.id('input-total_flight_time').value = timeFotTotal;
  }
}

function handleSearchLabelComboChange(e) {
  // console.log('CHANGE EVENT COMBO LABEL"""', e);
  const id = this.id.split('search-label-combo-')[1];
  if (this.value === 'type_of_flight') {
    changeInputForComboBox(id);
  } else {
    changeComboBoxForInput(id);
  }

  updateSearchParams(id, { searchKey: this.value });
}

function handleAddNewSearchParamClick(e) {
  // console.log('ADD NEW SEARCH PARAM:', APP.searchParams.length);
  const id = APP.searchParams.length;
  const obj = tableColumnKeys[id];
  const [key] = Object.entries(obj)[0];
  addNewRowIntoSearchParams(id, key);
  addNewSearchParam({ searchKey: key, operator: '=', searchValue: null });
}

function changeInputForComboBox(id) {
  const elId = `search-row-params-${id}`;
  const row = _dom.id(elId);
  const input = _dom.id(`search-input-${id}`);
  row.removeChild(input);
  const combo = _dom.create(
    {
      type: 'combobox',
      id: `search-combo-${id}`,
      options: typeOfFlightEnum,
      makeFirstOptionNull: true,
      className: 'search-input',
    },
    row
  );
  combo.addEventListener('change', handleSearchParamValueChange);
}

function changeComboBoxForInput(id) {
  const elId = `search-row-params-${id}`;
  const comboExists = _dom.id(`search-combo-${id}`);
  if (!comboExists) {
    return false;
  }

  const row = _dom.id(elId);
  const comboBox = _dom.id(`search-combo-${id}`);
  row.removeChild(comboBox);
  const input = _dom.create(
    {
      id: `search-input-${id}`,
      type: 'input',
      input: true,
      className: 'search-input',
    },
    row
  );

  input.addEventListener('input', handleSearchParamValueChange);
}

function handleRemoveSearchParamButtonClick(e) {
  // console.log('REMOVE ROW', this.id);
  const id = this.id.split('remove-search-param-')[1];
  const rowId = `search-row-params-${id}`;
  const row = _dom.id(rowId);
  UI.searchUpperRow.removeChild(row);
  removeSearchParams(id);
}

function handleSearchParamOperatorChange(e) {
  // console.log('OPERATOR CHANGE', this.value);
  const id = this.id.split('search-operator-')[1];

  updateSearchParams(id, { operator: this.value });
}

function handleSearchParamValueChange(e) {
  // console.log('VALUE CHANGE', e.target.value);
  let id;
  if (this.id.includes('search-combo')) {
    id = this.id.split('search-combo-')[1];
  } else {
    id = this.id.split('search-input-')[1];
  }

  updateSearchParams(id, { searchValue: this.value });
}
