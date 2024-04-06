import AnnouncementModal from "@/Components/Modals/AnnouncementModal"
import AttendanceReportModal from "@/Components/Modals/AttendanceReportModal"
import AuthModal from "@/Components/Modals/AuthModal"
import DeleteAnnouncementConfirmation from "@/Components/Modals/DeleteAnnouncementConfirmation"
import EmployeeModal from "@/Components/Modals/EmployeeModal"
import ProjectHistoryModal from "@/Components/Modals/ProjectHistoryModal"
import ProjectSettingsModal from "@/Components/Modals/ProjectSettingsModal"
import ShiftModal from "@/Components/Modals/ShiftModal"
import SyncModal from "@/Components/Modals/SyncModal"

const ModalProvider = () => {
    return (
        <>
            <AuthModal />
            <AnnouncementModal />
            <DeleteAnnouncementConfirmation />
            <EmployeeModal />
            <ShiftModal />
            <SyncModal />
            <AttendanceReportModal />
            <ProjectSettingsModal />
            <ProjectHistoryModal />
        </>
    )
}
export default ModalProvider