import { SearchTickets } from '@/services/mutation'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SearchTicket() {
  const [searchItem, setSearchItem] = useState("");
  // const
  const { isPending, mutate } = SearchTickets();

  const handleSearch = () => {
    if(!searchItem){
      return toast.error("Please enter a ticket detail");
    }

    mutate({}, {
      onSuccess: () => {
        toast.success("Ticket found");
        
      },
      onError: () => {
        toast.error("Failed to get ticket")
      },
    })
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Search Ticket</h1>
            <p className="text-muted-foreground">Searches a Ticket in the System.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search ticket number"
              className="w-full pl-8"
              value={searchItem}
              onChange={e => setSearchItem(e.target.value)}
            />
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <Button disabled={isPending} onClick={handleSearch} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {isPending ? "Searching" : "Search"}
          </Button>
        </div>
      </div>
      <div className="">

      </div>
    </>
  )
} 