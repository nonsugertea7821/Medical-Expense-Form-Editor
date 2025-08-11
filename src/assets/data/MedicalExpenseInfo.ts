export interface MedicalExpenseInfo {
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