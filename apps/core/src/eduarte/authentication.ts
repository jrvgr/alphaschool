import { ExpressError } from "../index";

export async function authenticate(
  code: string,
  grant_type: "authorization_code" | "refresh_token"
) {
  const params = new URLSearchParams({
    grant_type,
    redirect_uri: "http://student.eduarte.local/oauth-callback",
    client_id: "3cdf9da3-705a-4899-b3c9-393db1fdc8b7",
  });

  if (grant_type === "refresh_token") {
    params.append("refresh_token", code);
  } else {
    params.append("code", code);
  }

  const response = await fetch("https://login.educus.nl/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: params,
  });

  const data = await JSON.parse(await response.text());

  if (!response.ok) {
    throw new ExpressError("Invalid code", response.status);
  }

  return data;
}

/*
| Name         | Type | Value                                |
| ------------ | ---- | ------------------------------------ |
| grant_type   | Body | authorization_code                   |
| redirect_uri | Body | http://student.eduarte.local/oauth-callback |
| code         | Body | [code]                               |
| client_id    | Body | 3cdf9da3-705a-4899-b3c9-393db1fdc8b7 |*/
