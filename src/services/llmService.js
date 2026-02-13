export async function generateTravelPlan({ destination, startDate, days, interests }) {
  const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", { // Fixed URL
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "local-model", // Required by LM Studio
      messages: [
        {
          role: "system",
          content: "You are a travel AI that creates detailed multi-day itineraries with places, food, and travel tips."
        },
        {
          role: "user",
          content: `Destination: ${destination}. Start Date: ${startDate}. Days: ${days}. Interests: ${interests}. Create day-by-day itinerary.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
    })
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "No result";
}