import { FC } from "react";
import { Button } from "../ui/button";
import { useAnnouncementModal } from "@/Hooks/useAnnouncementModal";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Accordion } from "../ui/accordion";
import { PinIcon, XIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const AnnouncementModal:FC = () => {
    const {data,isOpen,onClose} = useAnnouncementModal();
    
    const title = !data?'New Announcement':'Edit Announcement';
    const description = !data?'Post a new announcement':'Edit current announcement';
    const submit = !data?'Post':'Update';

    return (
        <Sheet open={isOpen}>
            <SheetContent side='left' className='h-full flex flex-col min-w-[100vw] lg:min-w-[41rem] '>
                <SheetHeader className='h-auto'>
                    <SheetTitle className="w-full text-center">{title}</SheetTitle>
                    <SheetDescription className="w-full text-center">{description}</SheetDescription>
                </SheetHeader>
                <ScrollArea className='flex-1 pr-8'>
                    <div className="space-y-1">
                        <Label>Title</Label>
                        <Input placeholder="Title" />
                    </div>
                </ScrollArea>
                <SheetFooter className='h-auto flex items-center justify-center p-3.5 gap-x-2'>                   
                    <Button variant='secondary' onClick={onClose} type="button"> <XIcon className="h-5 w-5 mr-2" /> Close</Button>
                    <Button variant='outline' type="submit"> <PinIcon className="h-5 w-5 mr-2" /> {submit}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default AnnouncementModal