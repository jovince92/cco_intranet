import { Button } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { PageProps } from "@/types";
import { Page } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { CalendarClockIcon, SearchIcon, SlidersHorizontal, UserIcon } from "lucide-react";
import { ChangeEvent, FC } from "react";

interface Props {    
    shift?:string;
    onShiftChange:(shift_id:string)=>void;
    onInputChange:(e:ChangeEvent<HTMLInputElement>)=>void;
    strFilter:string;
}

const AttendanceHeader:FC<Props> = ({shift,onShiftChange,onInputChange,strFilter}) => {
    const {shifts} = usePage<Page<PageProps>>().props;
    return (
        <div className="flex items-center justify-between gap-x-2 h-auto">
            <div className="flex items-center gap-x-2">
                <div className="relative">
                    <SearchIcon className="absolute top-1/2 left-2 transform -translate-y-1/2 text-primary" />
                    <Input value={strFilter} onChange={onInputChange} placeholder="Filter by Company ID/Last Name" className="pl-8 w-72 h-9" />
                </div>
                <Select onValueChange={e=>onShiftChange(e)} value={shift}>
                    <SelectTrigger className="h-9 w-40">
                        <SelectValue  placeholder="Select a Shift" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Shift Schedule</SelectLabel>
                            <SelectItem value="0">No Schedule</SelectItem>
                            {
                                shifts.map((shift) =><SelectItem key={shift.id} value={shift.id.toString()}>{shift.schedule}</SelectItem>)
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size='sm' variant='outline'>
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Show Menu
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">                        
                    <DropdownMenuItem onClick={()=>{}}>
                        <UserIcon className="h-4 w-4 mr-2" />Change Date
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>{}}>
                        <CalendarClockIcon className="h-4 w-4 mr-2" />Change Shift
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default AttendanceHeader;

/*

*/