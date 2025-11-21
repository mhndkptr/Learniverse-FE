'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: 'Jan', enrollments: 400 },
  { name: 'Feb', enrollments: 480 },
  { name: 'Mar', enrollments: 520 },
  { name: 'Apr', enrollments: 590 },
  { name: 'May', enrollments: 670 },
  { name: 'Jun', enrollments: 720 },
  { name: 'Jul', enrollments: 856 },
]

export default function EnrollmentChart() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Enrollment Growth</CardTitle>
        <CardDescription>Monthly enrollment trend</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
            <Line
              type="monotone"
              dataKey="enrollments"
              stroke="var(--color-bluePrimary-500)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-bluePrimary-500)', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
