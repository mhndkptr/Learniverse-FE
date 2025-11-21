import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const recentActivities = [
  {
    id: 1,
    action: 'New user registration',
    user: 'Alice Brown',
    time: '2 hours ago',
  },
  {
    id: 2,
    action: 'Course enrollment',
    user: 'Bob Wilson',
    time: '4 hours ago',
  },
  {
    id: 3,
    action: 'Quiz attempt completed',
    user: 'Carol Davis',
    time: '6 hours ago',
  },
  { id: 4, action: 'Payment received', user: 'David Lee', time: '8 hours ago' },
  {
    id: 5,
    action: 'Mentor profile updated',
    user: 'Eve Martinez',
    time: '1 day ago',
  },
]

export default function RecentActivities() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest activities on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 border-b pb-4 last:border-b-0"
            >
              <div className="bg-bluePrimary-500 mt-1 h-2 w-2 shrink-0 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {activity.user}
                </p>
              </div>
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
