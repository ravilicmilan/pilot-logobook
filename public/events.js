function handleCloseForm(e) {
  // console.log('CLOSE FORM');
  closeModal();
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
  loadModal('logbook');
  const id = parseInt(this.id.split('edit-btn-')[1]);
  setState({ editMode: true, currentId: id });
  const data = findRecordById(id);

  Object.keys(data).forEach((key) => {
    if (key !== 'id') {
      const inputField = _dom.id(`input-${key}`);
      inputField.value = data[key];
    }
  });
}

function changePage(pageNum) {
  const data = getPageData(parseInt(pageNum), APP.logbookData);
  setState({ dataForPage: data });
  populateTable(data);
  updatePaginationUI();
  const { dataForSubtotal, dataForTotal } = getTotalsForPage();
  populateTableFooter(dataForSubtotal, dataForTotal);
}

function handleFirstPage(e) {
  if (APP.currentPage > 1) {
    setState({ currentPage: 1 });
    changePage(1);
  }
}

function handlePrevPage(e) {
  let newPage = APP.currentPage - 1;
  if (newPage > 1) {
    setState({ currentPage: newPage });
    changePage(newPage);
  }
}

function handleNextPage(e) {
  let newPage = APP.currentPage + 1;
  if (newPage <= APP.maxPage) {
    setState({ currentPage: newPage });
    changePage(newPage);
  }
}

function handleLastPage(e) {
  if (APP.currentPage < APP.maxPage) {
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
      const preparedData = stripSecondsFromTime(data);
      localStorage.setItem('logbook', JSON.stringify(preparedData));
      setInitialData(preparedData);
      createMainUI();
    })
    .catch((err) => {
      console.log('ERROR GET ALL RECORDS', err);
    });
}

function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(UI.logbookForm);
  const data = Object.fromEntries(formData);

  if (APP.editMode) {
    data.id = APP.currentId;
    handleUpdateData(data);
  } else {
    handlePostNewEntry(data);
  }

  closeModal();
}

function handleNewEntryButtonClick(e) {
  loadModal('logbook');
  setState({ editMode: false });
  tableColumnKeys.forEach((obj) => {
    const arr = Object.entries(obj);
    const key = arr[0][0];
    const inputField = _dom.id(`input-${key}`);
    inputField.value = '';
  });

  _dom.id('input-page_num').value = APP.currentPage;
  _dom.id('input-date').value = formatDate(new Date());
}

function handleUpdateData(data) {
  updateRecord(data)
    .then((res) => {
      const updateData = stripSecondsFromTime(res);
      const updateObj = updateData[0];
      updateRowInTable(updateObj);
      const logbookData = JSON.parse(localStorage.getItem('logbook'));
      logbookData.forEach((obj) => {
        if (obj.id === updateObj.id) {
          Object.keys(obj).forEach((key) => {
            obj[key] = updateObj[key];
          });
        }
      });
      localStorage.setItem('logbook', JSON.stringify(logbookData));

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
  let url = new URL(window.location.href);
  let params = url.searchParams;
  params.delete('search');
  window.history.replaceState(null, '', url.href);
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

    setState({ searchMode: false });
    UI.toggleSearchBtn.innerHTML = 'SHOW SEARCH';
    resetSearch();
  }
}

function handleFindButtonClick() {
  executeSearch(APP.searchParams);
}

function executeSearch(searchParams) {
  setState({ searchMode: true });
  const obj = {};

  searchParams.forEach((param) => {
    let { searchKey, operator, searchValue } = param;
    if (searchValue && searchValue !== null && searchValue !== '') {
      if (Number(searchValue)) {
        searchValue = Number(searchValue);
      }

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
  // console.log('CHANGE EVENT COMBO LABEL"""', this.value);
  const id = this.id.split('search-label-combo-')[1];
  if (this.value === 'type_of_flight') {
    changeInputForComboBox(id);
  } else {
    changeComboBoxForInput(id);
  }
  // console.log('STA SU PARAMS:::', id, this.value);
  updateSearchParams(id, { searchKey: this.value });
}

function handleAddNewSearchParamClick(e) {
  // console.log('ADD NEW SEARCH PARAM:', APP.searchParams);
  const id = _dom.uid();
  const key = 'date';
  addNewRowIntoSearchParams(id, key);
  addNewSearchParam({ id, searchKey: key, operator: '=', searchValue: null });
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
  // console.log('VALUE CHANGE', this.value);
  let id;
  if (this.id.includes('search-combo')) {
    id = this.id.split('search-combo-')[1];
  } else {
    id = this.id.split('search-input-')[1];
  }

  updateSearchParams(id, { searchValue: this.value });
}

function handlePrintModal(e) {
  loadModal('print');
}

function handleExecutePrint() {
  const formData = new FormData(UI.printForm);
  const data = Object.fromEntries(formData);

  const elements = [];
  tableColumnKeys.forEach((column) => {
    const [key, value] = Object.entries(column)[0];
    const id = `check_${key}`;
    if (!data.hasOwnProperty(id)) {
      elements.push(key);
    }
  });

  printContent(elements);
  closeModal();
}

function handleClosePrintModal() {
  closeModal();
}

function loadModal(type) {
  if (type === 'logbook') {
    UI.logbookForm.classList.add('show');
    UI.modalInner.appendChild(UI.logbookForm);
  } else if (type === 'print') {
    UI.printModal.classList.add('show');
    UI.modalInner.appendChild(UI.printModal);
  }

  toggleModal();
}

function closeModal() {
  UI.modal.classList.remove('show');
  UI.modalInner.innerHTML = '';
}
