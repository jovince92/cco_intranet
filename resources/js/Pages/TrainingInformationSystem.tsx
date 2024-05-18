import Layout from '@/Components/Layout/Layout';
import { Button } from '@/Components/ui/button';
import { Head, Link } from '@inertiajs/inertia-react';
import { LockIcon, MoreVerticalIcon } from 'lucide-react';
import {FC} from 'react';
import TraningInfoHeader from './TrainingInformationSystem/TraningInfoHeader';

interface Props {
    
}

const TrainingInformationSystem:FC<Props> = () => {
    return (
        <>
            <Head title="Training Info System" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container p-2.5'>
                    <TraningInfoHeader />
                </div>
            </Layout>
        </>
    );
};

export default TrainingInformationSystem;