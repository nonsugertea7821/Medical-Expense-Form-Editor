import React from "react";
import { useRecoilState } from "recoil";
import { medicalExpenseInfoState } from "../../store/atom/commonAtom";
import { MedicalExpenseInfo } from "../data/MedicalExpenseInfo";
import { RowsState } from "../parts/DGMedicalExpenseInfoList";
import { MEFormHandlers } from "../parts/MEForm";
import Validation from "../util/validation";

const INITIAL_ENTRY: MedicalExpenseInfo = {
    id: 1,
    name: '',
    institution: '',
    includes_Treatment: false,
    includes_Medication: false,
    includes_CareService: false,
    includes_OtherMedicalExpenses: false,
    medicalExpense: NaN,
    reimbursedAmount: 0,
    paymentDate: undefined,
} as const;

export interface MEFormContainerState {
    rowsState: RowsState<MedicalExpenseInfo>;
    currentEntry: MedicalExpenseInfo;
    uniqueCandidateOfName: string[];
    uniqueCandidateOfInstitution: string[];
    error: string | null;
    changeEntry: (field: keyof MedicalExpenseInfo, value: string | number | boolean | Date | undefined) => void;
    clearEntryField: (field: keyof MedicalExpenseInfo) => void;
    formHandlers: MEFormHandlers;
    handleAddNewEntryButtonClick: () => void
    handleBackEntryButtonClick: () => void;
}

export interface MEFormContainer {
    componentState: MEFormContainerState;
}

export default function useMEFormContainer(): MEFormContainer {
    // #region State Variable

    // エントリ配列の定義
    const rowsState = useRecoilState(medicalExpenseInfoState);
    const [rows, setRows] = rowsState;

    // 現在のエントリの定義
    const [currentEntry, setCurrentEntry] = React.useState<MedicalExpenseInfo>({ ...INITIAL_ENTRY });
    // エラー状態の定義
    const [error, setError] = React.useState<string | null>(null);

    // ユニークな名前の候補の定義
    const [uniqueCandidateOfName, setUniqueCandidateOfName] = React.useState<string[]>([]);
    // ユニークな機関の候補の定義
    const [uniqueCandidateOfInstitution, setUniqueCandidateOfInstitution] = React.useState<string[]>([]);

    // バリデーターを作成
    const {
        isDuplicate,
        isOutOfRangeDate,
        isInvalidNameValue,
        isInvalidInstitutionValue,
        isNameCharacterLimitExceeded,
        isInstitutionCharacterLimitExceeded,
        isInvalidMedicalExpenseAmount,
        isInvalidClassificationOfMedicalExpense
    } = Validation({ formData: rows });

    // #endregion
    // #region method

    /** 現在のエントリの変更を処理する
     * @param field - 変更するフィールドのキー
     * @param value - 新しい値
     * @description
     * この関数は、現在のエントリの特定のフィールドを更新します。
     * 変更されたフィールドの値を更新し、フォームデータを更新します
     * @returns void
     */
    const changeEntry = React.useCallback((field: keyof MedicalExpenseInfo, value: string | number | boolean | Date | undefined) => {
        setCurrentEntry({ ...currentEntry, [field]: value });
    }, [currentEntry]);

    /** 現在のエントリのフィールドをクリアする
     * @param field - クリアするフィールドのキー
     * @description
     * この関数は、現在のエントリの特定のフィールドをクリアします。
     * 文字列フィールドは空文字列に、数値フィールドはNaNに、日付フィールドはundefinedに設定します。
     * @returns void
     * @example
     * clearEntryField('name'); // 'name'フィールドをクリア
     * clearEntryField('medicalExpense'); // 'medicalExpense'フィールドをNaNにクリア
     * clearEntryField('paymentDate'); // 'paymentDate'フィールドをundefinedにクリア
     */
    const clearEntryField = React.useCallback((field: keyof MedicalExpenseInfo) => {
        switch (field) {
            case 'name':
            case 'institution':
                changeEntry(field, '');
                break;
            case 'medicalExpense':
            case 'reimbursedAmount':
                changeEntry(field, NaN);
                break;
            case 'paymentDate':
                changeEntry(field, undefined);
                break;
            default:
                break;
        }
    }, [changeEntry]);

    // #endregion
    // #region Handler

    /** フォームの各フィールドの変更を処理するハンドラ
     * @description
     * この関数は、フォームの各フィールドの変更を処理します。
     * チェックボックスや入力フィールドの変更イベントを受け取り、現在のエントリを更新します。
     */
    const formHandlers: MEFormHandlers = React.useMemo(() => ({
        handlePatientNameCompleteInputChange: (_event, value) => {
            changeEntry('name', value);
        },
        handleInstitutionCompleteInputChange: (_event, value) => {
            changeEntry('institution', value);
        },
        handleIncludesTreatmentChange: (event) => {
            changeEntry('includes_Treatment', event.target.checked);
        },
        handleIncludesMedicationChange: (event) => {
            changeEntry('includes_Medication', event.target.checked);
        },
        handleIncludesCareServiceChange: (event) => {
            changeEntry('includes_CareService', event.target.checked);
        },
        handleIncludesOtherMedicalExpensesChange: (event) => {
            changeEntry('includes_OtherMedicalExpenses', event.target.checked);
        },
        handleMedicalExpenseInputChange: (event) => {
            const value = event.target.value;
            // 数値以外の入力を防ぐ
            if (!isNaN(Number(value)) || value === '') {
                changeEntry('medicalExpense', value ? Number(value) : NaN);
            }
        },
        handleReimbursedAmountInputChange: (event) => {
            const value = event.target.value;
            // 数値以外の入力を防ぐ
            if (!isNaN(Number(value)) || value === '') {
                changeEntry('reimbursedAmount', value ? Number(value) : 0);
            }
        },
        handlePaymentDateInputChange: (event) => {
            const value = event.target.value;
            // 日付の形式が正しいかをチェック
            if (value === '' || !isNaN(Date.parse(value))) {
                changeEntry('paymentDate', value ? new Date(value) : undefined);
            }
        },
        handlePatientNameFieldClear: (event) => {
            if (event.key === 'Delete') {
                clearEntryField('name');
            }
        },
        handleInstitutionFieldClear: (event) => {
            if (event.key === 'Delete') {
                clearEntryField('institution');
            }
        },
    }), [changeEntry, clearEntryField]);

    /** 新しいエントリを追加する
     * @description
     * この関数は、現在のエントリをフォームデータに追加します。
     * もし現在のエントリが重複している場合、エラーを設定します。
     * また、支払年月日が範囲外の場合や、氏名や医療機関名が未入力の場合もエラーを設定します。
     * すべてのバリデーションが通った場合、新しいエントリをフォームデータに追加し、現在のエントリを初期状態にリセットします。
     */
    const handleAddNewEntryButtonClick = React.useCallback(() => {
        if (isDuplicate(currentEntry)) {
            setError('同一内容の受診データが既に存在します。');
            if (window.confirm('同一内容の受診データが既に存在します。追加しますか？')) {
                setError(null);
            } else {
                return;
            }
        }

        if (isOutOfRangeDate(currentEntry, 2023)) {
            setError('支払年月日が範囲外です。');
            return;
        }

        if (isInvalidNameValue(currentEntry)) {
            setError('氏名が未入力です。')
            return;
        }

        if (isInvalidInstitutionValue(currentEntry)) {
            setError('医療機関名が未入力です。')
            return;
        }

        if (isNameCharacterLimitExceeded(currentEntry)) {
            setError('名前が10文字を超えています。');
            return;
        }

        if (isInstitutionCharacterLimitExceeded(currentEntry)) {
            setError('医療施設名が20文字を超えています。');
            return;
        }

        if (isInvalidMedicalExpenseAmount(currentEntry)) {
            setError('医療費の金額が入力されていません。');
            return;
        }

        if (isInvalidClassificationOfMedicalExpense(currentEntry)) {
            setError('医療費の区分が選択されていません。')
            return;
        }

        setError(null);
        setRows([...rows, { ...currentEntry, id: rows.length + 1 }]);
        setCurrentEntry({ ...INITIAL_ENTRY, id: rows.length + 2 });
    }, [
        currentEntry,
        isDuplicate,
        isInstitutionCharacterLimitExceeded,
        isInvalidClassificationOfMedicalExpense,
        isInvalidInstitutionValue,
        isInvalidMedicalExpenseAmount,
        isInvalidNameValue,
        isNameCharacterLimitExceeded,
        isOutOfRangeDate,
        rows
    ]
    );

    /** 戻るボタンのハンドラ
     * @description
     * この関数は、フォームデータから最後のエントリを削除し、現在のエントリを更新します。
     * 最後のエントリが存在する場合、そのエントリの支払年月日をDateオブジェクトに変換します。
     * もしフォームデータが空であれば、現在のエントリを初期状態にリセットします。
     */
    const handleBack = React.useCallback(() => {
        if (rows.length > 0) {
            const newFormData = [...rows];
            const lastEntry = newFormData.pop();

            // paymentDateがDateオブジェクトであることを確認
            if (lastEntry && typeof lastEntry.paymentDate === 'string') {
                lastEntry.paymentDate = new Date(lastEntry.paymentDate);
            }

            setRows(newFormData);
            setCurrentEntry(lastEntry || { ...INITIAL_ENTRY });
        }
    }, [rows]);

    // #endregion
    // #region Effect

    // ユニークな名前と機関の候補を更新
    React.useEffect(() => {
        // formDataからユニークな名前と機関の候補を抽出
        setUniqueCandidateOfName([...new Set(rows.map((entry) => entry.name))]);
        // formDataからユニークな機関の候補を抽出
        setUniqueCandidateOfInstitution([...new Set(rows.map((entry) => entry.institution))]);
    }, [rows]);

    // #endregion
    return {
        componentState: {
            rowsState,
            currentEntry,
            uniqueCandidateOfName,
            uniqueCandidateOfInstitution,
            error,
            changeEntry,
            clearEntryField,
            formHandlers,
            handleAddNewEntryButtonClick,
            handleBackEntryButtonClick: handleBack
        }
    };
}