
import ziggy from 'ziggy-js'

export interface User {
    id: number;
    first_name: string;
    company_id:string;
    last_name: string;
    position: string;
    email?:string;
    photo?:string;
    departiment:string;
}

export interface TimeStamp{
    created_at:string;
    updated_at:string;
}
interface Announcement extends TimeStamp{
    id: number;
    user_id: number;
    title:string;
    content:string;
    image?:string;
    status:number;
    user:User;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    statuses:IStatus[];
    teams:ITeam[];
    projects:IProject[];
};


export declare global {
    function route(routeName?: string, parameters?: any[] | any, absolute? = true): Function[string]

}



export interface Pagination{
    current_page:number;
    first_page_url:string;
    from:number;
    last_page:number;
    last_page_url:string;
    next_page_url:string;
    path:string;
    per_page:number;
    prev_page_url:string|null;
    to:number;
    total:number
    links:{
        url:string|null;
        label:string;
        active:boolean;
    }[]
}