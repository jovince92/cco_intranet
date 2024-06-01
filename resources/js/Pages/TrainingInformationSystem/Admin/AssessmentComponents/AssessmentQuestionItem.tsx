import { AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { TrainingAssessmentQuestion } from '@/types/trainingInfo';
import {FC} from 'react';
import QuestionYooptaEditor from './QuestionYooptaEditor';

interface Props {
    question:TrainingAssessmentQuestion;
    index:number;
}

const AssessmentQuestionItem:FC<Props> = ({question,index}) => {
    return (
        <AccordionItem value={question.id.toString()}>
            <AccordionTrigger className='text-sm'>
                Question #{(index+1).toString()}
            </AccordionTrigger>
            <AccordionContent>
                <QuestionYooptaEditor readonly question={question} />
            </AccordionContent>
        </AccordionItem>
    );
};

export default AssessmentQuestionItem;