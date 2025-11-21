import { Card, CardContent } from '@/components/ui/card'

export default function StatisticsCard({ title, value, change, icon }) {
  const isPositive = change.startsWith('+')

  return (
    <Card className="border-0 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="pt-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground mb-2 text-sm">{title}</p>
            <h2 className="text-3xl font-bold">{value}</h2>
            <p
              className={`mt-2 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
            >
              {change} from last month
            </p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
