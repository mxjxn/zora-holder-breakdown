export function Card({ title, children }) {
  return (
    <div class="bg-white rounded-lg shadow-lg p-5">
      <h3 class="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}