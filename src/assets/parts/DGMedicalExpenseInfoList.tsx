import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { MedicalExpenseInfo } from "../data/MedicalExpenseInfo";
import { MEFormColumnTitles } from "./MEForm";

export type RowsState<T> = [T[], React.Dispatch<React.SetStateAction<T[]>>];

interface DGMedicalExpenseInfoListProps {
    rowsState: RowsState<MedicalExpenseInfo>;
}

export default function DGMedicalExpenseInfoList(props:DGMedicalExpenseInfoListProps): JSX.Element {
    const [rows] = props.rowsState;

    const charWidth = 16; // 1文字あたりの平均幅(px)
    const padding = 32; // セルの左右パディング合計(px)
    const minWidthByChars = React.useCallback((chars: number) => {return chars * charWidth + padding},[]);

    const columns :GridColDef<MedicalExpenseInfo>[] = React.useMemo(()=> [
        { field: 'name', headerName:MEFormColumnTitles.PatientName, minWidth: minWidthByChars(8) },
        { field: 'institution', headerName: MEFormColumnTitles.Institution, minWidth: minWidthByChars(10) },
        { field: 'includes_Treatment', headerName: MEFormColumnTitles.IncludesTreatment,  type: 'boolean', minWidth: minWidthByChars(6)},
        { field: 'includes_Medication', headerName:MEFormColumnTitles.IncludesMedication,  type: 'boolean', minWidth: minWidthByChars(8)},
        { field: 'includes_CareService', headerName: MEFormColumnTitles.IncludesCareService,  type: 'boolean', minWidth: minWidthByChars(8)},
        { field: 'includes_OtherMedicalExpenses', headerName: MEFormColumnTitles.IncludesOtherMedicalExpenses, type: 'boolean', minWidth: minWidthByChars(6)},
        { field: 'medicalExpense', headerName: '医療費',  type: 'number' , minWidth: minWidthByChars(4)},
        { field: 'reimbursedAmount', headerName:'補填額', type: 'number',minWidth: minWidthByChars(4) },
        { field: 'paymentDate', headerName: MEFormColumnTitles.PaymentDate,  type: 'date',minWidth: minWidthByChars(8) ,
            valueFormatter: (value?:Date) => {
            return value ? new Date(value).toLocaleDateString('ja-JP') : '未設定';
        } }
    ], [minWidthByChars]);

    return (
        <DataGrid
        columns={columns}
        rows={rows}
        />
    );
}