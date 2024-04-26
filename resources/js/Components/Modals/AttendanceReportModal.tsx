import { useAttendanceReportModal } from "@/Hooks/useAttendanceReportModal";
import { FC, useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn, ExportToExcel } from "@/lib/utils";
import { CalendarIcon, Loader2, ShieldAlertIcon } from "lucide-react";
import { format, set, addDays } from 'date-fns';
import { Calendar } from "../ui/calendar";
import axios from "axios";
import { toast } from "sonner";
import { User } from "@/types";

const AttendanceReportModal:FC = () => {
    const {isOpen,onClose} = useAttendanceReportModal();
    const [loading,setLoading] = useState(false);
    const [date, setDate] = useState<DateRange | undefined>()
    const disabledDates = {
        from: addDays(new Date(),2),
        //add 1 year
        to: set(new Date(),{year:new Date().getFullYear()+1})
    }

    const onSubmit = () =>{
        if(!date?.from) return toast.info('Please select a date range');
        const fileName = `Attendance Report ${format(date.from,'yyyy-MM-dd')} - ${format(date.to || date.from,'yyyy-MM-dd')}`;
        const tardyFileName = `Tardyness Report ${format(date.from,'yyyy-MM-dd')} - ${format(date.to || date.from,'yyyy-MM-dd')}`;
        setLoading(true);
        axios.post(route('attendance.generate_report'),{
            date
        })
        .then(async(response:{data:User[]})=>{
            //console.log(response.data);
            const report = await formatReport(response.data);
            const taryReport = await formatTardinessReport(response.data);
            await ExportToExcel(report,fileName);
            await ExportToExcel(taryReport,tardyFileName);
            toast.success('Attendance and Taridness report generated. Check your downloads folder');
        })
        .catch(error=>{
            console.error(error);
            toast.error('An error occurred while generating report. Please try again');
        })
        .finally(()=>{
            setLoading(false);
        });
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Generate Report</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-2.5">
                            <p>Please choose date range.</p>
                            {loading && <p>This may take a while. Please do not close or refresh this page</p>}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-y-3.5">
                    
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            disabled={loading}
                            id="date"
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Pick a date range</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={1}
                            disabled={disabledDates}
                        />
                        </PopoverContent>
                    </Popover>
                    <div className="flex flex-col gap-y-2.5">
                        <div className="flex items-center gap-x-2.5">
                            <ShieldAlertIcon className="h-5 w-5 text-primary" />
                            <p className="text-sm font-bold">Warning!</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Employees with no shift schedule may not be included in the report or incorrect values may appear. <br />
                            Please make sure each employee has a shift schedule set before generating the report.
                        </p>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <Button disabled={loading} type="button" onClick={onSubmit}>
                        {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        {loading ? "Generating Report..." : "Generate Report"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default AttendanceReportModal;


const formatReport:(data:User[])=>Promise<any[]>= async(data) =>{
    
    /*
    arrange in the format below:
    Name    Site	Employee ID	Role/Designation	01/02/2024	02/02/2024	03/02/2024	04/02/2024	05/02/2024	06/02/2024	07/02/2024	08/02/2024
    FirstName LastName  Manila	FOQT	CSR	1	1	0	0	1	1	1	1
    FirstName LastName  Leyte	348P	CSR	Not Yet Hired	1	0	0	0	0	0	1
    ***Note: 1 = Present, 0 = Absent, Not Yet Hired = Not Yet Hired
    ***Note: The dates should be dynamic based on the selected date range
    data is an array of users, each user has an array of UserAttendance records
    export interface UserAttendance {    
        id: number;
        date:string;
        time_in?:string;
        time_out?:string;
        is_tardy:string;
        shift_id?:string;
        shift?:Shift;
    }
    */
    const dates: string[] = data.reduce((acc: string[], curr) => {
        curr.attendances.forEach(attendance => {
            if (!acc.includes(attendance.date)) {
                acc.push(attendance.date);
            }
        });
        return acc;
    }, []).sort();
    const header = ['Name','Site', 'Employee ID', 'Role/Designation', ...dates];
    const rows = data.map(user => {
        const row = [ `${user.last_name}, ${user.first_name}`, user.site, user.company_id, user.position];
        dates.forEach(date => {
            const attendance = user.attendances.find(attendance => attendance.date === date);
            if (attendance) {
                row.push(attendance.time_in ? '1' : '0');
            } 
            if(!attendance && user.is_archived===0){
                row.push('0');
            }
            if(!attendance && user.is_archived===1){
                row.push('Resigned');
            }
        });
        return row;
    });
    return [header, ...rows]

}

const formatTardinessReport:(data:User[])=>Promise<any[]>= async(data) =>{
    const dates: string[] = data.reduce((acc: string[], curr) => {
        curr.attendances.forEach(attendance => {
            if (!acc.includes(attendance.date)) {
                acc.push(attendance.date);
            }
        });
        return acc;
    }, []).sort();
    const header = ['Name','Site', 'Employee ID', 'Role/Designation', ...dates];
    const rows = data.map(user => {
        const row = [ `${user.last_name}, ${user.first_name}`, user.site, user.company_id, user.position];
        dates.forEach(date => {
            const attendance = user.attendances.find(attendance => attendance.date === date);
            if (attendance) {
                row.push(attendance.is_tardy);
            } 
            if(!attendance && user.is_archived===0) {
                row.push('No Time In/Absent');
            }
            if(!attendance && user.is_archived===1){
                row.push('Resigned');
            }
        });
        return row;
    });
    return [header, ...rows]
}