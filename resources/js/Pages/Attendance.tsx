import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { User } from '@/types';
import { Head } from '@inertiajs/inertia-react';
import axios from 'axios';
import { format } from 'date-fns';
import {ChangeEvent, FC, useEffect, useMemo, useState} from 'react';
import { useQuery, useQueryClient } from 'react-query';
import AttendanceHeader from './AttendanceComponents/AttendanceHeader';
import { Skeleton } from '@/Components/ui/skeleton';
import { AttendanceDataTable } from './AttendanceComponents/AttendanceDataTable';
import { AttendanceColumns } from './AttendanceComponents/AttendanceColumns';
import UpdateAttendanceModal from './AttendanceComponents/UpdateAttendanceModal';
import AttendanceDashboard from './AttendanceComponents/AttendanceDashboard';
import { useLocalStorage } from 'usehooks-ts';

const getAttendances = async (search:string) => axios.post(route('api.attendances'),{search}).then((res:{data:User[]}) => res.data);

interface Props {
    dt: string;
}

const Attendance:FC<Props> = ({dt}) => {
    const { isLoading, isError, data, error } =useQuery(['attendances',dt], ()=>getAttendances(dt),{refetchInterval: 120000});
    const [strFilter, setStrFilter] = useState<string>('');
    const [shiftFilter, setShiftFilter] = useState<string|undefined>();
    const [showDashboard,setShowDashboard] = useLocalStorage('showDashboard',false);
    const onInputChange = (e:ChangeEvent<HTMLInputElement>) => setStrFilter(e.target.value);
    
    const filteredEmployees = useMemo(()=>data?.filter((employee) => {
        if(strFilter === '') return true;
        return employee.company_id.toLowerCase().includes(strFilter.toLocaleLowerCase()) || employee.last_name.toLowerCase().includes(strFilter.toLowerCase());        
    }).filter(employee=>{
        if(shiftFilter === 'all') return true;
        if((shiftFilter && employee.shift_id) && employee.shift_id.toString() === shiftFilter) return true;
        if(shiftFilter === '0') return !employee.shift_id;
        if(!shiftFilter) return true;
    }),[data,strFilter,shiftFilter]);

    useEffect(() => setShowDashboard(false),[]);

    return (
        <>
            <Head title="Attendace" />
            <Layout title={`Daily Attendance - ${format(new Date(dt),'PP')}`}>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container py-2.5'>
                    
                    {
                        (isLoading || !data) && (
                            <div className='flex-1 flex flex-col gap-y-3.5'>
                                <div className='flex items-center gap-x-2'>
                                    <Skeleton className='h-9 rounded-lg w-96' />
                                    <Skeleton className='h-9 rounded-lg w-32 ml-auto' />
                                </div>                                
                                <Skeleton className='flex-1 rounded-lg' />
                                <Skeleton className='h-9 rounded-lg w-96' />
                            </div>
                        )
                    }
                    {!isLoading&&<AttendanceHeader showDashboard={showDashboard} showDashboardToggle={()=>setShowDashboard(val=>!val)} onInputChange={onInputChange} onShiftChange={e=>setShiftFilter(e)} strFilter={strFilter} shift={shiftFilter} />}
                    {
                        !isLoading  && filteredEmployees && !showDashboard && (
                            <div className='flex-1 overflow-y-hidden'>
                                <AttendanceDataTable columns={AttendanceColumns} data={filteredEmployees} />
                            </div>
                        )
                    }
                    {!isLoading  && data && showDashboard &&(
                        <div className='flex-1 overflow-y-hidden'>
                            <AttendanceDashboard loading={isLoading} dt={dt} users={data} />
                        </div>                    
                    )}
                </div>
            </Layout>
            <UpdateAttendanceModal />
        </>
    );
};

export default Attendance;

