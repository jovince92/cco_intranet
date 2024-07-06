import { Button } from '@/Components/ui/button';
import { Calendar } from '@/Components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { IndividualPerformanceMetric } from '@/types/metric';
import { useForm } from '@inertiajs/inertia-react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {FC, useEffect, useState} from 'react';
import UserSelectionComboBox from '../UserSelectionComboBox';

interface Props {
    agents:User[];
    isOpen:boolean;
    onClose:()=>void;
    projectMetrics:IndividualPerformanceMetric[];
    agentRatings?:RateAgentsForm;
}

type Rating ={
    metric:IndividualPerformanceMetric;
    rating:number;
}

export type RateAgentsForm = {
    agent?:User;
    ratings:Rating[]
    date?:Date;
}


const RateAgentsModal:FC<Props> = ({agents,isOpen,onClose,projectMetrics,agentRatings}) => {
    const {reset,data,setData,processing,errors} = useForm<RateAgentsForm>({
        date:undefined,
        agent:undefined,
        ratings:[]
    });

    useEffect(()=>{
        if(!isOpen) reset();
        if(isOpen && !agentRatings) setData(val=>({
            ...val,
            ratings:projectMetrics.map(metric=>({
                metric,
                rating:0
            }
        ))}));
        if(isOpen && agentRatings){
            setData(agentRatings);
        }
    },[isOpen,projectMetrics,agentRatings]);

    const handleRatingChange = (metric:IndividualPerformanceMetric,rating:string) => {
        if(isNaN(parseInt(rating))) return;
        setData('ratings',data.ratings.map(r=>r.metric.id===metric.id?{...r,rating:parseInt(rating)}:r));
    };

    const title = `${agentRatings?'Edit Agent Ratings for ':'Rate Agent '} ${data.agent?.first_name} ${data.agent?.last_name}`;
    const description = `${agentRatings?'Edit the ratings for the agent based on the metrics below':'Rate the agent based on the metrics below'}`;

    const onSubmit = () =>{
        //TODO: Update Agent Ratings
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='flex flex-col max-h-screen overflow-y-auto '>
                <DialogHeader className='h-auto px-3'>
                    <DialogTitle>{!data.agent?'Select an Agent to Continue':title}</DialogTitle>
                    <DialogDescription>
                        {!data.agent?'Select an agent from the list to rate them':description}
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-y-1.5 flex-1 overflow-y-auto px-3'>
                    <UserSelectionComboBox disabled={!!agentRatings} isTeamLead users={agents} selectedUser={data.agent} onSelectUser={a=>setData('agent',a)} />
                    {!!data.agent&&(
                        <div className='flex flex-col gap-y-3.5 flex-1 overflow-y-auto'>
                            <div className='flex flex-col gap-y-1'>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button disabled={!!agentRatings} variant={"outline"} className={cn("w-full justify-start text-left font-normal",!data.date && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {data.date ? format(data.date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={data.date} onSelect={e=>setData('date',e)} initialFocus/>
                                    </PopoverContent>
                                </Popover>
                                {errors.date && <p className="text-red-600 dark:text-red-400 text-xs">{errors.date}</p>}
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto'>
                                {data.ratings.map(rating=>(
                                    <div key={rating.metric.id} className='space-y-1'>
                                        <Label>{rating.metric.metric_name}</Label>
                                        <Input className='!ring-0 !ring-offset-0' required value={rating.rating} onChange={e=>handleRatingChange(rating.metric,e.target.value)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {!!data.agent&&(
                    <DialogFooter className='h-auto px-3'>
                        <Button type="submit">Save Ratings</Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default RateAgentsModal;