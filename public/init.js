function toggleModal() {
  _dom.toggleClass(UI.modal, 'show');
}

function togglePagination() {
  _dom.toggleClass(UI.paginationWrapper, 'show');
}

function buildInitialUI() {
  const header = _dom.create(
    {
      name: 'h1',
      innerHTML: 'PILOT LOG BOOK',
      id: 'header',
      className: ['flex-center', 'flex-column'],
    },
    UI.main
  );
  createLoader();
}

function createLoader() {
  UI.loader = _dom.create({ name: 'div', id: 'loader-overlay' }, UI.main);
  const spinner = _dom.create({ name: 'div', id: 'spinner' }, UI.loader);
  const loaderText = _dom.create(
    { name: 'div', id: 'loader-text', innerHTML: 'Please Wait...' },
    UI.loader
  );
}

function createActionButtons() {
  UI.buttonsWrapper = _dom.create(
    { name: 'div', id: 'button-wrapper' },
    UI.main
  );
  const newEntryBtn = _dom.create(
    {
      name: 'div',
      id: 'new-entry-btn',
      className: ['flex-center', 'flex-column', 'btn', 'primary-btn'],
      innerHTML: 'NEW ENTRY',
    },
    UI.buttonsWrapper
  );
  const refreshBtn = _dom.create(
    {
      name: 'div',
      id: 'refresh-btn',
      className: ['flex-center', 'flex-column', 'btn', 'primary-btn'],
      innerHTML: 'REFRESH',
    },
    UI.buttonsWrapper
  );
  UI.toggleSearchBtn = _dom.create(
    {
      name: 'div',
      id: 'search-btn',
      className: ['flex-center', 'flex-column', 'btn', 'primary-btn'],
      innerHTML: 'SHOW SEARCH',
    },
    UI.buttonsWrapper
  );
  const printBtn = _dom.create(
    {
      name: 'div',
      id: 'print-btn',
      className: ['flex-center', 'flex-column', 'btn', 'primary-btn'],
      innerHTML: 'PRINT',
    },
    UI.buttonsWrapper
  );

  const logoutBtn = _dom.create(
    {
      name: 'div',
      id: 'logout-btn',
      className: ['flex-center', 'flex-column', 'btn', 'close-btn'],
      innerHTML: 'LOGOOUT',
    },
    UI.buttonsWrapper
  );

  newEntryBtn.addEventListener('click', handleNewEntryButtonClick);
  refreshBtn.addEventListener('click', handleRefreshButtonClick);
  UI.toggleSearchBtn.addEventListener('click', handleToggleSearchButtonClick);
  printBtn.addEventListener('click', handlePrintModal);
  logoutBtn.addEventListener('click', handleLogout);
}

function createSearchParams() {
  UI.searchParamsWrapper = _dom.create(
    {
      name: 'div',
      id: 'search-params-wrapper',
      className: ['flex-center', 'flex-column'],
    },
    UI.main
  );

  UI.searchUpperRow = _dom.create(
    {
      name: 'div',
      className: ['flex-center', 'flex-column', 'flex-gap-20'],
    },
    UI.searchParamsWrapper
  );

  const bottomRow = _dom.create(
    {
      name: 'div',
      className: ['flex-center', 'flex-row', 'flex-gap-20'],
    },
    UI.searchParamsWrapper
  );

  const addNewSearchParamBtn = _dom.create(
    {
      name: 'div',
      innerHTML: '+',
      id: `add-new-search-param`,
      className: ['btn', 'primary-btn'],
    },
    bottomRow
  );
  const findBtn = _dom.create(
    {
      name: 'div',
      innerHTML: 'FIND RECORDS',
      id: 'find-btn',
      className: ['btn', 'primary-btn'],
    },
    bottomRow
  );

  addNewSearchParamBtn.addEventListener('click', handleAddNewSearchParamClick);
  findBtn.addEventListener('click', handleFindButtonClick);
}

function addNewRowIntoSearchParams(id, searchKey = 'date') {
  // console.log('STA JE ID SEARHC KEY????', id, searchKey);
  const row = _dom.create(
    {
      name: 'div',
      id: `search-row-params-${id}`,
      className: [
        'flex-center',
        'flex-row',
        'flex-gap-20',
        'search-row-params',
      ],
    },
    UI.searchUpperRow
  );
  const removeSearchParamBtn = _dom.create(
    {
      name: 'div',
      innerHTML: '-',
      id: `remove-search-param-${id}`,
      className: ['btn', 'close-btn'],
    },
    row
  );
  const labelCombo = _dom.create(
    {
      type: 'combobox',
      className: 'search-label-combo',
      id: `search-label-combo-${id}`,
      options: tableColumnKeys,
      value: searchKey || 'date',
    },
    row
  );
  const inputOperator = _dom.create(
    {
      id: `search-operator-${id}`,
      type: 'combobox',
      className: 'search-operator',
      options: searchOperators,
    },
    row
  );
  const inputValue = _dom.create(
    {
      id: `search-input-${id}`,
      type: 'input',
      input: true,
      className: 'search-input',
    },
    row
  );

  labelCombo.addEventListener('change', handleSearchLabelComboChange);
  inputOperator.addEventListener('change', handleSearchParamOperatorChange);
  inputValue.addEventListener('input', handleSearchParamValueChange);

  removeSearchParamBtn.addEventListener(
    'click',
    handleRemoveSearchParamButtonClick
  );
}

function createTable() {
  UI.tableWrapper = _dom.create({ name: 'div', id: 'table-wrapper' }, UI.main);
  UI.table = _dom.create(
    { name: 'table', id: 'logbook-table' },
    UI.tableWrapper
  );
  UI.tableHeader = _dom.create({ name: 'thead' }, UI.table);

  const th = _dom.create({ name: 'th', innerHTML: 'Action' }, UI.tableHeader);

  for (let i = 0; i < tableColumnKeys.length; i++) {
    const column = tableColumnKeys[i];
    const arr = Object.entries(column);
    const [key, value] = arr[0];
    const th = _dom.create(
      { name: 'th', innerHTML: value, className: [`th-${key}`] },
      UI.tableHeader
    );
  }

  UI.tableBody = _dom.create({ name: 'tbody' }, UI.table);

  UI.tableFooter = _dom.create(
    { name: 'tfoot', className: ['footer-on-last-page'] },
    UI.table
  );

  UI.tableFooterSubtotal = _dom.create(
    { name: 'tr', id: `row-subtotal`, className: ['table-row'] },
    UI.tableFooter
  );
  UI.tableFooterTotal = _dom.create(
    { name: 'tr', id: `row-total`, className: ['table-row'] },
    UI.tableFooter
  );

  const subtotalText = _dom.create(
    { name: 'td', innerHTML: 'Subtotal' },
    UI.tableFooterSubtotal
  );
  const totalText = _dom.create(
    { name: 'td', innerHTML: 'Page Total' },
    UI.tableFooterTotal
  );

  for (let i = 0; i < tableColumnKeys.length; i++) {
    const column = tableColumnKeys[i];
    const arr = Object.entries(column);
    const key = arr[0][0];
    const td = _dom.create(
      { name: 'td', id: `subtotal-${key}`, innerHTML: '' },
      UI.tableFooterSubtotal
    );
  }

  for (let i = 0; i < tableColumnKeys.length; i++) {
    const column = tableColumnKeys[i];
    const arr = Object.entries(column);
    const key = arr[0][0];
    const td = _dom.create(
      { name: 'td', id: `total-${key}`, innerHTML: '' },
      UI.tableFooterTotal
    );
  }
}

function populateTable(data) {
  UI.tableBody.innerHTML = '';

  data.forEach((obj) => {
    populateRow(obj);
  });
}

function populateRow(obj) {
  const tableRow = _dom.create(
    { name: 'tr', id: `row-${obj.id}`, className: ['table-row'] },
    UI.tableBody
  );
  const tableData = _dom.create(
    { name: 'td', className: `td-action` },
    tableRow
  );
  const editBtn = _dom.create(
    {
      name: 'div',
      id: `edit-btn-${obj.id}`,
      className: ['flex-center', 'flex-column', 'small-btn', 'success-btn'],
      innerHTML: 'Edit',
    },
    tableData
  );
  editBtn.addEventListener('click', handleRecordEditClick);

  for (let i = 0; i < tableColumnKeys.length; i++) {
    const column = tableColumnKeys[i];
    const arr = Object.entries(column);
    const key = arr[0][0];
    const tableData = _dom.create(
      { name: 'td', className: `td-${key}`, innerHTML: obj[key] },
      tableRow
    );
  }

  tableRow.addEventListener('click', handleRowSelected);
}

function populateTableFooter(subTotalData, totalData) {
  const subtotalCells = Array.from(UI.tableFooterSubtotal.children);
  const totalCells = Array.from(UI.tableFooterTotal.children);
  // console.log('SUBTOTAL:::', subTotalData);
  // console.log('TOTAL::::', totalData);

  if (subTotalData) {
    subtotalCells.forEach((cell) => {
      const key = cell.id.split('subtotal-')[1];
      if (subTotalData[key] || typeof totalData[key] === 'number') {
        cell.innerHTML = subTotalData[key];
      }
    });
    UI.tableFooterSubtotal.style.display = 'table-row';
  } else {
    UI.tableFooterSubtotal.style.display = 'none';
  }

  totalCells.forEach((cell) => {
    const key = cell.id.split('total-')[1];
    if (totalData[key] || typeof totalData[key] === 'number') {
      cell.innerHTML = totalData[key];
    }
  });
}

function updatePaginationUI() {
  if (APP.currentPage >= APP.maxPage) {
    APP.firstPageBtn = true;
    APP.prevPageBtn = true;
    APP.lastPageBtn = false;
    APP.nextPageBtn = false;
  } else if (APP.currentPage <= 1) {
    APP.firstPageBtn = false;
    APP.prevPageBtn = false;
    APP.lastPageBtn = true;
    APP.nextPageBtn = true;
  } else {
    APP.firstPageBtn = true;
    APP.prevPageBtn = true;
    APP.lastPageBtn = true;
    APP.nextPageBtn = true;
  }

  if (APP.firstPageBtn) {
    UI.firstPageBtn.classList.remove('disabled-btn');
  } else {
    UI.firstPageBtn.classList.add('disabled-btn');
  }

  if (APP.prevPageBtn) {
    UI.prevPageBtn.classList.remove('disabled-btn');
  } else {
    UI.prevPageBtn.classList.add('disabled-btn');
  }

  if (APP.nextPageBtn) {
    UI.nextPageBtn.classList.remove('disabled-btn');
  } else {
    UI.nextPageBtn.classList.add('disabled-btn');
  }

  if (APP.lastPageBtn) {
    UI.lastPageBtn.classList.remove('disabled-btn');
  } else {
    UI.lastPageBtn.classList.add('disabled-btn');
  }

  UI.pageNumDiv.innerHTML = `${APP.currentPage} / ${APP.maxPage}`;
}

function buildPagination() {
  UI.paginationWrapper = _dom.create(
    {
      name: 'div',
      id: 'pagination-wrapper',
      className: ['flex-center', 'flex-row', 'show'],
    },
    UI.main
  );
  UI.firstPageBtn = _dom.create(
    {
      name: 'div',
      id: 'first-page-btn',
      className: ['flex-center', 'flex-column', 'btn', 'primary-btn'],
      innerHTML: '|<',
    },
    UI.paginationWrapper
  );
  UI.prevPageBtn = _dom.create(
    {
      name: 'div',
      id: 'prev-page-btn',
      className: ['flex-center', 'flex-column', 'btn', 'primary-btn'],
      innerHTML: '<',
    },
    UI.paginationWrapper
  );
  UI.pageNumDiv = _dom.create(
    {
      name: 'div',
      id: 'page-num-div',
      innerHTML: `${APP.currentPage} / ${APP.maxPage}`,
    },
    UI.paginationWrapper
  );
  UI.nextPageBtn = _dom.create(
    {
      name: 'div',
      id: 'next-page-btn',
      className: ['flex-center', 'flex-column', 'btn', 'primary-btn'],
      innerHTML: '>',
    },
    UI.paginationWrapper
  );
  UI.lastPageBtn = _dom.create(
    {
      name: 'div',
      id: 'last-page-btn',
      className: ['flex-center', 'flex-column', 'btn', 'primary-btn'],
      innerHTML: '>|',
    },
    UI.paginationWrapper
  );

  UI.firstPageBtn.addEventListener('click', handleFirstPage);
  UI.prevPageBtn.addEventListener('click', handlePrevPage);
  UI.nextPageBtn.addEventListener('click', handleNextPage);
  UI.lastPageBtn.addEventListener('click', handleLastPage);
}

function buildModal() {
  UI.modal = _dom.create(
    { name: 'div', id: 'modal', className: ['flex-center', 'flex-column'] },
    UI.main
  );
  const formBackdrop = _dom.create(
    {
      name: 'div',
      id: 'form-backdrop',
      className: ['flex-center', 'flex-column'],
    },
    UI.modal
  );
  const modalOuter = _dom.create(
    {
      name: 'div',
      id: 'modal-outer',
      className: ['flex-center', 'flex-column'],
    },
    UI.modal
  );
  UI.modalInner = _dom.create({ name: 'div', id: 'modal-inner' }, modalOuter);
}

function createLogbookForm() {
  UI.logbookForm = _dom.create(
    {
      name: 'form',
      id: 'logbook-form',
      className: ['flex-center', 'flex-column'],
    },
    UI.modalInner
  );

  const logBookHeader = _dom.create(
    {
      name: 'div',
      id: 'form-header',
      className: ['flex-center', 'flex-column'],
      innerHTML: 'LOGBOOK ENTRY',
    },
    UI.logbookForm
  );

  for (let i = 0; i < tableColumnKeys.length; i++) {
    const col = tableColumnKeys[i];
    const arr = Object.entries(col);
    const [key, value] = arr[0];
    const row = _dom.create(
      { name: 'div', className: 'form-row' },
      UI.logbookForm
    );
    if (i === tableColumnKeys.length - 1) {
      row.classList.add('last');
    }
    const label = _dom.create({ name: 'label', innerHTML: value }, row);
    if (key === 'type_of_flight') {
      const input = _dom.create(
        {
          name: key,
          type: 'combobox',
          id: `input-${key}`,
          value: '',
          options: typeOfFlightEnum,
        },
        row
      );
    } else if (key === 'route') {
      const input = _dom.create(
        { name: key, type: 'textarea', id: `input-${key}`, value: '' },
        row
      );
    } else {
      const input = _dom.create(
        { name: key, input: true, type: 'text', id: `input-${key}`, value: '' },
        row
      );
      if (key === 'destination_time' || key === 'departure_time') {
        input.addEventListener('blur', handleDestiantionDepartureTimeBlur);
      }
    }
  }

  const buttonsWrapper = _dom.create(
    { name: 'div', id: 'form-buttons-wrapper' },
    UI.logbookForm
  );

  const submitBtn = _dom.create(
    {
      name: 'div',
      id: 'form-submit-btn',
      className: ['flex-center', 'flex-column', 'btn', 'success-btn'],
      innerHTML: 'SAVE',
    },
    buttonsWrapper
  );
  const closeBtn = _dom.create(
    {
      name: 'div',
      id: 'form-close-btn',
      className: ['flex-center', 'flex-column', 'btn', 'close-btn'],
      innerHTML: 'CLOSE',
    },
    buttonsWrapper
  );

  submitBtn.addEventListener('click', handleFormSubmit);
  closeBtn.addEventListener('click', handleCloseForm);
}

function toggleSearchParams() {
  _dom.toggleClass(UI.searchParamsWrapper, 'show');
}

function createLoginForm() {
  UI.loginForm = _dom.create(
    {
      name: 'form',
      id: 'login-form',
      className: ['flex-center', 'flex-column'],
    },
    UI.main
  );
  const row1 = _dom.create(
    { name: 'div', className: ['flex-center', 'flex-row', 'login-form-row'] },
    UI.loginForm
  );
  const emailLabel = _dom.create(
    {
      name: 'label',
      className: ['flex-center', 'login-form-label'],
      innerHTML: 'EMAIL',
    },
    row1
  );
  const emailInput = _dom.create(
    {
      name: 'email',
      input: true,
      type: 'input',
      id: 'login-form-email',
      className: ['flex-center', 'login-form-input'],
    },
    row1
  );
  const row2 = _dom.create(
    { name: 'div', className: ['flex-center', 'flex-row', 'login-form-row'] },
    UI.loginForm
  );
  const passwordLabel = _dom.create(
    {
      name: 'label',
      className: ['flex-center', 'login-form-label'],
      innerHTML: 'PASSWORD',
    },
    row2
  );
  const passwordInput = _dom.create(
    {
      name: 'password',
      input: true,
      type: 'password',
      id: 'login-form-password',
      className: ['flex-center', 'login-form-input'],
    },
    row2
  );
  const loginBtn = _dom.create(
    {
      name: 'div',
      id: 'login-btn',
      className: ['flex-center', 'flex-column', 'btn', 'primary-btn'],
      innerHTML: 'LOGIN',
    },
    UI.loginForm
  );
  loginBtn.addEventListener('click', handleLoginButtonClick);
}

function createPrintModal() {
  UI.printModal = _dom.create(
    {
      name: 'div',
      id: 'print-modal',
      className: ['flex-column', 'flex-center'],
    },
    UI.main
  );
  const header = _dom.create(
    { name: 'h2', innerHTML: 'PRINT DIALOG', id: 'print-header' },
    UI.printModal
  );
  const subheader = _dom.create(
    {
      name: 'h4',
      innerHTML: 'Choose fields to be printed',
      id: 'print-subheader',
    },
    UI.printModal
  );

  UI.printForm = _dom.create({ name: 'form', id: 'print-form' }, UI.printModal);

  const checkboxWrapper = _dom.create(
    {
      name: 'div',
      id: 'print-checkbox-wrapper',
      className: ['flex-column', 'flex-center'],
    },
    UI.printForm
  );

  const checks = getTableColumnsAsChecks();

  for (let i = 0; i < checks.length; i++) {
    const check = checks[i];
    const label = _dom.create(
      {
        name: 'label',
        innerHTML: check.text,
        labelFor: `check_${check.key}`,
        className: ['flex-row', 'checkbox-label'],
      },
      checkboxWrapper
    );

    const checkbox = _dom.create({
      name: `check_${check.key}`,
      className: ['flex-row', 'flex-start'],
      type: 'checkbox',
      input: true,
      id: `check_${check.key}`,
      checked: true,
    });
    label.prepend(checkbox);
  }

  const buttonsWrapper = _dom.create(
    {
      name: 'div',
      id: 'print-buttons-wrapper',
      className: ['flex-row', 'flex-center', 'flex-gap-20'],
    },
    UI.printModal
  );
  const printExecuteBtn = _dom.create(
    {
      name: 'div',
      id: 'print-execute-btn',
      className: ['flex-center', 'flex-column', 'btn', 'primary-btn'],
      innerHTML: 'PRINT',
    },
    buttonsWrapper
  );

  const closeBtn = _dom.create(
    {
      name: 'div',
      id: 'close-print-modal-btn',
      className: ['flex-center', 'flex-column', 'btn', 'close-btn'],
      innerHTML: 'CLOSE',
    },
    buttonsWrapper
  );

  printExecuteBtn.addEventListener('click', handleExecutePrint);
  closeBtn.addEventListener('click', handleClosePrintModal);
}
