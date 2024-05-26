import Hint from '@/Components/Hint';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { TrainingFolder, TrainingSubFolder, TrainingTopic } from '@/types/trainingInfo';
import { Inertia } from '@inertiajs/inertia';
import { format } from 'date-fns';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { FC } from 'react';


interface Props {
    folder?:TrainingSubFolder;
    topic?:TrainingTopic;
    onDelete: (folder:TrainingSubFolder) => void;
    onEdit: (folder:TrainingSubFolder) => void;
    mainFolder:TrainingFolder;
}

const SubFolderItem:FC<Props> = ({folder,onDelete,onEdit,topic,mainFolder}) => {
    const itemCount = (folder?.children.length||0) + (folder?.topics?.length||0);
    const folderImgHref = `${route('public_route')}/assets/${itemCount?'sub_folder':'sub_folder_empty'}.png`;
    const fileImgRef = `${route('public_route')}/assets/topic.png`;
    const label = topic?topic.title:folder?.name!;
    const navigate = () =>{
        if(!!folder) return Inertia.get(route('training_info_system.admin',{id:mainFolder.id,sub_folder_id:folder.id}))
    }
    return (
        <Hint label={<HintPanel folder={folder} onTopicDelete={()=>{}} onTopicEdit={()=>{}} onFolderDelete={()=>{}} onFolderEdit={()=>{}} itemCount={itemCount} />} side='right' >
            <div onClick={navigate} role='button' className='group flex h-36 hover:bg-muted-foreground/10 transition duration-300 w-auto rounded-lg items-center justify-center relative'>
                <div className='flex flex-row items-center gap-x-2.5 '>
                    <div className='flex flex-col gap-y-1'>
                        <img className='h-24 w-[5.5rem]' src={folder?folderImgHref:fileImgRef} alt="FPO" />
                        <Label className='text-center text-xs'>
                            {/* truncante the folder.name if too long */}
                            {label.length>8?label.slice(0,8)+'...':label}
                        </Label>
                    </div>
                </div>                
            </div>
        </Hint>
    )
}

export default SubFolderItem;



interface HintPanelProps {
    topic?:TrainingTopic;
    folder?:TrainingSubFolder;
    onTopicDelete: () => void;
    onTopicEdit: () => void;
    onFolderDelete: () => void;
    onFolderEdit: () => void;
    itemCount:number;
}

const HintPanel:FC<HintPanelProps> = ({folder,topic,itemCount,onTopicDelete,onTopicEdit,onFolderDelete,onFolderEdit}) =>{
    const label = topic?topic.title:folder?.name;
    const creator = topic?topic.user:folder?.user;
    const createDate = format(new Date(topic?topic.created_at:folder?.created_at!),'Ppp');
    return (
        <div className='flex flex-col gap-y-1 text-xs'>
            <p>
                <span className='font-bold truncate'>{label}</span>
                {folder&&folder.children.length===0&&<span className='italic text-muted-foreground'>&nbsp;(empty)</span>}
            </p>
            <p>{`Created By: ${creator?.first_name} ${creator?.last_name}`} </p>
            <p>{`Created On: ${createDate}`}</p>
            <Separator />
            {topic&&(
                <>
                    <p className='font-semibold'>Version/s:</p>
                    <div className='gap-1 grid grid-cols-2'>
                        {topic.versions.map(ver=><p key={ver.id} className='text-xs'>{ver.version}</p>)}
                    </div>
                </>
            )}
            <Separator />
            <p className='text-center'>{`${itemCount} items`}</p>
            <Separator />
            <div className='flex flex-row'>
                <Button onClick={()=>{}} className='w-1/2 text-xs' variant='ghost' size='sm' ><PencilIcon className='h-4 w-4 mr-2' />Edit</Button>
                <Button onClick={()=>{}} className='w-1/2 text-xs' variant='ghost' size='sm' ><Trash2Icon className='h-4 w-4 mr-2' />Delete</Button>
            </div>
        </div>
    );
}