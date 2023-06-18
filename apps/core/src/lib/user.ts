export function userId(token: string): string {
  const id = JSON.parse(atob(token.split(".")[1])).sub.split("\\")[1];
  return id;
}
