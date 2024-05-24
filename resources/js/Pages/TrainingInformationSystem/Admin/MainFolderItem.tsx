import Hint from '@/Components/Hint';
import { Label } from '@/Components/ui/label';
import { TrainingFolder } from '@/types/trainingInfo';
import { format } from 'date-fns';
import { FolderIcon, FolderOpenIcon } from 'lucide-react';
import {FC, ReactNode} from 'react';

interface Props {
    folder:TrainingFolder;
}

const MainFolderItem:FC<Props> = ({folder}) => {
    const imgHref = `${route('public_route')}/assets/${folder.sub_folder_count!==0?'folder':'folder_empty'}.png`
    return (
        <Hint label={<HintPanel folder={folder} />} side='right'>
            <div role='button' className='group flex flex-col h-36 hover:bg-muted-foreground/10 transition duration-300 w-auto rounded-lg items-center justify-center'>
                <div className='flex flex-row items-center gap-x-2.5 '>
                    <div className='flex flex-col gap-y-1'>
                        <img className='h-24 w-[5.5rem]' src={imgHref} alt="FPO" />
                        <Label className='text-center text-xs'>
                            {/* truncante the folder.name if too long */}
                            {folder.name.length>8?folder.name.slice(0,8)+'...':folder.name}
                        </Label>
                    </div>
                </div>
            </div>
        </Hint>
    );
};

export default MainFolderItem;



const HintPanel:FC<{folder:TrainingFolder}> = ({folder}) =>{
    
    return (
        <div className='flex flex-col gap-y-1 text-xs'>
            <p>
                {folder.name}
                {folder.sub_folder_count===0&&<span className='italic text-muted-foreground'>&nbsp;(empty)</span>}
            </p>
            <p>{`Created By: ${folder.user.first_name} ${folder.user.last_name}`} </p>
            <p>{`Created On: ${format(new Date(folder.created_at),'Ppp')}`}</p>
            <p>Project/s:</p>
            <div className='flex flex-col gap-y-1'>
                {folder.projects.map(project=><p key={project.id} className='text-xs'>{project.name}</p>)}
            </div>
            <p className='text-center'>{`${folder.sub_folder_count.toString()} items`}</p>
        </div>
    );
}