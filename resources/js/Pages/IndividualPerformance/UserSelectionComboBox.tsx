import { Button } from '@/Components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { ChevronsUpDown,  Check } from 'lucide-react';
import {FC, useState} from 'react';

interface Props {
    users:User[];
    selectedUser?:User;
    onSelectUser:(user:User)=>void;
    isTeamLead:boolean;
}

const UserSelectionComboBox:FC<Props> = ({users,selectedUser,onSelectUser,isTeamLead}) => {
    const [open, setOpen] = useState(false);
    const onSelect = (user:User) => {
        if(user.id === selectedUser?.id) return;
        onSelectUser(user);
        setOpen(false);
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    size='sm'
                    disabled={!isTeamLead}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full md:w-52 justify-between"
                    >
                    {selectedUser?`${selectedUser.first_name} ${selectedUser.last_name}`:'Select Agent'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search Project..." />
                    <CommandList>
                        <CommandEmpty>No User found.</CommandEmpty>
                        <CommandGroup>
                            {users.map((p) => (
                                <CommandItem key={p.id} onSelect={()=>onSelect(p)} >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            p.id === selectedUser?.id ? "opacity-100" : "opacity-0"
                                        )}/>
                                    {p.first_name} {p.last_name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default UserSelectionComboBox;