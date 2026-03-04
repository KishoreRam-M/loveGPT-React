export async function generateLovePlan(story: string): Promise<string> {
  const response = await fetch("http://127.0.0.1:8000/api/generate_love_plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ story }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.plan;
}
