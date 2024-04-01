import AnnouncementModal from "@/Components/Modals/AnnouncementModal"
import AuthModal from "@/Components/Modals/AuthModal"
import DeleteAnnouncementConfirmation from "@/Components/Modals/DeleteAnnouncementConfirmation"
import EmployeeModal from "@/Components/Modals/EmployeeModal"
import ShiftModal from "@/Components/Modals/ShiftModal"

const ModalProvider = () => {
    return (
        <>
            <AuthModal />
            <AnnouncementModal />
            <DeleteAnnouncementConfirmation />
            <EmployeeModal />
            <ShiftModal />
        </>
    )
}
export default ModalProvider