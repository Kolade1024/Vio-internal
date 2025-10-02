import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { SearchIcon, RotateCw, Upload, ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { cn } from '../lib/utils'
import { getComplaints } from '@/services/query'
import { ComponentLoading } from '@/components/Loading'
import { Pagination } from '@/components/Pagination'

export default function Complaints() {
  const [search, setSearch] = useState('')
  const [error, __] = useState('')

  const { data: complaints, isLoading } = getComplaints() 
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  if (error) return <div className="text-center text-red-500 py-8">{error}</div>

  if (isLoading) {
    return <ComponentLoading />
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Complaints</h1>
          <p className="text-muted-foreground">Manage all the Complaints in the System.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RotateCw className="mr-2 h-4 w-4" /> Reload
          </Button>
          <Button className="bg-destructive text-white hover:bg-destructive/90">
            <Upload className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search for Complaints"
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
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Incident Date</TableHead>
              {/* <TableHead>Complainant</TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.slice((page-1)*pageSize, page*pageSize).map((complaint: any) => (
              <TableRow key={complaint.id}>
                <TableCell className="font-medium">{complaint.name}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      complaint.type === 'Extortion'
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    )}
                  >
                    {complaint.complaintType}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{complaint.description}</TableCell>
                <TableCell>{complaint.location}</TableCell>
                <TableCell>
                        {new Date(complaint.incidentDate).toLocaleDateString()}
                </TableCell>
                {/* <TableCell>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      complaint.complainant === 'Anonymous'
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    )}
                  >
                    {complaint.complainant}
                  </span>
                </TableCell> */}
                <TableCell>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      complaint.status === 'Pending'
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    )}
                  >
                    {complaint.status}
                  </span>
                </TableCell>
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
        total={complaints.length}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
      />
    </div>
  )
}
