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
  commandUnitId?: string;
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
        const res = await Api.post(`v1/tickets/search`, data)
        return res.data
      },
    })
  }

export const CreateTicket = () => {
    return useMutation({
      mutationFn: async (data: CreateTicketPayload) => {
        const res = await Api.post(`v1/tickets`, data)
        return res.data
      },
    })
  }
  

// Generate report
export const GenerateTicketReport = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        const res = await Api.post(`v1/tickets/generate`, data, {
            responseType: "blob",
          })
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
          const res = await Api.post(`v1/commands`, data)
          return res.data
        },
      })
    }

  export const UpdateCommand = (id: string) => {
      return useMutation({
        mutationFn: async (data: CommandPayload) => {
          const res = await Api.put(`v1/commands/${id}`, data)
          return res.data
        },
      })
    }
    
  export const DeleteCommand = () => {
      return useMutation({
        mutationFn: async (id: string) => {
          const res = await Api.delete(`v1/commands/${id}`)
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
          const res = await Api.post(`v1/command-units`, data)
          return res.data
        },
      })
    }

  export const UpdateCommandUnit = (id: string) => {
      return useMutation({
        mutationFn: async (data: CommandUnitPayload) => {
          const res = await Api.put(`v1/command-units/${id}`, data)
          return res.data
        },
      })
    }

  export const DeleteCommandUnit = () => {
      return useMutation({
        mutationFn: async (id: string) => {
          const res = await Api.delete(`v1/command-units/${id}`)
          return res.data
        },
      })
    }

// Search Offenders
export const SearchOffenders = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await Api.post(`v1/offenders/search`, data)
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
      const res = await Api.post(`v1/vehicles/search`, data)
      return res.data
    },
  })
}


// Payments
export interface InitiatePaymentPayload {
  ticketId: string;
  amount: number;
  channel?: string;
  callbackUrl?: string;
}

export interface VerifyPaymentPayload {
  reference: string;
}

export interface CreatePaymentPayload {
  ticketId: string;
  amount: number;
  status?: string;
  reference?: string;
  channel?: string;
}

export interface GeneratePaymentReportPayload {
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface SearchPaymentsPayload {
  query?: string; // ticketId or reference
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const InitiatePayment = () => {
  return useMutation({
    mutationFn: async (data: InitiatePaymentPayload) => {
      const res = await Api.post(`v1/payments/initiate`, data)
      return res.data
    },
  })
}

export const VerifyPayment = () => {
  return useMutation({
    mutationFn: async (data: VerifyPaymentPayload) => {
      const res = await Api.post(`v1/payments/verify`, data)
      return res.data
    },
  })
}

export const PaymentWebhook = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await Api.post(`v1/payments/webhook`, data)
      return res.data
    },
  })
}

export const CreatePayment = () => {
  return useMutation({
    mutationFn: async (data: CreatePaymentPayload) => {
      const res = await Api.post(`v1/payments`, data)
      return res.data
    },
  })
}

export const GeneratePaymentReport = () => {
  return useMutation({
    mutationFn: async (data: GeneratePaymentReportPayload) => {
      const res = await Api.post(`v1/payments/generate`, data)
      return res.data
    },
  })
}

export const DeletePayment = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await Api.delete(`v1/payments/${id}`)
      return res.data
    },
  })
}

// Users
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  badgeNumber: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  commandId: string;
  commandUnitId: string;
}

export const CreateUser = () => {
  return useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      const res = await Api.post(`api/users/self-register`, data)
      return res.data
    },
  })
}

export interface SearchPaymentsResponseItem {
  id: string;
  ticketId?: string;
  reference?: string;
  amount: number;
  status: string;
  channel?: string;
  createdAt?: string;
}

export interface SearchPaymentsResponse {
  items: SearchPaymentsResponseItem[];
  total: number;
  page: number;
  pageSize: number;
}

export const SearchPayments = () => {
  return useMutation<SearchPaymentsResponse, unknown, SearchPaymentsPayload>({
    mutationFn: async (data: SearchPaymentsPayload) => {
      const res = await Api.post(`v1/payments/search`, data)
      return res.data
    },
  })
}