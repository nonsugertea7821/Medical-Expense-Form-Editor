import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import ExcelJS from 'exceljs';
import React from "react";
import { useRecoilState } from "recoil";
import { isDialogOpenSelector } from "../store/selector/dialogSelector";
import useTemplateFile from "./hooks/useTemplateFile";

export default function InitialDataWriterDialog(): JSX.Element {
    const [isDialogOpen, setIsDialogOpen] = useRecoilState(isDialogOpenSelector('initialDataWriterDialog'));

    const [tempFile, setTempFile] = React.useState<ExcelJS.Workbook>();
    const [hasCache, setHasCache] = React.useState<boolean>();

    const { getCachedTemplateFile, setTemplateFileCache } = useTemplateFile();

    const noop = React.useCallback(() => { }, []);

    const handleClick = React.useCallback(async () => {
        if (tempFile) {
            setTemplateFileCache(tempFile);
            setHasCache(true);
            setIsDialogOpen(false);
        } else {
            alert('ファイルが選択されていません');
        }
    }, [tempFile, setHasCache]);

    const handleFileUpload = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = await new ExcelJS.Workbook().xlsx.load(arrayBuffer);
            setTempFile(workbook);
        }
    }, [setTempFile]);

    const handleClearCache = React.useCallback(() => {
        localStorage.removeItem('cachedFile');
        setTempFile(new ExcelJS.Workbook());
        setHasCache(false);
        alert('キャッシュを削除しました');
    }, [setTempFile]);

    React.useEffect(() => {
        if (isDialogOpen) {
            getCachedTemplateFile().then((file) => {
                if (file) {
                    setTempFile(file);
                    setHasCache(true);
                    setIsDialogOpen(false);
                }else{
                    setHasCache(false);
                }
            });
        }
    }, [isDialogOpen,getCachedTemplateFile]);

    return (
        <Dialog open={isDialogOpen} onClose={noop}>
            <Typography fontSize={19} padding={1} bgcolor="darkgreen" color="white">初期化</Typography>
            <DialogContent>
                <Typography>
                    下記のURLから医療費集計フォームをダウンロードし、ダウンロードしたファイルを選択したのち、確定ボタンを押してください。
                </Typography>
                <a
                    href="https://www.nta.go.jp/taxes/shiraberu/shinkoku/tokushu/keisubetsu/iryou-shuukei.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ wordBreak: 'break-word' }}
                >
                    https://www.nta.go.jp/taxes/shiraberu/shinkoku/tokushu/keisubetsu/iryou-shuukei.htm
                </a>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {!hasCache && (
                        <>
                            <input type="file" onChange={handleFileUpload} />
                            <button onClick={handleClick}>確定</button>
                        </>
                    )}
                    {hasCache && (
                        <>
                            <button onClick={handleClearCache}>再選択</button>
                        </>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}