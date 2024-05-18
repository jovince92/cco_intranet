import { Button } from '@/Components/ui/button';
import { TrainingTopic } from '@/types/trainingInfo';
import { Inertia } from '@inertiajs/inertia';
import { Link, useForm } from '@inertiajs/inertia-react';
import { LockIcon, LockOpenIcon, LogOutIcon, Plus, SquarePenIcon } from 'lucide-react';
import {FC, useState} from 'react';
import { toast } from 'sonner';
import TrainingTopicInfoModal from './TrainingTopicInfoModal';

interface Props {
    topic?:TrainingTopic;
}

const TraningInfoHeader:FC<Props> = ({topic}) => {
    const isAdminRoute = route().current('training_info_system.admin');
    const label = topic?topic.title:`Training Information System ${isAdminRoute&&'Settings'}`;
    const [showModal,setShowModal] = useState(false);
    return (
        <>
            <div className='flex flex-col gap-y-2 md:gap-y-0 md:flex-row md:items-center md:justify-between'>
                <div className='flex flex-row items-center'>
                    <h1 className='text-2xl font-bold md:flex-1'>{label}</h1>
                    {!!topic&&(<Button onClick={()=>setShowModal(true)} variant='outline' size='icon' className='ml-2.5 opacity-50 hover:opacity-100 rounded-full'>
                        <SquarePenIcon className='h-5 w-5' />
                    </Button>)}
                </div>
                <div className='flex flex-row items-center gap-x-2.5 justify-between'>
                    {!topic?<Links />:(
                        <Button variant='outline' size='sm' onClick={()=>Inertia.get(route('training_info_system.admin'))}>
                            <LogOutIcon className='h-4 w-4 mr-2' />
                            Back to Training Topic Settings
                        </Button>
                    )}
                </div>
            </div>
            {!!topic && <TrainingTopicInfoModal isOpen={showModal} onClose={()=>setShowModal(false)} topic={topic} />}
        </>
    );
};

export default TraningInfoHeader;

const Links:FC = () =>{
    
    const isAdminRoute = route().current('training_info_system.admin');
    const href = isAdminRoute?route('training_info_system.index'):route('training_info_system.admin');    
    const Icon = isAdminRoute?LockIcon:LockOpenIcon;
    const {post} = useForm({});
    const onCreate = () => post(route('training_info_system.store'),{
        onSuccess:()=>toast.success('New Training Topic Created'),
        onError:()=>toast.error('Failed to create new training topic. Please try again')    
    });
    return (
        <>
            <Link href={href}>
                <Button variant='outline'  size='sm'>
                    <Icon className='h-4 w-4 mr-2' />
                    {isAdminRoute?'Exit':'Enter'} Admin Mode
                </Button>
            </Link>
            {isAdminRoute&&(<Button onClick={onCreate} variant='secondary' size='sm'>
                <Plus className='h-4 w-4 mr-2' />
                New Training Topic
            </Button>)}
        </>
    );
}