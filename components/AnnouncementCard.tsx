import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
export function AnnouncementCard({ title, body }: { title: string; body: string }) {
  // Remove unwanted control characters (e.g., BOM, null, etc.)
  const cleanBody = body.replace(/^[\u0000-\u001F\u007F\uFEFF]+/, "");
  return (
    <Card className="shadow-glow">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent><p className="text-sm opacity-90">{cleanBody}</p></CardContent>
    </Card>
  );
}