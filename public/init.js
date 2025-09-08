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

  newEntryBtn.addEventListener('click', handleNewEntryButtonClick);
  refreshBtn.addEventListener('click', handleRefreshButtonClick);
  UI.toggleSearchBtn.addEventListener('click', handleToggleSearchButtonClick);
}

function createSearchParams() {
  UI.searchParamsWrapper = _dom.create(
    {
      name: 'div',
      id: 'search-params-wrapper',
      className: ['flex-center', 'flex-row'],
    },
    UI.main
  );
  UI.searchComobo = _dom.create(
    { type: 'combobox', id: 'search-combo', options: typeOfFlightEnum },
    UI.searchParamsWrapper
  );
  const findBtn = _dom.create(
    {
      name: 'div',
      innerHTML: 'FIND RECORDS',
      id: 'find-btn',
      className: ['btn', 'primary-btn'],
    },
    UI.searchParamsWrapper
  );

  findBtn.addEventListener('click', handleFindButtonClick);
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
    const th = _dom.create(
      { name: 'th', innerHTML: arr[0][1] },
      UI.tableHeader
    );
  }

  UI.tableBody = _dom.create({ name: 'tbody' }, UI.table);

  UI.tableFooter = _dom.create({ name: 'tfoot' }, UI.table);

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
  const modalInner = _dom.create(
    { name: 'div', id: 'modal-inner' },
    modalOuter
  );

  UI.logbookForm = _dom.create(
    {
      name: 'form',
      id: 'logbook-form',
      className: ['flex-center', 'flex-column'],
    },
    modalInner
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
