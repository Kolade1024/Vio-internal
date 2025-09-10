import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { SearchIcon, RotateCw, Upload, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { ComponentLoading } from '@/components/Loading'
import { SearchOffenders } from '@/services/mutation'

export default function Offenders() {
    const [search, setSearch] = useState('')
    const [offenders, setOffenders] = useState<any[]>([])
    const [error, __] = useState('')

    if (error) return <div className="text-center text-red-500 py-8">{error}</div>

    const { mutate, isPending } = SearchOffenders();
    
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
            setOffenders(res?.items);
          },
          onError: (err) => {
            console.log(err);
          }
        })
      }, [])
  
    if (isPending) {
      return <ComponentLoading />
    }
  
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Offenders</h1>
            <p className="text-muted-foreground">Manage all the Offenders in the System.</p>
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
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className='text-center'>Ticket Count</TableHead>
                <TableHead className='text-center'>Total Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offenders.map((offender: any) => (
                <TableRow key={offender.id}>
                  <TableCell className="font-medium">{offender.offenderName}</TableCell>
                  <TableCell className="font-medium">{offender.phoneNumber}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{offender.address}</TableCell>
                  <TableCell className='text-center'>{offender.ticketCount}</TableCell>
                  <TableCell className='text-center'>{offender.totalPoints}</TableCell>
                  
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
  
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            1-6 of {offenders.length}
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
