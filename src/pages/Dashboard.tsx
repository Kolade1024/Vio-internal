import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { DollarSign, Ticket, Users, XCircle, Banknote, ClipboardCheck } from 'lucide-react'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Button } from '../components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import type { TicketByDayOfWeek, RevenueByDay, UserStat, TopOffence, TopOffender } from '@/services/query'
import { getDashboardStats, getUsers } from '@/services/query'

import { ComponentLoading } from '@/components/Loading'
import { useState } from 'react'

interface FormattedUserStat {
  command: string;
  tickets: number;
  ticketAmount: string;
  outstandingAmount: string;
  discountAmount: string;
  paidAmount: string;
}

interface FormattedTopOffence {
  offence: string;
  timesViolated: number;
}

interface FormattedTopOffender {
  plateNumber: string;
  totalTickets: number;
}

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('Today');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const { data, isLoading } = getDashboardStats({ dateRangeType: dateRange, startDate, endDate, userId: currentUser! });
  const { data: usersData, isLoading: usersLoading } = getUsers();

  if (isLoading) {
    return <ComponentLoading />
  }

  const ticketsData = data?.ticketsByDayOfWeek.map((item: TicketByDayOfWeek) => ({
    name: item.day,
    tickets: item.ticketCount,
  })) || []

  const revenueData = data?.revenueByDay.map((item: RevenueByDay) => ({
    name: item.day,
    'Expected Revenue': item.expectedRevenue,
    'Actual Revenue': item.totalRevenue,
  })) || []

  const userStats: FormattedUserStat[] = data?.userStats.map((stat: UserStat) => ({
    command: stat.userName,
    tickets: stat.totalTicketsGenerated,
    ticketAmount: `NGN${stat.totalTicketAmountGenerated.toLocaleString()}`,
    outstandingAmount: `NGN${stat.totalOutstandingTicketAmount.toLocaleString()}`,
    discountAmount: `NGN${stat.totalTicketsDiscountAmount.toLocaleString()}`,
    paidAmount: `NGN${stat.totalFinesPaid.toLocaleString()}`,
  })) || []

  const topViolations: FormattedTopOffence[] = data?.topOffences.map((offence: TopOffence) => ({
    offence: offence.offenceType,
    timesViolated: offence.offenceCount,
  })) || []

  const topOffenders: FormattedTopOffender[] = data?.topOffenders.map((offender: TopOffender) => ({
    plateNumber: offender.vehiclePlateNumber,
    totalTickets: offender.ticketCount,
  })) || []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1"></div>
        <div className="flex items-center gap-3">
          <select
            className="w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            value={currentUser || ""}
            onChange={e => setCurrentUser(e.target.value || null)}
          >
            <option value="">{usersLoading ? "Loading..." : "All Users"}</option>
            {usersData && usersData.map((user: any) => (
              <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
            ))}
          </select>
          {
            dateRange === 'Custom' && (
              <>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border border-gray-300 rounded-md p-2" />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border border-gray-300 rounded-md p-2" />
              </>
            )}
        <select
            className="w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Weekly">This Week</option>
            <option value="Monthly">This Month</option>
            <option value="Quarterly">Quarter</option>
            <option value="Annually">Annually</option>
            <option value="Biannually">Biannually</option>
            <option value="Custom">Custom</option>
          </select>
            {
              dateRange === 'Custom' && (
                <button onClick={() => { setStartDate(""); setEndDate(""); setDateRange("Today"); }}>Reset</button>
              )
            }
          </div>
        </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[ // These values will now be dynamic from the API response
          {
            title: "Total Tickets",
            value: data?.totalTickets || 0,
            icon: <Ticket className="h-6 w-6 text-blue-500 bg-blue-100 rounded-full p-1 shadow" />,
            description: "", // Data not available in API for description
            color: "bg-blue-50",
            valueColor: "text-blue-700",
            border: "border-blue-200"
          },
          {
            title: "Total Offenders",
            value: data?.totalOffenders || 0,
            icon: <Users className="h-6 w-6 text-orange-500 bg-orange-100 rounded-full p-1 shadow" />,
            description: "", // Data not available in API for description
            color: "bg-orange-50",
            valueColor: "text-orange-700",
            border: "border-orange-200"
          },
          {
            title: "Tickets Paid",
            value: data?.totalTicketsPaid || 0,
            icon: <ClipboardCheck className="h-6 w-6 text-green-500 bg-green-100 rounded-full p-1 shadow" />,
            description: "", // Data not available in API for description
            color: "bg-green-50",
            valueColor: "text-green-700",
            border: "border-green-200"
          },
          {
            title: "Tickets Unpaid",
            value: data?.totalTicketsUnpaid || 0,
            icon: <XCircle className="h-6 w-6 text-red-500 bg-red-100 rounded-full p-1 shadow" />,
            description: "", // Data not available in API for description
            color: "bg-red-50",
            valueColor: "text-red-700",
            border: "border-red-200"
          },
          {
            title: "Total Discounts",
            value: `NGN${data?.totalDiscounts?.toLocaleString() || 0}`,
            icon: <Banknote className="h-6 w-6 text-teal-500 bg-teal-100 rounded-full p-1 shadow" />,
            description: "", // Data not available in API for description
            color: "bg-teal-50",
            valueColor: "text-teal-700",
            border: "border-teal-200"
          },
          {
            title: "Total Fines Paid",
            value: `NGN${data?.totalTicketsPaidAmount?.toLocaleString() || 0}`,
            icon: <DollarSign className="h-6 w-6 text-green-600 bg-green-100 rounded-full p-1 shadow" />,
            description: "", // Data not available in API for description
            color: "bg-green-50",
            valueColor: "text-green-700",
            border: "border-green-200"
          },
          {
            title: "Total Fines",
            value: `NGN${data?.totalTicketAmount?.toLocaleString() || 0}`,
            icon: <DollarSign className="h-6 w-6 text-indigo-500 bg-indigo-100 rounded-full p-1 shadow" />,
            description: "", // Data not available in API for description
            color: "bg-indigo-50",
            valueColor: "text-indigo-700",
            border: "border-indigo-200"
          },
          {
            title: "Total Fines Unpaid",
            value: `NGN${data?.totalTicketOutstandingAmount?.toLocaleString() || 0}`,
            icon: <DollarSign className="h-6 w-6 text-rose-500 bg-rose-100 rounded-full p-1 shadow" />,
            description: "", // Data not available in API for description
            color: "bg-rose-50",
            valueColor: "text-rose-700",
            border: "border-rose-200"
          }
        ].map((card) => (
          <Card key={card.title} className={`transition-shadow hover:shadow-lg ${card.color} ${card.border} border`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold">{card.title}</CardTitle>
                {/* <div className="text-xs text-muted-foreground mt-1">{card.description}</div> */}
              </div>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-extrabold ${card.valueColor}`}>{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>  
      <div className="grid gap-4 rid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-3 w-full">
          <CardHeader>
            <CardTitle>Tickets for the week</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketsData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Bar dataKey="tickets" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value}`} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Expected Revenue" stroke="var(--chart-1)" />
                <Line type="monotone" dataKey="Actual Revenue" stroke="var(--chart-2)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>User Accounts Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account/Command</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Ticket Amount</TableHead>
                  <TableHead>Outstanding Amount</TableHead>
                  <TableHead>Discount Amount</TableHead>
                  <TableHead>Paid Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userStats.map((stat: FormattedUserStat, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{stat.command}</TableCell>
                    <TableCell>{stat.tickets}</TableCell>
                    <TableCell>{stat.ticketAmount}</TableCell>
                    <TableCell>{stat.outstandingAmount}</TableCell>
                    <TableCell>{stat.discountAmount}</TableCell>
                    <TableCell>{stat.paidAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-col md:flex-row items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                1-10 of 26
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">Go to first page</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Go to previous page</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Go to next page</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Go to last page</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offence</TableHead>
                  <TableHead>Times Violated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topViolations.map((violation: FormattedTopOffence, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{violation.offence}</TableCell>
                    <TableCell>{violation.timesViolated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Offenders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Total Tickets</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topOffenders.map((offender: FormattedTopOffender, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{offender.plateNumber}</TableCell>
                    <TableCell>{offender.totalTickets}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
