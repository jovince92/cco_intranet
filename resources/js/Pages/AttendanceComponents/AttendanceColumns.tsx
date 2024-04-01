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
import { CalendarClockIcon, ChevronsLeftRight, FolderOpen, MailWarning, MoreHorizontalIcon, Pencil, Square, SquareCheckBig, StarsIcon, Trash2,  TriangleAlert,  UserIcon } from "lucide-react"
import { toast } from "sonner"


export const AttendanceColumns

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
        cell: ({row})=>(
            <div className={cn(!row.original.shift_id&&'text-muted-foreground')}>
                {!row.original.shift?(
                    <div className="flex items-center gap-x-2">
                        <TriangleAlert className="h-4 w-4" />
                        <span>Shift Not Set!</span>
                    </div>
                ):row.original.shift.schedule}
            </div>
        )
    },
    {
        accessorKey: "last_name",
        id:'Employee Name',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Employee Name<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{`${row.original.first_name} ${row.original.last_name}`}</p>
    },
    
    {
        accessorFn: (row)=>row.attendances[0]?.time_in||"",
        id:'Time-in',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Time In<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{`${row.original?.attendances[0]?.time_in||'No Time-in Record'}`}</p>
    },    
    {
        accessorFn: (row)=>row.attendances[0]?.time_out||"",
        id:'Time-Out',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Time Out<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{`${row.original?.attendances[0]?.time_out||''}`}</p>
    },    
    {       
        accessorFn: (row)=>row.attendances[0]?.is_tardy||"",
        id:'Tardy',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Tardy<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{row.original?.attendances[0]?.is_tardy}</p>
    },
    {
        header:({column})=><div className="text-primary w-full text-center">Actions</div>,
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
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }


]
