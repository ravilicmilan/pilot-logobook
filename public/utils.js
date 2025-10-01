function calculateTotals(data) {
  const totals = {
    single_engine_time: '00:00',
    multi_engine_time: '00:00',
    multi_pilot_time: '00:00',
    total_flight_time: '00:00',
    landings_day: 0,
    landings_night: 0,
    operational_night_time: '00:00',
    operational_ifr_time: '00:00',
    pic_time: '00:00',
    co_pilot_time: '00:00',
    dual_time: '00:00',
    instructor_time: '00:00',
    simulator_time: '00:00',
  };

  data.forEach((obj) => {
    Object.keys(totals).forEach((key) => {
      if (key === 'landings_day' || key === 'landings_night') {
        totals[key] += obj[key] === null ? 0 : parseInt(obj[key]);
      } else {
        const prevTime = totals[key];
        const currentTime = obj[key] !== null ? obj[key] : '00:00';
        const newTime = sumTime(prevTime, currentTime);
        totals[key] = newTime;
      }
    });
  });

  return totals;
}

function sumTime(time1, time2) {
  return calculateTime(time1, time2, '+');
}

function timeDiff(time1, time2) {
  return calculateTime(time1, time2, '-');
}

function calculateTime(time1, time2, operator) {
  const arr1 = time1.split(':');
  const arr2 = time2.split(':');
  const [h1, m1] = arr1;
  const [h2, m2] = arr2;
  let totalMinutes1 = parseInt(h1) * 60 + parseInt(m1);
  let totalMinutes2 = parseInt(h2) * 60 + parseInt(m2);
  let totalTimeInMinutes;

  if (operator === '+') {
    totalTimeInMinutes = totalMinutes1 + totalMinutes2;
  } else if (operator === '-') {
    if (totalMinutes2 < totalMinutes1) {
      totalTimeInMinutes = totalMinutes2 + 24 * 60 - totalMinutes1;
    } else {
      totalTimeInMinutes = totalMinutes2 - totalMinutes1;
    }
  }

  const totalHours = parseInt(totalTimeInMinutes / 60);
  const restOfMinutes = totalTimeInMinutes - totalHours * 60;
  return `${totalHours <= 9 ? '0' + totalHours : totalHours}:${restOfMinutes <= 9 ? '0' + restOfMinutes : restOfMinutes}`;
}

function compareDates(date1, date2, operator) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const time1 = d1.getTime();
  const time2 = d2.getTime();

  if (operator === '<') {
    return time1 < time2;
  } else if (operator === '>') {
    return time1 > time2;
  } else if (operator === '<=') {
    return time1 <= time2;
  } else if (operator === '>=') {
    return time1 >= time2;
  }
}

function isDateInRange(date, min, max) {
  return compareDates(date, min, '>=') && compareDates(date, max, '<=');
}

function getToken() {
  return document.cookie.split('jwt=')[1];
}

function checkAuth() {
  if (document.cookie.includes('jwt')) {
    const jwt = getToken();
    if (jwt && jwt.length > 0) {
      setState({ loggedIn: true });
    } else {
      setState({ loggedIn: false });
    }
  } else {
    setState({ loggedIn: false });
  }
}

function getSearchFromUrl() {
  const searchStr = decodeURI(document.location.search);

  if (!searchStr.includes('search=')) {
    return false;
  }

  try {
    const searchArr = JSON.parse(searchStr.split('search=')[1]);
    return searchArr;
  } catch {
    console.log('INVALID JSON', searchStr);
    return false;
  }
}

function setArrayToString(arr) {
  const newArr = arr.map((a, idx) => {
    return {
      searchKey: a.searchKey,
      operator: a.operator,
      searchValue: a.searchValue,
    };
  });

  return JSON.stringify(newArr);
}

function createSearchUrl(arr) {
  const str = `?search=${setArrayToString(arr)}`;
  document.location.search = str;
  return str;
}

function removeSeconds(time) {
  const arr = time.split(':');
  return `${arr[0]}:${arr[1]}`;
}

function stripSecondsFromTime(data) {
  return data.map((obj) => {
    const newObj = {};

    for (let key in obj) {
      if (key.includes('_time') && obj[key] !== null) {
        newObj[key] = removeSeconds(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }

    return newObj;
  });
}

function formatDate(date) {
  let formattedDate = new Date(date);
  return formattedDate.toISOString().split('T')[0];
}

function getTableColumnsAsChecks() {
  return tableColumnKeys.map((col) => {
    const [key, value] = Object.entries(col)[0];
    return { key, text: value, checked: true };
  });
}

function addMorePrintInfo(searchParams) {
  let str = '';

  if (!searchParams || searchParams.length === 0) {
    str += 'Page: ' + APP.currentPage;
  } else {
    searchParams.forEach((param, idx) => {
      const obj = tableColumnKeys.find((col) =>
        col.hasOwnProperty(param.searchKey)
      );
      const label = obj[param.searchKey];
      const conjunction = convertOperatorAndValues(
        param.operator,
        param.searchValue
      );

      str += `${label}${conjunction}`;

      if (idx < searchParams.length - 1) {
        str += ' | ';
      }
    });
  }

  return `Query:::> ${str}`;
}

function convertOperatorAndValues(operator, value) {
  let str = '';

  if (operator === '=') {
    str = `: ${value}`;
  } else if (operator === '<>') {
    const [val1, val2] = value.split(/[,;]/);
    str = `: between ${val1} and ${val2}`;
  } else if (operator === '!=') {
    str = ` is not ${value}`;
  } else {
    str = `${operator} ${value}`;
  }

  return str;
}
