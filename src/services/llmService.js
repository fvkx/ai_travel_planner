export async function generateTravelPlan({ destination, startDate, days, interests }) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
  
  try {
    const response = await fetch("http://172.16.102.140:1234/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({  
    model: "model",
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
        max_tokens: 3000,
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Unknown API error');
    }

    let content = data?.choices?.[0]?.message?.content || "No result";
    
    // Remove <think> tags and their content if present
    content = content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
    
    // Extract JSON - more efficient parsing
    const startIdx = content.indexOf('{');
    const endIdx = content.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      content = content.substring(startIdx, endIdx + 1);
    }
    
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      throw new Error('Failed to parse travel plan response. Please try again.');
    }
  } finally {
    clearTimeout(timeoutId);
  }
}