import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { TrainingAssessment } from '@/types/trainingInfo';
import { Head } from '@inertiajs/inertia-react';
import {FC} from 'react';

interface Props {
    assessment?:TrainingAssessment;
}

const TrainingAssessmentPage:FC<Props> = ({assessment}) => {
    return (
        <>
            <Head title={assessment?.title||'Not Found'} />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5'>
                    
                    {assessment?.title||'Not Found'}
                </div>
            </Layout>
        </>
    );
};

export default TrainingAssessmentPage;