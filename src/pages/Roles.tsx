import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { SearchIcon, PlusIcon, EditIcon, Trash2Icon, ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { ComponentLoading } from '@/components/Loading'
import { Pagination } from '@/components/Pagination'
import { getRoles } from '@/services/query'
import { CreateRole, UpdateRole, DeleteRole } from '@/services/mutation'
import type { Role } from '@/services/query'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'

export default function Roles() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [roleName, setRoleName] = useState('')
  const [roleDescription, setRoleDescription] = useState('')

  const queryClient = useQueryClient()
  const { data: roles, isLoading } = getRoles()

  const createRoleMutation = CreateRole()
  const updateRoleMutation = UpdateRole(currentRole?.id || '')
  const deleteRoleMutation = DeleteRole()

  useEffect(() => {
    if (currentRole) {
      setRoleName(currentRole.name)
      setRoleDescription(currentRole.description || '')
    } else {
      setRoleName('')
      setRoleDescription('')
    }
  }, [currentRole])

  const handleCreateRole = async () => {
    if (!roleName.trim()) {
      toast.error('Role name cannot be empty.')
      return
    }
    try {
      await createRoleMutation.mutateAsync({ 
        name: roleName.trim(), 
        description: roleDescription.trim() || undefined 
      })
      toast.success('Role created successfully!')
      setIsCreateModalOpen(false)
      setRoleName('')
      setRoleDescription('')
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    } catch (error) {
      console.error('Error creating role:', error)
      toast.error('Failed to create role.')
    }
  }

  const handleUpdateRole = async () => {
    if (!currentRole || !roleName.trim()) {
      toast.error('Role name cannot be empty.')
      return
    }
    try {
      await updateRoleMutation.mutateAsync({ 
        name: roleName.trim(), 
        description: roleDescription.trim() || undefined 
      })
      toast.success('Role updated successfully!')
      setIsEditModalOpen(false)
      setCurrentRole(null)
      setRoleName('')
      setRoleDescription('')
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Failed to update role.')
    }
  }

  const handleDeleteRole = async () => {
    if (!currentRole) return
    try {
      await deleteRoleMutation.mutateAsync(currentRole.id)
      toast.success('Role deleted successfully!')
      setIsDeleteModalOpen(false)
      setCurrentRole(null)
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    } catch (error) {
      console.error('Error deleting role:', error)
      toast.error('Failed to delete role.')
    }
  }

  const filteredRoles = roles?.filter((role: Role) =>
    role.name.toLowerCase().includes(search.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(search.toLowerCase()))
  ) || []

  const paginatedRoles = filteredRoles.slice((page - 1) * pageSize, page * pageSize)

  if (isLoading) {
    return <ComponentLoading />
  }

  return (
    <div className="flex flex-col gap-4 md:p-4">
      <div className="flex md:items-center justify-between flex-col md:flex-row gap-2">
        <div>
          <h1 className="text-2xl font-bold">Roles</h1>
          <p className="text-muted-foreground">Manage user roles and permissions.</p>
        </div>
        <div className="flex items-center md:justify-start justify-end gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusIcon className="mr-2 h-4 w-4" /> Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>Enter the details for the new role.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role-name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="role-name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter role name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="role-description"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter role description"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateRole} disabled={createRoleMutation.isPending}>
                  {createRoleMutation.isPending ? "Creating..." : "Create Role"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button variant="outline" onClick={() => refetch()}>
            <RotateCw className="mr-2 h-4 w-4" /> Reload
          </Button> */}
          {/* <Button className="bg-destructive text-white hover:bg-destructive/90">
            <Upload className="mr-2 h-4 w-4" /> Export
          </Button> */}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search roles..."
            className="w-full pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRoles.map((role: Role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {role.description || '-'}
                </TableCell>
                <TableCell>
                  {role.permissions && role.permissions.length > 0 ? (
                    <span className="text-sm text-muted-foreground">
                      {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">No permissions</span>
                  )}
                </TableCell>
                <TableCell>
                  {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => {
                          setCurrentRole(role)
                          setIsEditModalOpen(true)
                        }}
                      >
                        <EditIcon className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className='text-white'
                        onClick={() => {
                          setCurrentRole(role)
                          setIsDeleteModalOpen(true)
                        }}
                      >
                        <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          page={page}
          pageSize={pageSize}
          total={filteredRoles.length}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      </div>

      {/* Edit Role Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Make changes to the role details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role-name" className="text-right">
                Name *
              </Label>
              <Input
                id="edit-role-name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="col-span-3"
                placeholder="Enter role name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-role-description"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                className="col-span-3"
                placeholder="Enter role description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateRole} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentRole?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteRole} disabled={deleteRoleMutation.isPending}>
              {deleteRoleMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
