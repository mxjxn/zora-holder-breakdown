import axios from "axios";

const EXPLORER_API_URL = "https://explorer.zora.energy/api/v2";

export async function getInstances(address) {
  return axios.get(`${EXPLORER_API_URL}/tokens/${address}/instances`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

export async function getHolders(address, instanceId, nextPageParams) {
  let url = `${EXPLORER_API_URL}/tokens/${address}/instances/${instanceId}/holders`;
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
