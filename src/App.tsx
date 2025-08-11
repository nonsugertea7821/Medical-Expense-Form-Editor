import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';

import { useRecoilCallback } from 'recoil';
import ExplainDialog from './assets/ExplainDialog.tsx';
import useMEFormContainer from './assets/hooks/useMedicalExpenseForm.ts';
import InitialDataWriterDialog from './assets/InitialDataWriterDialog.tsx';
import MEDataWriter from './assets/MEDataWriter.tsx';
import MEFormContainer from './assets/MEFormContainer.tsx';
import ErrorBoundary from './ErrorBoundary.tsx';
import { isDialogOpenSelector } from './store/selector/dialogSelector.ts';

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  color: 'white',
  backgroundColor: 'darkGreen',
  padding: '10px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  gap: 2,
});

const HeaderButton = styled(Button)({
  backgroundColor: 'white',
  color: 'darkGreen',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  padding: '10px',
  margin: '5px'
});

export default function App(): JSX.Element {

  // 医療費フォームの状態を管理
  const { componentState: meFormContainerState } = useMEFormContainer();
  
  return (
    <>
      <InitialDataWriterDialog />
      <Header>
        <Typography sx={{ width: '90%', display: 'flex', fontSize: '1.5rem', padding: '10px' }}>医療費集計フォーム 入力補助アプリ</Typography>
        <HeaderButton onClick={useRecoilCallback(({ set }) => () => { set(isDialogOpenSelector('meDataWriterDialog'), true) }, [])} >機能</HeaderButton>
        <MEDataWriter />
        <HeaderButton onClick={useRecoilCallback(({ set }) => () => { set(isDialogOpenSelector('explainDialog'), true) }, [])}>説明 </HeaderButton>
        <ExplainDialog />
      </Header>
      <ErrorBoundary>
        <MEFormContainer componentState={meFormContainerState} />
      </ErrorBoundary>
    </>
  );
};