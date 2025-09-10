import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { SearchIcon, RotateCw, Upload, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { ComponentLoading } from '@/components/Loading'
import { SearchTickets } from '@/services/mutation'

export default function Tickets() {
  const [search, setSearch] = useState('')
  const [error, __] = useState('')
  const [tickets, setTickets] = useState<any[]>([])

  const { mutate, isPending } = SearchTickets();

  useEffect(() => {
    mutate({
      "advancedSearch": null,
      "keyword": null,
      "advancedFilter": null,
      "pageNumber": 1,
      "pageSize": 10,
      "orderBy": []
  }, {
      onSuccess: (res) => {
        setTickets(res?.items);
      },
      onError: (err) => {
        console.log(err);
      }
    })
  }, [])

  
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>
  // if (!tickets.length) return <div className="text-center py-8 text-gray-500">No tickets found.</div>

  if (isPending) {
    return <ComponentLoading />
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">Manage all the Tickets in the System.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => window.location.reload()} variant="outline">
            <RotateCw className="mr-2 h-4 w-4" /> Reload
          </Button>
          <Button className="bg-destructive !text-white text-destructive-foreground hover:bg-destructive/90">
            <Upload className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search for Tickets"
            className="w-full pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        {/* Add filter dropdowns here */}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>TicketNumber</TableHead>
              <TableHead>Ticket Date</TableHead>
              <TableHead>Fine Amount</TableHead>
              <TableHead>Total Points</TableHead>
              {/* <TableHead>Status</TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length < 1 || !tickets ? (
              <TableRow>
                <TableCell colSpan={7} className="font-medium text-center py-40">No Tickets</TableCell>
              </TableRow>
            ) : tickets.map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.id.substring(0, 8)}</TableCell>
                <TableCell>{ticket.ticketNumber}</TableCell>
                <TableCell>
                        {new Date(ticket?.offenceDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{ticket.fineAmount.toLocaleString()}</TableCell>
                <TableCell className='text-center'>{ticket.totalPoints}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <span className="sr-only">Open menu</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          1-10 of 17179
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
    </div>
  )
}
