import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from '@mui/material';
import React, { useState } from 'react';

const Explain: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState('諸注意');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSectionChange = (section: string) => {
        setSelectedSection(section);
    };

    return (
        <>
            <Button
                onClick={handleClickOpen}
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ marginRight: '20%', marginLeft: '20%', marginTop: '20px', marginBottom: '20px' }}
            >説明</Button>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth >
                <DialogContent sx={{ display: 'flex', flexDirection: 'row', backgroundColor: '#d6e9ca' }}>
                    <Box sx={{ display: 'flex', }}></Box>
                    <Box sx={{ width: 240, flexShrink: 0 }}>
                        <List>
                            <ListItem>
                                <ListItemButton
                                    onClick={() => handleSectionChange('諸注意')}
                                    selected={selectedSection === '諸注意'}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: '#93ca76'
                                        },
                                    }}
                                >
                                    <ListItemText primary="諸注意" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton
                                    onClick={() => handleSectionChange('ご利用にあたって')}
                                    selected={selectedSection === 'ご利用にあたって'}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: '#93ca76'
                                        },
                                    }}
                                >
                                    <ListItemText primary="ご利用にあたって" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton
                                    onClick={() => handleSectionChange('各項目の入力について')}
                                    selected={selectedSection === '各項目の入力について'}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: '#93ca76'
                                        },
                                    }}
                                >
                                    <ListItemText primary="各項目の入力について" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton
                                    onClick={() => handleSectionChange('操作方法')}
                                    selected={selectedSection === '操作方法'}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: '#93ca76'
                                        },
                                    }}
                                >
                                    <ListItemText primary="操作方法" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton
                                    onClick={() => handleSectionChange('お問い合わせ')}
                                    selected={selectedSection === 'お問い合わせ'}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: '#93ca76'
                                        },
                                    }}
                                >
                                    <ListItemText primary="お問い合わせ" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                    <Box sx={{ marginLeft: 2, flexGrow: 1, backgroundColor: 'white', borderRadius: '3px', padding: '40px' }}>
                        {selectedSection === '諸注意' && (
                            <DialogContentText>
                                このアプリケーションは、医療費集計フォームの編集を補助するために作成されています。<br />
                                税理業務の代行を行うものではなく、このアプリケーションの使用に際して発生した損害について、作者は一切の責任を負いません。<br />
                                生成されたファイルについては、必ずご自身で内容を確認してください。<br />
                                <br />
                                なおこのアプリケーションは、外部との通信を一切行っていません。<br />
                                フォームの編集に使用するデータは、お使いのブラウザに保存されます。<br />
                            </DialogContentText>
                        )}
                        {selectedSection === 'ご利用にあたって' && (
                            <DialogContentText>
                                <p>フォームをダウンロードした後、所得税の確定申告書作成コーナーの医療費控除の入力画面で読み込むことで、入力した内容が反映されます。</p>
                                <p>セルフメディケーション税制を適用される場合にはご利用いただけません。</p>
                                <p>セルフメディケーション税制を適用される場合、所得税の確定申告書等作成コーナーの画面から直接入力してください。</p>
                                <p>令和３年分以前の確定申告書等を作成される方は、医療費通知（「医療費のお知らせ」など）を利用する場合にはご利用いただけません。</p>
                                <p>ファイルの印刷については、ダウンロードしたファイルの「ご利用にあたって」をご確認ください。</p>
                            </DialogContentText>
                        )}
                        {selectedSection === '各項目の入力について' && (
                            <DialogContentText component="div" sx={{ marginBottom: "20px" }}>
                                <TableContainer component={Paper} sx={{ backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ padding: '10px', fontWeight: 'bold', width: '35%' }}>医療を受けた人</TableCell>
                                                <TableCell sx={{ padding: '10px' }}>医療を受けた方の氏名を入力してください</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ padding: '10px', fontWeight: 'bold' }}>病院・薬局などの名称</TableCell>
                                                <TableCell sx={{ padding: '10px' }}>診療を受けた病院や医薬品を購入した薬局などの名称を入力してください。</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ padding: '10px', fontWeight: 'bold' }}>医療費の区分<br />（チェックボックス）</TableCell>
                                                <TableCell sx={{ padding: '10px' }}>医療費の内容として該当するものを全てチェックしてください。</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ padding: '10px', fontWeight: 'bold' }}>支払った医療費の金額</TableCell>
                                                <TableCell sx={{ padding: '10px' }}>申告する年中に支払った金額のうち、医療費控除の対象となる金額を入力してください。</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ padding: '10px', fontWeight: 'bold' }}>補填される医療費の金額</TableCell>
                                                <TableCell sx={{ padding: '10px' }}>生命保険契約などで支給される入院費給付金や、健康保険などで支給される高額療養費・家族療養費・出産育児一時金などの金額を入力してください。</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <p>(注)補填される医療費の金額が支払った医療費の金額を上回る場合は、支払った医療費の金額と同じ額を入力してください。</p>
                            </DialogContentText>
                        )}
                        {selectedSection === '操作方法' && (
                            <DialogContentText>
                                <p>Tabキー:次の入力欄に移動します</p>
                                <p>delキー:入力内容を削除します。</p>
                                <p>上下矢印キー:予測候補を選択します。</p>
                                <p>入力を完了：入力された情報がファイルに書き込まれます</p>
                                <p>ダウンロード：ファイルをダウンロードできます(必ず入力を完了してから押してください)</p>
                                <p>クリア：全ての入力情報とキャッシュが削除されます。初めからやり直したいときに押してください。</p>
                            </DialogContentText>
                        )}
                        {selectedSection === 'お問い合わせ' && (
                            <DialogContentText>
                                <p>このアプリケーションに関するお問い合わせは、下記のメールアドレスまでお願いいたします。</p>
                                <p>※★を@に変えて使用してください。</p>
                                <p>メールアドレス: nonsugertea7821+GitPages★gmail.com</p>
                            </DialogContentText>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#d6e9ca' }}>
                    <Button onClick={handleClose} color="primary">
                        閉じる
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Explain;
