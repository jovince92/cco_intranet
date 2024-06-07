import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { cn } from '@/lib/utils';
import { TrainingAssessment, TrainingAssessmentQuestion, TrainingFolder } from '@/types/trainingInfo';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2, Plus, PlusCircleIcon } from 'lucide-react';
import {FC, useState} from 'react';
import { toast } from 'sonner';
import QuestionYooptaEditor from './QuestionYooptaEditor';
import AssessmentQuestionItem from './AssessmentQuestionItem';
import AssessmentQuestionModal from './AssessmentQuestionModal';

interface Props {
    assessment:TrainingAssessment;
    main_folder:TrainingFolder;
}

const AssessmentEdit:FC<Props> = ({assessment,main_folder}) => {
    const {post,processing} = useForm({training_assessment_id:assessment.id});
    const [editQuestion,setEditQuestion] = useState<TrainingAssessmentQuestion|undefined>(undefined);
    const {questions} = assessment;
    const AddNewIcon = !processing? PlusCircleIcon:Loader2;
    const onAdd = () =>{
        post(route('assessment.questions.store'),{
            onError:()=>toast.error('An error occurred while adding question. Please try again.'),
        });
    }
    return (
        <>
            <div className='flex-1 flex flex-col gap-y-2.5 overflow-y-auto relative'>
                <div className='flex flex-col gap-y-1.5 md:gap-y-0 md:flex-row md:items-center md:gap-x-3.5'>
                    <div className='space-y-1 md:flex-1'>
                        <Label>Assessment Title</Label>
                        <Input placeholder='Assessment Title' />
                    </div>
                    <div className='flex items-center gap-x-1.5'>
                        <div className='space-y-1'>                        
                            <Label>Max Score</Label>
                            <Input readOnly placeholder='Assessment Title' />
                        </div>
                        <div className='space-y-1'>
                            <Label>Passing Score</Label>
                            <Input placeholder='Assessment Title' />
                        </div>
                    </div>
                    <Button className='size-sm md:mt-auto'>
                        Save Changes
                    </Button>
                </div>
                <div className='flex-1 overflow-y-auto'>
                    <div className='flex items-center gap-x-1.5'>
                        <h3 className='text-xl font-semibold tracking-wide'>
                            Questions
                        </h3>
                        <Button disabled={processing} onClick={onAdd} variant='secondary' className='rounded-full' size='icon'>
                            <span className='sr-only'>Add Question</span>
                            <AddNewIcon className={cn('h-6 w-6',processing&&'animate-spin')} />
                        </Button>
                    </div>
                    {(questions?.length||0)===0 && <p className='pt-8 font-semibold text-lg tracking-wide text-center'>No Questions for this Assessment...</p>}
                    {!!questions&&(
                        <Accordion type="single" collapsible className="w-full ">                    
                            {(questions||[]).map((question,idx)=> <AssessmentQuestionItem onEdit={()=>setEditQuestion(question)} key={question.id} question={question} index={idx} />)}                        
                        </Accordion>
                    )}
                </div>
            </div>
            {!!editQuestion&&<AssessmentQuestionModal question={editQuestion} isOpen={!!editQuestion} onClose={()=>setEditQuestion(undefined)} />}
        </>
    );
};

export default AssessmentEdit;