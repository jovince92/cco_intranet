import Layout from '@/Components/Layout/Layout';
import { Button } from '@/Components/ui/button';
import { Head, Link } from '@inertiajs/inertia-react';
import { LockOpenIcon } from 'lucide-react';
import {FC} from 'react';
import TraningInfoHeader from './TrainingInformationSystem/TraningInfoHeader';
import { TrainingFolder, TrainingTopic } from '@/types/trainingInfo';
import MainFolderContainer from './TrainingInformationSystem/Admin/MainFolderContainer';

interface Props {
    main_folders: TrainingFolder[];
}

const TrainingInformationSystemAdmin:FC<Props> = ({main_folders}) => {
    
    return (
        <>
            <Head title="Training Info System Admin" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container p-2.5'>
                    <TraningInfoHeader />
                    <MainFolderContainer main_folders={main_folders} />
                </div>
            </Layout>
        </>
    );
};

export default TrainingInformationSystemAdmin;