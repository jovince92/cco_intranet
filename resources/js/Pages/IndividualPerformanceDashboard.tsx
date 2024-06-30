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
import {  CalendarIcon,  ExpandIcon,  PencilIcon,  ShrinkIcon,  SquareArrowRightIcon } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { Calendar } from '@/Components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { IndividualPerformanceUserMetric } from '@/types/metric';
import { toast } from 'sonner';
import UserMetricCardItem from './IndividualPerformance/Dashboard/UserMetricCardItem';
import { Separator } from '@/Components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import Hint from '@/Components/Hint';
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type UserMetricGroup = {date:string,metrics:IndividualPerformanceUserMetric[]}
type UserMetricAverage = {
    metric_name:string;
    average:number;
    total:number;
    days:number;
    goal:number; 
}

interface Props {
    is_admin:boolean;
    is_team_leader:boolean;
    project:Project;
    agents:User[];
    date_range?:DateRange;
    agent?:User;
    agent_averages?:UserMetricAverage[];
    grouped_metrics?:UserMetricGroup[];
}
const IndividualPerformanceDashboard:FC<Props> = ({is_admin,is_team_leader,project,agents,date_range,agent,agent_averages,grouped_metrics}) => {
    
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
    

    const [opened,setOpened] = useState<string[]>((grouped_metrics||[]).map(({date})=>(date)));
    const onShrinkAll = () => setOpened([]);
    const onExpandAll = () => setOpened((grouped_metrics||[]).map(({date})=>(date)));
    const onSetOpened = (dates:string[]) => setOpened(dates);
    const chartData = useMemo(()=>(agent_averages||[]).map(({metric_name,average,goal})=>({
        Metric:metric_name,
        Average:average,
        Goal:goal
    })),[agent_averages]);
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
                                            "w-60 justify-start text-left font-normal",
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
                                                <span className='text-xs'>Select date range or Pick a Date</span>
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
                        {(!!date_range?.to && !!date_range?.from && !!agent_averages) && (
                            <div className='h-auto flex flex-col gap-y-2.5'>
                                <Accordion type='single' collapsible className="w-full">                                    
                                    <AccordionItem value='averages'>
                                        <AccordionTrigger className='text-lg font-bold tracking-tight'>
                                            Agent Averages from {format(date_range.from,'PP')} to {format(date_range.to,'PP')}
                                        </AccordionTrigger>
                                        <AccordionContent asChild>
                                            <ResponsiveContainer height={500} width={'100%'}>
                                                <BarChart
                                                    data={chartData}
                                                    margin={{
                                                        top: 5,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                    >
                                                    <CartesianGrid stroke='#64748b' strokeDasharray="3 3" />
                                                    <XAxis className='' dataKey="Metric" />
                                                    <Tooltip labelClassName='text-slate-900 font-semibold' />
                                                    <Legend />
                                                    <Bar dataKey="Average" fill="#ec4899" activeBar={<Rectangle fill="#db2777" stroke="#be185d" />} />
                                                    <Bar dataKey="Goal" fill="#3b82f6" activeBar={<Rectangle fill="#2563eb" stroke="#1d4ed8" />} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </AccordionContent>
                                    </AccordionItem>                                      
                                </Accordion>
                            </div>
                        )}
                        <div className='flex-1  flex flex-col gap-y-2.5 overflow-y-auto'>
                            { !!agent && !!date_range?.from && grouped_metrics&&(
                                <>
                                    <div className='h-auto flex items-center justify-between'>
                                        <h3 className='text-lg font-bold tracking-tight'>
                                            {`Performance for ${agentName} - ${format(date_range.from,'LLL dd, y')}`}
                                            {!!date_range.to && ` to ${format(date_range.to,'LLL dd, y')}`}
                                        </h3>
                                        <div className='flex'>
                                            <Button size='sm' variant='outline' className='border-r-0 rounded-r-none' onClick={onShrinkAll}>
                                                <ShrinkIcon className='h-5 w-5' />
                                                <span className='ml-2 hidden md:inline'>Shrink All</span>
                                            </Button>
                                            <Button size='sm' variant='outline' className='rounded-l-none' onClick={onExpandAll}>
                                                <span className='mr-2 hidden md:inline'>Expand All</span>
                                                <ExpandIcon className='h-5 w-5' />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className='overflow-y-auto flex flex-col gap-y-3.5'>
                                        <Accordion type="multiple" value={opened} onValueChange={onSetOpened} className="w-full">
                                            {grouped_metrics.map(group=>(                                        
                                                <AccordionItem key={group.date} value={group.date}>
                                                    <AccordionTrigger className='text-xl text-center flex items-center justify-center'>
                                                        <span>{group.date}</span>
                                                    </AccordionTrigger>
                                                    <AccordionContent asChild>
                                                        <div className='gap-5 flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                                                            {group.metrics.map(userMetric=>  <UserMetricCardItem agent={agent} key={userMetric.id}   userMetric={userMetric} />)}
                                                        </div>  
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}                                        
                                        </Accordion>
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


