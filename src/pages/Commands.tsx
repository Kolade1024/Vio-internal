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
import { Label } from "../components/ui/label";
import { Pagination } from "@/components/Pagination";
import {
  SearchIcon,
  PlusIcon,
  RotateCw,
  // ChevronLeft,
  // ChevronRight,
  // ChevronsLeft,
  // ChevronsRight,
  ChevronDown,
  EditIcon, Trash2Icon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { getCommands } from "@/services/query";
import type { CommandType } from "@/services/query";
import { ComponentLoading } from "@/components/Loading";
import { useState, useEffect } from "react";
import { CreateCommand, UpdateCommand, DeleteCommand } from "@/services/mutation";
// import type { CommandPayload } from "@/services/mutation";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Commands() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<CommandType | null>(null);
  const [commandName, setCommandName] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = getCommands();

  const createCommandMutation = CreateCommand();
  const updateCommandMutation = UpdateCommand(currentCommand?.id || "");
  const deleteCommandMutation = DeleteCommand();

  useEffect(() => {
    if (currentCommand) {
      setCommandName(currentCommand.name);
    } else {
      setCommandName("");
    }
  }, [currentCommand]);

  const handleCreateCommand = async () => {
    if (!commandName) {
      toast.error("Command name cannot be empty.");
      return;
    }
    try {
      await createCommandMutation.mutateAsync({ name: commandName });
      toast.success("Command created successfully!");
      setIsCreateModalOpen(false);
      setCommandName("");
      queryClient.invalidateQueries({ queryKey: ['commands'] });
    } catch (error) {
      console.error("Error creating command:", error);
      toast.error("Failed to create command.");
    }
  };

  const handleUpdateCommand = async () => {
    if (!currentCommand || !commandName) {
      toast.error("Command name cannot be empty.");
      return;
    }
    try {
      await updateCommandMutation.mutateAsync({ name: commandName });
      toast.success("Command updated successfully!");
      setIsEditModalOpen(false);
      setCurrentCommand(null);
      setCommandName("");
      queryClient.invalidateQueries({ queryKey: ['commands'] });
    } catch (error) {
      console.error("Error updating command:", error);
      toast.error("Failed to update command.");
    }
  };

  const handleDeleteCommand = async () => {
    if (!currentCommand) return;
    try {
      await deleteCommandMutation.mutateAsync(currentCommand.id);
      toast.success("Command deleted successfully!");
      setIsDeleteModalOpen(false);
      setCurrentCommand(null);
      queryClient.invalidateQueries({ queryKey: ['commands'] });
    } catch (error) {
      console.error("Error deleting command:", error);
      toast.error("Failed to delete command.");
    }
  };

  if (isLoading) {
    return <ComponentLoading />;
  }

  return (
    <div className="flex flex-col gap-4 md:p-4">
      <div className="flex md:items-center justify-between flex-col md:flex-row gap-2">
        <div>
          <h1 className="text-2xl font-bold">Commands</h1>
          <p className="text-muted-foreground">
            Manage the Commands in Oyo state.
          </p>
        </div>
        <div className="flex items-center md:justify-start justify-end gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusIcon className="mr-2 h-4 w-4" /> Create
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Command</DialogTitle>
                <DialogDescription>Enter the name for the new command.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="command-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="command-name"
                    value={commandName}
                    onChange={(e) => setCommandName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateCommand} disabled={createCommandMutation.isPending}>
                  {createCommandMutation.isPending ? "Creating..." : "Create Command"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => refetch()}>
            <RotateCw className="mr-2 h-4 w-4" /> Reload
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search for Commands"
            className="w-full pl-8"
          />
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.slice((page - 1) * pageSize, page * pageSize).map((command) => (
              <TableRow key={command.id}>
                <TableCell className="font-medium">{command.id}</TableCell>
                <TableCell>{command.name}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => {
                          setCurrentCommand(command);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <EditIcon className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setCurrentCommand(command);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          page={page}
          pageSize={pageSize}
          total={data?.length || 0}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      </div>

      {/* Edit Command Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Command</DialogTitle>
            <DialogDescription>Make changes to the command name.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-command-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-command-name"
                value={commandName}
                onChange={(e) => setCommandName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateCommand} disabled={updateCommandMutation.isPending}>
              {updateCommandMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Command Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Command</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentCommand?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCommand} disabled={deleteCommandMutation.isPending}>
              {deleteCommandMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
