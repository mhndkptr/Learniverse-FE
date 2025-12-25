import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function RecentActivities({ activities = [] }) {
  const hasActivities = activities.length > 0

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest activities on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        {hasActivities ? (
          <div className="space-y-4">
            {activities.map((activity) => (
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
                  {activity.course ? (
                    <p className="text-muted-foreground mt-1 text-xs">
                      {activity.course}
                    </p>
                  ) : null}
                </div>
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No recent activities.</p>
        )}
      </CardContent>
    </Card>
  )
}
