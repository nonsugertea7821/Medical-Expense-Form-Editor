import { Box, Button, Dialog, DialogContent, List, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { medicalExpenseInfoState } from "../store/atom/commonAtom";
import { isDialogOpenSelector } from "../store/selector/dialogSelector";
import { MedicalExpenseInfo } from "./data/MedicalExpenseInfo";
import useTemplateFile from "./hooks/useTemplateFile";
import writeMEWorkBook from "./util/writeMEWorkBook";

export interface MEDataWriterState {
    handleClose: () => void;
    handleDownloadButtonClick: () => Promise<void>;
    handleJsonReadButtonInputChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>,
    handleJsonWriteButtonClick: () => Promise<void>;
    handleResetAllButtonClick: () => void;
}

const MEDataWriterSections = {
    Download: 'ダウンロード',
    JsonSaveAndLoad: '中断',
    AllClear: 'オールクリア'
} as const;

/** エクセルファイルのシート名 */
const XlsxSheetName = '医療費集計フォーム' as const;

export default function MEDataWriter(): JSX.Element {
    // #region ステート

    const rowsState = useRecoilState(medicalExpenseInfoState);
    const [data, setData] = rowsState;
    const [readJson, setReadJson] = React.useState<string>();

    const { getCachedTemplateFile } = useTemplateFile();

    const [isDialogOpen, setIsDialogOpen] = useRecoilState(isDialogOpenSelector('meDataWriterDialog'));
    const [selectedSection, setSelectedSection] = React.useState<string>(MEDataWriterSections.Download);

    const setInitialDataWriterDialogIsOpen = useSetRecoilState(isDialogOpenSelector('initialDataWriterDialog'));

    // #endregion
    // #region メソッド

    const closeDialog = React.useCallback(() => {
        setIsDialogOpen(false);
    }, [setIsDialogOpen]);

    // #endregion
    // #region ハンドラ

    const handleClose = React.useCallback(() => {
        closeDialog();
    }, [closeDialog]);

    const handleJsonReadButtonInputChange = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const text = await file.text();
            setReadJson(text);
        }
    }, [setReadJson]);

    const handleJsonReadButtonClick = React.useCallback(() => {
        try {
            if (readJson) {
                const jsonData = JSON.parse(readJson) as MedicalExpenseInfo[];
                if (data.length > 0) {
                    if (!window.confirm('既にデータが入力されています。置き換えますか？')) {
                        return;
                    }
                }
                setData(jsonData);
                localStorage.setItem('medicalExpenseData', JSON.stringify(jsonData));
                alert('JSONファイルが正常に読み込まれました。');
            }
            else {
                alert('JSONファイルが選択されていません。');
            }
        } catch (error) {
            console.error('Error reading JSON file:', error);
            alert('JSONファイルの読み込み中に未補足の例外が発生しました。');
        }
    }, [readJson, setData]);

    const handleJsonWriteButtonClick = React.useCallback(async () => {
        const sortedData = [...data].sort((a, b) => a.id - b.id);
        const json = JSON.stringify(sortedData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `MedicalExpenseFormData_${date}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [data]);

    const handleDownloadButtonClick = React.useCallback(async () => {
        if (data.length === 0) {
            alert('入力が完了されていません。');
            return;
        }
        const operatingFile = await getCachedTemplateFile();
        if (!operatingFile) {
            alert('医療費集計フォームのテンプレートが挿入されていません。');
            return;
        }
        try {
            const workBook = await writeMEWorkBook(data, operatingFile, XlsxSheetName);
            const buffer = await workBook.xlsx.writeBuffer();
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
    }, [data, getCachedTemplateFile]);

    const handleResetAllButtonClick = React.useCallback(() => {
        const confirm = window.confirm('本当にすべての入力内容を削除しますか？');
        if (confirm) {
            localStorage.removeItem('medicalExpenseData');
            localStorage.removeItem('cachedFile');
            setData([]);
            alert('すべての入力内容が削除されました。');
            setInitialDataWriterDialogIsOpen(true);
        }
    }, [window, localStorage]);

    // #endregion
    // #region 副作用

    // データが読み込まれたときにローカルストレージを更新
    React.useEffect(() => {
        localStorage.setItem('medicalExpenseData', JSON.stringify(data));
        console.log("saving data to cache, data", data);
    }, [data]);

    // #endregion
    return (
        <Dialog open={isDialogOpen} onClose={handleClose} fullWidth>
            <DialogContent sx={{ display: 'flex', flexDirection: 'row', backgroundColor: '#d6e9ca' }}>
                <Box sx={{ width: '40%' }}>
                    <List>
                        <ListItemButton
                            onClick={React.useCallback(() => setSelectedSection(MEDataWriterSections.Download), [])}
                            selected={selectedSection === MEDataWriterSections.Download}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: '#93ca76'
                                },
                            }}
                        >
                            <ListItemText primary={MEDataWriterSections.Download} />
                        </ListItemButton>
                        <ListItemButton
                            onClick={React.useCallback(() => setSelectedSection(MEDataWriterSections.JsonSaveAndLoad), [])}
                            selected={selectedSection === MEDataWriterSections.JsonSaveAndLoad}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: '#93ca76'
                                },
                            }}
                        >
                            <ListItemText primary={MEDataWriterSections.JsonSaveAndLoad} />
                        </ListItemButton>
                        <ListItemButton
                            onClick={React.useCallback(() => setSelectedSection(MEDataWriterSections.AllClear), [])}
                            selected={selectedSection === MEDataWriterSections.AllClear}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: '#93ca76'
                                },
                            }}
                        >
                            <ListItemText primary={MEDataWriterSections.AllClear} />
                        </ListItemButton>
                    </List>
                </Box>
                <Box display={'flex'} sx={{ margin: 1, padding: 1, bgcolor: 'white', width: '60%' }}>
                    {selectedSection === MEDataWriterSections.Download && (
                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} sx={{ width: '100%' }}>
                            <Button variant="contained" color="primary" onClick={handleDownloadButtonClick}>ダウンロード</Button>
                        </Box>
                    )}
                    {selectedSection === MEDataWriterSections.JsonSaveAndLoad && (
                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} sx={{ width: '100%' }}>
                            <Box display={'flex'} flexDirection={'row'} margin={1}>
                                <Button variant="contained" fullWidth onClick={handleJsonWriteButtonClick}>JSONファイルに書込</Button>
                            </Box>
                            <Box display={'flex'} flexDirection={'column'} margin={1}>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleJsonReadButtonInputChange}
                                />
                                <Button variant="contained" onClick={handleJsonReadButtonClick}>JSONファイルを読込</Button>
                            </Box>
                        </Box>
                    )}
                    {selectedSection === MEDataWriterSections.AllClear && (
                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} sx={{ width: '100%' }}>
                            <Button variant="contained" color="primary" onClick={handleResetAllButtonClick}>
                                オールクリア
                            </Button>
                        </Box>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}