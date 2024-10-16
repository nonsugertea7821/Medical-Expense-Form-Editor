import ExcelJS from 'exceljs';

interface IExcelData {
    id: number;
    name: string;
    institution: string;
    includes_Treatment: boolean;
    includes_Medication: boolean;
    includes_CareService: boolean;
    includes_OtherMedicalExpenses: boolean;
    medicalExpense: number;
    reimbursedAmount: number;
    paymentDate?: Date;
}

interface xlsxEditorProps {
    data: IExcelData[];
    file: object;
}

interface xlsxFileContainerProps {
    deliverFile: (file: ExcelJS.Workbook) => void;
}

interface MEFormContainerProps {
    initialData: IExcelData[];
    deliverData: (data: IExcelData[]) => void;
}

enum SortMethod {
    ById,
    ByName,
    ByMedicalExpense,
    ByPaymentDate,
}

export { SortMethod };
export type { IExcelData, MEFormContainerProps, xlsxEditorProps, xlsxFileContainerProps };

