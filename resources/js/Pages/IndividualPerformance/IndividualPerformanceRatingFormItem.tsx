import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { TableCell, TableRow } from '@/Components/ui/table';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { IndividualPerformanceMetric } from '@/types/metric';
import axios from 'axios';
import { Loader2, SaveIcon } from 'lucide-react';
import {FC, useState} from 'react';

interface Props {
    metrics: IndividualPerformanceMetric[];
    agent:User;    
    hideSaved?:boolean;
    date:Date;
}

type formDataType = {
    metric_id:number;
    user_metric_id:number;
    score:number;
}

const IndividualPerformanceRatingFormItem:FC<Props> = ({metrics,agent,hideSaved,date}) => {
    const [loading,setLoading] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const [formData, setFormData] = useState<formDataType[]>(metrics.map(metric=>{
        const userMetric = agent.user_metrics.find(um=>um.individual_performance_metric_id === metric.id);
        return {
            metric_id:metric.id,
            user_metric_id:userMetric?.id ?? 0,
            score:userMetric?.value ?? 0
        }
    }));

    const handleChange = (id:number,value:string) => {
        //return if value is not a number
        if(isNaN(+value)) return;
        const score = +value;
        setFormData(formData.map(data=>data.metric_id === id ? {...data,score} : data));
    };

    const onSubmit = () =>{
        setLoading(true);
        axios.post(route('individual_performance_dashboard.agent.save_rating'),{
            date,
            user_id:agent.id,
            ratings:formData.map(data=>({
                metric_id:data.metric_id,
                user_metric_id:data.user_metric_id,
                score:data.score
            }))
        }).then(()=>{
            setHasSaved(true);
        }).catch(()=>{
            console.error('Error saving rating');
        }).finally(()=>setLoading(false));
    }

    const Icon = loading?Loader2:SaveIcon;

    return (
        <TableRow className={cn(hasSaved&&hideSaved&&'hidden')} key={agent.id}>
            <TableCell className='sticky left-0 bg-background shadow-[1px_0] shadow-primary '>{`${agent.company_id}, ${agent.first_name} ${agent.last_name}`}</TableCell>
            {formData.map(metric=>(
                <TableCell key={metric.metric_id}>
                    <Input disabled={loading} className='h-9 w-64 text-right' placeholder='0' value={metric.score} onChange={e=>handleChange(metric.metric_id,e.target.value)} />
                </TableCell>
            ))}
            <TableCell className='flex items-center justify-end'>
                <Button  disabled={loading} onClick={onSubmit} size='icon_sm'>
                    <Icon className={cn(loading&&'animate-spin')} />
                </Button>
            </TableCell>
        </TableRow>   
    );
};

export default IndividualPerformanceRatingFormItem;

