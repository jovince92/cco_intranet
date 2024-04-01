import Editor from "@/Components/Editor"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { useAnnouncementModal } from "@/Hooks/useAnnouncementModal"
import { useDeleteAnnouncementModal } from "@/Hooks/useDeleteAnnouncementModal"
import { useEmployeeModal } from "@/Hooks/useEmployeeModal"
import { useShiftModal } from "@/Hooks/useShiftModal"
import { cn } from "@/lib/utils"
import { Announcement, User } from "@/types"
import { Inertia } from "@inertiajs/inertia"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { CalendarClockIcon, ChevronsLeftRight, FolderOpen, MailWarning, MoreHorizontalIcon, Pencil, Square, SquareCheckBig, StarsIcon, Trash2,  UserIcon } from "lucide-react"
import { toast } from "sonner"


/*

id: number;
    user_id: number;
    title:string;
    content:string;
    image?:string;
    status:number;
    user:User;
*/

export const EmployeeColumns

: ColumnDef<User>[] = [
    {
        accessorKey: "company_id",
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>ID<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p className="font-semibold tracking-wide">{row.original.company_id}</p>
    },
    {
        accessorKey: "shift_id",
        id:'Schedule',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Schedule<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p className={cn(!row.original.shift_id&&'text-destructive')}>{`${!row.original.shift?'Shift Not Set':row.original.shift.schedule}`}</p>
    },
    {
        accessorKey: "first_name",
        id:'First Name',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>First Name<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{row.original.first_name}</p>
    },
    {
        accessorKey: "last_name",
        id:'Last Name',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Last Name<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{row.original.last_name}</p>
    },
    {
        accessorKey: "position",
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Position<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{row.original.position}</p>
    },
    {
        accessorKey: "project",
        id:'Project',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Project<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{row.original.project}</p>
    },
    {
        accessorKey: "site",
        id:'Site',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Site<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{row.original.site}</p>
    },
    {
        header:({column})=><div className="text-primary w-full text-center
        ">Actions</div>,
        id:'Actions',
        cell:({row})=> {
            const {onOpen} = useEmployeeModal();
            const {onOpen:openShift} = useShiftModal();
            return(
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                            <span className="sr-only">Open Menu</span>
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">                        
                        <DropdownMenuItem onClick={()=>onOpen(row.original)}>
                            <UserIcon className="h-4 w-4 mr-2" />Employee Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>openShift(row.original)}>
                            <CalendarClockIcon className="h-4 w-4 mr-2" />Change Shift
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled onClick={()=>{}}>
                            <FolderOpen className="h-4 w-4 mr-2" />Project History
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled onClick={()=>{}}>
                            <StarsIcon className="h-4 w-4 mr-2" />Skills
                        </DropdownMenuItem>  
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled onClick={()=>{}}>
                            <MailWarning className="h-4 w-4 mr-2" />Memos and Violations
                        </DropdownMenuItem>                      
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }


]
