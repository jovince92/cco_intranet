import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { PageProps, Project, User } from '@/types';
import { Inertia, Page } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import { FC, useState } from 'react';
import IPDDropdown from './IndividualPerformance/IPDDropdown';
import ProjectSelectionComboBox from './IndividualPerformance/ProjectSelectionComboBox';
import UserSelectionComboBox from './IndividualPerformance/UserSelectionComboBox';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon, LogIn, SquareArrowRightIcon } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { Calendar } from '@/Components/ui/calendar';
import { DateRange } from 'react-day-picker';

interface Props {
    is_admin:boolean;
    is_team_leader:boolean;
    project:Project;
    agents:User[];
}

const IndividualPerformanceDashboard:FC<Props> = ({is_admin,is_team_leader,project,agents}) => {
    
    const {projects,auth} = usePage<Page<PageProps>>().props;
    const {user} = auth;
    const [selectedUser,setSelectedUser] = useState<User>(agents.find(a=>a.id===user.id)||agents[0]);
    const [date, setDate] = useState<DateRange | undefined>()
    const navigate = (project:Project) => Inertia.get(route('individual_performance_dashboard.index',{project_id:project.id}));
    

    return (
        <>
            <Head title="Individual Performance Dashboard" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5'>
                    <div className='md:relative flex flex-row md:flex-col items-center'>
                        <Header hidePicture title="Individual Performance Dashboard" />                        
                        <IPDDropdown project_id={project.id} isTeamLead={is_team_leader} isAdmin={is_admin} className='md:absolute md:right-0 md:top-[0.7rem] !ring-offset-background focus-visible:!outline-none'  />
                    </div>                
                    <div className="flex-1 flex flex-col overflow-y-auto gap-y-3.5">
                        <div className='h-auto flex flex-col gap-y-1 md:gap-y-0 md:flex-row md:items-center md:justify-between'>
                            <div className='flex items-center gap-x-2'>
                                <ProjectSelectionComboBox isAdmin={is_admin} projects={projects} selectedProject={project} onSelectProject={navigate} />
                                <UserSelectionComboBox isTeamLead={is_team_leader||is_admin} users={agents} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
                            </div>
                            <div className='flex items-center gap-x-1.5'>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
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
                                    />
                                    </PopoverContent>
                                </Popover>
                                <Button variant='secondary'>
                                    Go
                                    <SquareArrowRightIcon className='h-5 w-5 ml-2' />
                                </Button>
                            </div>
                        </div>
                    </div>                    
                </div>
            </Layout>
        </>
    );
};

export default IndividualPerformanceDashboard;
