import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InitiatePayment, VerifyPayment, SearchPayments, type SearchPaymentsResponseItem } from "@/services/mutation"

export default function Payments() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string | undefined>(undefined)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)

  const [selectedPayment, setSelectedPayment] = useState<SearchPaymentsResponseItem | null>(null)
  const [ticketAmount, setTicketAmount] = useState<string>('')
  const [channel, setChannel] = useState<string>('')

  const searchPayments = SearchPayments()
  const initiatePayment = InitiatePayment()
  const verifyPayment = VerifyPayment()

  const onSearch = async () => {
    await searchPayments.mutateAsync({
      query: query || undefined,
      status: status || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page,
      pageSize,
    })
  }

  const onInitiate = async () => {
    if (!selectedPayment?.ticketId) return
    const amountNum = ticketAmount ? Number(ticketAmount) : selectedPayment.amount
    if (!amountNum || Number.isNaN(amountNum)) return
    await initiatePayment.mutateAsync({
      ticketId: selectedPayment.ticketId,
      amount: amountNum,
      channel: channel || undefined,
    })
    setSelectedPayment(null)
    setTicketAmount('')
    setChannel('')
    await onSearch()
  }

  const onVerify = async (reference?: string) => {
    if (!reference) return
    await verifyPayment.mutateAsync({ reference })
    await onSearch()
  }

  const results = searchPayments.data

  return (
    <div className="p-4 space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <Label htmlFor="query">Search</Label>
            <Input id="query" placeholder="Ticket ID or Reference" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status ?? ''} onValueChange={(v) => setStatus(v || undefined)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
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
            <Button onClick={onSearch} disabled={searchPayments.isPending} className="w-full">
              {searchPayments.isPending ? 'Searching…' : 'Search'}
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results?.items?.length ? (
                results.items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.reference || '-'}</TableCell>
                    <TableCell>{p.ticketId || '-'}</TableCell>
                    <TableCell className={p.status === 'success' ? 'text-green-600' : p.status === 'failed' ? 'text-red-600' : ''}>{p.status}</TableCell>
                    <TableCell className="text-right">{Intl.NumberFormat().format(p.amount)}</TableCell>
                    <TableCell>{p.channel || '-'}</TableCell>
                    <TableCell>{p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}</TableCell>
                    <TableCell className="space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => { setSelectedPayment(p); setTicketAmount(String(p.amount || '')); }}>Initiate</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Initiate Payment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div>
                              <Label>Ticket ID</Label>
                              <Input value={selectedPayment?.ticketId || ''} disabled />
                            </div>
                            <div>
                              <Label>Amount</Label>
                              <Input type="number" value={ticketAmount} onChange={(e) => setTicketAmount(e.target.value)} />
                            </div>
                            <div>
                              <Label>Channel (optional)</Label>
                              <Input placeholder="card, transfer…" value={channel} onChange={(e) => setChannel(e.target.value)} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={onInitiate} disabled={initiatePayment.isPending}>
                              {initiatePayment.isPending ? 'Initiating…' : 'Initiate'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="secondary" size="sm" onClick={() => onVerify(p.reference)} disabled={!p.reference || verifyPayment.isPending}>
                        {verifyPayment.isPending ? 'Verifying…' : 'Verify'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">{searchPayments.isPending ? 'Loading…' : 'No results'}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {results?.total ? (
          <div className="flex items-center justify-between px-4 py-3">
            <div className="text-sm">Total: {results.total}</div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => { setPage(Math.max(1, page - 1)); onSearch(); }} disabled={page <= 1}>Prev</Button>
              <Button variant="outline" size="sm" onClick={() => { setPage(page + 1); onSearch(); }} disabled={results.items.length < pageSize}>Next</Button>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  )
}
