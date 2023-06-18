import { ExpressError } from "..";

export async function validateToken(token, url) {
  const response = await fetch(new URL(url + "/account/me/branding"), {
    headers: {
      accept: "application/json",
      authorization: "Bearer " + token,
    },
  });

  return response.status === 204;
}
