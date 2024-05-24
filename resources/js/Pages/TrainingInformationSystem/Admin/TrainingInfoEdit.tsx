import Layout from '@/Components/Layout/Layout';
import { TrainingTopic, TrainingTopicVersion } from '@/types/trainingInfo';
import { Head, useForm } from '@inertiajs/inertia-react';
import {FC, FormEventHandler, useEffect, useMemo, useState, version} from 'react';
import Editor from '@/Components/Editor';
import QuillEditor, { QuillMedia } from '../../../Components/QuillEditor';
import { Button } from '@/Components/ui/button';
import TraningInfoHeader from '../TraningInfoHeader';
import YooptaEditor from '@/Components/YooptaEditor';
import { YooptaContentValue } from '@yoopta/editor';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { GitPullRequestArrow, Loader2, SaveAllIcon } from 'lucide-react';
import { toast } from 'sonner';
import VersionHistoryModal from './VersionHistoryModal';

interface Props {
    topic:TrainingTopic;
    version:string;
}

const saveDraft = async (id:number,version:string,content:string|YooptaContentValue|undefined) => axios.post(route('training_info_system.save_draft',{id,version}),{content});

const TrainingInfoEdit:FC<Props> = ({topic,version}) => {
    const [showSaveModa,setShowSaveModal] = useState(false);
    const [showVersionHistoryModal,setShowVersionHistoryModal] = useState(false);
    const {current_version} = topic;
    const {data,setData,processing,reset,post} = useForm({content:current_version?.content});
    //useEffect(()=>setData('content',parsedContent),[parsedContent]);

    
    const selectedVersion = useMemo(()=>topic.versions.find(v=>v.version === version),[version,topic]);
    //const { isLoading, isError, error } =useQuery(['save_draft',topic.id,current_version?.version], ()=>saveDraft(topic.id,current_version?.version!,data.content),{refetchInterval: 5000});


    useEffect(()=>console.log(data.content),[data.content]);
    

    
    
    return (
        <>
            <Head title={topic.title} />
            <Layout >
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container p-2.5'>
                    <TraningInfoHeader topic={topic} />
                    <div className='flex flex-row items-center justify-between'>
                        <p className='text-sm text-muted-foreground'>{`You are editing version: ${selectedVersion?.version}`}</p>
                        <Button onClick={()=>setShowVersionHistoryModal(true)} size='sm' variant='secondary'>
                            <GitPullRequestArrow className='h-4 w-4 mr-2' />
                            Version History
                        </Button>
                    </div>
                    <div className='flex-1 overflow-y-auto'>
                        {!!selectedVersion&&<YooptaEditor onChange={(e)=>setData('content',e)} topic={topic} value={selectedVersion.content} version={selectedVersion.version!} />}
                        {/* <QuillEditor onVideoInsert={onVideoInsert} onImageInsert={onImageInsert} value={data.content} onChange={onChange} /> */}
                    </div>
                    <div className='flex items-center justify-end'>
                        <Button onClick={()=>setShowSaveModal(true)}>
                            <SaveAllIcon className='w-5 h-5 mr-2' />
                            Save as new Version
                        </Button>
                    </div>
                </div>
            </Layout>
            {current_version&&<SaveModal versions = {topic.versions} isOpen={showSaveModa} onClose={()=>setShowSaveModal(false)} version={current_version} content={data.content}/>}
            <VersionHistoryModal isOpen={showVersionHistoryModal} onClose={()=>setShowVersionHistoryModal(false)} topic={topic} />
        </>
    );
};

export default TrainingInfoEdit;

interface SaveModalProps{
    isOpen:boolean;
    onClose:()=>void;
    version:TrainingTopicVersion;
    content:string|YooptaContentValue|undefined;
    versions:TrainingTopicVersion[];
}

const SaveModal:FC<SaveModalProps> = ({isOpen,onClose,version,content,versions}) =>{
    const {data,setData,processing,post} = useForm<{version:string,content:string|undefined|YooptaContentValue}>({version:'',content:undefined});

    const onSubmit:FormEventHandler<HTMLFormElement> = e =>{
        e.preventDefault();
        if(data.version === version.version){
            toast.error('Version name must be different from the current version.');
            return;
        }

        if(versions.find(v=>v.version === data.version)){
            toast.error('Version name already exists.');
            return;
        }

        post(route('training_info_system.save_as_new',{id:version.training_topic_id}),{
            preserveScroll: true,
            preserveState:false,
            onSuccess:()=>{
                toast.success('New version saved successfully.')
                onClose();
            },
            onError:()=>toast.error('An error occurred. Please try again later.')
        })
    }

    useEffect(()=>{
        if(isOpen){
            setData(val=>({
                ...val,
                version:version.version||'0.1',
                content:content? JSON.parse(JSON.stringify(content)):undefined
            }));
        }
    },[isOpen,version,content]);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Save Topic Content</DialogTitle>
                    <DialogDescription>
                        Save as new version.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} id='save_as' className='flex flex-col gap-y-1.5'>
                    <div className='space-y-1'>
                        <Label>Version Name</Label>
                        <Input required disabled={processing} value={data.version} onChange={({target})=>setData('version',target.value)} autoFocus />
                    </div>
                </form>
                <DialogFooter>
                    <Button form='save_as' disabled={processing}>
                        {processing && <Loader2 className='w-5 h-5 mr-2 animate-spin' />}
                        Save as new version
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}