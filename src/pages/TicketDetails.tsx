import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { ArrowLeft, Edit, Save, X } from 'lucide-react'
import { ComponentLoading } from '@/components/Loading'
import { getTicketById, type TicketData } from '../services/query'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { UpdateTicket } from '@/services/mutation'

export default function TicketDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
//   const [ticket, setTicket] = useState<TicketData | null>(null)
//   const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<TicketData>>({})

  const isAdmin = user?.role === 'Admin'

  const { data, isLoading, refetch, isRefetching } = getTicketById(id!);

  useEffect(() => {
    if (id) {
      refetch()
    }
  }, [id])

//   const fetchTicket = async () => {
//     try {
//       setLoading(true)
//       const response = await getTicketById(id!)
//       setTicket(response.data)
//       setEditData(response.data)
//     } catch (err) {
//       setError('Failed to fetch ticket details')
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
    //   await UpdateTicket(id!, editData)
      setIsEditing(false)
      // Refetch the ticket data to get the updated information
    //   await fetchTicket()
    } catch (err) {
      console.error('Failed to update ticket:', err)
      setError('Failed to update data. Please try again.')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData(data || {})
  }

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading || isRefetching) {
    return <ComponentLoading />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate('/tickets')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-gray-500 mb-4">Ticket not found</p>
        <Button onClick={() => navigate('/tickets')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="">
          <Button
            variant="outline"
            onClick={() => navigate('/tickets')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Button>
          <div className='mt-5'>
            <h1 className="text-2xl font-bold">Ticket Details</h1>
            <p className="text-muted-foreground">Ticket #{data.ticketNumber}</p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Ticket
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Information */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold" htmlFor="ticketNumber">Ticket Number</Label>
                {isEditing ? (
                  <Input
                    id="ticketNumber"
                    value={editData.ticketNumber || ''}
                    onChange={(e) => handleInputChange('ticketNumber', e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-medium">{data.ticketNumber}</p>
                )}
              </div>
              <div>
                <Label className="font-semibold block" htmlFor="ticketStatus">Status</Label>
                {isEditing ? (
                  <Select
                    value={editData.ticketStatus || data.ticketStatus}
                    onValueChange={(value) => handleInputChange('ticketStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Issued">Issued</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Disputed">Disputed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className='text-white' variant={data.ticketStatus === 'Paid' ? 'default' : 'secondary'}>
                    {data.ticketStatus}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold" htmlFor="offenceDate">Offence Date</Label>
                {isEditing ? (
                  <Input
                    id="offenceDate"
                    type="datetime-local"
                    value={editData.offenceDate ? new Date(editData.offenceDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleInputChange('offenceDate', e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{new Date(data.offenceDate).toLocaleString()}</p>
                )}
              </div>
              <div>
                <Label className="font-semibold" htmlFor="fineAmount">Fine Amount</Label>
                {isEditing ? (
                  <Input
                    id="fineAmount"
                    type="number"
                    value={editData.fineAmount || data.fineAmount}
                    onChange={(e) => handleInputChange('fineAmount', parseFloat(e.target.value))}
                  />
                ) : (
                  <p className="text-sm font-medium">₦{data.fineAmount.toLocaleString()}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="font-semibold" htmlFor="offenceLocation">Offence Location</Label>
              {isEditing ? (
                <Input
                  id="offenceLocation"
                  value={editData.offenceLocation || data.offenceLocation}
                  onChange={(e) => handleInputChange('offenceLocation', e.target.value)}
                />
              ) : (
                <p className="text-sm">{data.offenceLocation}</p>
              )}
            </div>

            <div>
              <Label className="font-semibold" htmlFor="evidence">Evidence</Label>
              {isEditing ? (
                <Textarea
                  id="evidence"
                  value={editData.evidence || data.evidence}
                  onChange={(e) => handleInputChange('evidence', e.target.value)}
                />
              ) : (
                <p className="text-sm">{data.evidence}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Offender Information */}
        <Card>
          <CardHeader>
            <CardTitle>Offender Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Name</Label>
                <p className="text-sm font-medium">{data.offender.offenderName}</p>
              </div>
              <div>
                <Label className="font-semibold">Email</Label>
                <p className="text-sm">{data.offender.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Phone Number</Label>
                <p className="text-sm">{data.offender.phoneNumber}</p>
              </div>
              <div>
                <Label className="font-semibold">License Number</Label>
                <p className="text-sm">{data.offender.licenseNumber}</p>
              </div>
            </div>

            <div>
              <Label className="font-semibold">Address</Label>
              <p className="text-sm">{data.offender.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Total Points</Label>
                <p className="text-sm font-medium">{data.offender.totalPoints}</p>
              </div>
              <div>
                <Label className="font-semibold">Ticket Count</Label>
                <p className="text-sm">{data.offender.ticketCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Plate Number</Label>
                <p className="text-sm font-medium">{data.vehicle.plateNumber}</p>
              </div>
              <div>
                <Label className="font-semibold">Brand</Label>
                <p className="text-sm">{data.vehicle.brand}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Model</Label>
                <p className="text-sm">{data.vehicle.model}</p>
              </div>
              <div>
                <Label className="font-semibold">Color</Label>
                <p className="text-sm">{data.vehicle.color}</p>
              </div>
            </div>

            <div>
              <Label className="font-semibold">Year</Label>
              <p className="text-sm">{data.vehicle.year}</p>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Owner Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Owner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Full Name</Label>
                <p className="text-sm font-medium">{data.vehicleOwner.fullName}</p>
              </div>
              <div>
                <Label className="font-semibold">Email</Label>
                <p className="text-sm">{data.vehicleOwner.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Phone Number</Label>
                <p className="text-sm">{data.vehicleOwner.phoneNumber}</p>
              </div>
              <div>
                <Label className="font-semibold">Total Vehicles</Label>
                <p className="text-sm">{data.vehicleOwner.totalVehicles}</p>
              </div>
            </div>

            <div>
              <Label className="font-semibold">Address</Label>
              <p className="text-sm">{data.vehicleOwner.address}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offences */}
      <Card>
        <CardHeader>
          <CardTitle>Offences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.offences.map((offence) => (
              <div key={offence.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="font-semibold">Offence Name</Label>
                    <p className="text-sm font-medium">{offence.offenceName}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Code</Label>
                    <p className="text-sm">{offence.code}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Points</Label>
                    <p className="text-sm">{offence.points}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Penalty</Label>
                    <p className="text-sm font-medium">₦{offence.penalty.toLocaleString()}</p>
                  </div>
                </div>
                {offence.additionalAction && (
                  <div className="mt-2">
                    <Label className="font-semibold">Additional Action</Label>
                    <p className="text-sm">{offence.additionalAction}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Command Unit Information */}
      <Card>
        <CardHeader>
          <CardTitle>Issued By</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Command Unit</Label>
              {/* <p className="text-sm font-medium">{data?.issuedByCommandUnit.name}</p> */}
            </div>
            <div>
              <Label className="font-semibold">Command</Label>
              {/* <p className="text-sm">{data.issuedByCommandUnit.command.name}</p> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
