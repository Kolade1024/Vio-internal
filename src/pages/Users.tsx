import { ComponentLoading } from '@/components/Loading'
import { useState } from 'react'

export default function Users() {
  const [search, setSearch] = useState('')
  const [loading, _] = useState(false)
  const [error, __] = useState('')
  const [users, ___] = useState<any[]>([]) // Replace with real data type

  // ...fetch users logic...

  if (error) return <div className="text-center text-red-500 py-8">{error}</div>
  if (!users.length) return <div className="text-center py-8 text-gray-500">No users found.</div>

  if(loading){
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
        <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.status}</td>
                <td className="px-4 py-2">
                  {/* Actions: View/Edit/Delete */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="flex justify-end mt-4">
        {/* ...pagination buttons... */}
      </div>
    </div>
  )
}
