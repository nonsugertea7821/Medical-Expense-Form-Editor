import { Box } from '@mui/material';
import { Buffer } from 'buffer';
import ExcelJS from 'exceljs';
import React from 'react';
import { xlsxFileContainerProps } from './interface.tsx';

const XlsxFileReader: React.FC<xlsxFileContainerProps> = ({ deliverFile }) => {
    const [file, setFile] = React.useState<ExcelJS.Workbook>(new ExcelJS.Workbook());
    const [hasCache, setHasCache] = React.useState<boolean>(false);

    const handleClick = () => {
        deliverFile(file);

        // Save the file data to localStorage
        file.xlsx.writeBuffer().then((buffer) => {
            const fileData = Buffer.from(buffer).toString('base64');
            localStorage.setItem('cachedFile', fileData);
            setHasCache(true);
        });

        alert('ファイルを読み込みました');
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const workbook = new ExcelJS.Workbook();
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await workbook.xlsx.load(buffer);
            setFile(workbook);
        }
    };

    const handleClearCache = () => {
        localStorage.removeItem('cachedFile');
        setFile(new ExcelJS.Workbook());
        setHasCache(false);
        alert('キャッシュを削除しました');
    };

    React.useEffect(() => {
        // Load the cached file from localStorage if it exists
        const cachedFileData = localStorage.getItem('cachedFile');
        if (cachedFileData) {
            const buffer = Buffer.from(cachedFileData, 'base64');
            const workbook = new ExcelJS.Workbook();
            workbook.xlsx.load(buffer).then(() => {
                setFile(workbook);
                setHasCache(true);
            });
            deliverFile(file);
        }
    }, [deliverFile, file]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={1}
            alignItems="safe-center"
            p={2}
            bgcolor="background.paper"
            boxShadow={1}
            borderRadius={1}
            sx={{ width: '100%' }}
        >
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
    );
}

export default XlsxFileReader;