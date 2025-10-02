import { ComponentLoading } from '@/components/Loading'
import { getUsers } from '@/services/query'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Pagination } from '@/components/Pagination'

export default function Users() {
  const [search, setSearch] = useState('')
  const [error, __] = useState('')
  
  const { data: users, isLoading: usersLoading } = getUsers();
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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
                        {users.slice((page-1)*pageSize, page*pageSize).map((user: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{user.firstName} {user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phoneNumber || "-"}</TableCell>
                            <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
    <Pagination
      page={page}
      pageSize={pageSize}
      total={users.length}
      onPageChange={setPage}
      onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
    />
          </CardContent>
        </Card>
    </div>
    </div>
  )
}
