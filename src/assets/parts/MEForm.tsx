import { Autocomplete, Box, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import React, { KeyboardEventHandler, SyntheticEvent } from "react";
import { MedicalExpenseInfo } from "../data/MedicalExpenseInfo";

export const MEFormColumnTitles = {
    PatientName: '医療を受けた人',
    Institution: '病院・薬局などの名称',
    IncludesTreatment: '診療・治療',
    IncludesMedication: '医薬品の購入',
    IncludesCareService: '介護保険サービス',
    IncludesOtherMedicalExpenses: 'その他の医療費',
    MedicalExpense: '支払った医療費の金額',
    ReimbursedAmount: '支払った医療費のうち、補填される金額',
    PaymentDate: '支払年月日'
} as const;

export interface MEFormHandlers {
    /** 患者名のオートコンプリート入力変更を処理する
         * @param event - イベントオブジェクト
         * @param value - 新しい患者名
         */
    handlePatientNameCompleteInputChange: (event: SyntheticEvent<Element, Event>, value: string) => void;
    /** 医療機関名のオートコンプリート入力変更を処理する
     * @param event - イベントオブジェクト
     * @param value - 新しい医療機関名
     */
    handleInstitutionCompleteInputChange: (event: SyntheticEvent<Element, Event>, value: string) => void;
    /** 治療を含むチェックボックスの変更を処理する
     * @param event - イベントオブジェクト
     */
    handleIncludesTreatmentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** 投薬を含むチェックボックスの変更を処理する
     * @param event - イベントオブジェクト
     */
    handleIncludesMedicationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** 介護サービスを含むチェックボックスの変更を処理する
     * @param event - イベントオブジェクト
     */
    handleIncludesCareServiceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** その他医療費を含むチェックボックスの変更を処理する
     * @param event - イベントオブジェクト
     */
    handleIncludesOtherMedicalExpensesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** 医療費の入力変更を処理する
     * @param event - イベントオブジェクト
     */
    handleMedicalExpenseInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** 支給額の入力変更を処理する
     * @param event - イベントオブジェクト
     */
    handleReimbursedAmountInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** 支払年月日の入力変更を処理する
     * @param event - イベントオブジェクト
     */
    handlePaymentDateInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** 患者名のフィールドをクリアする
     * @param event - キーボードイベントオブジェクト
     */
    handlePatientNameFieldClear: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    /** 医療機関名のフィールドをクリアする
     * @param event - キーボードイベントオブジェクト
     */
    handleInstitutionFieldClear: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface MEFormProps {
    /** 現在の入力データ */
    currentEntry: MedicalExpenseInfo;
    /** ユニークな候補の患者名 */
    uniqueCandidateOfName: string[];
    /** ユニークな候補の医療機関名 */
    uniqueCandidateOfInstitution: string[];
    /** 入力変更を処理するハンドラー */
    handlers: MEFormHandlers;
}

export default function MedicalExpenseForm(props: MEFormProps): JSX.Element {

    const {
        currentEntry: {
            name: patientName,
            institution,
            includes_Treatment: includesTreatment,
            includes_Medication: includesMedication,
            includes_CareService: includesCareService,
            includes_OtherMedicalExpenses: includesOtherMedicalExpenses,
            medicalExpense,
            reimbursedAmount,
            paymentDate
        },
        uniqueCandidateOfName,
        uniqueCandidateOfInstitution,
        handlers: {
            handlePatientNameCompleteInputChange,
            handleInstitutionCompleteInputChange,
            handleIncludesTreatmentChange,
            handleIncludesMedicationChange,
            handleIncludesCareServiceChange,
            handleIncludesOtherMedicalExpensesChange,
            handleMedicalExpenseInputChange,
            handleReimbursedAmountInputChange,
            handlePaymentDateInputChange,
            handlePatientNameFieldClear,
            handleInstitutionFieldClear
        }
    } = props;

    return (
        <Box mb={2}>
            <Autocomplete // 患者名のオートコンプリート入力
                freeSolo
                options={uniqueCandidateOfName}
                inputValue={patientName}
                onInputChange={handlePatientNameCompleteInputChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={MEFormColumnTitles.PatientName}
                        type="text"
                        required
                        fullWidth
                        margin="normal"
                        onKeyDown={handlePatientNameFieldClear}
                    />)}
            />
            <Autocomplete // 医療機関名のオートコンプリート入力
                freeSolo
                options={uniqueCandidateOfInstitution}
                inputValue={institution}
                onInputChange={handleInstitutionCompleteInputChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={MEFormColumnTitles.Institution}
                        type="text"
                        required
                        fullWidth
                        margin="normal"
                        onKeyDown={handleInstitutionFieldClear}
                    />)}
            />
            <Box component="fieldset" borderColor="transparent" border='solid 1px lightgray'>
                <Typography component="legend" sx={{ color: 'gray', fontSize: '0.8rem' }}>
                    医療費の区分(複数選択可)
                </Typography>
                <FormControlLabel // 治療に関するチェックボックス
                    control={
                        <Checkbox
                            checked={includesTreatment}
                            onChange={handleIncludesTreatmentChange}
                            onKeyDown={React.useCallback<KeyboardEventHandler>((event: React.KeyboardEvent<HTMLInputElement>) => {
                                if (event.key === 'Enter') {
                                    handleIncludesTreatmentChange({
                                        target: { checked: !includesMedication }
                                    } as React.ChangeEvent<HTMLInputElement>);
                                }
                            }, [handleIncludesTreatmentChange, includesMedication])}
                        />
                    }
                    label={MEFormColumnTitles.IncludesTreatment}
                />
                <FormControlLabel // 医薬品の購入に関するチェックボックス
                    control={
                        <Checkbox
                            checked={includesMedication}
                            onChange={handleIncludesMedicationChange}
                            onKeyDown={React.useCallback<KeyboardEventHandler>((event: React.KeyboardEvent<HTMLInputElement>) => {
                                if (event.key === 'Enter') {
                                    handleIncludesMedicationChange({
                                        target: { checked: !includesMedication }
                                    } as React.ChangeEvent<HTMLInputElement>);
                                }
                            }, [handleIncludesMedicationChange, includesMedication])}
                        />
                    }
                    label={MEFormColumnTitles.IncludesMedication}
                />
                <FormControlLabel // 介護保険サービスに関するチェックボックス
                    control={
                        <Checkbox
                            checked={includesCareService}
                            onChange={handleIncludesCareServiceChange}
                            onKeyDown={React.useCallback<KeyboardEventHandler>((event: React.KeyboardEvent<HTMLInputElement>) => {
                                if (event.key === 'Enter') {
                                    handleIncludesCareServiceChange({
                                        target: { checked: !includesCareService }
                                    } as React.ChangeEvent<HTMLInputElement>);
                                }
                            }, [handleIncludesCareServiceChange, includesCareService])}
                        />
                    }
                    label={MEFormColumnTitles.IncludesCareService}
                />
                <FormControlLabel // その他の医療費に関するチェックボックス
                    control={
                        <Checkbox
                            checked={includesOtherMedicalExpenses}
                            onChange={handleIncludesOtherMedicalExpensesChange}
                            onKeyDown={React.useCallback<KeyboardEventHandler>((event: React.KeyboardEvent<HTMLInputElement>) => {
                                if (event.key === 'Enter') {
                                    handleIncludesOtherMedicalExpensesChange({
                                        target: { checked: !includesOtherMedicalExpenses }
                                    } as React.ChangeEvent<HTMLInputElement>);
                                }
                            }, [handleIncludesOtherMedicalExpensesChange, includesOtherMedicalExpenses])}
                        />
                    }
                    label={MEFormColumnTitles.IncludesOtherMedicalExpenses}
                />
            </Box>
            <TextField // 医療費の入力フィールド
                label={MEFormColumnTitles.MedicalExpense}
                type="number"
                value={React.useMemo(() => isNaN(medicalExpense) ? '' : medicalExpense, [medicalExpense])}
                required
                onChange={handleMedicalExpenseInputChange}
                fullWidth
                margin="normal"
                onKeyDown={React.useCallback<KeyboardEventHandler>((event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Delete') {
                        handleMedicalExpenseInputChange({
                            target: { value: '' }
                        } as React.ChangeEvent<HTMLInputElement>);
                    }
                }, [handleMedicalExpenseInputChange])}
            />
            <TextField // 補填額の入力フィールド
                label={MEFormColumnTitles.ReimbursedAmount}
                type="number"
                required
                value={React.useMemo(() => isNaN(reimbursedAmount) ? '' : reimbursedAmount, [reimbursedAmount])}
                onChange={handleReimbursedAmountInputChange}
                fullWidth
                margin="normal"
                onKeyDown={React.useCallback<KeyboardEventHandler>((event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Delete') {
                        handleReimbursedAmountInputChange({
                            target: { value: '' }
                        } as React.ChangeEvent<HTMLInputElement>);
                    }
                }, [handleReimbursedAmountInputChange])}
            />
            <TextField
                label={MEFormColumnTitles.PaymentDate}
                type="date"
                value={React.useMemo(() => paymentDate instanceof Date
                    ? paymentDate.toISOString().split('T')[0]
                    : paymentDate, [paymentDate])}
                onChange={handlePaymentDateInputChange}
                fullWidth
                margin="normal"
                onKeyDown={React.useCallback<KeyboardEventHandler>((event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Delete') {
                        handlePaymentDateInputChange({
                            target: { value: '' }
                        } as React.ChangeEvent<HTMLInputElement>);
                    }
                }, [handlePaymentDateInputChange])}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    }
                }}
            />
        </Box>
    );
}