import AnnouncementModal from "@/Components/Modals/AnnouncementModal"
import AuthModal from "@/Components/Modals/AuthModal"

const ModalProvider = () => {
    return (
        <>
            <AuthModal />
            <AnnouncementModal />
        </>
    )
}
export default ModalProvider