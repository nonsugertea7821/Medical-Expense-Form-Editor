import { MedicalExpenseInfo } from '../data/MedicalExpenseInfo';

export enum SortMethod {
    ById,
    ByName,
    ByMedicalExpense,
    ByPaymentDate,
}

// Function to sort IExcelData based on the SortMethod
export default function sortExcelData(data: MedicalExpenseInfo[], method: SortMethod): MedicalExpenseInfo[] {
    const copy = [...data];
    switch (method) {
        case SortMethod.ById:
            return copy.sort((a, b) => a.id - b.id);
        case SortMethod.ByName:
            return copy.sort((a, b) => a.name.localeCompare(b.name));
        case SortMethod.ByMedicalExpense:
            return copy.sort((a, b) => a.medicalExpense - b.medicalExpense);
        case SortMethod.ByPaymentDate:
            return copy.sort((a, b) => {
            const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : new Date(0).getTime();
            const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : new Date(0).getTime();
            return dateA - dateB;
            });
        default:
            return copy;
    }
}

