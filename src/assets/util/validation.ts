import React from 'react';
import { MedicalExpenseInfo } from '../data/MedicalExpenseInfo';

const ValidateValue = {
    InstitutionCharacterLimit: 21,
    NameCharacterLimit: 11,
} as const;

export default function Validation( props: { formData: MedicalExpenseInfo[] }) {
    const { formData: _formData } = props;

    const isDuplicate = React.useCallback((newEntry:MedicalExpenseInfo): boolean => {
        return _formData.some((entry) => 
            entry.name === newEntry.name &&
            entry.institution === newEntry.institution &&
            entry.medicalExpense === newEntry.medicalExpense &&
            entry.paymentDate instanceof Date && 
            newEntry.paymentDate instanceof Date &&
            entry.paymentDate.toISOString().split('T')[0] === newEntry.paymentDate.toISOString().split('T')[0]
        );
    },[_formData]);

    const isNameCharacterLimitExceeded = React.useCallback((newEntry:MedicalExpenseInfo): boolean => {
        return newEntry.name.length > ValidateValue.NameCharacterLimit;
    }, []);

    const isInstitutionCharacterLimitExceeded = React.useCallback((newEntry:MedicalExpenseInfo): boolean => {
        return newEntry.institution.length > ValidateValue.InstitutionCharacterLimit;
    }, []);

    const isOutOfRangeDate = React.useCallback((newEntry:MedicalExpenseInfo, fiscalYear:number): boolean => {
        return newEntry.paymentDate ? (newEntry.paymentDate.getFullYear() < fiscalYear || newEntry.paymentDate.getFullYear() > fiscalYear + 1) : false;
    }, []);

    const isInvalidNameValue = React.useCallback((newEntry:MedicalExpenseInfo): boolean => {
        return newEntry.name.length === 0;
    }, []);

    const isInvalidInstitutionValue = React.useCallback((newEntry:MedicalExpenseInfo): boolean => {
        return newEntry.institution.length === 0;
    }, []);

    const isInvalidMedicalExpenseAmount = React.useCallback((newEntry:MedicalExpenseInfo): boolean => {
        return newEntry.medicalExpense === null || isNaN(newEntry.medicalExpense);
    }, []);

    const isInvalidClassificationOfMedicalExpense = React.useCallback((newEntry:MedicalExpenseInfo): boolean => {
        return (
            newEntry.includes_CareService === false &&
            newEntry.includes_Medication === false &&
            newEntry.includes_Treatment === false &&
            newEntry.includes_OtherMedicalExpenses === false
        );
    }, []);

    return {
        isDuplicate,
        isNameCharacterLimitExceeded,
        isInstitutionCharacterLimitExceeded,
        isOutOfRangeDate,
        isInvalidNameValue,
        isInvalidInstitutionValue,
        isInvalidMedicalExpenseAmount,
        isInvalidClassificationOfMedicalExpense
    };
}