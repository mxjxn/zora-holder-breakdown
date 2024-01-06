
import { createSignal, createMemo } from "solid-js";
import { getInstances, getHolders } from "./api";

export function useCollectorBalances() {
  const [totalItems, setTotalItems] = createSignal(0);
  const [balances, setBalances] = createSignal({});
  const totalCollectors = createMemo(() => {
    const currentBalances = balances();
    console.log("rendering total collectors");
    return Object.keys(currentBalances).length > 0
      ? Object.keys(currentBalances).length
      : 0;
  });
  const collectedAll = createMemo(() => {
    const currentBalances = balances();
    console.log({ currentBalances });
    if (Object.keys(currentBalances).length > 0) {
      return Object.keys(currentBalances).filter((address) => {
        return currentBalances[address].every((value) => value > 0);
      });
    }
    return [];
  });
  const [logMessages, setLogMessages] = createSignal([]);

  const addLogMessage = (message) => {
    setLogMessages((prevMessages) => [...prevMessages, message]);
  };

  const updateBalances = (newHolders, index) => {
    setBalances((prevBalances) => {
      console.log({ prevBalances, newHolders });
      const updatedBalances = { ...prevBalances };
      const addressBalances = newHolders.map((holder) => ({
        address: holder.address.hash.toLowerCase(),
        value: parseInt(holder.value),
      }));
      addressBalances.forEach((holder) => {
        const _address = holder.address;
        if (!updatedBalances[_address]) {
          updatedBalances[_address] = Array(totalItems()).fill(0);
        } else {
          updatedBalances[_address] = [...updatedBalances[_address]];
        }
        updatedBalances[_address][index] += parseInt(holder.value);
      });
      return updatedBalances;
    });
  };

  async function getCollectorBalances(address) {
    let response;
    setBalances({});
    setLogMessages([]);
    try {
      response = await getInstances(address);
    } catch (error) {
      console.error(error);
    }

    const items = response.data.items;
    addLogMessage(`Found ${items.length} items`);
    const numItems = items.length;
    setTotalItems(numItems);
    const _balances = { ...balances() };

    for (let i = 1; i <= numItems; i++) {
      let next_page_params = null;
      let holders = [];
      let hasNextPage = false;
      let tokenHolderCount = 0;
      do {
        let response;

        try {
          response = await getHolders(address, i, next_page_params);
        } catch (error) {
          console.error(error);
          continue;
        }
        // set holders to current holders value with the items in array response.data.items appended
        const newHolders = response.data.items;
        tokenHolderCount += newHolders.length;
        updateBalances(newHolders, i - 1);
        await new Promise((res) => setTimeout(res, 500));
        if (response.data.next_page_params) {
          hasNextPage = true;
          next_page_params = {
            address_hash: response.data.next_page_params.address_hash,
            value: response.data.next_page_params.value,
            items_count: response.data.next_page_params.items_count,
            token_id: response.data.next_page_params.token_id,
          };
        } else {
          hasNextPage = false;
          next_page_params = null;
        }
      } while (hasNextPage);
      addLogMessage("Found " + tokenHolderCount + " holders for item " + i);
    }
  }

  return {
    balances,
    getCollectorBalances,
    totalCollectors,
    collectedAll,
    logMessages,
  };
}