import Layout from '@/Components/Layout/Layout';
import TeamsModal from '@/Pages/TeamSettingsComponents/TeamsModal';
import TeamsComboBox from '@/Components/TeamsComboBox';
import { Button } from '@/Components/ui/button';
import { Team, User } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import { Head, useForm } from '@inertiajs/inertia-react';
import { Edit3Icon, PackagePlus, UserPlus2, UserPlus2Icon } from 'lucide-react';
import {FC, FormEventHandler, useState} from 'react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

interface Props {
    teams:Team[]
    team:Team;
    team_leads:User[];
    teamless_agents:User[];
}

const TeamSettings:FC<Props> = ({team,team_leads,teams,teamless_agents}) => {
    const {users} = team;
    const {data,setData,processing,reset,post} = useForm({
        name:'',
        user_id:team.user_id as number|undefined
    });
    const [teamForm,setTeamForm] = useState<{show?:boolean;edit?:boolean}>({});
    const handleToggleShowForm = (edit?:boolean) => setTeamForm(val=>({show:!val.show,edit})); 
    
    return (
        <>
            <Head title="Team Settings" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5 overflow-y-auto'>
                    <div className='h-14 flex items-center gap-x-2'>
                        <TeamsComboBox className='flex-1' teams={teams} size='sm' disabled={processing} selectedTeam={team} onTeamSelect={t=>Inertia.get(route('team.index',{team_id:t.id}))} />
                        <div className="flex items-center">
                            <Button onClick={()=>handleToggleShowForm()} size='sm' variant='outline' className="rounded-r-none border-r-0 gap-x-2">
                                <PackagePlus className="h-5 w-5" /> <span className='hidden md:inline'>Create a Team</span> 
                            </Button>
                            <Button onClick={()=>handleToggleShowForm(true)} className="rounded-l-none rounded-r-none gap-x-2" size='sm' variant='outline'>
                                <span className='hidden md:inline'>Edit Team</span> <Edit3Icon className="h-5 w-5" />
                            </Button>
                            <Button onClick={()=>{}} className="rounded-l-none border-l-0 gap-x-2" size='sm' variant='outline'>
                                <span className='hidden md:inline'>Add Team Member</span> <UserPlus2Icon className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    <div className='flex-1 overflow-y-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Agent</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Company ID</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map(u => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium w-72">{u.first_name} {u.last_name}</TableCell>
                                    <TableCell>{u.project?.name||'No Project'}</TableCell>
                                    <TableCell>{u.company_id}</TableCell>
                                    <TableCell className="text-right">TODO: Actions</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Layout>
            <TeamsModal isOpen={teamForm.show} team={teamForm.edit?team:undefined} onClose={()=>handleToggleShowForm()} teamLeads={team_leads} />
        </>
    );
};

export default TeamSettings;