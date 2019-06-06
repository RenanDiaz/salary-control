const BASE_URL = 'http://localhost:3001';

async function callApi(endpoint, options = {}) {
  options.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  const url = BASE_URL + endpoint;
  const response = await fetch(url, options);
  const data = await response.json();
  const totalCount = await response.headers.get('X-Total-Count');
  if (totalCount) {
    Object.defineProperty(data, 'totalCount', { value: Number(totalCount) });
  }

  return data;
}

const api = {
  monthlyPayments: {
    list(page) {
      if (page) {
        let limit = 12;
        return callApi(`/monthlyPayments?_page=${page}&_limit=${limit}`);
      }
      return callApi('/monthlyPayments');
    },
    async last() {
      const emptyResponse = await callApi('/monthlyPayments?_start=0&_end=0');
      const last = emptyResponse.totalCount;
      return callApi(`/monthlyPayments/${last}`);
    },
    readByDate(month, year) {
      return callApi(`/monthlyPayments?month=${month}&year=${year}`);
    },
    create(payment) {
      return callApi(`/monthlyPayments`, {
        method: 'POST',
        body: JSON.stringify(payment)
      });
    },
    async read(paymentId) {
      const emptyResponse = await callApi('/monthlyPayments?_start=0&_end=0');
      const last = emptyResponse.totalCount;
      const response = await callApi(`/monthlyPayments/${paymentId}`);
      response.last = last;
      return response;
    },
    update(paymentId, updates) {
      return callApi(`/monthlyPayments/${paymentId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },
    remove(paymentId) {
      return callApi(`/monthlyPayments/${paymentId}`, {
        method: 'DELETE'
      });
    }
  },
  recurrentDiscounts: {
    list() {
      return callApi('/recurrentDiscounts');
    },
    create(discount) {
      return callApi(`/recurrentDiscounts`, {
        method: 'POST',
        body: JSON.stringify(discount)
      });
    },
    read(discountId) {
      return callApi(`/recurrentDiscounts/${discountId}`);
    },
    update(discountId, updates) {
      return callApi(`/recurrentDiscounts/${discountId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },
    remove(discountId) {
      return callApi(`/recurrentDiscounts/${discountId}`, {
        method: 'DELETE'
      });
    }
  },
  configuration: {
    read() {
      return callApi('/configuration');
    },
    update(updates) {
      return callApi('/configuration', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    }
  }
};

export default api;
