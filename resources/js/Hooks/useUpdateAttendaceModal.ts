

import { User, UserAttendance } from '@/types';
import {create} from 'zustand';

type data = {
    user_attendance?:UserAttendance;
    user?:User;
}

type Props = {
    isOpen?:boolean;
    onOpen:(data:data)=>void;
    onClose:()=>void;
    data?:data;
}

export const useUpdateAttendaceModal = create<Props>((set)=>({
    data:undefined,
    isOpen:false,
    onOpen:(data)=>set({isOpen:true,data}),
    onClose:()=>set({isOpen:false,data:undefined}),
}));