import { IExcelData } from './interface';

class Validation{
    private _formData: IExcelData[];

    constructor(formData: IExcelData[]){
        this._formData = formData;
    }

    public isDuplicate(newEntry:IExcelData): boolean{
        return this._formData.some((entry) => 
            entry.name === newEntry.name &&
            entry.institution === newEntry.institution &&
            entry.medicalExpense === newEntry.medicalExpense &&
            entry.paymentDate && newEntry.paymentDate &&
            entry.paymentDate.toISOString().split('T')[0] === newEntry.paymentDate.toISOString().split('T')[0]
        );
    }

    public NameCharacterLimitExceeded(newEntry:IExcelData): boolean{
        return newEntry.name.length > 11;
    }

    public InstitutionCharacterLimitExceeded(newEntry:IExcelData): boolean{
        return newEntry.institution.length > 21;
    }

    public isOutOfRangeDate(newEntry:IExcelData, fiscalYear:number): boolean{
        return newEntry.paymentDate ? (newEntry.paymentDate.getFullYear() < fiscalYear || newEntry.paymentDate.getFullYear() > fiscalYear + 1) : false;
    }

    public isInvalidNameValue(newEntry:IExcelData):boolean{
        return newEntry.name.length == 0;
    }

    public isInvalidInstitutionValue(newEntry:IExcelData):boolean{
        return newEntry.institution.length == 0;
    }

    public isInvalidMedicalExpenseAmount(newEntry:IExcelData):boolean{
        return newEntry.medicalExpense === null || isNaN(newEntry.medicalExpense);
    }

    public isInvalidClassificationOfMedicalExpense(newEntry:IExcelData):boolean{
        return(
            newEntry.includes_CareService == false &&
            newEntry.includes_Medication == false &&
            newEntry.includes_Treatment == false &&
            newEntry.includes_OtherMedicalExpenses == false
        );
        
    }
}

export default Validation;