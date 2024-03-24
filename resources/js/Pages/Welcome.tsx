

import AnnouncementCard from '@/Components/AnnouncementCard';
import AnnouncementPagination from '@/Components/AnnouncementPagination';
import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import Navbar from '@/Components/Navbar';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/Components/ui/pagination';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Announcement, Pagination as PaginationInterface } from '@/types';
import { Head } from '@inertiajs/inertia-react';
import { ActivityIcon, GaugeIcon, GlobeIcon, InfoIcon, LucideIcon } from 'lucide-react';
import {FC, useMemo} from 'react';


interface PaginatedAnnouncements extends PaginationInterface{
    data:Announcement[];
}

interface Props{
    announcements:PaginatedAnnouncements;
}
const Welcome:FC<Props> = ({announcements}) => {
    
    const {prev_page_url,next_page_url,links,current_page,data} = announcements;

    const linkItems = useMemo(()=>{
        if(links.length<3) return [];
        if(links.length===3) return [links[1]];
        return links.filter(link=>parseInt(link.label)<current_page+2 && parseInt(link.label)>current_page-2);
    },[links,current_page]);

    

    return (
        <>
            <Head title="Welcome" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5'>
                    <Header />
                    
                    <ScrollArea className='flex-1 border rounded-lg p-6'>
                        <div className='flex flex-col gap-y-12'>
                            {
                                !data||data.length<1&&(
                                    //NO ANNOUNCEMENTS
                                    <div className='flex-1 flex items-center justify-center'>
                                        <p className='text-lg text-center'>No announcements found</p>
                                    </div>
                                )
                            }
                            {
                                data.map((announcement,index)=><AnnouncementCard key={announcement.id} announcement={announcement} even={index%2===0} />)
                            }
                        </div>
                    </ScrollArea>
                    
                    <AnnouncementPagination prev_page_url={prev_page_url} data={data} linkItems={linkItems} next_page_url={next_page_url} />
                </div>
            </Layout>
        </>
    )
}

export default Welcome;


export type NavLink = {
    id:number;
    Icon:LucideIcon;
    label:string;
    items: {
        name:string;
        href:string;
    }[];
}


export const NavItems:NavLink[] = [
    {
        id: 1,
        Icon: GaugeIcon,
        label: 'CCO Performance Management',
        items:[
            {
                name: "Project Knowledge Base",
                href: "/project-knowledge-base"
            },
            {
                name: "Individual Performance Dashboard",
                href: "/individual-performance-dashboard"
            },
            {
                name: "Client and Internal Escalation Records",
                href: "/client-and-internal-escalation-records"
            },
            {
                name: "Attendance Management System",
                href: "/attendance-management-system"
            },
            {
                name: "Quality Management System/Leave planner",
                href: "/quality-management-system-leave-planner",
            },
            {
                name: "Reliability Management System",
                href: "/reliability-management-system"
            },
            {
                name: "Connect: Coaching Tool",
                href: "/connect-coaching-tool",
            },
            {
                name: "Key Performance Indicators Records per Project and Trending Report",
                href: "/key-performance-indicators-records-per-project-and-trending-report"
            }
        ]
    },
    {
        id: 2,
        Icon: InfoIcon,
        label: 'CCO Information System',
        items:[
            {
                name: "Training Information System",
                href: "/training-information-system"
            },
            {
                name: "CCO Manhour/Billing Report",
                href: "/cco-manhour-billing-report"
            },
            {
                name: "CCO Code of Descipline",
                href: "/cco-code-of-descipline"
            },
            {
                name: "Employee Information Records",
                href: "/employee-information-records"
            },
            {
                name: "Incentive Reports",
                href: "/incentive-reports"
            },
            {
                name: "Memorandum/Code of Descipline Infractions record",
                href: "/memorandum-code-of-descipline-infractions-record"
            },
            {
                name: "Coaching logs/Performance Evaluations",
                href: "/coaching-logs-performance-evaluations"
            },
            {
                name: "CCO Attrition Report",
                href: "/cco-attrition-report"
            },
            {
                name: "Shrink Tracker (VLs, SLs, OOO)",
                href: "/shrink-tracker-vls-sls-ooo"
            }
        ]
    },
    {
        id: 3,
        Icon: ActivityIcon,
        label: 'CCO Site Monitoring',
        items: [
            {
                name: "Company Information",
                href: "/company-information"
            },
            {
                name: "Hardware and Capacity Monitoring",
                href: "/hardware-and-capacity-monitoring"
            },
            {
                name: "Company perks (DDC Mart, DDC Care, etc.)",
                href: "/company-perks-ddc-mart-ddc-care-etc"
            },
            {
                name: "BCP protocols",
                href: "/bcp-protocols"
            }
        ]
    },
    {
        id:4,
        Icon:GlobeIcon,
        label:'General Updates',
        items: [
            {
                name: "CCO and other departments job postings",
                href: "/cco-and-other-departments-job-postings"
            },
            {
                name: "CCO reminders and announcements",
                href: "/cco-reminders-and-announcements"
            },
            {
                name: "CCO Employee engagement records and documentation",
                href: "/cco-employee-engagement-records-and-documentation"
            }
        ]
    }
];
