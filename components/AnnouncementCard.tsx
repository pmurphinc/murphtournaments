import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
export function AnnouncementCard({ title, body }: { title: string; body: string }) {
  // Remove unwanted control characters (e.g., BOM, null, etc.)
  // Remove all non-printable/control characters from the start of the string
  const cleanBody = body.replace(/^[^\x20-\x7E]+/, "");
  return (
    <Card className="shadow-glow">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent><p className="text-sm opacity-90">{cleanBody}</p></CardContent>
    </Card>
  );
}