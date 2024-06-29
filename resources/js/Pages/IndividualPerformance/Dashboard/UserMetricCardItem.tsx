import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { cn } from '@/lib/utils';
import { IndividualPerformanceUserMetric } from '@/types/metric';
import {FC} from 'react';

interface Props {
    userMetric:IndividualPerformanceUserMetric;
}

const UserMetricCardItem:FC<Props> = ({userMetric}) => {
    const hasFailed = userMetric.value < userMetric.metric.goal;
    return (
        <Card key={userMetric.id} className='flex flex-col w-full'>
            <CardHeader className='h-auto'>
                <CardTitle className='text-lg truncate'>{userMetric.metric.metric_name}</CardTitle>
            </CardHeader>
            <CardContent className='flex-1 flex flex-col gap-y-1 w-full'>
                <div className='flex items-center justify-between'>
                    <p>Agent Score:</p>
                    <div className={cn('flex items-center',hasFailed && 'text-red-600 dark:text-red-400')}>
                        <p>{userMetric.value}</p>
                        {userMetric.metric.format==='rate' && userMetric.metric.rate_unit && <p className='ml-1'>per {userMetric.metric.rate_unit}</p>}
                    </div>
                </div>
                <div className='flex items-center justify-between'>
                    <p>Daily Goal:</p>
                    <div className='flex items-center'>
                        <p>{userMetric.metric.goal}</p>
                        {userMetric.metric.format==='rate' && userMetric.metric.rate_unit && <p className='ml-1'>per {userMetric.metric.rate_unit}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>  
    );
};

export default UserMetricCardItem;