import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Upload, SearchIcon } from 'lucide-react'
import { Label } from '../components/ui/label'
// import { Textarea } from '../components/ui/textarea'
import type { CreateTicketPayload } from '@/services/mutation'
import { CreateTicket as useCreateTicketMutation } from '@/services/mutation'
import toast from 'react-hot-toast'
import { getOffences, getCommands, getVehicleByPlateNumber, /*getCommandUnits*/ } from '@/services/query'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import type { CommandType, /*CommandUnitType*/ OffencesType } from '@/services/query'

// interface OffencesType {
//   "id": string,
//   "offenceName": string,
//   "code": string
//   "points": number,
//   "penalty": number
//   "additionalAction": string | null,
//   "subsequentOffenderPrice": number,
//   "status": string
// }

export default function CreateTicket() {
  const [searchPlate, setSearchPlate] = useState('')
  const [vehicleMake, setVehicleMake] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehicleYear, setVehicleYear] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [chasisNumber, setChasisNumber] = useState('')
  const [selectedOffences, setSelectedOffences] = useState<OffencesType[]>([]) // Change state to store full offence objects
  const [totalPoints, setTotalPoints] = useState(0)
  const [totalFine, setTotalFine] = useState(0)
  const [location, setLocation] = useState('')
  const [command, setCommand] = useState('')
  // const [commandUnit, setCommandUnit] = useState('')
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([])
  const [vehicleFound, setVehicleFound] = useState<boolean | null>(null)
  const [offenceSearch, setOffenceSearch] = useState('')
  const [filteredOffences, setFilteredOffences] = useState<OffencesType[]>([])

  const { mutate, isPending } = useCreateTicketMutation();
  const { data: offencesData, isLoading: isLoadingOffences } = getOffences();
  const { data: commandsData, isLoading: isLoadingCommands } = getCommands();
  const { data: vehicleData, isLoading: isLoadingVehicle, refetch: refetchVehicle, isRefetching: isRefetchingVehicle } = getVehicleByPlateNumber(searchPlate);
  // const { data: commandUnitsData, isLoading: isLoadingCommandUnits } = getCommandUnits(command);

  useEffect(() => {
    const points = selectedOffences.reduce((sum, offence) => sum + offence.points, 0);
    const fine = selectedOffences.reduce((sum, offence) => sum + offence.penalty, 0);
    setTotalPoints(points);
    setTotalFine(fine);
  }, [selectedOffences]);

  useEffect(() => {
    if (offencesData) {
      setFilteredOffences(offencesData)
    }
  }, [offencesData])

  useEffect(() => {
    if (offenceSearch) {
      setFilteredOffences(offencesData!.filter((offence: OffencesType) => offence.offenceName.toLowerCase().includes(offenceSearch.toLowerCase())))
    } else {
      setFilteredOffences(offencesData!)
    }
  }, [offenceSearch, offencesData])

  const handleOffenceSelect = (offence: OffencesType) => {
    setSelectedOffences((prevSelected) => {
      if (prevSelected.some((o) => o.id === offence.id)) {
        return prevSelected.filter((o) => o.id !== offence.id);
      } else {
        return [...prevSelected, offence];
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setEvidenceFiles(Array.from(event.target.files))
    }
  }

  const handleSearchVehicle = () => {
    if(searchPlate) {
      refetchVehicle();
      console.log(vehicleData)
      if(vehicleData) {
        toast.success("Vehicle found. Please fill out the form below to create a new ticket and register the vehicle details.")
        setVehicleMake(vehicleData.brand)
        setVehicleModel(vehicleData.model)
        setVehicleYear(vehicleData.year)
        setVehicleColor(vehicleData.color)
        setChasisNumber(vehicleData.chasisNumber)
        setOwnerName(vehicleData.ownerName)
        setVehicleFound(true)
      } else {
        toast.error("Vehicle not found. Please fill out the form below to create a new ticket and register the vehicle details.")
        setVehicleFound(false)
      }
    }
  }

  const handleSubmit = async () => {
    // For demonstration purposes, assuming some IDs are hardcoded or fetched elsewhere
    const vehicleId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // Replace with actual ID
    const vehicleOwnerId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // Replace with actual ID

    let evidencePayload: CreateTicketPayload['evidence'] = undefined;

    if (evidenceFiles.length > 0) {
      const file = evidenceFiles[0]; // Assuming only one file for simplicity
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          evidencePayload = {
            name: file.name,
            extension: file.name.split('.').pop() || '',
            data: base64String,
          };

          const payload: CreateTicketPayload = {
            vehicleId: vehicleId,
            vehicleOwnerId: vehicleOwnerId,
            // commandUnitId: commandUnit,
            vehicleBrand: vehicleMake,
            vehicleModel: vehicleModel,
            vehicleColor: vehicleColor,
            vehicleYear: Number(vehicleYear),
            chasisNumber: chasisNumber,
            plateNumber: searchPlate,
            offenderName: ownerName,
            offenceIds: selectedOffences.map(o => o.id),
            totalPoints: totalPoints,
            fineAmount: totalFine,
            offenceLocation: location,
            evidence: evidencePayload,
          };

          // return console.log(payload)

          mutate(payload, {
            onSuccess: (data) => {
              toast.success("Ticket created successfully!");
              console.log(data)
            },
            onError: (error) => {
              console.log(error)
              toast.error("Failed to create Ticket")
            }
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      const payload: CreateTicketPayload = {
        vehicleId: vehicleId,
        vehicleOwnerId: vehicleOwnerId,
        vehicleBrand: vehicleMake,
        vehicleModel: vehicleModel,
        vehicleColor: vehicleColor,
        vehicleYear: Number(vehicleYear),
        chasisNumber: chasisNumber,
        plateNumber: searchPlate,
        offenderName: ownerName,
        offenceIds: selectedOffences.map(o => o.id),
        totalPoints: totalPoints,
        fineAmount: totalFine,
        offenceLocation: location,
        evidence: undefined,
      };
      mutate(payload);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:p-4">
      <div className="flex md:items-center justify-between flex-col md:flex-row gap-2">
        <div>
          <h1 className="text-2xl font-bold">Create Ticket</h1>
          <p className="text-muted-foreground">Create a new Ticket in the System.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search by plate number"
            className="w-full pl-8"
            value={searchPlate}
            onChange={(e) => setSearchPlate(e.target.value)}
          />
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Button disabled={isLoadingVehicle || isRefetchingVehicle} className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSearchVehicle}>
          {isLoadingVehicle || isRefetchingVehicle ? "Searching" : "Search"}
        </Button>
      </div>
      <div>
      {/* Info for users to search for a plate number */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Tip:</span> Search for a vehicle by plate number above. If the vehicle is not found, you can fill out the form below to create a new ticket and register the vehicle details.
        </p>
      </div>
      </div>
      {/* Only show the ticket form if vehicle data is found after searching */}
      {(vehicleFound === false) && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plate-number">Plate Number</Label>
                <Input id="plate-number" placeholder="Enter Vehicle Plate number" value={searchPlate} onChange={(e) => setSearchPlate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-make">Vehicle Make</Label>
                <Input id="vehicle-make" placeholder="Enter Vehicle Make" value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-model">Vehicle Model</Label>
                <Input id="vehicle-model" placeholder="Enter Vehicle Model" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-year">Vehicle Year</Label>
                <Input id="vehicle-year" placeholder="Enter Vehicle Year" value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-color">Vehicle Color</Label>
                <Input id="vehicle-color" placeholder="Enter Vehicle Color" value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chasis-number">Chasis Number</Label>
                <Input id="chasis-number" placeholder="Enter Chasis Number" value={chasisNumber} onChange={(e) => setChasisNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner-name">Owner Name</Label>
                <Input id="owner-name" placeholder="Enter Vehicle Owner Name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="offences">Offences*</Label>
                {/* Searchable Offences Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedOffences.length > 0
                        ? `${selectedOffences.length} offence${selectedOffences.length > 1 ? "s" : ""} selected`
                        : "Select Offences"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[400px] overflow-y-scroll max-h-[400px]">
                    <div className="px-2 py-2">
                      <Input
                        placeholder="Search offences..."
                        value={offenceSearch || ""}
                        onChange={e => setOffenceSearch(e.target.value)}
                        className="w-full"
                        autoFocus
                      />
                    </div>
                    {isLoadingOffences ? (
                      <DropdownMenuLabel>Loading...</DropdownMenuLabel>
                    ) : (filteredOffences && filteredOffences.length > 0 ? (
                      filteredOffences.map((offence: OffencesType) => (
                        <DropdownMenuCheckboxItem
                          key={offence.id}
                          checked={selectedOffences.some((o) => o.id === offence.id)}
                          onCheckedChange={() => handleOffenceSelect(offence)}
                        >
                          {offence.offenceName}
                        </DropdownMenuCheckboxItem>
                      ))
                    ) : (
                      <DropdownMenuLabel className="py-2">No offences found.</DropdownMenuLabel>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className='text-xs'>
                  {selectedOffences.length > 0
                    ? selectedOffences.map((o) => <p key={o.id}>{o.offenceName}</p>)
                    : "No offences selected"}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-points">Total Points*</Label>
                <Input id="total-points" type="number" value={totalPoints} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-fine">Total Fine*</Label>
                <Input id="total-fine" type="number" value={totalFine} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location of Violation*</Label>
                <Input id="location" placeholder="Enter offence location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="command">Select a Command</Label>
                <select
                  id="command"
                  value={command}
                  onChange={e => setCommand(e.target.value)}
                  className="border rounded px-2 py-2.5 w-full block"
                >
                  <option value="">Select Command</option>
                  {isLoadingCommands
                    ? <option value="loading-commands">Loading Commands...</option>
                    : commandsData && commandsData.length > 0
                      ? commandsData.map((cmd: CommandType) => (
                          <option key={cmd.id} value={cmd.id}>{cmd.name}</option>
                        ))
                      : <option value="no-commands">No Commands Found</option>
                  }
                </select>
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="command-unit">Select a command unit</Label>
                <select
                  id="command-unit"
                  value={commandUnit}
                  onChange={e => setCommandUnit(e.target.value)}
                  className="border rounded px-2 py-2.5 w-full block"
                  disabled={!command || isLoadingCommandUnits}
                >
                  <option value="">Select a command unit</option>
                  {isLoadingCommandUnits
                    ? <option value="loading-units">Loading Command Units...</option>
                    : commandUnitsData && commandUnitsData.length > 0
                      ? commandUnitsData.map((unit: CommandUnitType) => (
                          <option key={unit.id} value={unit.name}>{unit.name}</option>
                        ))
                      : <option value="no-units">No Command Units Found</option>
                  }
                </select>
              </div> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="evidence-upload" className="cursor-pointer bg-accent text-accent-foreground hover:bg-accent/90 px-4 py-2 rounded-md flex items-center">
                  <Upload className="mr-2 h-4 w-4" /> UPLOAD IMAGE FILES (MAX 12 MB PER FILE. TOTAL 54 MB)
                </Label>
                <Input id="evidence-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
              </div>
              {evidenceFiles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium">Selected Files:</h4>
                  <ul className="text-sm text-muted-foreground">
                    {evidenceFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Button disabled={isPending} onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90 self-start">
            {isPending ? "Creating" : "Create Ticket"}
          </Button>
        </>
      )}
    </div>
  )
}