import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
// import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SearchPayments, type SearchPaymentsResponseItem } from "@/services/mutation"
import toast from 'react-hot-toast'
import { Pagination } from '@/components/Pagination'

export default function Payments() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string | undefined>(undefined)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [payments, setPayments] = useState<SearchPaymentsResponseItem[]>([])
  const [total, setTotal] = useState(0)

  const [selectedPayment, setSelectedPayment] = useState<SearchPaymentsResponseItem | null>(null)
  // const [ticketAmount, setTicketAmount] = useState<string>('')
  // const [channel, setChannel] = useState<string>('')
  const [viewModalOpen, setViewModalOpen] = useState(false)

  const { mutate, isPending } = SearchPayments()
  // const initiatePayment = InitiatePayment()
  // const verifyPayment = VerifyPayment()

  const fetchPayments = (p = page, ps = pageSize) => {
    mutate({
      query: query || undefined,
      status: status || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      pageNumber: p,
      pageSize: ps,
    }, {
      onSuccess: (res: any) => {
        setPayments(res?.items || [])
        setTotal(res?.totalCount ?? (res?.items?.length ?? 0))
      },
      onError: (err) => {
        console.error(err)
        toast.error('Failed to load payments')
      }
    })
  }

  useEffect(() => {
    fetchPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize])

  const onSearch = () => {
    setPage(1)
    fetchPayments(1, pageSize)
  }

  // const onInitiate = async () => {
  //   if (!selectedPayment?.ticketId) return
  //   const amountNum = ticketAmount ? Number(ticketAmount) : (selectedPayment.amount || 0)
  //   if (!amountNum || Number.isNaN(amountNum)) return toast.error('Invalid amount')
  //   try {
  //     await initiatePayment.mutateAsync({
  //       ticketId: selectedPayment.ticketId,
  //       amount: amountNum,
  //       channel: channel || undefined,
  //     })
  //     setSelectedPayment(null)
  //     setTicketAmount('')
  //     setChannel('')
  //     await fetchPayments(page, pageSize)
  //     toast.success('Initiated')
  //   } catch {
  //     toast.error('Initiation failed')
  //   }
  // }

  // const onVerify = async (reference?: string) => {
  //   if (!reference) return
  //   try {
  //     await verifyPayment.mutateAsync({ reference })
  //     await fetchPayments(page, pageSize)
  //     toast.success('Verified')
  //   } catch {
  //     toast.error('Verification failed')
  //   }
  // }

  // const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1
  // const endIndex = Math.min(page * pageSize, total)

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <Label htmlFor="query">Search</Label>
            <Input id="query" placeholder="Ticket ID or Reference" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status ?? ''}
              onChange={(e) => setStatus(e.target.value || undefined)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <Label htmlFor="start">Start date</Label>
            <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="end">End date</Label>
            <Input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div>
            <Button onClick={onSearch} disabled={isPending} className="w-full">
              {isPending ? 'Searching…' : 'Search'}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Ticket</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.length ? (
                payments.map((p: any) => (
                  <TableRow key={p.id || p.reference || Math.random()}>
                    <TableCell>{p.paymentReference || '-'}</TableCell>
                    <TableCell>{p.ticketId.substring(0, 10) || '-'}</TableCell>
                    {/* <TableCell className={p.ticketStatus === 'issued' ? 'text-green-600' : p.ticketStatus === 'failed' ? 'text-red-600' : ''}>{p.ticketStatus || p.status || '-'}</TableCell> */}
                    <TableCell className="text-right">{p.amount != null ? Intl.NumberFormat().format(p.amount) : (p.fineAmount != null ? Intl.NumberFormat().format(p.fineAmount) : '-')}</TableCell>
                    <TableCell>{p.paymentMethod || '-'}</TableCell>
                    <TableCell>{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : (p.offenceDate ? new Date(p.offenceDate).toLocaleString() : '-')}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedPayment(p); setViewModalOpen(true); }}>
                        View
                      </Button>

                      {/* <Button variant="outline" size="sm" onClick={() => { setSelectedPayment(p); setTicketAmount(String(p.amount || p.fineAmount || '')); }}>
                        Initiate
                      </Button> */}

                      {/* <Button variant="secondary" size="sm" onClick={() => onVerify(p.reference)} disabled={!p.reference || verifyPayment.isPending}>
                        {verifyPayment.isPending ? 'Verifying…' : 'Verify'}
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">{isPending ? 'Loading…' : 'No results'}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex}-{endIndex} of {total}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="h-8 w-20 border rounded px-2"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => { if (page > 1) { setPage(page - 1); fetchPayments(page - 1, pageSize); } }} disabled={page <= 1}>
                Prev
              </Button>
              <Button variant="outline" size="sm" onClick={() => { if (endIndex < total) { setPage(page + 1); fetchPayments(page + 1, pageSize); } }} disabled={endIndex >= total}>
                Next
              </Button>
            </div>
          </div>
        </div> */}
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          isLoading={isPending}
        />
      </Card>

      {/* Simple view modal */}
      {viewModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setViewModalOpen(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded shadow-lg w-full max-w-2xl p-6 z-10">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">Payment Details</h3>
              <button onClick={() => setViewModalOpen(false)} className="text-gray-600 hover:text-gray-900">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-sm text-muted-foreground">Reference</div>
                <div className="font-medium">{selectedPayment.paymentReference || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Ticket</div>
                <div className="font-medium">{selectedPayment.ticketId || '-'}</div>
              </div>

              {/* <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-medium">{selectedPayment.ticketStatus || selectedPayment.ticketStatus || '-'}</div>
              </div> */}

              <div>
                <div className="text-sm text-muted-foreground">Amount</div>
                <div className="font-medium">{selectedPayment.amount != null ? Intl.NumberFormat().format(selectedPayment.amount) : '-'}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Channel</div>
                <div className="font-medium">{selectedPayment.paymentMethod || '-'}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="font-medium">{selectedPayment.paymentDate ? new Date(selectedPayment.paymentDate).toLocaleString() : '-'}</div>
              </div>

              {/* If the payment item carries ticket metadata, show it */}
              {/* <div className="md:col-span-2">
                <div className="text-sm text-muted-foreground">Offence Location</div>
                <div className="font-medium">{selectedPayment.offenceLocation || '-'}</div>
              </div> */}

              {/* <div className="md:col-span-2">
                <div className="text-sm text-muted-foreground">Raw data</div>
                <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded max-h-48 overflow-auto">{JSON.stringify(selectedPayment, null, 2)}</pre>
              </div>*/}
            </div> 

            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 rounded border" onClick={() => { setViewModalOpen(false); }}>Close</button>
              {/* <button
                className="px-4 py-2 rounded bg-primary text-primary-foreground"
                onClick={() => { setSelectedPayment(selectedPayment); setTicketAmount(String(selectedPayment.amount || selectedPayment.fineAmount || '')); }}
              >
                Prepare Initiate
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
