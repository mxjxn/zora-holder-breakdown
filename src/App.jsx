import { CollectorBalances } from "./CollectorBalances";
import "./App.css";

function App() {
  return (
    <>
      <div class="">
        <h2 class="text-3xl font-bold">Zora Collection Holder Breakdown</h2>
        <CollectorBalances />
        <div class="text-md italic pt-4 pb-8">
          🚨 Uses blockscout API, which sometimes misses transactions. To be
          safe, check # Tokens and Total Collectors against Etherscan or OS
          before using these addresses and numbers for airdrops, snapshots, etc.
        </div>
      </div>
    </>
  );
}

export default App;
