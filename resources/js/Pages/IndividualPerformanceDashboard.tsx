import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { PageProps, Project, User } from '@/types';
import { Inertia, Page } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import { FC, useState, useMemo } from 'react';
import IPDDropdown from './IndividualPerformance/IPDDropdown';
import ProjectSelectionComboBox from './IndividualPerformance/ProjectSelectionComboBox';
import UserSelectionComboBox from './IndividualPerformance/UserSelectionComboBox';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import {  CalendarIcon,  PencilIcon,  SquareArrowRightIcon } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { Calendar } from '@/Components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { IndividualPerformanceUserMetric } from '@/types/metric';
import { toast } from 'sonner';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import UserMetricCardItem from './IndividualPerformance/Dashboard/UserMetricCardItem';
import { Separator } from '@/Components/ui/separator';

interface Props {
    is_admin:boolean;
    is_team_leader:boolean;
    project:Project;
    agents:User[];
    date_range?:DateRange;
    user_metrics?:IndividualPerformanceUserMetric[];
    agent?:User;
}
type UserMetricGroup = {date:string,metrics:IndividualPerformanceUserMetric[]}
const IndividualPerformanceDashboard:FC<Props> = ({is_admin,is_team_leader,project,agents,date_range,user_metrics,agent}) => {
    
    const {projects} = usePage<Page<PageProps>>().props;
    const [selectedUser,setSelectedUser] = useState<User|undefined>(agent);
    const [date, setDate] = useState<DateRange | undefined>(date_range)
    const navigate = () => {
        if(!project) return toast.error('Please select a project');
        if(!selectedUser) return toast.error('Please select an agent');
        if(!date) return toast.error('Please select a date range or pick a date');
        Inertia.get(route('individual_performance_dashboard.index',{
            project_id:project.id,
            date,
            company_id:selectedUser.company_id
        }));
    };

    const onProjectSelect = (project:Project) => Inertia.get(route('individual_performance_dashboard.index',{project_id:project.id}));
   
    const agentName = selectedUser?selectedUser.first_name+' '+selectedUser.last_name:'';
   
    
    const groupedMetrics = useMemo(()=>user_metrics?.reduce((acc:UserMetricGroup[],metric)=>{
        const date = format(new Date(metric.date),'yyyy-MM-dd');
        const group = acc.find(g=>g.date === date);
        if(group){
            group.metrics.push(metric);
        }else{
            acc.push({date,metrics:[metric]});
        }
        return acc;
    },[] ) || [],[user_metrics]) as UserMetricGroup[];
    console.log(groupedMetrics);
    return (
        <>
            <Head title="Individual Performance Dashboard" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5 overflow-y-auto'>
                    <div className='md:relative flex flex-row md:flex-col items-center'>
                        <Header hidePicture title="Individual Performance Dashboard" />                        
                        <IPDDropdown project_id={project.id} isTeamLead={is_team_leader} isAdmin={is_admin} className='md:absolute md:right-0 md:top-[0.7rem] !ring-offset-background focus-visible:!outline-none'  />
                    </div>                
                    <div className="flex-1 flex flex-col gap-y-3.5 overflow-y-auto">
                        <div className='h-auto flex flex-col gap-y-1 md:gap-y-0 md:flex-row md:items-center md:justify-between'>
                            <ProjectSelectionComboBox isAdmin={is_admin} projects={projects} selectedProject={project} onSelectProject={onProjectSelect} />
                            <div className='flex items-center gap-x-1.5'>
                                <UserSelectionComboBox isTeamLead={is_team_leader||is_admin} users={agents} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size='sm'
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                            "w-[14.5rem] justify-start text-left font-normal",
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
                                            <span>Select date range or Pick a Date</span>
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
                                    />
                                    </PopoverContent>
                                </Popover>
                                <Button size='sm' onClick={navigate} variant='secondary'>
                                    Go
                                    <SquareArrowRightIcon className='h-5 w-5 ml-2' />
                                </Button>
                            </div>
                        </div>
                        <div className='flex-1  flex flex-col gap-y-2.5 overflow-y-auto'>
                            { !!agent && !!date_range?.from && user_metrics&&(
                                <>
                                    <div className='h-auto'>
                                        <h3 className='text-lg font-bold tracking-tight'>
                                            {`Performance for ${agentName} - ${format(date_range.from,'LLL dd, y')}`}
                                            {!!date_range.to && ` to ${format(date_range.to,'LLL dd, y')}`}
                                        </h3>
                                    </div>
                                    <div className='overflow-y-auto flex flex-col gap-y-3.5'>
                                        {groupedMetrics.map(group=>(
                                            <div key={group.date} className='flex flex-col gap-y-1.5 p-2 border border-border/50 rounded'>
                                                <p className='text-lg font-bold'>{group.date}</p>
                                                <div className='gap-2 flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                                                    {group.metrics.map(userMetric=> <UserMetricCardItem key={userMetric.id} userMetric={userMetric} />)}
                                                </div>
                                                
                                            </div>
                                        ))}
                                        
                                    </div>
                                </>
                            )}
                        </div>
                    </div>                    
                </div>
            </Layout>
        </>
    );
};

export default IndividualPerformanceDashboard;



interface UserMetricHintProps {
    userMetric:IndividualPerformanceUserMetric; 
}

const UserMetricHint:FC<UserMetricHintProps> = ({userMetric}) =>{    
    return (
        <div className='flex flex-col gap-y-2 text-xs'>
            <div className='flex flex-col gap-y-1'>
                <span className='font-bold truncate'>{userMetric.metric.metric_name}</span>
                <span className='italic text-muted-foreground'>{format(new Date(userMetric.date),'PP')}</span>
            </div>
            <Separator />
            <p className='font-semibold'>
                {`Agent: ${userMetric.user.first_name} ${userMetric.user.last_name}`}
            </p>
        </div>
    );
}

