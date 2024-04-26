import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useAttendanceReportModal } from "@/Hooks/useAttendanceReportModal";
import { cn } from "@/lib/utils";
import { PageProps } from "@/types";
import { Inertia, Page } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { addDays, addYears, format } from "date-fns";
import {  CalendarClockIcon, CalendarIcon, FileSpreadsheet, GanttChart, RefreshCw, SearchIcon, SlidersHorizontal, UserIcon, XIcon } from "lucide-react";
import { ChangeEvent, FC, ReactNode, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "sonner";

interface Props {    
    shift?:string;
    onShiftChange:(shift_id:string)=>void;
    onInputChange:(e:ChangeEvent<HTMLInputElement>)=>void;
    strFilter:string;
    showDashboard:boolean;
    showDashboardToggle:()=>void;
    onProjectFilter:(project_id:string)=>void;
    projectFilterIds:string[];
    resetProjectFilter:()=>void;
}

const AttendanceHeader:FC<Props> = ({shift,onShiftChange,onInputChange,strFilter,showDashboard,showDashboardToggle,onProjectFilter,projectFilterIds,resetProjectFilter}) => {
    const {shifts,projects} = usePage<Page<PageProps>>().props;
    const [showDateModal,setShowDateModal] = useState(false);
    const {user} = usePage<Page<PageProps>>().props.auth;
    const {onOpen} = useAttendanceReportModal();
    return (
        <>
            <div className="flex items-center justify-between gap-x-2 h-auto">
                <div className="flex items-center gap-x-2">
                    {!showDashboard?(
                        <>
                            <div className="relative">
                                <SearchIcon className="absolute top-1/2 left-2 transform -translate-y-1/2 text-primary" />
                                <Input value={strFilter} onChange={onInputChange} placeholder="Filter by Company ID/Last Name" className="pl-8 md:w-72 h-9" />
                            </div>
                            <Select onValueChange={e=>onShiftChange(e)} value={shift}>
                                <SelectTrigger className="h-9 w-40">
                                    <SelectValue  placeholder="Select a Shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Shift Schedule</SelectLabel>
                                        <SelectItem value="0">No Schedule</SelectItem>
                                        <SelectItem value={"all"}>Show All</SelectItem>
                                        {
                                            shifts.map((shift) =><SelectItem key={shift.id} value={shift.id.toString()}>{shift.schedule}</SelectItem>)
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </>
                    ):(
                        <div className="text-lg font-semibold tracking-wide">
                            CCO Daily Attendance Dashboard
                        </div>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size='sm' variant="outline">Filter By Project</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 max-h-[23rem] overflow-auto">
                            <DropdownMenuLabel>Filter By Project</DropdownMenuLabel>
                            {projectFilterIds.length>0&&(<DropdownMenuItem onClick={resetProjectFilter}>
                                <XIcon className="h-4 w-4 mr-2" />
                                Remove Project Filters
                            </DropdownMenuItem>)}
                            <DropdownMenuSeparator />
                            {projects.map(project=>(
                                <DropdownMenuCheckboxItem key={project.id} checked={projectFilterIds.includes(project.id.toString())} onCheckedChange={()=>onProjectFilter(project.id.toString())} >
                                    {project.name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size='sm' variant="outline" onClick={showDashboardToggle}>
                        <GanttChart className="h-4 w-4 mr-2" />
                        {showDashboard?'Show Attendance Table':'Show Dashboard'}
                    </Button>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size='sm' variant='outline'>
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Show Menu
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>                     
                            <DropdownMenuItem onClick={()=>setShowDateModal(true)}>
                                <UserIcon className="h-4 w-4 mr-2" />Change Date
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>onOpen(user.position)}>
                                <FileSpreadsheet className="h-4 w-4 mr-2" />Generate Report
                            </DropdownMenuItem>
                        </DropdownMenuGroup>   
                    </DropdownMenuContent>
                </DropdownMenu>
                
            </div>
            <DateModal isOpen={showDateModal} onClose={()=>setShowDateModal(false)} />
        </>
    )
}

export default AttendanceHeader;

interface DateModalProps{
    isOpen:boolean;
    onClose:()=>void;
}

const DateModal:FC<DateModalProps> = ({isOpen,onClose}) =>{
    const [loading,setLoading] = useState(false);
    const [date,setDate] = useState<Date>();
    //disable future dates
    const disabledDates=[
        {
            from: addDays( new Date(),2),
            to: addYears(new Date(), 1)
        }
    ];

    const onSubmit = () => {
        if(!date) return toast.info('Please select a date');
        Inertia.get(route('attendance.index',{search:format(date,'yyyy-MM-dd')}),{},{
            preserveState:false,
         onSuccess:onClose,
            onError:()=>toast.error('Something went wrong. Please try again'),
            onStart:()=>setLoading(true),
            onFinish:()=>setLoading(false)
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Attendance Date</DialogTitle>
                    <DialogDescription>
                        Choose the date to view the attendance
                    </DialogDescription>
                </DialogHeader>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PP") : <span>Select a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={disabledDates}
                            
                        />
                    </PopoverContent>
                </Popover>
                <DialogFooter>
                    <Button disabled={loading}>Close</Button>
                    <Button disabled={loading} onClick={onSubmit}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}