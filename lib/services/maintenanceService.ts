export async function getMaintenance() {
  const response = await fetch('/api/maintenance');
  const json = await response.json();
  return json;
}
