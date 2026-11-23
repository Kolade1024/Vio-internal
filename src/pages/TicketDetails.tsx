import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { ArrowLeft, Edit, PlusIcon, Save, Trash, X } from 'lucide-react'
import { ComponentLoading } from '@/components/Loading'
import { getTicketById, type TicketData } from '../services/query'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import Auth from '@/services/auth'
import toast from 'react-hot-toast'
import { ApplyDiscountToTicket, DeleteTicket, UpdateTicket } from '@/services/mutation'

export default function TicketDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = Auth.getUser();

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<TicketData> & { isOffenderVehicleOwner?: boolean }>({})
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [discount, setDiscount] = useState({
    amount: 0,
    reason: ""
  })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { mutate: deleteTicket, isPending: isDeleting } = DeleteTicket()
  const { mutate: updateTicket, isPending: isUpdating } = UpdateTicket(id!)

  const handleDeleteTicket = () => {
    deleteTicket(id!, {
      onSuccess: () => {
        toast.success('Ticket deleted successfully')
        navigate('/tickets')
        setIsDeleteModalOpen(false)
      },
      onError: (err) => {
        console.error(err)
        toast.error('Failed to delete ticket')
        setIsDeleteModalOpen(false)
      }
    })
  }

  const isAdmin = user?.roles?.includes('Admin')

  const { data, isLoading, refetch, isRefetching } = getTicketById(id!);

  // populate editData when ticket data loads
  useEffect(() => {
    if (data) {
      setEditData({
        ...data,
        isOffenderVehicleOwner: data.offender?.id === data.vehicleOwner?.id
      })
    }
  }, [data])

  useEffect(() => {
    if (id) {
      refetch()
    }
  }, [id])

  const handleSave = () => {
    if (!data) return;

    const isOwner = editData.isOffenderVehicleOwner ?? (editData.offender?.id === editData.vehicleOwner?.id);

    const payload = {
      id: id!,
      offenderId: editData.offender?.id || data.offender?.id,
      offenderName: editData.offender?.offenderName || data.offender?.offenderName,
      email: editData.offender?.email || data.offender?.email,
      phoneNumber: editData.offender?.phoneNumber || data.offender?.phoneNumber,
      dateOfBirth: editData.offender?.dateOfBirth || data.offender?.dateOfBirth,
      address: editData.offender?.address || data.offender?.address,
      nationalIdentificationNumber: editData.offender?.nationalIdentificationNumber || data.offender?.nationalIdentificationNumber,
      licenseNumber: editData.offender?.licenseNumber || data.offender?.licenseNumber,
      licenseClass: editData.offender?.licenseClass || data.offender?.licenseClass || 'None',
      licenseStatus: editData.offender?.licenseStatus || data.offender?.licenseStatus || 'None',
      
      vehicleId: editData.vehicle?.id || data.vehicle?.id,
      plateNumber: editData.vehicle?.plateNumber || data.vehicle?.plateNumber,
      brand: editData.vehicle?.brand || data.vehicle?.brand,
      model: editData.vehicle?.model || data.vehicle?.model,
      color: editData.vehicle?.color || data.vehicle?.color,
      year: editData.vehicle?.year !== undefined ? Number(editData.vehicle.year) : (data.vehicle?.year || 0),
      chasisNumber: editData.vehicle?.chasisNumber || data.vehicle?.chasisNumber || '',
      
      commandId: data.issuedByCommandUnit?.command?.id || data.issuedByCommandUnit?.id || undefined,
      
      vehicleOwnerId: editData.vehicleOwner?.id || data.vehicleOwner?.id,
      isOffenderVehicleOwner: isOwner,
      vehicleOwnerName: isOwner ? (editData.offender?.offenderName || data.offender?.offenderName) : (editData.vehicleOwner?.fullName || data.vehicleOwner?.fullName),
      vehicleOwnerEmail: isOwner ? (editData.offender?.email || data.offender?.email) : (editData.vehicleOwner?.email || data.vehicleOwner?.email),
      vehicleOwnerPhoneNumber: isOwner ? (editData.offender?.phoneNumber || data.offender?.phoneNumber) : (editData.vehicleOwner?.phoneNumber || data.vehicleOwner?.phoneNumber),
      vehicleOwnerNationalIdentificationNumber: isOwner ? (editData.offender?.nationalIdentificationNumber || data.offender?.nationalIdentificationNumber) : (editData.vehicleOwner?.nationalIdentificationNumber || data.vehicleOwner?.nationalIdentificationNumber),
      vehicleOwnerAddress: isOwner ? (editData.offender?.address || data.offender?.address) : (editData.vehicleOwner?.address || data.vehicleOwner?.address),
      
      offenceLocation: editData.offenceLocation || data.offenceLocation,
      fineAmount: editData.fineAmount ?? data.fineAmount,
      totalPoints: editData.totalPoints ?? data.totalPoints ?? 0,
      ticketStatus: editData.ticketStatus || data.ticketStatus,
    };

    updateTicket(payload, {
      onSuccess: () => {
        toast.success('Ticket updated successfully');
        setIsEditing(false);
        refetch();
      },
      onError: (err: any) => {
        console.error(err);
        toast.error(err.response?.data?.detail || 'Failed to update ticket');
      }
    });
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const { mutate, isPending } = ApplyDiscountToTicket(id!)

  const handleApplyDiscount = () => {
    if (discount.reason.length <= 10) {
      toast.error("Reason must be greater than 10 characters!");

      return;
    }

    mutate({
      ticketId: id!,
      discount: discount.amount,
      discountReason: discount.reason
    }, {
      onSuccess: (res) => {
        toast.success("Discount applied successfully")
        console.log(res)
      },
      onError: (err: any) => {
        toast.error(err.response.data.detail || "Failed to apply discount")
      }
    })

  }

  const handleCancel = () => {
    setIsEditing(false)
    if (data) {
      setEditData({
        ...data,
        isOffenderVehicleOwner: data.offender?.id === data.vehicleOwner?.id
      })
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedInputChange = (parent: 'offender' | 'vehicle' | 'vehicleOwner', field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }))
  }

  if (isLoading || isRefetching) {
    return <ComponentLoading />
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
          <div className="flex gap-2 items-center">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <PlusIcon className="mr-2 h-4 w-4" /> Apply Discount
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Discount</DialogTitle>
                  <DialogDescription>Apply discount for this ticket</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="">
                    <Label htmlFor="discount-amount" className="mb-2 block">
                      Discount Amount *
                    </Label>
                    <Input
                      id="discount-amount"
                      value={discount.amount}
                      onChange={(e) => setDiscount({ ...discount, amount: parseInt(e.target.value) })}
                      className="col-span-3"
                      type='number'
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="">
                    <Label htmlFor="discount-reason" className="mb-2 block">
                      Reason
                    </Label>
                    <Textarea
                      id="discount-reason"
                      value={discount.reason}
                      onChange={(e) => setDiscount({ ...discount, reason: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter reason for discount"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleApplyDiscount} disabled={isPending}>
                    {isPending ? "Applying..." : "Apply"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700" disabled={isUpdating}>
                  <Save className="mr-2 h-4 w-4" />
                  {isUpdating ? "Saving..." : "Save Changes"}
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
                <Label className="font-semibold">Ticket Number</Label>
                <p className="text-sm font-medium">{data.ticketNumber}</p>
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
                <Label className="font-semibold">Offence Date</Label>
                <p className="text-sm">{new Date(data.offenceDate).toLocaleString()}</p>
              </div>
              <div>
                <Label className="font-semibold" htmlFor="fineAmount">Fine Amount</Label>
                {isEditing ? (
                  <Input
                    id="fineAmount"
                    type="number"
                    value={editData.fineAmount ?? data.fineAmount}
                    onChange={(e) => handleInputChange('fineAmount', parseFloat(e.target.value))}
                  />
                ) : (
                  <p className="text-sm font-medium">
                    ₦{(data.discountAmount && data.discountAmount > 0
                      ? data.discountAmount
                      : data.fineAmount ?? 0
                    ).toLocaleString()}
                  </p>
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
                <Label className="font-semibold" htmlFor="offenderName">Name</Label>
                {isEditing ? (
                  <Input
                    id="offenderName"
                    value={editData.offender?.offenderName || ''}
                    onChange={(e) => handleNestedInputChange('offender', 'offenderName', e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-medium">{data.offender.offenderName}</p>
                )}
              </div>
              <div>
                <Label className="font-semibold" htmlFor="offenderEmail">Email</Label>
                {isEditing ? (
                  <Input
                    id="offenderEmail"
                    type="email"
                    value={editData.offender?.email || ''}
                    onChange={(e) => handleNestedInputChange('offender', 'email', e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{data.offender.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold" htmlFor="offenderPhone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="offenderPhone"
                    value={editData.offender?.phoneNumber || ''}
                    onChange={(e) => handleNestedInputChange('offender', 'phoneNumber', e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{data.offender.phoneNumber}</p>
                )}
              </div>
              <div>
                <Label className="font-semibold" htmlFor="licenseNumber">License Number</Label>
                {isEditing ? (
                  <Input
                    id="licenseNumber"
                    value={editData.offender?.licenseNumber || ''}
                    onChange={(e) => handleNestedInputChange('offender', 'licenseNumber', e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{data.offender.licenseNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold" htmlFor="dateOfBirth">Date of Birth</Label>
                {isEditing ? (
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={editData.offender?.dateOfBirth ? editData.offender.dateOfBirth.slice(0, 10) : ''}
                    onChange={(e) => handleNestedInputChange('offender', 'dateOfBirth', e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{data.offender.dateOfBirth ? new Date(data.offender.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                )}
              </div>
              <div>
                <Label className="font-semibold" htmlFor="offenderNIN">NIN</Label>
                {isEditing ? (
                  <Input
                    id="offenderNIN"
                    value={editData.offender?.nationalIdentificationNumber || ''}
                    onChange={(e) => handleNestedInputChange('offender', 'nationalIdentificationNumber', e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{data.offender.nationalIdentificationNumber || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold block" htmlFor="licenseClass">License Class</Label>
                {isEditing ? (
                  <Select
                    value={editData.offender?.licenseClass || 'None'}
                    onValueChange={(value) => handleNestedInputChange('offender', 'licenseClass', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                      <SelectItem value="G">G</SelectItem>
                      <SelectItem value="H">H</SelectItem>
                      <SelectItem value="J">J</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm">{data.offender.licenseClass || 'None'}</p>
                )}
              </div>
              <div>
                <Label className="font-semibold block" htmlFor="licenseStatus">License Status</Label>
                {isEditing ? (
                  <Select
                    value={editData.offender?.licenseStatus || 'None'}
                    onValueChange={(value) => handleNestedInputChange('offender', 'licenseStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Revoked">Revoked</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm">{data.offender.licenseStatus || 'None'}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="font-semibold" htmlFor="offenderAddress">Address</Label>
              {isEditing ? (
                <Input
                  id="offenderAddress"
                  value={editData.offender?.address || ''}
                  onChange={(e) => handleNestedInputChange('offender', 'address', e.target.value)}
                />
              ) : (
                <p className="text-sm">{data.offender.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold" htmlFor="totalPoints">Total Points</Label>
                {isEditing ? (
                  <Input
                    id="totalPoints"
                    type="number"
                    value={editData.totalPoints ?? data.totalPoints ?? 0}
                    onChange={(e) => handleInputChange('totalPoints', parseInt(e.target.value))}
                  />
                ) : (
                  <p className="text-sm font-medium">{data.offender.totalPoints}</p>
                )}
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
                <Label className="font-semibold" htmlFor="vehiclePlate">Plate Number</Label>
                {isEditing ? (
                  <Input
                    id="vehiclePlate"
                    value={editData.vehicle?.plateNumber || ''}
                    onChange={(e) => handleNestedInputChange('vehicle', 'plateNumber', e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-medium">{data.vehicle.plateNumber}</p>
                )}
              </div>
              <div>
                <Label className="font-semibold" htmlFor="vehicleBrand">Brand</Label>
                {isEditing ? (
                  <Input
                    id="vehicleBrand"
                    value={editData.vehicle?.brand || ''}
                    onChange={(e) => handleNestedInputChange('vehicle', 'brand', e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{data.vehicle.brand}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold" htmlFor="vehicleModel">Model</Label>
                {isEditing ? (
                  <Input
                    id="vehicleModel"
                    value={editData.vehicle?.model || ''}
                    onChange={(e) => handleNestedInputChange('vehicle', 'model', e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{data.vehicle.model}</p>
                )}
              </div>
              <div>
                <Label className="font-semibold" htmlFor="vehicleColor">Color</Label>
                {isEditing ? (
                  <Input
                    id="vehicleColor"
                    value={editData.vehicle?.color || ''}
                    onChange={(e) => handleNestedInputChange('vehicle', 'color', e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{data.vehicle.color}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold" htmlFor="vehicleYear">Year</Label>
                {isEditing ? (
                  <Input
                    id="vehicleYear"
                    type="number"
                    value={editData.vehicle?.year || ''}
                    onChange={(e) => handleNestedInputChange('vehicle', 'year', parseInt(e.target.value))}
                  />
                ) : (
                  <p className="text-sm">{data.vehicle.year}</p>
                )}
              </div>
              <div>
                <Label className="font-semibold" htmlFor="chasisNumber">Chasis Number</Label>
                {isEditing ? (
                  <Input
                    id="chasisNumber"
                    value={editData.vehicle?.chasisNumber || ''}
                    onChange={(e) => handleNestedInputChange('vehicle', 'chasisNumber', e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{data.vehicle.chasisNumber || 'N/A'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Owner Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Vehicle Owner Information</CardTitle>
            {isEditing && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isOffenderVehicleOwner"
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  checked={!!editData.isOffenderVehicleOwner}
                  onChange={(e) => setEditData(prev => ({ ...prev, isOffenderVehicleOwner: e.target.checked }))}
                />
                <Label htmlFor="isOffenderVehicleOwner" className="text-sm cursor-pointer select-none">
                  Offender is the Vehicle Owner
                </Label>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {editData.isOffenderVehicleOwner ? (
              <p className="text-sm text-muted-foreground italic py-4">
                Vehicle owner is the offender. Owner details will automatically be saved using the offender's profile information.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold" htmlFor="ownerName">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="ownerName"
                        value={editData.vehicleOwner?.fullName || ''}
                        onChange={(e) => handleNestedInputChange('vehicleOwner', 'fullName', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium">{data.vehicleOwner.fullName}</p>
                    )}
                  </div>
                  <div>
                    <Label className="font-semibold" htmlFor="ownerEmail">Email</Label>
                    {isEditing ? (
                      <Input
                        id="ownerEmail"
                        type="email"
                        value={editData.vehicleOwner?.email || ''}
                        onChange={(e) => handleNestedInputChange('vehicleOwner', 'email', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm">{data.vehicleOwner.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold" htmlFor="ownerPhone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="ownerPhone"
                        value={editData.vehicleOwner?.phoneNumber || ''}
                        onChange={(e) => handleNestedInputChange('vehicleOwner', 'phoneNumber', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm">{data.vehicleOwner.phoneNumber}</p>
                    )}
                  </div>
                  <div>
                    <Label className="font-semibold" htmlFor="ownerNIN">NIN</Label>
                    {isEditing ? (
                      <Input
                        id="ownerNIN"
                        value={editData.vehicleOwner?.nationalIdentificationNumber || ''}
                        onChange={(e) => handleNestedInputChange('vehicleOwner', 'nationalIdentificationNumber', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm">{data.vehicleOwner.nationalIdentificationNumber || 'N/A'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="font-semibold" htmlFor="ownerAddress">Address</Label>
                  {isEditing ? (
                    <Input
                      id="ownerAddress"
                      value={editData.vehicleOwner?.address || ''}
                      onChange={(e) => handleNestedInputChange('vehicleOwner', 'address', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm">{data.vehicleOwner.address}</p>
                  )}
                </div>
              </>
            )}
            {!isEditing && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Total Vehicles</Label>
                  <p className="text-sm">{data.vehicleOwner.totalVehicles}</p>
                </div>
              </div>
            )}
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
            {data.offences.length === 0 || !data.offences ? (
              <p className='py-20 text-center'>No Offences</p>
            ) : data.offences.map((offence) => (
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
      {data.issuedByCommandUnit && <Card>
        <CardHeader>
          <CardTitle>Issued By</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Command Unit</Label>
              <p className="text-sm font-medium">{data.issuedByCommandUnit.name}</p>
            </div>
            <div>
              <Label className="font-semibold">Command</Label>
              <p className="text-sm">{data.issuedByCommandUnit.command?.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>}

      {/* button to toggle delete modal */}
      <div className="flex justify-end">
        {isAdmin && (
          <Button onClick={() => setIsDeleteModalOpen(true)} className='bg-red-600 hover:bg-red-700'>
            <Trash className="mr-2 h-4 w-4" />
            Delete Ticket
          </Button>
        )}
      </div>



      {/* Delete Ticket Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ticket? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button className='text-white' variant="destructive" onClick={handleDeleteTicket} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
