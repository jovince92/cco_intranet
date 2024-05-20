import {FC, useEffect, useMemo, useRef} from 'react';
import Editor, { YooptaContentValue, createYooptaEditor } from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import axios from 'axios';
import { TrainingTopic, TrainingTopicVersion } from '@/types/trainingInfo';
import { toast } from 'sonner';
import { useQuery } from 'react-query';
import { Node, Scrubber } from 'slate';





interface Props {
    topic: TrainingTopic;
    onChange?: (val: string) => void;
    value?: string ;
    version: string;
}

const saveDraft = async (id:number,version:string,content:string|YooptaContentValue|undefined) => axios.post(route('training_info_system.save_draft',{id,version}),{content});

const YooptaEditor:FC<Props> = ({topic,onChange,value,version}) => {
        
    const plugins = [
        Paragraph,
        HeadingOne,
        HeadingTwo,
        HeadingThree,
        Blockquote,
        NumberedList,
        BulletedList,
        TodoList,
        Embed,
        Image.extend({
            options: {
                onUpload: async (file) => {
                    const data = await uploadImageToServer(file);
                    return {
                        src: data,
                        alt: 'iamge',
                        sizes: {
                            width: 320,
                            height: 240,
                        },
                    };
                },
            },
        }),
        Video.extend({
            options: {
                onUpload: async (file) => {
                    const data = await uploadVideoToServer(file);
                    return {
                        src: data,
                        alt: 'video',
                        sizes: {
                            width: 320,
                            height: 240,
                        },
                    };
                },
            },
        }),
        // File.extend({
        //     // options: {
        //     //     onUpload: async (file) => {
        //     //     const response = await uploadToCloudinary(file, 'auto');
        //     //     return { src: response.url };
        //     //     },
        //     // },
        // }),
    ];



    const TOOLS = {
        ActionMenu: {
            render: DefaultActionMenuRender,
            tool: ActionMenuList,
        },
        Toolbar: {
            render: DefaultToolbarRender,
            tool: Toolbar,
        },
    };

    const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

    
    const uploadVideoToServer = async (file:File) => {
        try {
            const formData = new FormData();
            formData.append('video', file);
            const response = await axios({
                method: 'post',
                url: route('training_info_system.upload_video',{id:topic.id}),
                data: formData,
            });
            return response.data;
        }catch(e){
            console.error(e);
            toast.error('Failed to upload video');
        }
    }

    const uploadImageToServer = async (file:File) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await axios({
                method: 'post',
                url: route('training_info_system.upload_image',{id:topic.id}),
                data: formData,
            });
            return response.data;
        }catch(e){
            console.error(e);
            toast.error('Failed to upload image');
        }
    }

    const editor = useMemo(() => createYooptaEditor(), []);
    const selectionRef = useRef(null);
    const { isLoading, isError, error } =useQuery(['save_draft',topic.id,version], ()=>saveDraft(topic.id,version!,editor.getEditorValue()),{refetchInterval: 5000});
    useEffect(() => {
        if (!onChange) return;
        const handleChange = (val:string) =>onChange(val);
        editor.on('change', handleChange);
        return () => editor.off('change', handleChange);
    }, [editor,onChange]);

    // useEffect(()=>{
    //     if(!value) return ;
    //     editor.setEditorValue(JSON.parse(JSON.stringify(value)));
    // },[editor,value]);

    const jsonValue = JSON.parse(JSON.stringify(value));    

    if (!value) return null;
    if (typeof jsonValue !== 'object') return null;
    console.log(typeof jsonValue);
    console.log(Object.keys(jsonValue).length);
    if (Object.keys(jsonValue).length === 0) return null;

    //turn the value into a list of elements
            

    if (!Node.isNodeList(jsonValue)) {
        throw new Error(
            `[Slate] initialValue is invalid! Expected a list of elements but got: ${Scrubber.stringify(
                value
            )}`
        )
    }

    return (
        <div
            className="container flex justify-center"
            ref={selectionRef}
            >
            <Editor
                className='mx-auto'
                editor={editor}
                //@ts-ignore
                value={jsonValue}
                //@ts-ignore
                plugins={plugins}
                tools={TOOLS}
                marks={MARKS}
                selectionBoxRoot={selectionRef}
                autoFocus
                placeholder='Start writing here...'
                
            />
            </div>
    );
};

export default YooptaEditor;
