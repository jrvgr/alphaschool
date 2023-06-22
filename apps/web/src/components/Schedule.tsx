import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import { intlFormat, isSameDay } from "date-fns";

export function Schedule({ from, to, sort }: { from: Date; to: Date; sort: "asc" | "desc" }) {
  const navigate = useNavigate();

  let sortQuery = "";
  if (sort === "asc") sortQuery = "asc-beginDatumTijd";
  if (sort === "desc") sortQuery = "desc-beginDatumTijd";

  const { data, error, isError, isLoading } = useQuery(["schedule", from, to, sort], async () => {
    console.log(from, to);
    const response = await fetch(`${API_URL}/schedule`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        afterDate: from.toISOString(),
        beforeDate: to.toISOString(),
        sort: sortQuery,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }, {
    refetchOnMount: true,
    onError: (error) => {
      console.log(error);
      navigate("/login");
    }
  });

  const responseError = error as Error;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {responseError.message}</div>;
  }

  if (!data.length) {
    return <div>No data</div>;
  }

  let days: string[] = [];

  data.forEach((item: any) => {
    const startTime = new Date(item.startTime);
    if (!days.includes(startTime.toDateString())) {
      days.push(startTime.toDateString());
    }
  });

  let itemsByDate: any = [];

  days.forEach((day) => {
    const filtered = data.filter((item: any) => {
      const startTime = new Date(item.startTime);
      return isSameDay(startTime, new Date(day));
    });
    itemsByDate.push({
      day: day,
      items: filtered,
    });
  });

  console.log(itemsByDate);

  return (
    <div>
      {itemsByDate.map((item: any) => {
        const date = new Date(item.day);
        return (
          <div key={item.day}>
            <h2>{intlFormat(date, { weekday: "long", day: "2-digit", month: "long" })}</h2>
            {item.items.map((item: any) => {
              const timeOptions: any = { hour: "numeric", minute: "2-digit", hour12: false };

              const startTimeString = intlFormat(new Date(item.startTime), timeOptions);
              const endTimeString = intlFormat(new Date(item.endTime), timeOptions);
              return (
                <div id={item.id}>
                  <h3>{item.title}</h3>
                  <p>{item.location}</p>
                  <p>{startTimeString} - {endTimeString}</p>
                  <p>{item.description}</p>
                  <h4>Docenten:</h4>
                  {item.teachers.map((teacher: any) => <span>{`${teacher.firstName} ${teacher.lastName}`} </span>)}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  );

}
