import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trash } from "lucide-react";

export default function SavedPlansList({ plans, onDelete }) {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Saved Plans</h2>

        {plans.map(plan => (
          <div key={plan.id} className="border p-4 rounded-xl flex justify-between gap-4">
            <div>
              <h3 className="font-semibold">{plan.destination}</h3>
              <p className="text-sm">{plan.startDate} • {plan.days} days • {plan.interests}</p>
              <pre className="text-xs mt-2 whitespace-pre-wrap max-h-40 overflow-auto">
                {JSON.stringify(plan.plan, null, 2)}
              </pre>
            </div>

            <Button variant="destructive" size="sm" onClick={()=>onDelete(plan.id)}>
              <Trash size={14} />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
