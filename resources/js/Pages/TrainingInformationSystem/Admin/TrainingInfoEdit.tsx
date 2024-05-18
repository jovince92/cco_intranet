import Layout from '@/Components/Layout/Layout';
import { TrainingTopic } from '@/types/trainingInfo';
import { Head, useForm } from '@inertiajs/inertia-react';
import {FC, useEffect} from 'react';
import Editor from '@/Components/Editor';
import QuillEditor, { QuillMedia } from '../../../Components/QuillEditor';
import { Button } from '@/Components/ui/button';
import TraningInfoHeader from '../TraningInfoHeader';
import YooptaEditor from '@/Components/YooptaEditor';

interface Props {
    topic:TrainingTopic;
}

const TrainingInfoEdit:FC<Props> = ({topic}) => {
    const onChange = (val:string) => setData('content',val);
    const {current_version} = topic;
    const {data,setData,processing,reset,post} = useForm({content:""});
    
    useEffect(()=>setData('content',current_version?.content||""),[current_version]);

    useEffect(()=>console.log(data.content),[data.content]);
    
    return (
        <>
            <Head title={topic.title} />
            <Layout >
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container p-2.5'>
                    <TraningInfoHeader topic={topic} />
                    <div className='flex-1 overflow-y-auto'>
                        <YooptaEditor onChange={e=>setData('content',e)} topic={topic} />
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