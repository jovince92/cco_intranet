import { Button } from '@/Components/ui/button';
import { TrainingFolder, TrainingSubFolder, TrainingTopic } from '@/types/trainingInfo';
import { SortingState } from '@tanstack/react-table';
import { FilePlus2, FolderPlusIcon, SlashIcon, XIcon } from 'lucide-react';
import {FC, useMemo, useState} from 'react';
import { SortState, sortStates } from './MainFolderContainer';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import SubFolderItem from './SubFolderItem';

interface Props {
    subFolders:TrainingSubFolder[];
    mainFolder:TrainingFolder;
    topics?:TrainingTopic[];
}

const SubFolderContainer:FC<Props> = ({subFolders,mainFolder,topics}) => {
    
    const [nameFilter, setNameFilter] = useState('');
    const [sortBy, setSortBy] = useState<SortState>('name');
    
    return (
        <div className='flex-1 flex flex-col gap-y-2.5 overflow-y-auto relative'>
            <div className='flex flex-col gap-y-1.5 md:gap-y-0 md:flex-row md:gap-x-3.5 h-auto md:items-center sticky top-0 bg-background z-50'>
                <Button onClick={()=>{}} variant='secondary'>
                    <FolderPlusIcon className='h-6 w-6 mr-2' />
                    New Folder
                </Button>
                <Button onClick={()=>{}} variant='secondary'>
                    <FilePlus2 className='h-6 w-6 mr-2' />
                    New Topic
                </Button>
                <Select value={sortBy} onValueChange={(state)=>setSortBy(state as SortState)}>
                    <SelectTrigger className="md:w-32 w-auto !ring-0 !ring-offset-0">
                        <SelectValue placeholder="Sort By:" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort By:</SelectLabel>
                            {sortStates.map(state=><SelectItem value={state} key={state} > <span className='capitalize'>{`${ state==='user'?'Created By':state==='date'?'Create Date':'Name'}`}</span></SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className='flex flex-row items-center'>
                    <Input value={nameFilter} onChange={e=>setNameFilter(e.target.value)} className='!ring-0 !ring-offset-0 rounded-r-none' placeholder="Filter by Folder Name" />
                    <Button disabled={!nameFilter} onClick={()=>setNameFilter('')} variant='outline' className='rounded-l-none border-l-0'>
                        <XIcon className='h-6 w-6' />
                    </Button>                    
                </div>
            </div>
            <div className='flex-1 bg-secondary rounded'>
                <div className='overflow-y-auto  grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 gap-3.5'>
                    {subFolders.map(folder=> <SubFolderItem mainFolder={mainFolder} onDelete={f=>{}} onEdit={f=>{}} key={folder.id} folder={folder}  />)}
                    {(topics||[]).map(topic=> <SubFolderItem mainFolder={mainFolder} onDelete={f=>{}} onEdit={f=>{}} key={topic.id} topic={topic}  />)}
                </div>
            </div>
        </div>
    );
};

export default SubFolderContainer;