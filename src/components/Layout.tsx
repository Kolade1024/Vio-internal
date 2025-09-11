import { Link, Outlet } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
// import { cn } from '../lib/utils'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  // CalendarIcon,
  HomeIcon,
  MenuIcon,
  TicketIcon,
  UsersIcon,
  CreditCardIcon,
  ClipboardListIcon,
  ShieldAlertIcon,
  CarIcon,
  FileTextIcon,
  BarChart2Icon,
  UserCheckIcon,
  SearchIcon,
  PlusIcon
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
// import { Calendar } from '@/components/ui/calendar'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { Label } from '@/components/ui/label'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import Auth from '@/services/auth'
import { getProfile } from '@/services/query'
import { useEffect } from 'react'
import Loading from './Loading'

import logo from "../assets/images/oyo-logo.png"

export default function Layout() {
  const [user, setUser] = useState(Auth.getUser())
  // const [date, setDate] = useState<Date | undefined>(new Date())

  const { data, isLoading } = getProfile();

  useEffect(() => {
    if(data && !isLoading) {
      Auth.setUser(data)
      setUser(Auth.getUser())
    }
  }, [data, isLoading])

  const handleLogout = () => {
    Auth.logOut()
  }

  const navItems = [
    {
      section: 'Management',
      items: [
        { name: 'Home', icon: HomeIcon, path: '/' },
        { name: 'Commands', icon: TicketIcon, path: '/commands' },
        { name: 'Command Units', icon: UsersIcon, path: '/command-units' },
      ],
    },
    {
      section: 'Enforcement',
      items: [
        { name: 'Offences', icon: ShieldAlertIcon, path: '/offences' },
        { name: 'Offenders', icon: UsersIcon, path: '/offenders' },
        { name: 'Vehicles', icon: CarIcon, path: '/vehicles' },
        { name: 'Vehicle Owners', icon: UserCheckIcon, path: '/vehicle-owners' },
        { name: 'Tickets', icon: TicketIcon, path: '/tickets' },
        { name: 'Search Ticket', icon: SearchIcon, path: '/search-ticket' },
        { name: 'Create Ticket', icon: PlusIcon, path: '/create-ticket' },
        { name: 'Complaints', icon: ClipboardListIcon, path: '/complaints' },
      ],
    },
    {
      section: 'Administration',
      items: [
        { name: 'Payments', icon: CreditCardIcon, path: '/payments' },
        { name: 'Users', icon: UsersIcon, path: '/users' },
        { name: 'Roles', icon: UserCheckIcon, path: '/roles' },
        { name: 'Audit Trail', icon: FileTextIcon, path: '/audit-logs' },
        { name: 'Tenants', icon: BarChart2Icon, path: '/tenants' },
      ],
    },
  ]

  if(isLoading){
    return <Loading />
  }

  return (
    <div className="min-h-screen w-full bg-gray-100/40">
      <div className="fixed inset-y-0 left-0 z-10 hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-[280px]">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" to="/">
              <img src={logo} alt="VIO Logo" className="h-8 w-8" />
              <span>VIO</span>
            </Link>
            <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <ScrollArea className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {navItems.map((section, sectionIndex) => (
                <div key={sectionIndex} className="pb-4">
                  <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white">
                    {section.section}
                  </h4>
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      to={item.path}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </div>
      <div className="flex flex-col lg:ml-[280px]">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="lg:hidden" size="icon" variant="outline">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link className="flex items-center gap-2 font-semibold mb-4" to="/">
                <img src={logo} alt="VIO Logo" className="h-8 w-8" />
                <span>VIO</span>
              </Link>
              <ScrollArea className="grid gap-2 text-lg font-medium h-full w-full pr-4 overflow-y-auto">
                {navItems.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white">
                      {section.section}
                    </h4>
                    {section.items.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-gray-900 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        to={item.path}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <div className="flex items-center justify-end gap-4">
              {/* <Select>
                <SelectTrigger id="account" className="w-[180px]">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account1">Account 1</SelectItem>
                  <SelectItem value="account2">Account 2</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-[240px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toDateString() : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="rounded-full"
                    size="icon"
                    variant="ghost"
                  >
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {user ? `${user?.firstName?.substring(0, 1)}${user?.lastName?.substring(0, 1)}` : 'RA'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>My Account</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}