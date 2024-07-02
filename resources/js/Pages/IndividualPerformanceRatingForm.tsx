import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { PageProps, Project, User } from '@/types';
import { Head, usePage } from '@inertiajs/inertia-react';
import {FC, useState} from 'react';
import IPDDropdown from './IndividualPerformance/IPDDropdown';
import ProjectSelectionComboBox from './IndividualPerformance/ProjectSelectionComboBox';
import { Inertia, Page } from '@inertiajs/inertia';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Input } from '@/Components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Calendar } from '@/Components/ui/calendar';

interface Props {
    is_admin:boolean;
    is_team_leader:boolean;
    project:Project;
    agents:User[];
    date?:Date;
}

const IndividualPerformanceRatingForm:FC<Props> = ({is_admin,is_team_leader,project,agents,date : DATE}) => {
    
    const {projects} = usePage<Page<PageProps>>().props;
    const navigate = (selectedProject:Project) => Inertia.get(route('individual_performance_dashboard.agent.rating',{project_id:selectedProject.id}));
    const {metrics} = project;
    const [date,setDate] = useState(DATE);
    return (
        <>
            <Head title="Individual Performance Ratings Page" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5'>
                    <div className='md:relative flex flex-row md:flex-col items-center'>
                        <Header hidePicture title="Individual Performance Ratings Page" />                        
                        <IPDDropdown isAdmin isTeamLead project_id={project?.id} className='md:absolute md:right-0 md:top-[0.7rem] !ring-offset-background focus-visible:!outline-none' />
                    </div>                
                    <div className="flex-1 flex flex-col overflow-y-auto gap-y-3.5">
                        <div className='h-auto flex flex-col gap-y-1 md:gap-y-0 md:flex-row md:items-center md:justify-between'>
                            <div className='flex items-center gap-x-2'>
                                <ProjectSelectionComboBox isAdmin projects={projects} selectedProject={project} onSelectProject={navigate} />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <p className='font-bold text-left md:text-right'>
                                {project?`Metrics for ${project.name}`:"Select a project to view metrics"}
                            </p>
                        </div>
                        {!!project&&(
                            <Table className='flex-1'>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Agent</TableHead>
                                        {metrics.map(metric=><TableHead key={metric.id}>{metric.metric_name}</TableHead>)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {agents.map(agent=>(
                                        <TableRow key={agent.id}>
                                            <TableCell>{agent.first_name} {agent.last_name}</TableCell>
                                            {metrics.map(metric=>(
                                                <TableCell key={metric.id}>
                                                    <Input placeholder={'Goal: '+ metric.daily_goal}  />
                                                </TableCell>
                                            ))}
                                        </TableRow>                                    
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {!project&&<div className='flex-1 flex items-center justify-center text-muted-foreground'>Select a project to view metrics</div>}
                    </div>                    
                </div>
            </Layout>
        </>
    );
};

export default IndividualPerformanceRatingForm;