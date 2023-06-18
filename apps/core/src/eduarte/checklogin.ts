import { ExpressError } from "..";

export async function validateToken(token, url) {
  const response = await fetch(new URL(url + "/account/me/branding"), {
    headers: {
      accept: "application/json",
      authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new ExpressError("unauthorized", response.status);
    }
  }

  return response.status === 204;
}
