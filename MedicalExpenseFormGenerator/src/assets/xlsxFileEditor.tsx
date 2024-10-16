import ExcelJS from 'exceljs'; // Excelファイルを操作するためのライブラリをインポート
import { IExcelData, SortMethod } from './interface.tsx';
import { sortExcelData } from './sortExcelData.tsx';

// Excelファイルを編集する非同期関数
const XlsxFileEditor = async (data: IExcelData[], file: ExcelJS.Workbook, sheetName: string) => {
    const templateBuffer = await file.xlsx.writeBuffer();
    const workbook = file;
    await workbook.xlsx.load(templateBuffer);
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) throw new Error(`Worksheet with name ${sheetName} not found`);

    // データを日付でソート
    const sortedData = sortExcelData(data, SortMethod.ByPaymentDate);

    // データをワークシートに書き込む
    sortedData.forEach((item, index) => {
        const row = worksheet.getRow(index + 9); // 1~8行目はヘッダーなので9行目から開始
        //idは入力しない
        row.getCell(2).value = item.name;
        row.getCell(3).value = item.institution;
        row.getCell(4).value = item.includes_Treatment ? "該当する" : '';
        row.getCell(5).value = item.includes_Medication ? '該当する' : '';
        row.getCell(6).value = item.includes_CareService ? '該当する' : '';
        row.getCell(7).value = item.includes_OtherMedicalExpenses ? '該当する' : '';
        row.getCell(8).value = item.medicalExpense ?? 0;
        row.getCell(9).value = item.reimbursedAmount ?? 0;
        row.getCell(10).value =
            item.paymentDate && item.paymentDate instanceof Date ? 
            `${item.paymentDate.getFullYear()}/${String(item.paymentDate.getMonth() + 1).padStart(2, '0')}/${String(item.paymentDate.getDate()).padStart(2, '0')}` : '';
        row.commit();
    });

    return workbook;
};

export default XlsxFileEditor;