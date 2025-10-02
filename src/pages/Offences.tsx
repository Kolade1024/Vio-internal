import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { SearchIcon, RotateCw, Upload } from 'lucide-react'
import { cn } from '../lib/utils'
import { ComponentLoading } from '@/components/Loading'
import { getOffences } from '@/services/query'
import { Pagination } from '@/components/Pagination'

export default function Offences() {
    const [search, setSearch] = useState('')
    const [error, __] = useState('')

    if (error) return <div className="text-center text-red-500 py-8">{error}</div>

    const { data, isLoading } = getOffences();
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
  
    if (isLoading) {
      return <ComponentLoading />
    }
  
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Offences</h1>
            <p className="text-muted-foreground">Manage all the Offences in the System.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
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
                <TableHead>Offence name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Penalty</TableHead>
                <TableHead>Additional Action</TableHead>
                <TableHead>Subsequent Offender Price</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead className="text-right">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.slice((page-1)*pageSize, page*pageSize).map((offender: any) => (
                <TableRow key={offender.id}>
                  <TableCell className="font-medium">{offender.offenceName}</TableCell>
                  <TableCell className="font-medium">{offender.code || "-"}</TableCell>
                  <TableCell className="font-medium">{offender.points || "-"}</TableCell>
                  <TableCell className="font-medium">{offender.penalty.toLocaleString() || "-"}</TableCell>
                  <TableCell className="font-medium">{offender.additionalAction || "-"}</TableCell>
                  <TableCell className="font-medium">{offender.subsequentOffenderPrice || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-semibold",
                        offender.status === 'Pending'
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      )}
                    >
                      {offender.status}
                    </span>
                  </TableCell>
                  {/* <TableCell className="text-right">
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
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
  
        <Pagination
          page={page}
          pageSize={pageSize}
          total={data?.length || 0}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      </div>
  )
}
