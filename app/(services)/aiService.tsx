export async function getQueryResponse(prompt: string): Promise<string> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
    cache: "no-store",
  });
  const json = await response.json();
  return json.response;
}
