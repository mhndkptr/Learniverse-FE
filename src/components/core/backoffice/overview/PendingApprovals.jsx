import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PendingApprovals({ approvals = [] }) {
  const hasApprovals = approvals.length > 0

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
        <CardDescription>Mentor applications awaiting review</CardDescription>
      </CardHeader>
      <CardContent>
        {hasApprovals ? (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between border-b pb-4 last:border-b-0"
              >
                <div>
                  <p className="font-medium">{approval.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {approval.course}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-yellow-200 bg-yellow-50 text-yellow-700"
                >
                  Pending
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No pending approvals.</p>
        )}
      </CardContent>
    </Card>
  )
}
