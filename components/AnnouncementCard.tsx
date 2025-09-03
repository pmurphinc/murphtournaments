import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
export function AnnouncementCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="shadow-glow">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent><p className="text-sm opacity-90">{body}</p></CardContent>
    </Card>
  );
}