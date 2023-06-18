export async function user(token, url: string, user) {
  const response = await fetch(new URL(url + "/account/" + user), {
    headers: {
      accept: "application/json",
      authorization: "Bearer " + token,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description);
  return data;
}
