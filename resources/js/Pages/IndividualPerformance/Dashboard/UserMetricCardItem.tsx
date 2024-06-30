import Hint from '@/Components/Hint';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { IndividualPerformanceUserMetric } from '@/types/metric';
import { format } from 'date-fns';
import {FC} from 'react';

interface Props {
    userMetric:IndividualPerformanceUserMetric;
    agent:User;
}

const UserMetricCardItem:FC<Props> = ({userMetric,agent}) => {
    const hasFailed = userMetric.value < userMetric.metric.goal;
    return (
        <Hint className='bg-slate-50 dark:bg-slate-950 border border-primary shadow-md shadow-primary' key={userMetric.id} label={<UserMetricHint agent={agent} userMetric={userMetric} />} side='right' >
            <Card key={userMetric.id} className={cn('flex flex-col w-full border-l-[5px] shadow-lg cursor-pointer hover:opacity-70 transition duration-300',!hasFailed?'border-l-emerald-500 shadow-emerald-500/20':'border-l-orange-500 shadow-orange-500/20 ')}>
                <CardHeader className='h-auto'>
                    <CardTitle className='text-lg truncate'>{userMetric.metric.metric_name}</CardTitle>
                </CardHeader>
                <CardContent className='flex-1 flex flex-col gap-y-1 w-full'>
                    <div className='flex items-center justify-between'>
                        <p>Agent Score:</p>
                        <div className={cn('flex items-center',hasFailed && 'text-red-600 dark:text-red-400')}>
                            <p>{`${userMetric.value} ${userMetric.metric.unit}`}</p>
                            {userMetric.metric.format==='rate' && userMetric.metric.rate_unit && <p className='ml-1'>per {userMetric.metric.rate_unit}</p>}
                        </div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p>Daily Goal:</p>
                        <div className='flex items-center'>
                            <p>{`${userMetric.metric.goal} ${userMetric.metric.unit}`}</p>
                            {userMetric.metric.format==='rate' && userMetric.metric.rate_unit && <p className='ml-1'>per {userMetric.metric.rate_unit}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>  
        </Hint>
    );
};

export default UserMetricCardItem;


interface UserMetricHintProps {
    userMetric:IndividualPerformanceUserMetric; 
    agent:User;
}

const UserMetricHint:FC<UserMetricHintProps> = ({userMetric,agent}) =>{
    
    const hasFailed = userMetric.value < userMetric.metric.goal; 
    return (
        <div className='flex flex-col gap-y-2 text-xs px-2.5 py-3.5 w-72'>
            <div className='flex flex-col gap-y-1'>
                <span className='font-bold truncate'>{userMetric.metric.metric_name}</span>
                <span className='font-semibold'>{format(new Date(userMetric.date),'PP')}</span>
                <span className='italic text-muted-foreground capitalize'>Format: {userMetric.metric.format}</span>
            </div>
            <Separator />
            <p className='font-semibold'>
                {`Agent: ${agent.first_name} ${agent.last_name}`}
            </p>            
            <Separator />
            <div className='flex items-center justify-between'>
                <p>Agent Score:</p>
                <div className={cn('flex items-center',hasFailed && 'text-red-600 dark:text-red-400')}>
                    <p>{`${userMetric.value} ${userMetric.metric.unit}`}</p>
                    {userMetric.metric.format==='rate' && userMetric.metric.rate_unit && <p className='ml-1'>per {userMetric.metric.rate_unit}</p>}
                </div>
            </div>
            <div className='flex items-center justify-between'>
                <p>Daily Goal:</p>
                <div className='flex items-center'>
                    <p>{`${userMetric.metric.goal} ${userMetric.metric.unit}`}</p>
                    {userMetric.metric.format==='rate' && userMetric.metric.rate_unit && <p className='ml-1'>per {userMetric.metric.rate_unit}</p>}
                </div>
            </div>
        </div>
    );
}



