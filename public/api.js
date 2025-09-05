function api(url, methodName, data) {
  const config = {
    method: methodName,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (url.includes('/api')) {
    config.headers.widthCredentials = true;
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  return new Promise((resolve, reject) => {
    fetch(url, config)
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getAllRecords() {
  try {
    const res = await api('/api/logbook', 'GET');
    return res;
  } catch (error) {
    return error;
  }
}

async function insertNewRecord(data) {
  try {
    const res = await api('/api/logbook', 'POST', data);
    return res;
  } catch (error) {
    return error;
  }
}

async function updateRecord(data) {
  try {
    const url = `/api/logbook/${data.id}`;
    delete data.id;
    const res = await api(url, 'PUT', data);
    return res;
  } catch (error) {
    return error;
  }
}

async function loginUser (data) {
  try {
    const url = '/users/login';
    const res = await api(url, 'POST', data);

    return res;
  } catch (error) {
    return error;
  }
}