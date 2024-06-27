import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { User } from '@/types';
import {FC, useState} from 'react';

interface Props {
    agents:User[];
    isOpen:boolean;
    onClose:()=>void;
}

const RateAgentsModal:FC<Props> = ({agents,isOpen,onClose}) => {
    const [selectedAgent,setSelectedAgent] = useState<User|undefined>();
    return (
        <Dialog>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RateAgentsModal;