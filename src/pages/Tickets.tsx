import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { SearchIcon, RotateCw, Upload, ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { ComponentLoading } from '@/components/Loading'
import { SearchTickets } from '@/services/mutation'
import { Pagination } from '@/components/Pagination'

export default function Tickets() {
  const [search, setSearch] = useState('')
  const [error, __] = useState('')
  const [tickets, setTickets] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const { mutate, isPending } = SearchTickets();

  useEffect(() => {
    mutate({
      "advancedSearch": null,
      "keyword": search || null,
      "advancedFilter": null,
      "pageNumber": page,
      "pageSize": pageSize,
      "orderBy": []
  }, {
      onSuccess: (res: any) => {
        setTickets(res?.items || []);
        setTotal(res?.totalPages || 0)
      },
      onError: (err) => {
        console.log(err);
      }
    })
  }, [page, pageSize])

  
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
          <Button onClick={() => mutate({
            "advancedSearch": null,
            "keyword": search || null,
            "advancedFilter": null,
            "pageNumber": page,
            "pageSize": pageSize,
            "orderBy": []
          })} variant="outline">
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

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        isLoading={isPending}
      />
    </div>
  )
}
