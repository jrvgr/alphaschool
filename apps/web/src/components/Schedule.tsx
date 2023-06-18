import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";

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
  })

    ;

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

  return (
    data.map((item: any) => {
      const startTime = new Date(item.startTime);
      return (<div key={item.id}>
        <h1>{item.title}</h1>
        <p>{item.location}</p>
        <p>{item.description}</p>
        <p>{startTime.toDateString()} - {startTime.getHours()}:{startTime.getMinutes()}</p>
      </div>)
    }
    )
  );

}
