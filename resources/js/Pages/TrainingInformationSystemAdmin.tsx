import Layout from '@/Components/Layout/Layout';
import { Button } from '@/Components/ui/button';
import { Head, Link } from '@inertiajs/inertia-react';
import { LockOpenIcon } from 'lucide-react';
import {FC} from 'react';
import TraningInfoHeader from './TrainingInformationSystem/TraningInfoHeader';
import { TrainingInfoDataTable } from './TrainingInformationSystem/Admin/TrainingInfoDataTable';
import { TrainingTopic } from '@/types/trainingInfo';
import { TrainingInfoColumns } from './TrainingInformationSystem/Admin/TrainingInfoColumns';

interface Props {
    topics: TrainingTopic[];
}

const TrainingInformationSystemAdmin:FC<Props> = ({topics}) => {
    return (
        <>
            <Head title="Training Info System Admin" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container p-2.5'>
                    <TraningInfoHeader />
                    <TrainingInfoDataTable columns={TrainingInfoColumns} data={topics||[]}  />
                </div>
            </Layout>
        </>
    );
};

export default TrainingInformationSystemAdmin;