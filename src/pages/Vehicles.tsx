import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { SearchIcon, RotateCw, Upload } from 'lucide-react'
import { ComponentLoading } from '@/components/Loading'
import { SearchVehicle } from '@/services/mutation'
import { Pagination } from '@/components/Pagination'

export default function Vehicles() {
    const [search, setSearch] = useState('')
    const [error, __] = useState('')
    const [vehicles, setVehicles] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)

    if (error) return <div className="text-center text-red-500 py-8">{error}</div>

    const { mutate, isPending } = SearchVehicle();

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
              setVehicles(res?.items || []);
              setTotal(res?.totalCount || 0)
            },
            onError: (err) => {
              console.log(err);
            }
          })
        }, [page, pageSize])
    
      if (isPending) {
        return <ComponentLoading />
      }
  
    return (
      <div className="flex flex-col gap-4 md:p-4">
        <div className="flex md:items-center justify-between flex-col md:flex-row gap-2">
          <div>
            <h1 className="text-2xl font-bold">Vehicles</h1>
            <p className="text-muted-foreground">Vehicles: Manage Registered Vehicles.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => mutate({
              "advancedSearch": null,
              "keyword": search || null,
              "advancedFilter": null,
              "pageNumber": page,
              "pageSize": pageSize,
              "orderBy": []
            })}>
              <RotateCw className="mr-2 h-4 w-4" /> Reload
            </Button>
            <Button className="bg-destructive text-white hover:bg-destructive/90">
              <Upload className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
  
        <div className="flex items-center md:justify-start justify-end gap-2">
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
                <TableHead>Plate Number</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles?.map((vehicle: any) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.plateNumber}</TableCell>
                  <TableCell className="font-medium">{vehicle.brand}</TableCell>
                  <TableCell className="font-medium">{vehicle.model}</TableCell>
                  <TableCell className="font-medium">{vehicle.color}</TableCell>
                  <TableCell className="font-medium">{vehicle.year}</TableCell>
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
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          isLoading={isPending}
        />
      </div>
  )
}
