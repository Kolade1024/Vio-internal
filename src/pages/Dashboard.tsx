import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  DollarSign,
  Ticket,
  Users,
  XCircle,
  Banknote,
  ClipboardCheck,
  DownloadIcon,
  RefreshCcw,
  ChevronDown,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import type {
  TicketByDayOfWeek,
  RevenueByDay,
  UserStat,
  TopOffence,
  TopOffender,
} from "@/services/query";
import { getDashboardStats, getUsers } from "@/services/query";

import { ComponentLoading } from "@/components/Loading";
import { useEffect, useState } from "react";
import { GenerateTicketReport } from "@/services/mutation";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

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
  const [dateRange, setDateRange] = useState("Today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [_, setShowCustomDates] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, refetch, isRefetching } = getDashboardStats({
    dateRangeType: dateRange === "Custom" ? undefined : dateRange,
    startDate: dateRange === "Custom" ? startDate : "",
    endDate: dateRange === "Custom" ? endDate : "",
    userId: currentUser!,
  });
  const { data: usersData, isLoading: usersLoading } = getUsers();
  const { mutate, isPending: isGeneratingReport } = GenerateTicketReport();

  // Refetch when custom dates change
  // useEffect(() => {
  //   if (dateRange === "Custom" && startDate && endDate) {
  //     refetch();
  //   }
  // }, [startDate, endDate, dateRange, refetch]);

  // Refetch when date range preset changes
  useEffect(() => {
    if (dateRange !== "Custom") {
      refetch();
    }
  }, [dateRange, refetch]);

  if (isLoading || isRefetching) {
    return <ComponentLoading />;
  }

  const ticketsData =
    data?.ticketsByDayOfWeek.map((item: TicketByDayOfWeek) => ({
      name: item.day,
      tickets: item.ticketCount,
    })) || [];

  const revenueData =
    data?.revenueByDay.map((item: RevenueByDay) => ({
      name: item.day,
      "Expected Revenue": item.expectedRevenue,
      "Actual Revenue": item.totalRevenue,
    })) || [];

  const userStats: FormattedUserStat[] =
    data?.userStats.map((stat: UserStat) => ({
      command: stat.userName,
      tickets: stat.totalTicketsGenerated,
      ticketAmount: `NGN${stat.totalTicketAmountGenerated.toLocaleString()}`,
      outstandingAmount: `NGN${stat.totalOutstandingTicketAmount.toLocaleString()}`,
      discountAmount: `NGN${stat.totalTicketsDiscountAmount.toLocaleString()}`,
      paidAmount: `NGN${stat.totalFinesPaid.toLocaleString()}`,
    })) || [];

  const topViolations: FormattedTopOffence[] =
    data?.topOffences.map((offence: TopOffence) => ({
      offence: offence.offenceType,
      timesViolated: offence.offenceCount,
    })) || [];

  const topOffenders: FormattedTopOffender[] =
    data?.topOffenders.map((offender: TopOffender) => ({
      plateNumber: offender.vehiclePlateNumber,
      totalTickets: offender.ticketCount,
    })) || [];

  const handleGenerateReport = () => {
    const payload: any = {
      dateRangeType: dateRange,
      reportType: "AllTickets",
    };

    if (dateRange === "Custom") {
      payload.startDate = startDate;
      payload.endDate = endDate;
    }

    mutate(payload, {
      onSuccess: (res) => {
        console.log(res);
        toast.success("Downloading report.");

        const blob = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Report.xlsx";
        link.click();
        URL.revokeObjectURL(url);
      },
      onError: () => {
        toast.error("Failed to generate report.");
      },
    });
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setDateRange("Today");
    setShowCustomDates(false);
  };

  const selectedUserName =
    usersData?.find((u: any) => u.id === currentUser)?.firstName || "All Users";

  return (
    <div className="flex flex-col gap-4 p-2 md:p-4">
      {/* Enhanced Filters Section */}
      <div className="bg-gradient-to-r from-[#700002] to-[#8B0000] rounded-xl shadow-lg overflow-hidden">
        {/* Filter Header - Toggle on Mobile */}
        <div
          className="flex items-center justify-between px-4 py-4 md:py-5 cursor-pointer md:cursor-default hover:bg-black/5 md:hover:bg-transparent transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 01-.22.644l-7 9.5a1 1 0 00-.22.644v5a1 1 0 01-1.447.894l-2-1A1 1 0 016 15.618v-5.07a1 1 0 00-.22-.644l-7-9.5A1 1 0 013 4V3z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-sm md:text-lg font-semibold">
                Dashboard Filters
              </h2>
            </div>
            {/* Active Filters Badge */}
            {(currentUser || dateRange !== "Today") && (
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                {[currentUser && "User", dateRange !== "Today" && "Date"]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-white transition-transform ${showFilters ? "rotate-180" : ""
              }`}
          />
        </div>

        {/* Filter Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? "max-h-96 md:max-h-none" : "max-h-0"
            }`}
        >
          <div className="px-4 md:px-6 py-4 md:py-5 bg-black/10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* User Selector */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Select Officer
                </label>
                <select
                  className="w-full px-3 py-2.5 border-2 border-white/30 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-sm font-medium transition-all hover:border-white/50"
                  value={currentUser || ""}
                  onChange={(e) => setCurrentUser(e.target.value || null)}
                >
                  <option value="">All Officers</option>
                  {usersLoading ? (
                    <option>Loading...</option>
                  ) : (
                    usersData &&
                    usersData.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Date Range Selector */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5H4v8a2 2 0 002 2h12a2 2 0 002-2V7h-2v1a1 1 0 11-2 0V7H9v1a1 1 0 11-2 0V7H6v1a1 1 0 11-2 0V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Date Range
                </label>
                <select
                  className="w-full px-3 py-2.5 border-2 border-white/30 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-sm font-medium transition-all hover:border-white/50"
                  value={dateRange}
                  onChange={(e) => {
                    setDateRange(e.target.value);
                    setShowCustomDates(e.target.value === "Custom");
                  }}
                >
                  <option value="Today">Today</option>
                  <option value="Yesterday">Yesterday</option>
                  <option value="Weekly">This Week</option>
                  <option value="Monthly">This Month</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually">Annually</option>
                  <option value="BiAnnually">Biannually</option>
                  <option value="Custom">Custom Range</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium block">
                  &nbsp;
                </label>
                <div className="flex gap-2 h-full">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 border-white/40 text-primary hover:bg-white/10 font-medium"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                    className="flex-1 bg-white text-[#700002] hover:bg-gray-100 font-medium"
                  >
                    {isGeneratingReport ? (
                      <RefreshCcw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <DownloadIcon className="w-4 h-4 mr-2" />
                    )}
                    Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Custom Date Inputs */}
            {dateRange === "Custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/10 rounded-lg border border-white/20">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    Start Date
                  </label>
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="Select start date"
                    className="bg-white text-gray-900 border-2 border-white/30 hover:border-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    End Date
                  </label>
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="Select end date"
                    className="bg-white text-gray-900 border-2 border-white/30 hover:border-white/50"
                  />
                </div>
                {!startDate || !endDate ? (
                  <p className="text-xs text-red-200 md:col-span-2">
                    ⚠️ Please select both dates to apply filter
                  </p>
                ) : (
                  <Button
                    onClick={() => refetch()}
                    disabled={isRefetching}
                    className="md:col-span-2 bg-white text-[#700002] hover:bg-gray-100 font-medium"
                  >
                    {isRefetching ? "Loading..." : "Apply Custom Range"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(currentUser || dateRange !== "Today") && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Active:
          </span>
          {currentUser && (
            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs">
              <Users className="w-3 h-3" />
              {selectedUserName}
              <button
                onClick={() => setCurrentUser(null)}
                className="ml-1 hover:font-bold transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {dateRange !== "Today" && (
            <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5H4v8a2 2 0 002 2h12a2 2 0 002-2V7h-2v1a1 1 0 11-2 0V7H9v1a1 1 0 11-2 0V7H6v1a1 1 0 11-2 0V7z"
                  clipRule="evenodd"
                />
              </svg>
              {dateRange}
              <button
                onClick={() => {
                  setDateRange("Today");
                  setShowCustomDates(false);
                }}
                className="ml-1 hover:font-bold transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Tickets",
            value: data?.totalTickets || 0,
            icon: (
              <Ticket className="h-6 w-6 text-blue-500 bg-blue-100 dark:bg-blue-900 rounded-full p-1 shadow" />
            ),
            color: "bg-blue-50 dark:bg-blue-950",
            valueColor: "text-blue-700 dark:text-blue-300",
            border: "border-blue-200 dark:border-blue-800",
          },
          {
            title: "Total Offenders",
            value: data?.totalOffenders || 0,
            icon: (
              <Users className="h-6 w-6 text-orange-500 bg-orange-100 dark:bg-orange-900 rounded-full p-1 shadow" />
            ),
            color: "bg-orange-50 dark:bg-orange-950",
            valueColor: "text-orange-700 dark:text-orange-300",
            border: "border-orange-200 dark:border-orange-800",
          },
          {
            title: "Tickets Paid",
            value: data?.totalTicketsPaid || 0,
            icon: (
              <ClipboardCheck className="h-6 w-6 text-green-500 bg-green-100 dark:bg-green-900 rounded-full p-1 shadow" />
            ),
            color: "bg-green-50 dark:bg-green-950",
            valueColor: "text-green-700 dark:text-green-300",
            border: "border-green-200 dark:border-green-800",
          },
          {
            title: "Tickets Unpaid",
            value: data?.totalTicketsUnpaid || 0,
            icon: (
              <XCircle className="h-6 w-6 text-red-500 bg-red-100 dark:bg-red-900 rounded-full p-1 shadow" />
            ),
            color: "bg-red-50 dark:bg-red-950",
            valueColor: "text-red-700 dark:text-red-300",
            border: "border-red-200 dark:border-red-800",
          },
        ].map((card) => (
          <Card
            key={card.title}
            className={`transition-all hover:shadow-lg hover:-translate-y-1 ${card.color} ${card.border} border`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xs sm:text-sm font-semibold">
                  {card.title}
                </CardTitle>
              </div>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div
                className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${card.valueColor}`}
              >
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Total Discounts",
            value: `NGN${data?.totalDiscounts?.toLocaleString() || 0}`,
            icon: (
              <Banknote className="h-6 w-6 text-teal-500 bg-teal-100 dark:bg-teal-900 rounded-full p-1 shadow" />
            ),
            color: "bg-teal-50 dark:bg-teal-950",
            valueColor: "text-teal-700 dark:text-teal-300",
            border: "border-teal-200 dark:border-teal-800",
          },
          {
            title: "Total Fines Paid",
            value: `NGN${data?.totalTicketsPaidAmount?.toLocaleString() || 0}`,
            icon: (
              <DollarSign className="h-6 w-6 text-green-600 bg-green-100 dark:bg-green-900 rounded-full p-1 shadow" />
            ),
            color: "bg-green-50 dark:bg-green-950",
            valueColor: "text-green-700 dark:text-green-300",
            border: "border-green-200 dark:border-green-800",
          },
          {
            title: "Total Fines",
            value: `NGN${data?.totalTicketAmount?.toLocaleString() || 0}`,
            icon: (
              <DollarSign className="h-6 w-6 text-indigo-500 bg-indigo-100 dark:bg-indigo-900 rounded-full p-1 shadow" />
            ),
            color: "bg-indigo-50 dark:bg-indigo-950",
            valueColor: "text-indigo-700 dark:text-indigo-300",
            border: "border-indigo-200 dark:border-indigo-800",
          },
          {
            title: "Total Fines Unpaid",
            value: `NGN${data?.totalTicketOutstandingAmount?.toLocaleString() || 0
              }`,
            icon: (
              <DollarSign className="h-6 w-6 text-rose-500 bg-rose-100 dark:bg-rose-900 rounded-full p-1 shadow" />
            ),
            color: "bg-rose-50 dark:bg-rose-950",
            valueColor: "text-rose-700 dark:text-rose-300",
            border: "border-rose-200 dark:border-rose-800",
          },
        ].map((card) => (
          <Card
            key={card.title}
            className={`transition-all hover:shadow-lg hover:-translate-y-1 ${card.color} ${card.border} border`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xs sm:text-sm font-semibold">
                  {card.title}
                </CardTitle>
              </div>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div
                className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${card.valueColor}`}
              >
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-3 w-full">
          <CardHeader>
            <CardTitle className="text-sm md:text-base">
              Tickets for the week
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-0 md:pl-2 w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={250} minWidth={250}>
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
                <Bar
                  dataKey="tickets"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 md:pl-2 overflow-x-auto">
            <ResponsiveContainer width="100%" height={250} minWidth={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
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
                  tickFormatter={(value) => `₦${value}`}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Expected Revenue"
                  stroke="var(--chart-1)"
                />
                <Line
                  type="monotone"
                  dataKey="Actual Revenue"
                  stroke="var(--chart-2)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm md:text-base">
              User Accounts Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Account/Command</TableHead>
                  <TableHead className="text-xs">Tickets</TableHead>
                  <TableHead className="text-xs hidden sm:table-cell">
                    Ticket Amount
                  </TableHead>
                  <TableHead className="text-xs hidden md:table-cell">
                    Outstanding
                  </TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">
                    Discount
                  </TableHead>
                  <TableHead className="text-xs">Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userStats.map((stat: FormattedUserStat, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs">{stat.command}</TableCell>
                    <TableCell className="text-xs">{stat.tickets}</TableCell>
                    <TableCell className="text-xs hidden sm:table-cell">
                      {stat.ticketAmount}
                    </TableCell>
                    <TableCell className="text-xs hidden md:table-cell">
                      {stat.outstandingAmount}
                    </TableCell>
                    <TableCell className="text-xs hidden lg:table-cell">
                      {stat.discountAmount}
                    </TableCell>
                    <TableCell className="text-xs">{stat.paidAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-3 md:gap-4 grid-cols-1 lg:col-span-1">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm md:text-base">
                Top 5 Violations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Offence</TableHead>
                    <TableHead className="text-xs">Violated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topViolations.map(
                    (violation: FormattedTopOffence, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="text-xs">
                          {violation.offence}
                        </TableCell>
                        <TableCell className="text-xs">
                          {violation.timesViolated}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm md:text-base">
                Top 5 Offenders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Plate Number</TableHead>
                    <TableHead className="text-xs">Tickets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topOffenders.map(
                    (offender: FormattedTopOffender, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="text-xs">
                          {offender.plateNumber}
                        </TableCell>
                        <TableCell className="text-xs">
                          {offender.totalTickets}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
