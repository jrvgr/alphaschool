import { useState } from "react";
import { Schedule } from "./components/Schedule";
export const API_URL: string = import.meta.env.VITE_API_ENDPOINT;

const today = new Date();
const currentDayOfWeek = today.getDay();
const daysToAdd = currentDayOfWeek === 0 ? 1 : 8 - currentDayOfWeek; 

const sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysToAdd);
const monday = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() - 6);

function App() {
  const [from, setFrom] = useState(monday)
  const [to, setTo] = useState(sunday)
  const [sort, setSort] = useState<"asc" | "desc">("asc")

  return (
    <>
      <select value={sort} onChange={(e) => setSort(e.target.value as "asc" | "desc")}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <input type="date" value={from.toISOString().split('T')[0]} onChange={(e) => setFrom(e.target.valueAsDate!)} />
      <p style={{whiteSpace: "pre", display: "inline-block"}}> - </p>
      <input type="date" value={to.toISOString().split('T')[0]} onChange={(e) => setTo(e.target.valueAsDate!)} />
      <Schedule from={from} to={to} sort={sort} />
    </>);

}

export default App;
