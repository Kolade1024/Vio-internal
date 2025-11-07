import { SearchTickets } from '@/services/mutation'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function SearchTicket() {
  const navigate = useNavigate()
  const [searchItem, setSearchItem] = useState('')
  const [tickets, setTickets] = useState<any[]>([])

  const { isPending, mutate } = SearchTickets()

  const handleSearch = () => {
    if (!searchItem) {
      return toast.error('Please enter a ticket detail')
    }

    mutate(
      {
        keyword: searchItem || null,
        advancedFilter: null,
        orderBy: ['offenceDate desc'],
        pageNumber: 1,
        pageSize: 10,
        advancedSearch: {
          keyword: searchItem || null,
          fields: ['Vehicle.PlateNumber', 'Offender.PhoneNumber']
        }
      },
      {
        onSuccess: (res: any) => {
          if (!res?.items || res?.items.length === 0) {
            setTickets([])
            return toast.error('Ticket not found!')
          }

          setTickets(res?.items || [])
          toast.success('Ticket(s) found!')
        },
        onError: (err) => {
          console.error(err)
          toast.error('Search failed')
        },
      }
    )
  }

  const formatDate = (iso?: string) => {
    if (!iso) return '-'
    try {
      return new Date(iso).toLocaleString()
    } catch {
      return iso
    }
  }

  const formatCurrency = (value?: number) => {
    if (value == null) return '-'
    return value.toLocaleString(undefined, { style: 'currency', currency: 'NGN' })
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Search Ticket</h1>
            <p className="text-muted-foreground">Searches a Ticket in the System.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search ticket number, plate number, offender or phone"
              className="w-full pl-8"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <Button disabled={isPending} onClick={handleSearch} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {isPending ? 'Searching' : 'Search'}
          </Button>
        </div>
      </div>

      <div className="md:p-4">
        {tickets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No tickets to display.</div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-md shadow">
            <table className="min-w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="px-4 py-3">Ticket #</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Issued At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium">{t.ticketNumber || t.number || t.id}</div>
                      <div className="text-xs text-gray-500">{t.commandUnitName || t.command || '-'}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                          t.ticketStatus === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {t.ticketStatus || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium">{t.offenceLocation || t.vehicleOwner || t.plateNumber || '-'}</div>
                      <div className="text-xs text-gray-500">
                        {t.vehicleMake ? `${t.vehicleMake} ${t.vehicleModel || ''}` : t.plateNumber || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">{formatCurrency(t.fineAmount || t.amount)}</td>
                    <td className="px-4 py-3 align-top">{formatDate(t.createdAt || t.offenceDate)}</td>
                    <td className="px-4 py-3 text-right align-top">
                      <div className="inline-flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            // navigate to ticket details page if available
                            if (t.id) navigate(`/tickets/${t.id}`)
                            else toast('No ticket id available')
                          }}
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => {
                            // quick action: open edit route or modal - prefer details page for now
                            if (t.id) navigate(`/tickets/${t.id}`)
                            else toast('No ticket id available')
                          }}
                        >
                          Manage
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}