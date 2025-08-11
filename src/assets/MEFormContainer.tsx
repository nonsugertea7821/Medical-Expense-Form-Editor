import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, Typography } from '@mui/material';
import { MEFormContainerState } from './hooks/useMedicalExpenseForm.ts';
import DGMedicalExpenseInfoList from './parts/DGMedicalExpenseInfoList.tsx';
import MedicalExpenseForm from './parts/MEForm.tsx';

interface Props {
    componentState: MEFormContainerState;
}

/**
 * 医療費フォームコンポーネント
 * @returns 医療費フォームコンポーネント
 */
export default function MEFormContainer(props:Props):JSX.Element{

    const {
        rowsState,
        currentEntry,
        uniqueCandidateOfName,
        uniqueCandidateOfInstitution,
        formHandlers,
        error,
        handleAddNewEntryButtonClick,
        handleBackEntryButtonClick,
    } = props.componentState;

    const [rows] = rowsState;

    return (
        <Paper elevation={3} sx={{ padding: '20px' }}>
            <MedicalExpenseForm
                currentEntry={currentEntry}
                uniqueCandidateOfName={uniqueCandidateOfName}
                uniqueCandidateOfInstitution={uniqueCandidateOfInstitution}
                handlers={formHandlers} 
            />
            {error && <Typography color="error">{error}</Typography>}
            <Box display="flex" justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
            <Box display="flex" justifyContent="flex-start" sx={{ gap: 1 }}>
                <Button variant="contained" color="secondary" onClick={handleBackEntryButtonClick} disabled={rows.length === 0}>
                    一つ前の入力に戻る
                </Button>
            </Box>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={handleAddNewEntryButtonClick} >
                    受診データを追加
                </Button>
            </Box>
            </Box>
            <Accordion>
                <AccordionSummary sx={{ color:'white',backgroundColor:'gray'}}> 入力データ確認 </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: 'lightgray' }}>
                <Box sx={{ p: 2 }}>
                    <Typography>現在のデータの個数: {rows.length}</Typography>
                    <DGMedicalExpenseInfoList rowsState={rowsState} />
                </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};