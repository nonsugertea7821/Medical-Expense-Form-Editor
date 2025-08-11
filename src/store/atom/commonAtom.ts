import { atom } from 'recoil';
import { DefaultDialogState, DialogState } from '../../assets/data/DialogState';
import { MedicalExpenseInfo } from '../../assets/data/MedicalExpenseInfo';
import { AtomKeys } from '../keys/AtomKeys';

function getInitialMedicalExpenseInfoFromJson() {
    const savedData = localStorage.getItem('medicalExpenseData');
    console.log("retrieving data from cache", savedData);
    return savedData ? JSON.parse(savedData) as MedicalExpenseInfo[] : [];
}

export const dialogState = atom<DialogState>({
    key: AtomKeys.DIALOG_STATE,
    default: DefaultDialogState,
});

export const medicalExpenseInfoState = atom<MedicalExpenseInfo[]>({
    key: AtomKeys.MEDICAL_EXPENSE_INFO,
    default: getInitialMedicalExpenseInfoFromJson()
});