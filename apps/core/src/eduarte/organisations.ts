import { type Organisations } from "../lib/organisation";

export async function organisations(): Promise<Organisations> {
  const response = await fetch("https://login.educus.nl/app/endpoints", {
    headers: {
      accept: "application/json",
    },
  });
  const data: Organisations = await response.json();
  return data;
}
