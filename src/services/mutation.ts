import { useMutation } from "@tanstack/react-query";
import Api from "./api";

export const LoginMutation = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        const res = await Api.post(`token`, data)
        return res.data
      },
    })
  }

export interface EvidencePayload {
  name: string;
  extension: string;
  data: string; // Base64 encoded string
}

export interface CreateTicketPayload {
  vehicleId?: string;
  vehicleOwnerId?: string;
  commandUnitId: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleYear: number;
  chasisNumber?: string;
  plateNumber: string;
  offenderName: string;
  offenceIds: string[];
  totalPoints: number;
  fineAmount: number;
  offenceLocation: string;
  evidence?: EvidencePayload;
}

//  Tickets
export const SearchTickets = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        const res = await Api.post(`v1/oyrtma/tickets/search`, data)
        return res.data
      },
    })
  }

export const CreateTicket = () => {
    return useMutation({
      mutationFn: async (data: CreateTicketPayload) => {
        const res = await Api.post(`v1/oyrtma/tickets`, data)
        return res.data
      },
    })
  }
  
  
  // Commands
  export interface CommandPayload {
    name: string;
  }

  export const CreateCommand = () => {
      return useMutation({
        mutationFn: async (data: CommandPayload) => {
          const res = await Api.post(`v1/oyrtma/commands`, data)
          return res.data
        },
      })
    }

  export const UpdateCommand = (id: string) => {
      return useMutation({
        mutationFn: async (data: CommandPayload) => {
          const res = await Api.put(`v1/oyrtma/commands/${id}`, data)
          return res.data
        },
      })
    }
    
  export const DeleteCommand = () => {
      return useMutation({
        mutationFn: async (id: string) => {
          const res = await Api.delete(`v1/oyrtma/commands/${id}`)
          return res.data
        },
      })
    }

  // Command Units
  export interface CommandUnitPayload {
    name: string;
    commandId: string;
  }
  export const CreateCommandUnits = () => {
      return useMutation({
        mutationFn: async (data: CommandUnitPayload) => {
          const res = await Api.post(`v1/oyrtma/command-units`, data)
          return res.data
        },
      })
    }

  export const UpdateCommandUnit = (id: string) => {
      return useMutation({
        mutationFn: async (data: CommandUnitPayload) => {
          const res = await Api.put(`v1/oyrtma/command-units/${id}`, data)
          return res.data
        },
      })
    }

  export const DeleteCommandUnit = () => {
      return useMutation({
        mutationFn: async (id: string) => {
          const res = await Api.delete(`v1/oyrtma/command-units/${id}`)
          return res.data
        },
      })
    }

// Search Offenders
export const SearchOffenders = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await Api.post(`v1/oyrtma/offenders/search`, data)
      return res.data
    },
  })
}

// Vehicle
export interface VehiclePayload {
  ownerId?: string;
  brand: string;
  model: string;
  color: string;
  year: number;
  chasisNumber?: string;
  plateNumber: string;
}
export const SearchVehicle = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await Api.post(`v1/oyrtma/vehicles/search`, data)
      return res.data
    },
  })
}
