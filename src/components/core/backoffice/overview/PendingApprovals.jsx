import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const pendingApprovals = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Mentor',
    course: 'React Basics',
    status: 'ON_REVIEW',
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Mentor',
    course: 'JavaScript Advanced',
    status: 'ON_REVIEW',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Mentor',
    course: 'Web Design',
    status: 'ON_REVIEW',
  },
]

export default function PendingApprovals() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
        <CardDescription>Mentor applications awaiting review</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingApprovals.map((approval) => (
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
      </CardContent>
    </Card>
  )
}
