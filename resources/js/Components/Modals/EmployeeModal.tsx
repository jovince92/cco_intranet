import { useEmployeeModal } from "@/Hooks/useEmployeeModal"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { ScrollArea } from "../ui/scroll-area"

const EmployeeModal = () => {
    const {isOpen,data,onClose} = useEmployeeModal();
    if(!data) return null;
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-screen flex flex-col" >
                <DialogHeader className="h-auto">
                    <DialogTitle>Edit Employee Info</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to edit the employee's information
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-8">
                    
                </ScrollArea>
                <DialogFooter className="h-auto">
                    <Button>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default EmployeeModal