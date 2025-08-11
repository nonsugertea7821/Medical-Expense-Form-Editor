import ExcelJS from 'exceljs';
import React from 'react';

function toBase64Str(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function toArrayBuffer(str: string): ArrayBuffer {
    const binaryStr = atob(str);
    const length = binaryStr.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }
    return bytes.buffer;
}

export default function useTemplateFile() {

    const setTemplateFileCache = React.useCallback(async (templateFile: ExcelJS.Workbook) => {
        // Save the file data to localStorage
        const buffer = await templateFile.xlsx.writeBuffer();
        const fileData = toBase64Str(buffer);
        localStorage.setItem('cachedFile', fileData);
        alert('ファイルを読み込みました');
    }, []);

    const getCachedTemplateFile = React.useCallback(async () => {
        // Load the cached file from localStorage if it exists
        const cachedFileData = localStorage.getItem('cachedFile');
        if (cachedFileData) {
            const buffer = toArrayBuffer(cachedFileData);
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            return workbook;
        }
    }, [localStorage]);

    const resetTemplateFileCache = React.useCallback(() => {
        localStorage.removeItem('cachedFile');
    }, []);

    return {
        setTemplateFileCache,
        getCachedTemplateFile,
        resetTemplateFileCache
    }
}