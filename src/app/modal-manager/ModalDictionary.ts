import CreateSolutionModal from "components/modals/create-solution-modal/CreateSolutionModal";
import { ModalType } from "store/slices/modals";

const ModalDictionary: Record<ModalType, React.FC<any>> = {
    [ModalType.CreateSolution]: CreateSolutionModal
}

export default ModalDictionary;