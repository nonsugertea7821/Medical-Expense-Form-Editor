import { Box, Button, Typography } from '@mui/material';
import ExcelJS from 'exceljs';
import React, { useEffect } from 'react';
import { IExcelData } from './assets/interface.tsx';
import MedicalExpenseForm from './assets/MedicalExpenseForm.tsx';
import XlsxFileEditor from './assets/xlsxFileEditor.tsx';
import XlsxFileReader from './assets/xlsxFileReader.tsx';
import ErrorBoundary from './ErrorBoundary.tsx';
import Explain from './Explain.tsx';

const App: React.FC = () => {

  const [data, setData] = React.useState<IExcelData[]>(() => {
    const savedData = localStorage.getItem('medicalExpenseData');
    console.log("retrieving data from cache", savedData);
    return savedData ? JSON.parse(savedData) as IExcelData[] : [];
  });
  const [file, setFile] = React.useState<ExcelJS.Workbook>(new ExcelJS.Workbook());
  const sheetName = '医療費集計フォーム';
  const [editedFile, setEditedFile] = React.useState<ExcelJS.Workbook>(new ExcelJS.Workbook());

  useEffect(() => {
    if (data.length > 0 && file.worksheets.length > 0) {
      XlsxFileEditor(data, file, sheetName).then((result) => {
        setEditedFile(result);
      });
    }
  }, [data, file]);

  useEffect(() => {
    localStorage.setItem('medicalExpenseData', JSON.stringify(data));
    console.log("saving data to cache, data", data);
  }, [data]);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-center' }}>
        <div style={{ width: '85%', display: 'flex', justifyContent: 'space-between' }}>
          <h1>(令和5年度版)医療費集計フォーム 入力補助アプリ</h1>
        </div>
        <div style={{ width: '15%', display: 'flex', alignItems: 'flex-center' }}>
          <Explain />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: "75%" }}>
          <ErrorBoundary>
            <MedicalExpenseForm initialData={data} deliverData={setData} />
          </ErrorBoundary>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', width: '25%' }}>
          <Typography>下記のURLから医療費集計フォームをダウンロードし、ダウンロードしたファイルを選択したのち、確定ボタンを押してください。</Typography>
          <a
            href="https://www.nta.go.jp/taxes/shiraberu/shinkoku/tokushu/keisubetsu/iryou-shuukei.htm"
            target="_blank"
            rel="noopener noreferrer"
            style={{ wordBreak: 'break-word' }}
          >
            https://www.nta.go.jp/taxes/shiraberu/shinkoku/tokushu/keisubetsu/iryou-shuukei.htm
          </a>
          <XlsxFileReader deliverFile={setFile} />
          <p>ダウンロードはこちら（入力完了後）</p>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-center"
            p={2}
            bgcolor="background.paper"
            boxShadow={1}
            borderRadius={1}
            sx={{ width: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                if (data.length === 0) {
                  alert('入力が完了されていません。');
                  return;
                }
                if (file.worksheets.length === 0) {
                  alert('医療費集計フォームのテンプレートが挿入されていません。');
                  return;
                }
                try {
                  const buffer = await editedFile.xlsx.writeBuffer();
                  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = '医療費集計フォーム.xlsx';
                  a.click();
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Error downloading the file:', error);
                }
              }}
            >
              ダウンロード
            </Button>
          </Box>
          <p>中断データの書き出し・読み込みはこちら</p>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-center"
            p={2}
            bgcolor="background.paper"
            boxShadow={1}
            borderRadius={1}
            sx={{ width: '100%', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              component="label"
            >
              JSONファイルを読み込み
              <input
              type="file"
              accept=".json"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                try {
                  const text = await file.text();
                  const jsonData = JSON.parse(text) as IExcelData[];
                  if (data.length > 0) {
                  if (!window.confirm('既にデータが入力されています。置き換えますか？')) {
                    return;
                  }
                  }
                  setData(jsonData);
                  localStorage.setItem('medicalExpenseData', JSON.stringify(jsonData));
                  alert('JSONファイルが正常に読み込まれました。');
                } catch (error) {
                  console.error('Error reading JSON file:', error);
                  alert('JSONファイルの読み込み中にエラーが発生しました。');
                }
                }
              }}
              />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component="label"
            >
              JSONファイルを書き出し
              <input
                type="button"
                onClick={() => {
                  const json = JSON.stringify(data, null, 2);
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  const date = new Date().toISOString().split('T')[0];
                  a.href = url;
                    a.download = `MedicalExpenseFormData_${date}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                hidden
              />
            </Button>
          </Box>

          <p>初めからやりなおす</p>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-center"
            p={2}
            bgcolor="background.paper"
            boxShadow={1}
            borderRadius={1}
            sx={{ width: '100%' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (window.confirm('本当にすべての入力内容を削除しますか？')) {
                  localStorage.removeItem('medicalExpenseData');
                  localStorage.removeItem('hasSeenIntroduction');
                  setData([]);
                  setFile(new ExcelJS.Workbook());
                  setEditedFile(new ExcelJS.Workbook());
                  alert('すべての入力内容が削除されました。');
                }
              }}
            >
              オールクリア
            </Button>
          </Box>
        </div>
      </div>
    </>
  );
};

export default App;
