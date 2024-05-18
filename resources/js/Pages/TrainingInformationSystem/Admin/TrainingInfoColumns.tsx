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
import { TrainingTopic } from "@/types/trainingInfo"
import { Inertia, Page } from "@inertiajs/inertia"
import { useForm, usePage } from "@inertiajs/inertia-react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { CalendarClockIcon, ChevronsLeftRight, FolderOpen, MailWarning, MoreHorizontalIcon, Pencil, PowerIcon, Square, SquareCheckBig, StarsIcon, TimerReset, Trash2,  TriangleAlert,  UserIcon } from "lucide-react"
import { toast } from "sonner"

export const TrainingInfoColumns

: ColumnDef<TrainingTopic>[] = [
    {
        accessorKey: "user_id",
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Created By<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p className="font-semibold tracking-wide">{`${row.original.user.first_name} ${row.original.user.last_name}`}</p>
    },
    {
        accessorKey: "title",
        id:'title',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Title<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{row.original.title}</p>
    },
    {
        accessorKey: "description",
        id:'description',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Description<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p className="truncate">{`${row.original.description||""}`}</p>
    },
    
    {
        accessorKey: "is_active",
        id:'is_active',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Is Active?<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p className={cn("font-bold tracking-wide w-full text-center",row.original.is_active===1&&'text-success')}>{row.original.is_active===1?'YES':'NO'}</p>
    },    
    {
        accessorFn: (row)=>row.current_version,
        id:'Current Version',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Current Version<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=>{
            return (
                <p className="font-semibold tracking-wide w-full text-center">
                    {`${row.original.current_version?row.original.current_version.version:'N/A'}`}
                </p>
            )
        }
    },    
    {       
        accessorKey: "created_at",
        id:'Date Created',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Date Created<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{format(new Date(row.original.created_at),'PPp')}</p>
    },
    {
        header:({column})=><div className="text-primary w-full text-center">Actions</div>,
        id:'Actions',
        cell:({row})=> {
            const {post} = useForm({});
            const onDelete = () => post(route('training_info_system.destroy',{id:row.original.id}),{
                onSuccess:()=>toast.success('Topic Deleted Successfully!'),
                onError:()=>toast.error('Failed to Delete Topic! Please try again')
            });
            return(
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                            <span className="sr-only">Open Menu</span>
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">                        
                        <DropdownMenuItem onClick={()=>Inertia.get(route('training_info_system.edit',{id:row.original.id}))}>
                            <Pencil className="h-4 w-4 mr-2" />Edit Topic
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled onClick={()=>{}}>
                            <PowerIcon className="h-4 w-4 mr-2" />Set {`${row.original.is_active===1?'Inactive':'Active'}`}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />Delete Topic
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }


]
