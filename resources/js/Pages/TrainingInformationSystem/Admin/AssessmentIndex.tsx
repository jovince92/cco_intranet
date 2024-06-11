import Layout from '@/Components/Layout/Layout';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { TrainingAssessment, TrainingAssessmentResult } from '@/types/trainingInfo';
import { Head } from '@inertiajs/inertia-react';
import {FC, useState} from 'react';
import AssessmentIndexItem from './AssessmentComponents/AssessmentIndex/AssessmentIndexItem';
import ManualCheckModal from './AssessmentComponents/AssessmentIndex/ManualCheckModal';

interface Props {
    results:TrainingAssessmentResult[];
}

const AssessmentIndex:FC<Props> = ({results}) => {
    const [manualCheck,setManualCheck] = useState<TrainingAssessmentResult|undefined>();
    return (
        <>
            <Head title='Assessments' />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5 items-center justify-center'>
                    <div className='h-auto'>
                        TODO: Filters
                    </div>
                    <div className='flex-1'>
                        <Table >
                            <TableHeader className='sticky top-0 z-50 bg-background'>
                                <TableRow className=' z-50 text-sm'>
                                    <TableHead>Agent</TableHead>                                    
                                    <TableHead>Assessment Title</TableHead>
                                    <TableHead>Max Score</TableHead>
                                    <TableHead>Passing Score</TableHead>
                                    <TableHead>Agent Score</TableHead>
                                    <TableHead>Manual Checked By</TableHead>
                                    <TableHead>Date Taken</TableHead>
                                    <TableHead>Remarks</TableHead>
                                    <TableHead> Actions </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className='z-40'>
                                {
                                    results.map((r)=><AssessmentIndexItem onManualCheck={()=>setManualCheck(r)} key={r.id} result={r} />)
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Layout>
            {!!manualCheck && <ManualCheckModal result={manualCheck} isOpen={!!manualCheck} onClose={()=>setManualCheck(undefined)} />}
        </>
    );
};

export default AssessmentIndex;