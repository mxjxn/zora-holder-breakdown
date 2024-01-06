import { createSignal } from "solid-js";

function Clipr({ children }) {
  const [copySuccess, setCopySuccess] = createSignal("");
  let el;
  const copyText = () => {
    const textToCopy = el.innerText;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => setCopySuccess("Copied!"))
      .catch((err) => setCopySuccess("Failed to copy!"));
  };

  return (
    <div>
      <p class="text-gray-500 pb-2">{copySuccess()}</p>
      <div
        onClick={copyText}
        ref={el}
        class="border border-blue-700 hover:border-blue-500 active:border-blue-300 rounded-xl p-2"
      >
        {children}
      </div>
    </div>
  );
}

export default Clipr;
