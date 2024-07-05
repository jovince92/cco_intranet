import { TopPerformer } from '@/Pages/TeamPerformanceDashboard';
import {FC} from 'react';

interface Props {
    topPerformers:TopPerformer[];
}

const TopPerformers:FC<Props> = ({topPerformers}) => {
    return (
        <div className='w-full grid gap-2.5 grid-col-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {topPerformers.map(tP=><TopPerformer key={tP.metric_id} topPerformer={tP} />)}
        </div>
    );
};

export default TopPerformers;

const TopPerformer:FC<{topPerformer:TopPerformer}> = ({topPerformer}) => {
    const {top_five_performers}=topPerformer;
    return (
        <div className='h-80 border rounded-xl px-2.5 py-1.5 shadow-md shadow-primary/20 flex flex-col gap-y-3.5'>
            <div className='space-y-1'>
                <p className='text-sm font-semibold tracking-tight'>{`Top Performers for ${topPerformer.metric_name}`}</p>
            </div>
            <div className='flex flex-col gap-y-1'>
                TODO: TOP FIVE PERFORMERS
            </div>
        </div>
    );
}