import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { SearchIcon, RotateCw, Upload } from "lucide-react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { ComponentLoading } from "@/components/Loading";
import { SearchTickets, DismissTicket } from "@/services/mutation";
import { Pagination } from "@/components/Pagination";
import toast from "react-hot-toast";
import Auth from "@/services/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import type { TicketData } from "@/services/query";

export default function Tickets() {
  const navigate = useNavigate();
  const user = Auth.getUser();
  const [search, setSearch] = useState("");
  const [error, __] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

  const { mutate, isPending } = SearchTickets();
  const { mutate: dismissTicket, isPending: isDismissing } = DismissTicket();

  const isAdmin = user?.roles?.includes("Admin");

  useEffect(() => {
    mutate(
      {
        advancedSearch: null,
        keyword: search || null,
        advancedFilter: null,
        pageNumber: page,
        pageSize: pageSize,
        orderBy: ["offenceDate desc"],
      },
      {
        onSuccess: (res: any) => {
          setTickets(res?.items || []);
          setTotal(res?.totalCount || 0);
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  }, [page, pageSize]);

  const handleSearch = () => {
    mutate(
      {
        advancedSearch: null,
        keyword: search || null,
        advancedFilter: null,
        pageNumber: page,
        pageSize: pageSize,
        orderBy: ["offenceDate desc"],
      },
      {
        onSuccess: (res: any) => {
          if (!res?.items || res?.items.length === 0) {
            setTickets([]);
            return toast.error("Ticket not found!");
          }

          setTickets(res?.items || []);
          setTotal(res?.totalCount || 0);
          toast.success("Ticket(s) found!");
        },
        onError: (err) => {
          console.error(err);
          toast.error("Search failed");
        },
      }
    );
  };

  const handleDismiss = () => {
    if (!confirm("Are you sure you want to dismiss this ticket?")) return;
    dismissTicket(
      { id: selectedTicket?.id!, reason },
      {
        onSuccess: () => {
          toast.success("Ticket dismissed successfully");
          setIsDismissModalOpen(false);
          // refresh list
          mutate({
            advancedSearch: null,
            keyword: search || null,
            advancedFilter: null,
            pageNumber: page,
            pageSize: pageSize,
            orderBy: ["offenceDate desc"],
          });
          setOpenActionId(null);
        },
        onError: (err) => {
          console.error(err);
          toast.error("Failed to delete ticket");
        },
      }
    );
  };

  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;
  if (isPending) {
    return <ComponentLoading />;
  }

  return (
    <div className="flex flex-col gap-4 md:p-4">
      <div className="flex md:items-center justify-between flex-col md:flex-row gap-2">
        <div>
          <h1 className="text-2xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">
            Manage all the Tickets in the System.
          </p>
        </div>
        <div className="flex items-center md:justify-start justify-end gap-2">
          <Button
            onClick={() =>
              mutate({
                advancedSearch: null,
                keyword: search || null,
                advancedFilter: null,
                pageNumber: page,
                pageSize: pageSize,
                orderBy: ["offenceDate desc"],
              })
            }
            variant="outline"
          >
            <RotateCw className="mr-2 h-4 w-4" /> Reload
          </Button>
          <Button className="bg-destructive !text-white text-destructive-foreground hover:bg-destructive/90">
            <Upload className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search for Tickets"
            className="w-full pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={handleSearch}>
          <SearchIcon className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>TicketNumber</TableHead>
              <TableHead>Ticket Date</TableHead>
              <TableHead>Fine Amount</TableHead>
              <TableHead className="text-center">Total Points</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length < 1 || !tickets ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 6}
                  className="font-medium text-center py-40"
                >
                  No Tickets
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-muted">
                  <TableCell
                    className="font-medium cursor-pointer"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    {ticket.id.substring(0, 8)}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    {ticket.ticketNumber}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    {new Date(ticket?.offenceDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    {ticket.fineAmount?.toLocaleString?.() ?? "-"}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer text-center"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    {ticket.totalPoints}
                  </TableCell>

                  {isAdmin && (
                    <TableCell className="relative text-right">
                      <div className="inline-block">
                        <button
                          aria-expanded={openActionId === ticket.id}
                          onClick={() =>
                            setOpenActionId(
                              openActionId === ticket.id ? null : ticket.id
                            )
                          }
                          className="px-2 py-1 rounded border text-sm cursor-pointer"
                        >
                          ⋯
                        </button>

                        {openActionId === ticket.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border rounded shadow z-20">
                            {/* <button
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              setOpenActionId(null)
                              navigate(`/tickets/${ticket.id}/edit`)
                            }}
                          >
                            Edit
                          </button> */}
                            <button
                              className="w-full cursor-pointer text-left px-3 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setIsDismissModalOpen(true);
                              }}
                              disabled={isDismissing}
                            >
                              {isDismissing ? "Deleting..." : "Dismiss"}
                            </button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        isLoading={isPending}
      />

      <Dialog open={isDismissModalOpen} onOpenChange={setIsDismissModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Dismiss Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to dismiss "{selectedTicket?.ticketNumber}"?
              <input
                type="text"
                placeholder="Reason for dismissal"
                className="w-full mt-4 p-2 border rounded"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDismissModalOpen(false);
                setOpenActionId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              variant="destructive"
              onClick={() => handleDismiss()}
              disabled={isDismissing}
            >
              {isDismissing ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
