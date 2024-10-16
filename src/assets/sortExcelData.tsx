import { IExcelData, SortMethod } from './interface';

// Function to sort IExcelData based on the SortMethod
function sortExcelData(data: IExcelData[], method: SortMethod): IExcelData[] {
    switch (method) {
        case SortMethod.ById:
            return data.sort((a, b) => a.id - b.id);
        case SortMethod.ByName:
            return data.sort((a, b) => a.name.localeCompare(b.name));
        case SortMethod.ByMedicalExpense:
            return data.sort((a, b) => a.medicalExpense - b.medicalExpense);
        case SortMethod.ByPaymentDate:
            return data.sort((a, b) => {
            const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
            const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
            return dateA - dateB;
            });
        default:
            return data;
    }
}

export { sortExcelData };

