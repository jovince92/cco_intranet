import Editor from "@/Components/Editor"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { useAnnouncementModal } from "@/Hooks/useAnnouncementModal"
import { useDeleteAnnouncementModal } from "@/Hooks/useDeleteAnnouncementModal"
import { useEmployeeModal } from "@/Hooks/useEmployeeModal"
import { useShiftModal } from "@/Hooks/useShiftModal"
import { useUpdateAttendaceModal } from "@/Hooks/useUpdateAttendaceModal"
import { cn } from "@/lib/utils"
import { Announcement, PageProps, User } from "@/types"
import { Inertia, Page } from "@inertiajs/inertia"
import { usePage } from "@inertiajs/inertia-react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { CalendarClockIcon, ChevronsLeftRight, FolderOpen, MailWarning, MoreHorizontalIcon, Pencil, Square, SquareCheckBig, StarsIcon, TimerReset, Trash2,  TriangleAlert,  UserIcon } from "lucide-react"
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
            const {user} = usePage<Page<PageProps>>().props.auth;
            const {onOpen} = useEmployeeModal();
            const {onOpen:openShift} = useShiftModal();
            const {onOpen:openUpdateModal} =useUpdateAttendaceModal();
            const handleUpdateModalOpen = () =>{
                /*
                only open the modal for the following positions (row.original.position):
                PROGRAMMER
                REPORTS ANALYST
                QUALITY ANALYST 5
                REAL TIME ANALYST
                GENERAL MANAGER
                OPERATIONS SUPERVISOR
                QUALITY ANALYST 1
                OPERATIONS SUPERVISOR 2
                QUALITY ANALYST 6
                QUALITY ANALYST 2
                QUALITY ANALYST 4
                QUALITY ASSURANCE AND TRAINING SUPERVISOR
                QUALITY ANALYST
                OPERATIONS MANAGER
                */
                const allowed = [
                    'PROGRAMMER',
                    'REPORTS ANALYST',
                    'QUALITY ANALYST 5',
                    'REAL TIME ANALYST',
                    'GENERAL MANAGER',
                    'OPERATIONS SUPERVISOR',
                    'QUALITY ANALYST 1',
                    'OPERATIONS SUPERVISOR 2',
                    'QUALITY ANALYST 6',
                    'QUALITY ANALYST 2',
                    'QUALITY ANALYST 4',
                    'QUALITY ASSURANCE AND TRAINING SUPERVISOR',
                    'QUALITY ANALYST',
                    'OPERATIONS MANAGER',
                ];
                if(!allowed.includes(user.position)) return toast.error('Only RTAs and Supervisors can update attendance.');
                openUpdateModal({user_attendance:row.original.attendances[0],user:row.original})
            }
            return(
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                            <span className="sr-only">Open Menu</span>
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">    
                        <DropdownMenuLabel>{`${row.original.first_name} ${row.original.last_name}, ${row.original.company_id}`}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={()=>onOpen(row.original)}>
                            <UserIcon className="h-4 w-4 mr-2" />Employee Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>openShift(row.original)}>
                            <CalendarClockIcon className="h-4 w-4 mr-2" />Change Shift
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleUpdateModalOpen}>
                            <TimerReset className="h-4 w-4 mr-2" />Update Time-in/Time-out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }


]
