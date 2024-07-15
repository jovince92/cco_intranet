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
import { ArrowBigLeft, ArrowBigRight, CalendarIcon, } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Calendar } from '@/Components/ui/calendar';
import IndividualPerformanceRatingFormItem from './IndividualPerformance/IndividualPerformanceRatingFormItem';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';

interface Props {
    is_admin:boolean;
    is_team_leader:boolean;
    project:Project;
    agents:User[];
    date:Date;
}

const IndividualPerformanceRatingForm:FC<Props> = ({is_admin,is_team_leader,project,agents,date}) => {
    
    const {projects} = usePage<Page<PageProps>>().props;
    const navigate = (selectedProject:Project) => Inertia.get(route('individual_performance_dashboard.agent.rating',{project_id:selectedProject.id}));
    const {metrics} = project;
    const onSetDate = (date?:Date) => {
        if(!date) return;
        Inertia.get(route('individual_performance_dashboard.agent.rating',{project_id:project.id,date:format(date,"yyyy-MM-dd")}));
    }
    const [hideSaved, setHideSaved] = useState(false);
    const [showName, setShowName] = useState(true);
    const Icon = !showName ? ArrowBigRight : ArrowBigLeft
    return (
        <>
            <Head title="Individual Performance Ratings Page" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5'>
                    <div className='md:relative flex flex-row md:flex-col items-center'>
                        <Header logo='performance'  title="Individual Performance Ratings Page" />                        
                        <IPDDropdown isAdmin isTeamLead project_id={project?.id} className='md:absolute md:right-0 md:top-[0.7rem] !ring-offset-background focus-visible:!outline-none' />
                    </div>                
                    <div className="flex-1 flex flex-col overflow-auto gap-y-3.5">
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
                                        size='sm'
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={onSetDate}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <div className="flex items-center space-x-2">
                                    <Switch checked={hideSaved} onCheckedChange={()=>setHideSaved(val=>!val)} id="hideSaved" />
                                    <Label htmlFor="hideSaved">Hide Recently Saved</Label>
                                </div>
                            </div>
                            <p className='font-bold text-left md:text-right'>
                                {project?`Metrics for ${project.name}`:"Select a project to view metrics"}
                            </p>
                        </div>
                        {!!project&&(
                            <Table className='flex-1'>
                                <TableHeader>
                                    <TableRow className='relative'>
                                        <TableHead  className={cn('!sticky left-0 bg-background  shadow-[1px_0] shadow-primary ')}>
                                            <div className={cn('flex items-center transition-all duration ease-in-out',showName?'min-w-[15rem]':'min-w-[4rem]')}>
                                                <span>Agent</span>
                                                <button className='ml-auto hover:opacity-60 transition duration-500' onClick={()=>setShowName(val=>!val)}>
                                                    <Icon className='h-5 w-5' />
                                                </button>
                                            </div>
                                        </TableHead>
                                        {metrics.map(metric=><TableHead className='' key={metric.id}>{metric.metric_name}</TableHead>)}
                                        <TableHead className='text-right'>Save</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {agents.map(agent=> <IndividualPerformanceRatingFormItem key={agent.id} showName={showName} date={date} hideSaved={hideSaved}  metrics={metrics} agent={agent} />)}
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