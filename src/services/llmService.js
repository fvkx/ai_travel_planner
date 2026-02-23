export async function generateTravelPlan({ destination, startDate, days, interests }) {
  const response = await fetch("http://172.16.102.117:1234/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "local-model",
      messages: [
        {
          role: "system",
          content: `You are a travel AI that creates detailed multi-day itineraries. 
          Format your response EXACTLY as JSON with this structure. IMPORTANT: The "title" field should contain ONLY the location/activity name, NOT "Day X:". For example, use "Shibuya & Asakusa", not "Day 1: Shibuya & Asakusa".
          {
            "title": "Trip to [destination]",
            "summary": "Brief overview",
            "days": [
              {
                "day": 1,
                "title": "Location or main activity (without 'Day X:')",
                "activities": ["activity1", "activity2"],
                "places": ["place1", "place2"],
                "meals": {"breakfast": "", "lunch": "", "dinner": ""},
                "tips": ["tip1", "tip2"]
              }
            ]
          } /no_think`
        },
        {
          role: "user",
          content: `Destination: ${destination}. Start Date: ${startDate}. Days: ${days}. Interests: ${interests}.`
        }
      ],
      temperature: 0.7,
      max_tokens: 6000,
    })
  });

  const data = await response.json();
  let content = data?.choices?.[0]?.message?.content || "No result";
  
  // Remove <think> tags and their content if present
  content = content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
  
  // Extract JSON if it's wrapped in other text
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    content = jsonMatch[0];
  }
  
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return { rawText: content };
  }
}