import axios from "axios";
import { createSignal, For } from "solid-js";
import { useCollectorBalances } from "./useCollectorBalances.js";

const EXPLORER_API_URL = "https://explorer.zora.energy/api/v2";

function CollectorBalances() {
  const [contractAddress, setContractAddress] = createSignal("");
  const { getCollectorBalances, totalCollectors, collectedAll, logMessages } =
    useCollectorBalances();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(!contractAddress()) {
      return;
    }
    await getCollectorBalances(contractAddress(contractAddress())).catch((error) => {
      console.error(error);
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Contract Address:
          <input
            type="text"
            value={contractAddress()}
            onInput={(e) => setContractAddress(e.target.value)}
          />
        </label>
        <button type="submit">Get Balances</button>
      </form>

      <div>
        <h3>logs</h3>
        <For each={logMessages()}>{(message) => <div>{message}</div>}</For>
      </div>
      <div>
        <h3>Total Collectors</h3>
        <div>{totalCollectors}</div>
      </div>
      <div>
        <h3>Who Collected All</h3>
        <For each={collectedAll()}>{(message) => <div>{message}</div>}</For>
      </div>
    </div>
  );
}

export { CollectorBalances };
