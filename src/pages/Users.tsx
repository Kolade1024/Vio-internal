import { ComponentLoading } from '@/components/Loading'
import { getCommands, getCommandUnits, getUsers } from '@/services/query'
import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Api from '@/services/api'

export default function Users() {
  const [search, setSearch] = useState('')
  const [error, __] = useState('')
  
  const { data: users, isLoading: usersLoading } = getUsers();
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const queryClient = useQueryClient()

  // Create User dialog state
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [badgeNumber, setBadgeNumber] = useState('')
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [commandId, setCommandId] = useState<string>('')
  const [commandUnitId, setCommandUnitId] = useState<string>('')

  const { data: commands = [] } = getCommands()
  const { data: commandUnits = [] } = getCommandUnits(commandId)

  const isSubmitDisabled = useMemo(() => {
    return !firstName || !lastName || !email || !userName || !password || !confirmPassword || !phoneNumber || !commandId || !commandUnitId || password !== confirmPassword
  }, [firstName, lastName, email, userName, password, confirmPassword, phoneNumber, commandId, commandUnitId])

  const { mutateAsync: createUser, isPending: creating } = useMutation({
    mutationFn: async () => {
      const payload = {
        firstName,
        lastName,
        badgeNumber,
        email,
        userName,
        password,
        confirmPassword,
        phoneNumber,
        commandId,
        commandUnitId,
      }
      const res = await Api.post('users/self-register', payload)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      setOpen(false)
      setFirstName(''); setLastName(''); setBadgeNumber(''); setEmail(''); setUserName(''); setPassword(''); setConfirmPassword(''); setPhoneNumber(''); setCommandId(''); setCommandUnitId('')
    },
  })

  if (error) return <div className="text-center text-red-500 py-8">{error}</div>
  // if (!users.length) return <div className="text-center py-8 text-gray-500">No users found.</div>

  if(usersLoading){
    return <ComponentLoading />
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
        <input
          className="border rounded px-3 py-2 w-full sm:w-64"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className='cursor-pointer'>Create User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="badgeNumber">Badge Number</Label>
                <Input id="badgeNumber" value={badgeNumber} onChange={(e) => setBadgeNumber(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="userName">Username</Label>
                <Input id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              {/* <div className="grid gap-1 sm:grid-cols-2 gap-3">
              </div> */}
              <div className="grid gap-1">
                <Label>Command</Label>
                <Select value={commandId} onValueChange={(v) => { setCommandId(v); setCommandUnitId('') }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select command" />
                  </SelectTrigger>
                  <SelectContent>
                    {commands.map((cmd: any) => (
                      <SelectItem key={cmd.id} value={cmd.id}>{cmd.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Command Unit</Label>
                <Select value={commandUnitId} onValueChange={setCommandUnitId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select command unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {commandUnits.map((cu: any) => (
                      <SelectItem key={cu.id} value={cu.id}>{cu.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex col-span-2 justify-end gap-2 mt-2">
                <Button className='cursor-pointer' variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button className='cursor-pointer' onClick={() => createUser()} disabled={isSubmitDisabled || creating}>{creating ? 'Creating...' : 'Create'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
