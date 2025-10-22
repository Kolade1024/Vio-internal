import { useQuery } from "@tanstack/react-query";
import Api from "./api";

// Profile
export const getProfile = () => {
    return useQuery({
      queryKey: ['profile'], 
      queryFn: async () => {
        const res = await Api.get(`users/profile`)
        return res.data
      },
    })
  };


export interface TicketByDayOfWeek {
  day: string;
  ticketCount: number;
}

export interface RevenueByDay {
  day: string;
  totalRevenue: number;
  expectedRevenue: number;
}

export interface UserStat {
  userId: string;
  userName: string;
  totalTicketsGenerated: number;
  totalTicketAmountGenerated: number;
  totalOutstandingTicketAmount: number;
  totalTicketsDiscountAmount: number;
  totalFinesPaid: number;
}

export interface TopOffence {
  offenceType: string;
  offenceCount: number;
}

export interface TopOffender {
  offenderId: string;
  vehiclePlateNumber: string;
  ticketCount: number;
}

export interface DashboardStatsResponse {
  totalOffenders: number;
  totalTickets: number;
  totalTicketAmount: number;
  totalTicketsIssued: number;
  totalTicketsPaid: number;
  totalTicketsVerified: number;
  totalTicketsDiscounted: number;
  totalTicketsDismissed: number;
  totalTicketsPaidAmount: number;
  totalTicketOutstandingAmount: number;
  totalTicketsDismissedAmount: number;
  totalTicketsUnpaid: number;
  topOffenders: TopOffender[];
  topOffences: TopOffence[];
  ticketsByDayOfWeek: TicketByDayOfWeek[];
  totalRevenue: number;
  expectedRevenue: number;
  totalDiscounts: number;
  revenueByDay: RevenueByDay[];
  userStats: UserStat[];
}

// Dashboard
export interface DashboardStatsParams {
  userId?: string;
  startDate?: string;
  endDate?: string;
  dateRangeType?: string;
}

export const getDashboardStats = (params: DashboardStatsParams = {}) => {
  return useQuery<DashboardStatsResponse>({
    queryKey: [
      'stats',
      params.userId,
      params.endDate,
      params.dateRangeType,
    ],
    queryFn: async () => {
      const res = await Api.get('v1/dashboard', {
        params: {
          ...(params.userId && { userId: params.userId }),
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
          ...(params.dateRangeType && { dateRangeType: params.dateRangeType }),
        },
      });
      return res.data;
    },
  });
};


// Tickets
export const getOffences = () => {
  return useQuery<OffencesType[]>({
    queryKey: ['offences'], 
    queryFn: async () => {
      const res = await Api.get(`v1/offences`)
      return res.data
    },
  })
};

export interface OffencesType {
  "id": string,
  "offenceName": string,
  "code": string
  "points": number,
  "penalty": number
  "additionalAction": string | null,
  "subsequentOffenderPrice": number,
  "status": string
}

export interface TicketData {
  id: string
  ticketNumber: string
  offenceDate: string
  offenceLocation: string
  fineAmount: number
  discountAmount: number
  totalPoints: number
  evidence: string
  ticketStatus: string
  offender: {
    id: string
    offenderName: string
    email: string
    phoneNumber: string
    dateOfBirth: string
    address: string
    nationalIdentificationNumber: string
    licenseNumber: string
    licenseClass: string
    licenseStatus: string
    totalPoints: number
    ticketCount: number
  }
  vehicle: {
    id: string
    vehicleOwnerId: string
    plateNumber: string
    brand: string
    model: string
    color: string
    year: number
  }
  vehicleOwner: {
    id: string
    fullName: string
    nationalIdentificationNumber: string
    phoneNumber: string
    email: string
    address: string
    totalVehicles: number
  }
  issuedByCommandUnit: {
    id: string
    name: string
    command: {
      id: string
      name: string
    }
  }
  offences: Array<{
    id: string
    offenceName: string
    code: string
    points: number
    penalty: number
    additionalAction: string
    subsequentOffenderPrice: number
    status: string
  }>
}

export const getTicketById = (id: string) => {
  return useQuery<TicketData>({
    queryKey: ['ticket'], 
    queryFn: async () => {
      const res = await Api.get(`v1/tickets/${id}`)
      return res.data
    }, enabled: !!id
  })
};

export interface CommandType {
  id: string;
  name: string;
}

export interface CommandUnitType {
  id: string;
  name: string;
  commandId: string;
}

export const getCommands = () => {
  return useQuery<CommandType[]> ({
    queryKey: ['commands'],
    queryFn: async () => {
      const res = await Api.get(`v1/commands`)
      return res.data
    },
  });
};

export const getCommandUnits = (commandId?: string) => {
  return useQuery<CommandUnitType[]> ({
    queryKey: ['commandUnits', commandId],
    queryFn: async () => {
      const res = await Api.get(`v1/command-units${commandId ? `?commandId=${commandId}` : ''}`)
      return res.data
    },
    // enabled: !!commandId, // Only fetch if commandId is available
  });
};

export const getTickets = () => {
    return useQuery({
      queryKey: ['ticket'], 
      queryFn: async () => {
        const res = await Api.get(`v1/tickets`)
        return res.data
      },
    })
  };


// Complaints
export const getComplaints = () => {
  return useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      const res = await Api.get(`v1/complaints/complaints`)
      return res.data
    }
  })
}

// Vehicle Owners
export const getVehicleOwners = () => {
  return useQuery({
    queryKey: ['vehicle-owners'],
    queryFn: async () => {
      const res = await Api.get(`v1/vehicle-owners`)
      return res.data
    }
  })
}

export const getVehicleByPlateNumber = (plateNumber?: string) => {
  return useQuery({
    queryKey: ['vehicle-by-plate-number'],
    queryFn: async () => {
      const res = await Api.get(`v1/vehicles/${plateNumber}`)
      return res.data
    },
    enabled: false,
  })
}

// Users
export const getUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await Api.get(`users`)
      return res.data
    }
  })
}


// Payments - Queries
export interface Payment {
  id: string;
  ticketId?: string;
  reference?: string;
  amount: number;
  currency?: string;
  status: string;
  channel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getPaymentById = (id?: string) => {
  return useQuery<Payment>({
    queryKey: ['payment', id],
    queryFn: async () => {
      const res = await Api.get(`v1/payments/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

export const getPaymentByTicketId = (ticketId?: string) => {
  return useQuery<Payment>({
    queryKey: ['payment-ticket', ticketId],
    queryFn: async () => {
      const res = await Api.get(`v1/payments/ticket/${ticketId}`)
      return res.data
    },
    enabled: !!ticketId,
  })
}
