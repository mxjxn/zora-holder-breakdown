import axios from "axios";

export async function getInstances(apiUrl, address) {
  return axios.get(`${apiUrl}/tokens/${address}/instances`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

export async function getHolders(apiUrl, address, instanceId, nextPageParams) {
  let url = `${apiUrl}/tokens/${address}/instances/${instanceId}/holders`;
  if (nextPageParams) {
    url += `?address_hash=${nextPageParams.address_hash}&value=${nextPageParams.value}&items_count=${nextPageParams.items_count}&token_id=${nextPageParams.token_id}`;
  }
  return axios.get(url, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
