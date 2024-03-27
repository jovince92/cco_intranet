import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { Head } from '@inertiajs/inertia-react';
import { format } from 'date-fns';
import {FC} from 'react';

interface Props {
    
}

const Attendance:FC<Props> = () => {
    return (
        <>
            <Head title="Attendace" />
            <Layout title='Daily Attendance'>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5'>
                    <div className='h-auto'>
                        header here
                    </div>
                    
                    <div className='flex-1 border rounded-lg p-6 bg-secondary'>
                        content here
                    </div>
                    
                    <div className='h-auto'>
                        pagination here
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Attendance;