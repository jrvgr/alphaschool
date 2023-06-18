import { useState } from "react";
import { Schedule } from "./components/Schedule";
import { startOfWeek, endOfWeek, addHours }from 'date-fns'

export const API_URL: string = import.meta.env.VITE_API_ENDPOINT;

const currentDate = new Date()
const monday = addHours(startOfWeek(currentDate, { weekStartsOn: 1 }), 24)
const sunday = endOfWeek(currentDate, { weekStartsOn: 1 })

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
