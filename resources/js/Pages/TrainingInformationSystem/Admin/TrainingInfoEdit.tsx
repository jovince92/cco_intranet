import Layout from '@/Components/Layout/Layout';
import { TrainingTopic } from '@/types/trainingInfo';
import { Head, useForm } from '@inertiajs/inertia-react';
import {FC, useEffect, useMemo} from 'react';
import Editor from '@/Components/Editor';
import QuillEditor, { QuillMedia } from '../../../Components/QuillEditor';
import { Button } from '@/Components/ui/button';
import TraningInfoHeader from '../TraningInfoHeader';
import YooptaEditor from '@/Components/YooptaEditor';
import { YooptaContentValue } from '@yoopta/editor';
import axios from 'axios';
import { useQuery } from 'react-query';

interface Props {
    topic:TrainingTopic;
    version:string;
}

const saveDraft = async (id:number,version:string,content:string|YooptaContentValue|undefined) => axios.post(route('training_info_system.save_draft',{id,version}),{content});

const TrainingInfoEdit:FC<Props> = ({topic,version}) => {
    const {current_version} = topic;
    const {data,setData,processing,reset,post} = useForm({content:current_version?.content});
    //useEffect(()=>setData('content',parsedContent),[parsedContent]);

    
    const selectedVersion = useMemo(()=>topic.versions.find(v=>v.version === version),[version,topic]);
    //const { isLoading, isError, error } =useQuery(['save_draft',topic.id,current_version?.version], ()=>saveDraft(topic.id,current_version?.version!,data.content),{refetchInterval: 5000});


    //useEffect(()=>console.log(data.content),[data.content]);
    

    
    
    return (
        <>
            <Head title={topic.title} />
            <Layout >
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container p-2.5'>
                    <TraningInfoHeader topic={topic} />
                    <div className='flex-1 overflow-y-auto'>
                        <YooptaEditor onChange={(e)=>setData('content',e)} topic={topic} value={data.content} version={version} />
                        {/* <QuillEditor onVideoInsert={onVideoInsert} onImageInsert={onImageInsert} value={data.content} onChange={onChange} /> */}
                    </div>
                    <div className='flex items-center justify-end'>
                        <Button>Save Changes</Button>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default TrainingInfoEdit;