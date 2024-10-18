import { Autocomplete, Box, Button, Checkbox, FormControlLabel, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IExcelData, MEFormContainerProps } from './interface.tsx';
import Validation from './validation.tsx';

const initialEntry: IExcelData = {
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
};

const MedicalExpenseForm: React.FC<MEFormContainerProps> = ({ initialData, deliverData }) => {
    useEffect(() => {
        console.log("MedicalExpenseForm:InitialData is ", initialData);
    }, [initialData]);

    const [formData, setFormData] = useState<IExcelData[]>([]);
    const [currentEntry, setCurrentEntry] = useState<IExcelData>({ ...initialEntry });
    const [error, setError] = useState<string | null>(null);
    const [previousEntry, setPreviousEntry] = useState<IExcelData | null>(null);

    const [uniqueCandidateOfName, setUniqueCandidateOfName] = useState<string[]>([]);
    const [uniqueCandidateOfInstitution, setUniqueCandidateOfInstitution] = useState<string[]>([]);
    
    const validation = new Validation(formData);

    useEffect(() => {
        setFormData(initialData);
        if (initialData.length > 0) {
            const lastEntry = initialData[initialData.length - 1];
            setPreviousEntry({
                ...lastEntry,
                paymentDate: lastEntry.paymentDate ? new Date(lastEntry.paymentDate) : undefined
            });
        } else {
            setPreviousEntry(null);
        }
    }, [initialData]);

    useEffect(() => {
        setUniqueCandidateOfName([...new Set(formData.map((entry) => entry.name))]);
        setUniqueCandidateOfInstitution([...new Set(formData.map((entry) => entry.institution))]);
    }, [formData]);

    const handleChange = (field: keyof IExcelData, value: string | number | boolean | Date | undefined) => {
        setCurrentEntry({ ...currentEntry, [field]: value });
    };

    const handleClearField = (field: keyof IExcelData) => {
        switch (field) {
            case 'name':
            case 'institution':
                handleChange(field, '');
                break;
            case 'medicalExpense':
            case 'reimbursedAmount':
                handleChange(field, NaN);
                break;
            case 'paymentDate':
                handleChange(field, undefined);
                break;
            default:
                break;
        }
    };

    const handleSubmit = () => {
        deliverData(formData);
    };

    const addNewEntry = () => {
        if (validation.isDuplicate(currentEntry)) {
            setError('同一内容の受診データが既に存在します。');
            if (window.confirm('同一内容の受診データが既に存在します。追加しますか？')) {
            setError(null);
            } else {
            return;
            }
        }

        if(validation.isOutOfRangeDate(currentEntry, 2023)){
            setError('支払年月日が範囲外です。');
            return;
        }

        if(validation.NameCharacterLimitExceeded(currentEntry)){
            setError('名前が10文字を超えています。');
            return;
        }

        if(validation.InstitutionCharacterLimitExceeded(currentEntry)){
            setError('医療施設名が20文字を超えています。');
            return;
        }

        setError(null);
        setPreviousEntry(currentEntry);
        setFormData([...formData, { ...currentEntry, id: formData.length + 1 }]);
        setCurrentEntry({ ...initialEntry, id: formData.length + 2 });
    };


    const handleBack = () => {
        if (formData.length > 0) {
            const newFormData = [...formData];
            const lastEntry = newFormData.pop();
            
            // paymentDateがDateオブジェクトであることを確認
            if (lastEntry && typeof lastEntry.paymentDate === 'string') {
                lastEntry.paymentDate = new Date(lastEntry.paymentDate);
            }
    
            setFormData(newFormData);
            setCurrentEntry(lastEntry || { ...initialEntry });
            setPreviousEntry(newFormData.length > 0 ? newFormData[newFormData.length - 1] : null);
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>現在のデータの個数: {formData.length}</Typography>
            {previousEntry && (
                <Box mb={2}>
                    <Typography variant="subtitle1">一つ前に入力されたデータ:</Typography>
                    <Table sx={{ mt: 1, border: '1px solid', borderColor: 'grey.300', borderRadius: '4px' }}>
                        <TableHead sx={{ bgcolor: 'grey.200' }}>
                            <TableRow>
                                <TableCell sx={{ width: '25%' }}>項目</TableCell>
                                <TableCell>内容</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>医療を受けた人</TableCell>
                                <TableCell>{previousEntry.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>病院・薬局などの名称</TableCell>
                                <TableCell>{previousEntry.institution}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>医療費の区分</TableCell>
                                <TableCell>
                                    {[
                                        previousEntry.includes_Treatment && '診療・治療',
                                        previousEntry.includes_Medication && '医薬品の購入',
                                        previousEntry.includes_CareService && '介護保険サービス',
                                        previousEntry.includes_OtherMedicalExpenses && 'その他の医療費'
                                    ].filter(Boolean).join(', ')}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>支払った医療費の金額</TableCell>
                                <TableCell>{previousEntry.medicalExpense}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>支払った医療費のうち、補填される金額</TableCell>
                                <TableCell>{previousEntry.reimbursedAmount}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>支払年月日</TableCell>
                                <TableCell>
                                    {previousEntry.paymentDate 
                                        ? (previousEntry.paymentDate instanceof Date 
                                            ? previousEntry.paymentDate.toISOString().split('T')[0] 
                                            : new Date(previousEntry.paymentDate).toISOString().split('T')[0]) 
                                        : 'N/A'}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            )}
            <Box mb={2}>
                <Button variant="contained" color="primary" onClick={handleBack} disabled={formData.length === 0}>
                    一つ前の入力に戻る
                </Button>
            </Box>
            <Box mb={2}>
                <Autocomplete
                    freeSolo
                    options={uniqueCandidateOfName}
                    inputValue={currentEntry.name}
                    onInputChange={(_event, newInputValue) => {
                        try {
                            handleChange('name', newInputValue);
                        } catch (error) {
                            console.error('Error updating name:', error);
                            setError('名前の更新中にエラーが発生しました。');
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="医療を受けた人"
                            type="text"
                            required
                            fullWidth
                            margin="normal"
                            onKeyDown={(e) => {
                                if (e.key === 'Delete') {
                                    handleClearField('name');
                                }
                            }}
                        />)}
                />
                <Autocomplete
                    freeSolo
                    options={uniqueCandidateOfInstitution}
                    inputValue={currentEntry.institution}
                    onInputChange={(_event, newInputValue) => {
                        try {
                            handleChange('institution', newInputValue);
                        } catch (error) {
                            console.error('Error updating institution:', error);
                            setError('施設名の更新中にエラーが発生しました。');
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="病院・薬局などの名称"
                            type="text"
                            required
                            fullWidth
                            margin="normal"
                            onKeyDown={(e) => {
                                if (e.key === 'Delete') {
                                    handleClearField('institution');
                                }
                            }}
                        />)}
                />
                <Box component="fieldset" borderColor="transparent" border='solid 1px lightgray'>
                    <Typography component="legend" sx={{ color: 'gray', fontSize: '0.8rem' }}>
                        医療費の区分(複数選択可)
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={currentEntry.includes_Treatment}
                                onChange={(e) => {
                                    try {
                                        handleChange('includes_Treatment', e.target.checked);
                                    } catch (error) {
                                        console.error('Error updating includes_Treatment:', error);
                                        setError('診療・治療の更新中にエラーが発生しました。');
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        try {
                                            handleChange('includes_Treatment', !currentEntry.includes_Treatment);
                                        } catch (error) {
                                            console.error('Error updating includes_Treatment:', error);
                                            setError('診療・治療の更新中にエラーが発生しました。');
                                        }
                                    }
                                }}
                            />
                        }
                        label="診療・治療"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={currentEntry.includes_Medication}
                                onChange={(e) => {
                                    try {
                                        handleChange('includes_Medication', e.target.checked);
                                    } catch (error) {
                                        console.error('Error updating includes_Medication:', error);
                                        setError('医薬品の購入の更新中にエラーが発生しました。');
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        try {
                                            handleChange('includes_Medication', !currentEntry.includes_Medication);
                                        } catch (error) {
                                            console.error('Error updating includes_Medication:', error);
                                            setError('医薬品の購入の更新中にエラーが発生しました。');
                                        }
                                    }
                                }}
                            />
                        }
                        label="医薬品の購入"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={currentEntry.includes_CareService}
                                onChange={(e) => {
                                    try {
                                        handleChange('includes_CareService', e.target.checked);
                                    } catch (error) {
                                        console.error('Error updating includes_CareService:', error);
                                        setError('介護保険サービスの更新中にエラーが発生しました。');
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        try {
                                            handleChange('includes_CareService', !currentEntry.includes_CareService);
                                        } catch (error) {
                                            console.error('Error updating includes_CareService:', error);
                                            setError('介護保険サービスの更新中にエラーが発生しました。');
                                        }
                                    }
                                }}
                            />
                        }
                        label="介護保険サービス"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={currentEntry.includes_OtherMedicalExpenses}
                                onChange={(e) => {
                                    try {
                                        handleChange('includes_OtherMedicalExpenses', e.target.checked);
                                    } catch (error) {
                                        console.error('Error updating includes_OtherMedicalExpenses:', error);
                                        setError('その他の医療費の更新中にエラーが発生しました。');
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        try {
                                            handleChange('includes_OtherMedicalExpenses', !currentEntry.includes_OtherMedicalExpenses);
                                        } catch (error) {
                                            console.error('Error updating includes_OtherMedicalExpenses:', error);
                                            setError('その他の医療費の更新中にエラーが発生しました。');
                                        }
                                    }
                                }}
                            />
                        }
                        label="その他の医療費"
                    />
                </Box>
                <TextField
                    label="支払った医療費の金額"
                    type="number"
                    value={isNaN(currentEntry.medicalExpense) ? '' : currentEntry.medicalExpense}
                    required
                    onChange={(e) => {
                        try {
                            handleChange('medicalExpense', e.target.value === '' ? NaN : parseFloat(e.target.value));
                        } catch (error) {
                            console.error('Error updating medicalExpense:', error);
                            setError('医療費の金額の更新中にエラーが発生しました。');
                        }
                    }}
                    fullWidth
                    margin="normal"
                    onKeyDown={(e) => {
                        if (e.key === 'Delete') {
                            handleClearField('medicalExpense');
                        }
                    }}
                />
                <TextField
                    label="支払った医療費のうち、補填される金額"
                    type="number"
                    required
                    value={isNaN(currentEntry.reimbursedAmount) ? '' : currentEntry.reimbursedAmount}
                    onChange={(e) => {
                        try {
                            handleChange('reimbursedAmount', e.target.value === '' ? NaN : parseFloat(e.target.value));
                        } catch (error) {
                            console.error('Error updating reimbursedAmount:', error);
                            setError('補填される金額の更新中にエラーが発生しました。');
                        }
                    }}
                    fullWidth
                    margin="normal"
                    onKeyDown={(e) => {
                        if (e.key === 'Delete') {
                            handleClearField('reimbursedAmount');
                        }
                    }}
                />
                <TextField
                    label="支払年月日"
                    type="date"
                    value={currentEntry.paymentDate ? currentEntry.paymentDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        try {
                            const newDate = new Date(e.target.value);
                            if (!isNaN(newDate.getTime())) {
                                handleChange('paymentDate', newDate);
                            }
                        } catch (error) {
                            console.error('Error updating paymentDate:', error);
                            setError('支払年月日の更新中にエラーが発生しました。');
                        }
                    }}
                    fullWidth
                    margin="normal"
                    onKeyDown={(e) => {
                        if (e.key === 'Delete') {
                            handleClearField('paymentDate');
                        }
                    }}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        }
                    }}
                />
            </Box>
            {error && <Typography color="error">{error}</Typography>}
            <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="contained" color="primary" onClick={addNewEntry}>
                    受診データを追加
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                >
                    入力を終了
                </Button>
            </Box>
        </Paper>
    );
};

export default MedicalExpenseForm;