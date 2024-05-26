import Layout from '@/Components/Layout/Layout';
import { Button } from '@/Components/ui/button';
import { Head, Link } from '@inertiajs/inertia-react';
import { LockOpenIcon, SlashIcon } from 'lucide-react';
import {FC} from 'react';
import TraningInfoHeader from './TrainingInformationSystem/TraningInfoHeader';
import { TrainingFolder, TrainingSubFolder, TrainingTopic } from '@/types/trainingInfo';
import MainFolderContainer from './TrainingInformationSystem/Admin/MainFolderContainer';
import SubFolderContainer from './TrainingInformationSystem/Admin/SubFolderContainer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/Components/ui/breadcrumb';

interface Props {
    main_folders?: TrainingFolder[];
    sub_folders?: TrainingSubFolder[];
    main_folder?: TrainingFolder;
    current_folder?: TrainingSubFolder;
}

const TrainingInformationSystemAdmin:FC<Props> = ({main_folders,sub_folders,main_folder,current_folder}) => {
    
    return (
        <>
            <Head title="Training Info System Admin" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container p-2.5'>
                    <TraningInfoHeader />

                    {(!!sub_folders&&!!main_folder)&&(
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={route('training_info_system.admin')}>Home</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={route('training_info_system.admin',{id:main_folder.id})}>{main_folder.name}</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                {!!current_folder?.parent&&<ParentBreadcrumb folder={current_folder.parent} main_folder={main_folder} />}
                                {!!current_folder&&(
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{current_folder.name}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    )}
                    {!!main_folders&&<MainFolderContainer main_folders={main_folders} />}
                    {(!!sub_folders&&!!main_folder)&&<SubFolderContainer mainFolder={main_folder} subFolders={sub_folders} />}
                </div>
            </Layout>
        </>
    );
};

export default TrainingInformationSystemAdmin;

interface HintPanelProps {
    folder:TrainingSubFolder;
    main_folder:TrainingFolder;
}
//recursive component 
const ParentBreadcrumb:FC<HintPanelProps> = ({folder,main_folder}) => {    
    return (
        <>
            {!!folder.parent&&<ParentBreadcrumb folder={folder.parent} main_folder={main_folder} />}
            <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href={route('training_info_system.admin',{id:main_folder.id,sub_folder_id:folder.id})}>{folder.name}</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
        </>
    );
}