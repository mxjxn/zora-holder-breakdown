import axios from "axios";
import { createSignal, createMemo, createEffect, For } from "solid-js";
import rangeSlider from "range-slider-input";
import "range-slider-input/dist/style.css";

import { useCollectorBalances } from "./useCollectorBalances";
import ChainSelector from "./ChainSelector";
import { Card } from "./Card";
import Clipr from "./Clipr";


function CollectorBalances() {
  let breakdownRef, logsRef, rangeRef, totalRef;
  let slider;
  let rangeSliderSet = false;
  const [contractAddress, setContractAddress] = createSignal("");
  const [apiEndpoint, setApiEndpoint] = createSignal("");
  const {
    balances,
    getCollectorBalances,
    totalItems,
    totalCollectors,
    logMessages,
    completed,
  } = useCollectorBalances();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!contractAddress()) {
      return;
    }
    logsRef.classList.add("fade-in-active");
    // TODO also pass in the api url
    console.log("api endpoint", apiEndpoint());
    await getCollectorBalances(apiEndpoint(), contractAddress(contractAddress())).catch(
      (error) => {
        console.error(error);
      }
    );
  };

  const [range, setRange] = createSignal([1, 2]);

  const rangeText = createMemo(() => {
    const [start, end] = range();
    if (start == 1 && end == totalItems()) {
      return "collectors holding all tokens";
    }
    return `collectors holding ${start} thru ${end}`;
  });

  // add up all the balances for each token individually
  const tokenTotals = createMemo(() => {
    const _balances = Object.values(balances());
    if (_balances.length == 0) return new Array(0).fill(0);
    const result = _balances.reduce(
      (acc, cur) => acc.map((balance, i) => balance + cur[i]),
      new Array(_balances[0].length).fill(0)
    );
    return result;
  });

  const rangeHolders = createMemo(() => {
    const [start, end] = range();
    const _balances = balances();
    const holdersOfRange = Object.keys(_balances).filter((address) =>
      _balances[address].slice(start - 1, end).every((balance) => balance > 0)
    );
    console.log("range", range());
    console.log("balances", _balances);
    console.log("holders of range", holdersOfRange);
    return holdersOfRange;
  });

  createEffect(() => {
    const itemCount = totalItems();
    breakdownRef.classList.remove("fade-in-active");
    if (itemCount > 0) {
      logsRef.classList.add("fade-in-active");
      setRange([1, itemCount]);
    } else {
      logsRef.classList.remove("fade-in-active");
    }
    if (completed()) {
      if (itemCount > 0) {
        if (!rangeSliderSet) {
          slider = rangeSlider(rangeRef, {
            min: 1,
            max: totalItems(),
            value: [1, totalItems()],
            rangeSlideDisabled: true,
            onInput: (v, u) => {
              setRange(v);
            },
          });
          rangeSliderSet = true;
          setRange([1, itemCount]);
        } else {
          setRange([1, itemCount]);
          slider.max(itemCount);
        }
        breakdownRef.classList.add("fade-in-active");
      }
    } else {
      breakdownRef.classList.remove("fade-in-active");
    }
  });

  return (
    <div class="flex flex-col gap-8 items-center justify-between">
      <form onSubmit={handleSubmit}>
        <div class="flex flex-row items-start justify-between">
          <div class="w-72">
            <label class="mr-2">Enter your Zora NFT Contract Address:</label>
            <div class="rounded-lg py-1 px-0 bg-gray-200 w-72 flex flex-row items-center h-10">
              <svg
                class="inline mr-2 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
                  ></path>
                  <path d="M15.803 15.804 21 21"></path>
                </g>
              </svg>
              <input
                type="text"
                class="focus:outline-none text-black bg-transparent h-10 w-64"
                placeholder="0x..."
                value={contractAddress()}
                onInput={(e) => setContractAddress(e.target.value)}
              />
            </div>
          </div>
          <ChainSelector onSelected={setApiEndpoint} />
          <button
            class="btn border border-slate-500 hover:border-slate-400 active:border-slate-100 rounded-lg p-2 ml-5"
            type="submit"
          >🚀</button>
        </div>
      </form>
      <div class="flex flex-row gap-4 items-start fade-in" ref={logsRef}>
        <div class="flex flex-col gap-4">
          <Card title="Logs">
            <ul class="text-left text-gray-500 italic">
              <For each={logMessages()}>{(message) => <li>{message}</li>}</For>
            </ul>
          </Card>
          <div class="text-left">
            <Card title="# Minted per token">
              <ol>
                <For each={tokenTotals()}>
                  {(item, index) => (
                    <li>
                      Token #{index() + 1}: {item}
                    </li>
                  )}
                </For>
              </ol>
            </Card>
          </div>
        </div>
        <div class="flex flex-col gap-4 items-stretch">
          <div class="flex flex-row gap-4">
            <div>
              <Card title="Num. Tokens">
                <div>{totalItems()}</div>
              </Card>
            </div>
            <div>
              <Card title="Total collectors">
                <div>{completed() ? totalCollectors : "calculating..."}</div>
              </Card>
            </div>
          </div>

          <div
            ref={breakdownRef}
            class="flex flex-col gap-4 items-stretch justify-around fade-in"
            c
          >
            <div class="text-center text-gray-700">
              Adjust Slider to select token range
            </div>
            <div class="w-full">
              <div class="range-slider" ref={rangeRef}>
                <input type="range" />
                <input type="range" />
                <div class="range-slider__thumb" data-lower></div>
                <div class="range-slider__thumb" data-upper></div>
                <div class="range-slider__range"></div>
              </div>
            </div>
            <Card>
              <div class="text-lg font-bold pb-2">
                {rangeHolders().length + " " + rangeText()}
              </div>
              <Clipr classes="border border-blue-700 hover:border-blue-500 active:border-blue-300">
                <For each={rangeHolders()}>
                  {(message) => <div>{message}</div>}
                </For>
              </Clipr>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CollectorBalances };
