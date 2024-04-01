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

interface Props {
    dt: string;
}

const Attendance:FC<Props> = ({dt}) => {
    const { isLoading, isError, data, error } =useQuery(['attendances',dt], ()=>getAttendances(dt),{refetchInterval: 120000});
    const [strFilter, setStrFilter] = useState<string>('');
    const [shiftFilter, setShiftFilter] = useState<string|undefined>();
    const onInputChange = (e:ChangeEvent<HTMLInputElement>) => setStrFilter(e.target.value);
    
    const filteredEmployees = useMemo(()=>data?.filter((employee) => {
        if(strFilter === '') return true;
        return employee.company_id.toLowerCase().includes(strFilter.toLocaleLowerCase()) || employee.last_name.toLowerCase().includes(strFilter.toLowerCase());        
    }).filter(employee=>{
        if((shiftFilter && employee.shift_id) && employee.shift_id.toString() === shiftFilter) return true;
        if(shiftFilter === '0') return !employee.shift_id;
        if(!shiftFilter) return true;
    }),[data,strFilter,shiftFilter]);

    return (
        <>
            <Head title="Attendace" />
            <Layout title='Daily Attendance'>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container py-2.5'>
                    
                    {
                        isLoading && (
                            <div className='flex-1 flex flex-col gap-y-3.5'>
                                <Skeleton className='h-9 rounded-lg' />
                                <Skeleton className='flex-1 rounded-lg' />
                                <Skeleton className='h-9 rounded-lg' />
                            </div>
                        )
                    }
                    {!isLoading&&<AttendanceHeader onInputChange={onInputChange} onShiftChange={e=>setShiftFilter(e)} strFilter={strFilter} shift={shiftFilter} />}
                    {
                        !isLoading  && filteredEmployees && (
                            <div className='flex-1 overflow-y-hidden'>
                                <AttendanceDataTable columns={AttendanceColumns} data={filteredEmployees} />
                            </div>
                        )
                    }
                </div>
            </Layout>
        </>
    );
};

export default Attendance;

const getAttendances = async (search:string) => axios.post(route('api.attendances'),{search}).then((res:{data:User[]}) => res.data);