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
import {
  SearchIcon,
  PlusIcon,
  RotateCw,
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
import { getCommandUnits, getCommands } from "@/services/query";
import type { CommandUnitType, CommandType } from "@/services/query";
import { ComponentLoading } from "@/components/Loading";
import { useState, useEffect } from "react";
import { CreateCommandUnits, UpdateCommandUnit, DeleteCommandUnit } from "@/services/mutation";
// import type { CommandUnitPayload } from "@/services/mutation";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@/components/Pagination";

export default function CommandUnits() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCommandUnit, setCurrentCommandUnit] = useState<CommandUnitType | null>(null);
  const [commandUnitName, setCommandUnitName] = useState("");
  const [selectedCommandId, setSelectedCommandId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  const { data: commandsData, isLoading: isLoadingCommands } = getCommands();
  const { data: commandUnitsData, isLoading: isLoadingCommandUnits, refetch } = getCommandUnits();

  const createCommandUnitMutation = CreateCommandUnits();
  const updateCommandUnitMutation = UpdateCommandUnit(currentCommandUnit?.id || "");
  const deleteCommandUnitMutation = DeleteCommandUnit();

  useEffect(() => {
    if (currentCommandUnit) {
      setCommandUnitName(currentCommandUnit.name);
      setSelectedCommandId(currentCommandUnit.commandId);
    } else {
      setCommandUnitName("");
      setSelectedCommandId("");
    }
  }, [currentCommandUnit]);

  const handleCreateCommandUnit = async () => {
    if (!commandUnitName || !selectedCommandId) {
      toast.error("Command unit name and command must be selected.");
      return;
    }
    try {
      await createCommandUnitMutation.mutateAsync({ name: commandUnitName, commandId: selectedCommandId });
      toast.success("Command unit created successfully!");
      setIsCreateModalOpen(false);
      setCommandUnitName("");
      setSelectedCommandId("");
      queryClient.invalidateQueries({ queryKey: ['commandUnits'] });
    } catch (error) {
      console.error("Error creating command unit:", error);
      toast.error("Failed to create command unit.");
    }
  };

  const handleUpdateCommandUnit = async () => {
    if (!currentCommandUnit || !commandUnitName || !selectedCommandId) {
      toast.error("Command unit name and command must be selected.");
      return;
    }
    try {
      await updateCommandUnitMutation.mutateAsync({ name: commandUnitName, commandId: selectedCommandId });
      toast.success("Command unit updated successfully!");
      setIsEditModalOpen(false);
      setCurrentCommandUnit(null);
      setCommandUnitName("");
      setSelectedCommandId("");
      queryClient.invalidateQueries({ queryKey: ['commandUnits'] });
    } catch (error) {
      console.error("Error updating command unit:", error);
      toast.error("Failed to update command unit.");
    }
  };

  const handleDeleteCommandUnit = async () => {
    if (!currentCommandUnit) return;
    try {
      await deleteCommandUnitMutation.mutateAsync(currentCommandUnit.id);
      toast.success("Command unit deleted successfully!");
      setIsDeleteModalOpen(false);
      setCurrentCommandUnit(null);
      queryClient.invalidateQueries({ queryKey: ['commandUnits'] });
    } catch (error) {
      console.error("Error deleting command unit:", error);
      toast.error("Failed to delete command unit.");
    }
  };

  if (isLoadingCommandUnits || isLoadingCommands) {
    return <ComponentLoading />;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Command Units</h1>
          <p className="text-muted-foreground">
            Manage the Command Units in Oyo state.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusIcon className="mr-2 h-4 w-4" /> Create
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Command Unit</DialogTitle>
                <DialogDescription>Enter the name and select a command for the new command unit.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="command-unit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="command-unit-name"
                    value={commandUnitName}
                    onChange={(e) => setCommandUnitName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="command-select" className="text-right">
                    Command
                  </Label>
                  <select
                    id="command-select"
                    value={selectedCommandId}
                    onChange={e => setSelectedCommandId(e.target.value)}
                    className="col-span-3 border rounded px-2 py-2.5 w-full block"
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
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateCommandUnit} disabled={createCommandUnitMutation.isPending}>
                  {createCommandUnitMutation.isPending ? "Creating..." : "Create Command Unit"}
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
            placeholder="Search for Command Units"
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
              <TableHead>Command</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commandUnitsData?.slice((page - 1) * pageSize, page * pageSize).map((commandUnit) => (
              <TableRow key={commandUnit.id}>
                <TableCell className="font-medium">{commandUnit.id.substring(0, 8)}...</TableCell>
                <TableCell>{commandUnit.name}</TableCell>
                <TableCell>{commandsData?.find(cmd => cmd.id === commandUnit.commandId)?.name || "N/A"}</TableCell>
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
                          setCurrentCommandUnit(commandUnit);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <EditIcon className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setCurrentCommandUnit(commandUnit);
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
          total={commandUnitsData?.length || 0}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      </div>

      {/* Edit Command Unit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Command Unit</DialogTitle>
            <DialogDescription>Make changes to the command unit name and command.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-command-unit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-command-unit-name"
                value={commandUnitName}
                onChange={(e) => setCommandUnitName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-command-select" className="text-right">
                Command
              </Label>
              <select
                id="edit-command-select"
                value={selectedCommandId}
                onChange={e => setSelectedCommandId(e.target.value)}
                className="col-span-3 border rounded px-2 py-1"
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
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateCommandUnit} disabled={updateCommandUnitMutation.isPending}>
              {updateCommandUnitMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Command Unit Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Command Unit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentCommandUnit?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCommandUnit} disabled={deleteCommandUnitMutation.isPending}>
              {deleteCommandUnitMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}