import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { PageProps, User } from '@/types';
import { Page } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { format } from 'date-fns';
import { Clock, FolderCheck, UserCheck, Users2Icon } from 'lucide-react';
import {FC, useMemo} from 'react';

interface Props {
    users:User[];
    dt:string;
    loading?:boolean;
}




const AttendanceDashboard:FC<Props> = ({users,dt,loading}) => {

    const manilaUsers = users.filter(user => user.site.toLocaleLowerCase() === 'manila');
    const leyteUsers = users.filter(user => user.site.toLocaleLowerCase() === 'leyte');
    
    const {shifts,projects} = usePage<Page<PageProps>>().props;


    return (
        <div className='flex flex-col h-full gap-y-2 overflow-y-auto lg:overflow-y-hidden '>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 h-auto">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total CCO Employees
                        </CardTitle>
                        <Users2Icon className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {manilaUsers.length} in Manila and {leyteUsers.length} in Leyte
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            CCO Employees with no Shift
                        </CardTitle>
                        <Clock className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter(user=>!user.shift_id).length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            CCO Employees with no Project
                        </CardTitle>
                        <FolderCheck className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter(user=>!user.project_id).length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {format(new Date(dt), 'PPP')}&nbsp;Attendance
                        </CardTitle>
                        <UserCheck className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter(user=>!!user.attendances[0]?.time_in).length} Present</div>
                        <p className="text-xs text-muted-foreground">
                            {users.filter(user=>!user.attendances[0]?.time_in).length} Abent/No Attendance
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className='flex-1 gap-y-3.5 flex flex-col overflow-auto'>
                <p className='w-full text-center text-lg h-auto'>{format(new Date(dt),'PPP')} Attendace </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8 flex-1">
                    {/* <Card className="lg:col-span-4  "> */}
                    <Card className="lg:col-span-8  ">
                        <CardHeader>
                            <CardTitle>Per Shift Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
                            {shifts.map(shift=>(
                                <BreakdownBlock 
                                    key={shift.id}
                                    label={shift.schedule}
                                    total={users.filter(user=>user.shift_id===shift.id).length}
                                    present={users.filter(user=>user.shift_id===shift.id).filter(user=>!!user.attendances[0]?.time_in).length}
                                    absent={users.filter(user=>user.shift_id===shift.id).filter(user=>!user.attendances[0]?.time_in).length}
                                    />                     
                            ))}
                            <BreakdownBlock 
                                label='No Shift Schedule'
                                total={users.filter(user=>!user.shift_id).length}
                                present={users.filter(user=>!user.shift_id).filter(user=>!!user.attendances[0]?.time_in).length}
                                absent={users.filter(user=>!user.shift_id).filter(user=>!user.attendances[0]?.time_in).length}
                                />
                        </CardContent>
                    </Card>
                    {/* <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Per Project Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                            {projects.map(project=>(
                                <BreakdownBlock
                                    key={project.id} 
                                    label={project.name}
                                    total={users.filter(user=>user.project_id===project.id).length}
                                    present={users.filter(user=>user.project_id===project.id).filter(user=>!!user.attendances[0]?.time_in).length}
                                    absent={users.filter(user=>user.project_id===project.id).filter(user=>!user.attendances[0]?.time_in).length}
                                    />
                            ))}
                            <BreakdownBlock 
                                label='No Project'
                                total={users.filter(user=>!user.project_id).length}
                                present={users.filter(user=>!user.project_id).filter(user=>!!user.attendances[0]?.time_in).length}
                                absent={users.filter(user=>!user.project_id).filter(user=>!user.attendances[0]?.time_in).length}
                                />
                        </CardContent>
                        
                    </Card> */}
                </div>
            </div>
        </div>
    );
};

export default AttendanceDashboard;

interface BreakdownBlockProps{
    label:string;
    total:number;
    present:number;
    absent:number;
}
const BreakdownBlock:FC<BreakdownBlockProps> = ({label,total,present,absent}) =>{
    return (
        <Card className="flex flex-col gap-1.5 rounded-2xl border-[3px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
            <div className='flex flex-col gap-y-1.5 text-muted-foreground font-light'>
                <div className='w-full flex items-center justify-between '>
                    <p>Total:</p>
                    <p>{total}</p>
                </div>
                <div className='w-full flex items-center justify-between'>
                    <p>Present:</p>
                    <p>{present}</p>
                </div>
                <div className='w-full flex items-center justify-between text-destructive'>
                    <p>Absent:</p>
                    <p>{absent}</p>
                </div>
            </div>
            </CardContent>
        </Card>  
        
    );
}