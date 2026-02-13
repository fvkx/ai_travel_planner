import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Send } from "lucide-react";

export default function PlannerForm({
  destination,
  setDestination,
  startDate,
  setStartDate,
  days,
  setDays,
  interests,
  setInterests,
  generatePlan,
  loading
}) {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-6 space-y-4">
        <div className="grid md:grid-cols-4 gap-4">
          <Input placeholder="Destination" value={destination} onChange={(e)=>setDestination(e.target.value)} />
          <Input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
          <Input type="number" value={days} onChange={(e)=>setDays(e.target.value)} />
          <Input placeholder="Interests" value={interests} onChange={(e)=>setInterests(e.target.value)} />
        </div>

        <Button onClick={generatePlan} disabled={loading} className="w-full">
          <Send className="mr-2" size={16} />
          {loading ? "Generating..." : "Generate Plan"}
        </Button>
      </CardContent>
    </Card>
  );
}