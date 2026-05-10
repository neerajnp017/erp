import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardContent className="flex gap-3 p-5">
        <AlertCircle className="mt-1 h-5 w-5 text-destructive" />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
