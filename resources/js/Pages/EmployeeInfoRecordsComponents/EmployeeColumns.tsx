import Editor from "@/Components/Editor"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { useAnnouncementModal } from "@/Hooks/useAnnouncementModal"
import { useDeleteAnnouncementModal } from "@/Hooks/useDeleteAnnouncementModal"
import { useEmployeeModal } from "@/Hooks/useEmployeeModal"
import { useProjectHistoryModal } from "@/Hooks/useProjectHistoryModal"
import { useShiftModal } from "@/Hooks/useShiftModal"
import { cn } from "@/lib/utils"
import { Announcement, PageProps, User } from "@/types"
import { Inertia, Page } from "@inertiajs/inertia"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { CalendarClockIcon, ChevronsLeftRight, FolderOpen, MailWarning, MoreHorizontalIcon, Pencil, Recycle, Square, SquareCheckBig, StarsIcon, Trash2,  UserIcon } from "lucide-react"
import { toast } from "sonner"
import { useEmployeeArchiveMotal } from "./EmployeeInfoHooks/useEmployeeArchiveMotal"
import { usePage } from "@inertiajs/inertia-react"
import EmployeeSkillsModal from "./EmployeeSkillsModal"
import EmployeeViolationModal from "./EmployeeViolationModal"


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
        accessorKey: "project_id",
        id:'Project',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Project<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{row.original.project?.name||'No Project'}</p>
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
            const {user} = usePage<Page<PageProps>>().props.auth;
            const {onOpen} = useEmployeeModal();
            const {onOpen:openShift} = useShiftModal();
            const {onOpen:openProjectHistory} = useProjectHistoryModal();
            const {onOpen:onArchive} = useEmployeeArchiveMotal();
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
                        <DropdownMenuItem onClick={()=>openProjectHistory(row.original )}>
                            <FolderOpen className="h-4 w-4 mr-2" />Project History
                        </DropdownMenuItem>
                        <EmployeeSkillsModal user={row.original}>
                            <Button size='sm' className="w-full justify-start" variant='ghost' >
                                <StarsIcon className="h-4 w-4 mr-2" />Skills
                            </Button>
                        </EmployeeSkillsModal>
                        <DropdownMenuSeparator />
                        <EmployeeViolationModal user={row.original}>
                            <Button size='sm' className="w-full justify-start" variant='ghost' >
                                <MailWarning className="h-4 w-4 mr-2" />Memos and Violations
                            </Button>
                        </EmployeeViolationModal>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={()=>onArchive(row.original,user.position)}>
                            <Recycle className="h-4 w-4 mr-2" />Archive
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }


]
