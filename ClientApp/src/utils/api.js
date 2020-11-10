const BASE_URL = 'http://localhost:3001';

async function callApi(endpoint, options = {}) {
  options.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
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
    async list(page) {
      if (page) {
        let limit = 12;
        return await callApi(`/monthlyPayments?_page=${page}&_limit=${limit}&_sort=id&_order=desc`);
      }
      return await callApi('/monthlyPayments');
    },
    async last() {
      const emptyResponse = await callApi('/monthlyPayments?_start=0&_end=0');
      const last = emptyResponse.totalCount;
      return await callApi(`/monthlyPayments/${last}`);
    },
    async readByDate(month, year) {
      return await callApi(`/monthlyPayments?month=${month}&year=${year}`);
    },
    async create(payment) {
      return await callApi(`/monthlyPayments`, {
        method: 'POST',
        body: JSON.stringify(payment),
      });
    },
    async read(paymentId) {
      const emptyResponse = await callApi('/monthlyPayments?_start=0&_end=0');
      const last = emptyResponse.totalCount;
      const response = await callApi(`/monthlyPayments/${paymentId}`);
      response.last = last;
      return response;
    },
    async update(paymentId, updates) {
      return await callApi(`/monthlyPayments/${paymentId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    async remove(paymentId) {
      return await callApi(`/monthlyPayments/${paymentId}`, {
        method: 'DELETE',
      });
    },
  },
  recurrentDiscounts: {
    async list() {
      return await callApi('/recurrentDiscounts');
    },
    async create(discount) {
      return await callApi(`/recurrentDiscounts`, {
        method: 'POST',
        body: JSON.stringify(discount),
      });
    },
    async read(discountId) {
      return await callApi(`/recurrentDiscounts/${discountId}`);
    },
    async update(discountId, updates) {
      return await callApi(`/recurrentDiscounts/${discountId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    async remove(discountId) {
      return await callApi(`/recurrentDiscounts/${discountId}`, {
        method: 'DELETE',
      });
    },
  },
  configuration: {
    async read() {
      return await callApi('/configuration');
    },
    async update(updates) {
      return await callApi('/configuration', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
  },
};

export default api;
