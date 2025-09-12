import { ComponentLoading } from '@/components/Loading'
import { getUsers } from '@/services/query'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Button } from '../components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

export default function Users() {
  const [search, setSearch] = useState('')
  const [error, __] = useState('')
  
  const { data: users, isLoading: usersLoading } = getUsers();

  if (error) return <div className="text-center text-red-500 py-8">{error}</div>
  // if (!users.length) return <div className="text-center py-8 text-gray-500">No users found.</div>

  if(usersLoading){
    return <ComponentLoading />
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 w-full sm:w-64"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {/* Add filter dropdowns here */}
      </div>
      <div className="overflow-x-auto">
        <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone Number</TableHead>
                          <TableHead>Status</TableHead>
                          {/* <TableHead>Actions</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{user.firstName} {user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phoneNumber || "-"}</TableCell>
                            <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
    <div className="flex flex-col md:flex-row items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {users?.length}
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
    </div>
    </div>
  )
}
