import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Announcement } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ChevronsLeftRight, MoreHorizontalIcon, Pencil, Square, SquareCheckBig, Trash2 } from "lucide-react"


/*

id: number;
    user_id: number;
    title:string;
    content:string;
    image?:string;
    status:number;
    user:User;
*/

export const AnnouncementSettingsColums
: ColumnDef<Announcement>[] = [
    {
        accessorKey: "title",
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Title<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p className="line-clamp-2 max-w-[7.5rem]">{row.original.title}</p>
    },
    {
        accessorKey: "user.first_name",
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Posted By<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=>(
            <div className="flex flex-col gap-y-1">
                <p>{`${row.original.user.first_name} ${row.original.user.last_name}`}</p>
                <p>{`${row.original.user.company_id}`}</p>
            </div>
        )
    },
    
    {
        accessorKey: "created_at",
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Date Posted<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=> <p> {format(new Date(row.original.created_at),'PPp')} </p>
    },
    {
        accessorKey: "content",
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Content<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p className="truncate max-w-[13rem]">{row.original.content}</p>
    },
    {
        accessorKey: "status",
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Status<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=>{
            const s = row.original.status===1?'Active':'Inactive';
            return (
                <Badge variant={s==='Active'?'default':'outline'}>{s}</Badge>
            )
        }

    },
    {
        accessorKey: "image",
        header: ()=><p  className='w-full text-primary text-center px-0' > Image</p>,
        cell: ({row})=> row.original.image?<div className="p-3.5 flex items-center justify-center"><img className="h-12 w-12 rounded-md object-cover" src={row.original.image} /></div>:<Badge variant='secondary'>No Image</Badge>
    },
    {
        header:({column})=><span className="text-primary">Actions</span>,
        id:'Actions',
        cell:({row})=> {
            const {id,status} = row.original;
            const Icon = status===1?SquareCheckBig:Square
            return(
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className="h-4 w-8 p-0">
                            <span className="sr-only">Open Menu</span>
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">                        
                        <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Icon className="h-4 w-4 mr-2" />Set as {status===1?'Inactive':'Active'}
                        </DropdownMenuItem>  
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                        </DropdownMenuItem>                      
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
]
