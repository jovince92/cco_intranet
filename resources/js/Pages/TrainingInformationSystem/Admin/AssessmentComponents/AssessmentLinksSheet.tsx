import { Button } from '@/Components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/Components/ui/sheet';
import { TrainingAssessment } from '@/types/trainingInfo';
import {FC} from 'react';

interface Props {
    assessment:TrainingAssessment;
    isOpen:boolean;
    onClose:()=>void;
}

const AssessmentLinksSheet:FC<Props> = ({assessment,isOpen,onClose}) => {
    const {links} = assessment;
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='h-full max-h-screen'>
                <SheetHeader>
                    <SheetTitle>{assessment.title} Link</SheetTitle>
                    <SheetDescription>
                        Manage the links for the assessment
                    </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant='secondary'>Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default AssessmentLinksSheet;