import { useState } from "react";
import { Schedule } from "./components/Schedule";
import { startOfWeek, endOfWeek, setHours } from 'date-fns'
import './app.css';

export const API_URL: string = import.meta.env.VITE_API_ENDPOINT;

const currentDate = new Date()
const monday = startOfWeek(currentDate, { weekStartsOn: 1 })
const sunday = endOfWeek(currentDate, { weekStartsOn: 1 })

function App() {
  const [from, setFrom] = useState(monday)
  const [to, setTo] = useState(sunday)
  const [sort, setSort] = useState<"asc" | "desc">("asc")

  return (
    <><nav>

      <select value={sort} onChange={(e) => setSort(e.target.value as "asc" | "desc")}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <input type="date" value={from.toISOString().split('T')[0]} onChange={(e) => setFrom(e.target.valueAsDate!)} />
      <p style={{ whiteSpace: "pre", display: "inline-block" }}> - </p>
      <input type="date" value={to.toISOString().split('T')[0]} onChange={(e) => setTo(e.target.valueAsDate!)} />
    </nav>
      <Schedule from={setHours(from, 1)} to={setHours(to, 23)} sort={sort} />
    </>);

}

export default App;
