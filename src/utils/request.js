function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export default function request(url, options) {
  const token = localStorage.getItem("token");
  const finalOptions = {
    ...options,
    headers: {
      "content-type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  };
  console.log({ finalOptions });
  return fetch(url, finalOptions).then(checkStatus).then(parseJSON);
}
