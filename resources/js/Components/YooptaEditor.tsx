import {FC, useEffect, useMemo, useRef, useState} from 'react';
import Editor, { YooptaContentValue, YooptaPlugin, createYooptaEditor } from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Video from '@yoopta/video';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import axios from 'axios';
import { TrainingTopic, TrainingTopicVersion } from '@/types/trainingInfo';
import { toast } from 'sonner';
import { useQuery } from 'react-query';





interface Props {
    topic: TrainingTopic;
    onChange?: (val: string) => void;
    value?: string ;
    version: string;
}

const YooptaEditor:FC<Props> = ({topic,onChange,value,version}) => {
    
    

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    const editor = useMemo(() => createYooptaEditor(), []);
    // const editorRef = useRef(createYooptaEditor())
    // const editor = editorRef.current
    const saveDraft = async (id:number,version:string,content:string|YooptaContentValue|undefined) => {
        if(!isMounted) return;
        if(!editor) return;
        if(!content) return;
        //replace all instances of null with empty string
        //@ts-ignore
        const updatedContent = JSON.stringify(content).replace(/null/g,'""');
        return axios.post(route('training_info_system.save_draft',{id,version}),{content:JSON.parse(updatedContent)})
    };
    const selectionRef = useRef(null);
    const plugins = [
        Paragraph,
        HeadingOne,
        HeadingTwo,
        HeadingThree,
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
    ] as YooptaPlugin[];



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
    const { isLoading, isError, error,refetch } =useQuery(['save_draft',topic.id,version], ()=>saveDraft(topic.id,version!,editor.getEditorValue()),{refetchInterval: 10000});
    useEffect(() => {
        function handleChange(value:string) {
            onChange && onChange(value);
        }
        editor.on('change', ()=>{
            handleChange(value||"");
            refetch();
        });
        return () => {
            editor.off('change', handleChange);
        };
    }, [editor,onChange]);
    // useEffect(()=>{
    //     console.log(['value',JSON.parse(JSON.stringify(value))]);
    //     if(value && editor && isMounted){
    //         editor.setEditorValue(JSON.parse(JSON.stringify(value)) as YooptaContentValue );
    //     }
    // },[editor,value,isMounted]);
    
    //console.log(value);
    
    
    
    // const removeDoubleQoutesFromJson = (json:string) => {
    //     /*
    //         find all instance of:
    //         "id",
    //         "value",
    //         "type",
    //         "meta",
    //         "props",
    //         "children",
    //         "nodeType",
    //         "order",
    //         "depth"
    //         and remove double quotes
    //     */
    //     return json.replace(/"id"/g,'id')
    //     .replace(/"value"/g,'value')
    //     .replace(/"type"/g,'type')
    //     .replace(/"meta"/g,'meta')
    //     .replace(/"props"/g,'props')
    //     .replace(/"children"/g,'children')
    //     .replace(/"nodeType"/g,'nodeType')
    //     .replace(/"order"/g,'order')
    //     .replace(/"depth"/g,'depth');
    // }

    // console.log(value&&['value',removeDoubleQoutesFromJson(value)]);
    
    
    return (
        <div
            className="container flex justify-center p-2.5"
            ref={selectionRef}
            >
            { (isMounted&&editor)&&   <Editor
                    className='!mx-auto !border-border !rounded'
                    editor={editor}
                    //@ts-ignore
                    value={value?JSON.parse(JSON.stringify(value)):undefined}
                    plugins={plugins}
                    tools={TOOLS}
                    marks={MARKS}
                    selectionBoxRoot={selectionRef}
                    autoFocus
                    placeholder='Start writing here...'
                    
                />}
            </div>
    );
};

export default YooptaEditor;

export const WITH_BASIC_INIT_VALUE = {
    '9d98408d-b990-4ffc-a1d7-387084291b00': {
        id: '9d98408d-b990-4ffc-a1d7-387084291b00',
        value: [
            {
                id: '0508777e-52a4-4168-87a0-bc7661e57aab',
                type: 'heading-one',
                children: [
                    {
                    text: 'Example with full setup of Yoopta-Editor',
                    },
                ],
                props: {
                    nodeType: 'block',
                },
            },
        ],
        type: 'HeadingOne',
        meta: {
            order: 0,
            depth: 0,
        },
    },
};

const sample = {"82bffe2e-520a-410a-93ec-e0eab6c93b09":{"id":"82bffe2e-520a-410a-93ec-e0eab6c93b09","value":[{"id":"11a957e6-7bc5-4139-99f8-0296b3fcb838","type":"paragraph","children":[{"text":"a"}],"props":{"nodeType":"block"}}],"type":"Paragraph","meta":{"order":0,"depth":0}},"23b6a387-46a1-4d1c-acc1-f62af663174d":{"id":"23b6a387-46a1-4d1c-acc1-f62af663174d","value":[{"id":"e66f4cbd-3239-494d-aef4-03d25401da6b","type":"paragraph","children":[{"text":null}],"props":{"nodeType":"block"}}],"type":"Paragraph","meta":{"order":1,"depth":0}}}


