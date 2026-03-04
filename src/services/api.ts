const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function generateLovePlan(
  story: string,
  geminiApiKey: string
): Promise<string> {
  const response = await fetch(`${API_URL}/api/generate_love_plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ story, gemini_api_key: geminiApiKey }),
  });

  if (!response.ok) {
    let detail = `API error: ${response.status}`;
    try {
      const err = await response.json();
      if (err.detail) detail = err.detail;
    } catch {
      //
    }
    throw new Error(detail);
  }

  const data = await response.json();
  console.log(data.plan)
  return data.plan as string;
}
