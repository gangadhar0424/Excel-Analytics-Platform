// Make sure your backend is running on port 5000 and has CORS configured for localhost:3001
const BASE_URL = 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

const handleResponse = async (res) => {
  const data = await res.json();
  
  if (res.status === 429) {
    throw new Error('Too many requests. Please wait a moment before trying again.');
  }
  
  if (res.status === 401) {
    throw new Error('Authentication failed. Please check your credentials.');
  }
  
  if (res.status === 403) {
    throw new Error('Access denied. You do not have permission for this action.');
  }
  
  if (res.status === 404) {
    throw new Error('Resource not found.');
  }
  
  if (res.status === 500) {
    throw new Error('Server error. Please try again later.');
  }
  
  if (!res.ok) {
    throw new Error(data.message || `HTTP error! status: ${res.status}`);
  }
  
  return data;
};

const api = {
  get: async (url) => {
    const res = await fetch(BASE_URL + url, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return handleResponse(res);
  },
  post: async (url, body, options = {}) => {
    let headers = options.headers || {};
    if (!(body instanceof FormData)) {
      headers = { 'Content-Type': 'application/json', ...headers };
    }
    if (!headers['Authorization']) headers['Authorization'] = `Bearer ${getToken()}`;
    const res = await fetch(BASE_URL + url, {
      method: 'POST',
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    return handleResponse(res);
  },
  delete: async (url) => {
    const res = await fetch(BASE_URL + url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return handleResponse(res);
  },
};

export default api;
