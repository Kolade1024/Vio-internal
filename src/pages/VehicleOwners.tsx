import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { SearchIcon, RotateCw, Upload } from 'lucide-react'
import { ComponentLoading } from '@/components/Loading'
import { getVehicleOwners } from '@/services/query'
import { Pagination } from '@/components/Pagination'

export default function VehicleOwners() {
    const [search, setSearch] = useState('')
    const [error, __] = useState('')

    if (error) return <div className="text-center text-red-500 py-8">{error}</div>

    const { data, isLoading, isFetching, refetch } = getVehicleOwners();

    if (isLoading) {
        return <ComponentLoading />
      }

    const owners = Array.isArray(data) ? data : []
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const normalizedSearch = search.toLowerCase()
    const filteredOwners = owners.filter((owner: any) => {
      const haystack = [
        owner?.fullName,
        owner?.nationalIdentificationNumber,
        owner?.phoneNumber,
        owner?.email,
        owner?.address,
      ]
        .map((v: any) => (v ?? '').toString().toLowerCase())
        .join(' ')
      return haystack.includes(normalizedSearch)
    })
  
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Vehicle Owners</h1>
            <p className="text-muted-foreground">Manage registered vehicle owners.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RotateCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} /> Reload
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
              placeholder="Search owners by name, phone, email, address"
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
                <TableHead>Owner Name</TableHead>
                <TableHead>NIN</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Total Vehicles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOwners.slice((page-1)*pageSize, page*pageSize)?.map((owner: any) => (
                <TableRow key={owner.id}>
                  <TableCell className="font-medium">{owner.fullName}</TableCell>
                  <TableCell className="font-medium">{owner.nationalIdentificationNumber ?? '-'}</TableCell>
                  <TableCell className="font-medium">{owner.phoneNumber ?? '-'}</TableCell>
                  <TableCell className="font-medium">{owner.email ?? '-'}</TableCell>
                  <TableCell className="font-medium">{owner.address ?? '-'}</TableCell>
                  <TableCell className="font-medium text-right">{owner.totalVehicles ?? 0}</TableCell>
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
          total={filteredOwners.length}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          isLoading={isFetching}
        />
      </div>
  )
}
