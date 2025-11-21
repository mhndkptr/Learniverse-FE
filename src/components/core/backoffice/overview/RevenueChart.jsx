'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: 'Week 1', revenue: 4000 },
  { name: 'Week 2', revenue: 3000 },
  { name: 'Week 3', revenue: 2000 },
  { name: 'Week 4', revenue: 2780 },
  { name: 'Week 5', revenue: 1890 },
  { name: 'Week 6', revenue: 2390 },
  { name: 'Week 7', revenue: 3490 },
]

export default function RevenueChart() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Weekly revenue for the current month</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-bluePrimary-500)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
