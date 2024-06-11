import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { TrainingAssessmentResult, TrainingAssessmentResultAnswer } from '@/types/trainingInfo';
import {ChangeEventHandler, FC, useMemo, useRef} from 'react';
import QuestionYooptaEditor from '../QuestionYooptaEditor';

import Editor,{ createYooptaEditor, YooptaPlugin } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Video from '@yoopta/video';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import { Bold ,Italic, CodeMark, Underline, Strike, Highlight} from '@yoopta/marks';
import { Label } from '@/Components/ui/label';
import { Accordion, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { ChevronsUpDownIcon } from 'lucide-react';
import { AccordionContent } from '@radix-ui/react-accordion';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';
import { Textarea } from '@/Components/ui/textarea';
import { useForm } from '@inertiajs/inertia-react';
import { toast } from 'sonner';

interface Props {
    result:TrainingAssessmentResult;
    isOpen:boolean;
    onClose:()=>void
}

const ManualCheckModal:FC<Props> = ({isOpen,result,onClose}) => {
    
    const {answers} = result;
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[1024px] max-h-screen flex flex-col">
                <DialogHeader className='h-auto'>
                    <DialogTitle>{result.assessment.title}</DialogTitle>
                    <DialogDescription>
                        Manual Check Assessment for {result.user.company_id}, {result.user.first_name} {result.user.last_name}
                    </DialogDescription>
                </DialogHeader>
                <div className='flex-1 flex flex-col gap-y-3.5 overflow-y-auto'>
                    <Accordion type="single" collapsible className="w-full ">                    
                        {answers.map((a,idx)=> <AssessmentAnswerItem questionNo={(idx+1).toString()} answer={a}   />)}                        
                    </Accordion>
                </div>
                <DialogFooter className='h-auto'>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ManualCheckModal;

interface AssessmentAnswerItemProps {
    answer:TrainingAssessmentResultAnswer;
    questionNo:string
}

const AssessmentAnswerItem:FC<AssessmentAnswerItemProps> = ({answer,questionNo}) => {

    const {data,setData,processing,post} = useForm({
        result_id:answer.training_assessment_result_id,
        result_answer_id:answer.id,
        score:answer.score
    });

    const onPointChange:ChangeEventHandler<HTMLInputElement> = ({target}) => {
        //return if target.value is not a number
        if(isNaN(parseInt(target.value))) return;
        //set to 0 if target.value is less than 0 or blank
        if(parseInt(target.value)<0 || target.value==='') target.value = '0';
        if(parseInt(target.value)>answer.points) return toast.error('Score cannot be greater than the question points');
        setData('score',parseInt(target.value));
    }

    return (
        <AccordionItem value={answer.id.toString()}>
            <AccordionTrigger asChild>
                <div role='button' className='w-full h-10 px-4 py-2 bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors'>
                    <p className='w-1/2 text-right'>
                        Question #{questionNo}&nbsp;
                        {answer.needs_manual_check===1&&(
                            <span className='italic text-xs text-muted-foreground'>
                                - Needs manual check
                            </span>)
                        }
                    </p>
                    <ChevronsUpDownIcon className='mr-auto h-3.5 w-3.5 ml-2.5 stroke-[3.5px]' />
                </div>
            </AccordionTrigger>
            <AccordionContent asChild>
                <div className='py-3.5 flex flex-col gap-y-1.5 md:flex-row md:gap-y-0 md:gap-x-1 md:items-stretch'>
                    
                    <div className={cn('space-y-2.5 w-full border rounded p-2.5 flex gap-x-1',(answer.question_type===5 || answer.question_type===4),'flex-col gap-x-0')}>
                        <div className='space-y-1 flex-1'>
                            <div className='flex items-center justify-between'>
                                <Label className='text-muted-foreground'>Question:</Label>
                                <div className='space-y-1'>
                                    <Label>User Score:</Label>
                                    <Input className='w-[4.5rem] !ring-0 !ring-offset-0' value={answer.score||'0'} onChange={onPointChange} />
                                </div>
                            </div>                         
                            <QuestionView question={answer.question} id={answer.id} />                            
                        </div>
                        <div className='space-y-1'>
                            {(answer.question_type===1||answer.question_type===3) && (
                                <>
                                    <div className='space-y-1'>
                                        <Label className='text-muted-foreground'>User Answer:</Label>
                                        <Input className='!ring-0 !ring-offset-0' value={answer.user_answer} readOnly />
                                    </div>
                                    <div className='space-y-1'>
                                        <Label className='text-muted-foreground'>Correct Answer:</Label>
                                        <Input className='!ring-0 !ring-offset-0' value={answer.correct_answer} readOnly />
                                    </div>
                                </>
                            )}
                            {(answer.question_type===5) && (
                                <div className='space-y-1'>
                                    <Label>User Answer</Label>
                                    <Textarea readOnly value={answer.user_answer} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};




const QuestionView:FC<{question:string|object,id:number}> = ({question,id}) => {
    const plugins = [
        Paragraph,
        HeadingOne,
        HeadingTwo,
        HeadingThree,
        NumberedList,
        BulletedList,
        TodoList,
        Embed,
        Image,
        Video
    ] as YooptaPlugin[];
    
    const selectionRef = useRef(null);
    
    const editor = useMemo(() => createYooptaEditor(), []);
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
    return (
        <Editor
            plugins={plugins}
            className='mx-auto w-full'
            editor={editor}
            //@ts-ignore
            value={typeof question === 'string'?JSON.parse(question):question}
            //autoFocus
            //placeholder='Start writing here...'
            readOnly
            key={id}                            
            selectionBoxRoot={selectionRef}
            tools={TOOLS}
            marks={MARKS}
        /> 
    )
}
