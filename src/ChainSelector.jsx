import { createSignal, createEffect } from "solid-js";

function ChainSelector({ onSelected }) {
  const [selectedOption, setSelectedOption] = createSignal([]);

  const options = [
    { text: "Zora", value: "https://explorer.zora.energy/api/v2" },
    { text: "Optimism", value: "https://optimism.blockscout.com/api/v2" },
    { text: "Base", value: "https://base.blockscout.com/api/v2" },
    { text: "Ethereum", value: "https://eth.blockscout.com/api/v2" },
    // replace with your options
  ];

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    console.log(event.target.value);
    onSelected(event.target.value);
  };

  createEffect(() => {
    onSelected(options[0].value);
  });

  return (
    <div class="mx-2">
      <div>Chain:</div>
      <select class="p-2 w-32" onChange={handleSelectChange}>
        {options.map((option) => (
          <option value={option.value}>{option.text}</option>
        ))}
      </select>
    </div>
  );
}

export default ChainSelector;
