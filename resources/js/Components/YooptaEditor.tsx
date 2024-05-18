import {FC, useEffect, useMemo, useRef} from 'react';
import Editor, { createYooptaEditor } from '@yoopta/editor';

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
import { TrainingTopic } from '@/types/trainingInfo';
import { toast } from 'sonner';





interface Props {
    topic: TrainingTopic;
    onChange?: (val: string) => void;
}
const YooptaEditor:FC<Props> = ({topic,onChange}) => {
        
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
    useEffect(() => {
        if (!onChange) return;
        const handleChange = (val:string) =>onChange(val);
        editor.on('change', handleChange);
        return () => editor.off('change', handleChange);
    }, [editor,onChange]);
    return (
        <div
            className="md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center"
            ref={selectionRef}
            >
            <Editor
                editor={editor}
                //@ts-ignore
                plugins={plugins}
                tools={TOOLS}
                marks={MARKS}
                selectionBoxRoot={selectionRef}
                autoFocus
                
                
            />
            </div>
    );
};

export default YooptaEditor;