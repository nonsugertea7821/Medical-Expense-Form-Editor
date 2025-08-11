import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React from "react";

export default function IntroductionDialog(): JSX.Element {
    const [open, setOpen] = React.useState<boolean>(false)

    const handleClose = React.useCallback(() => {
        localStorage.setItem("hasSeenIntroduction", "true");
        setOpen(false);
    }, []);

    React.useEffect(() => {
        const hasSeenIntroduction = localStorage.getItem("hasSeenIntroduction");
        if (!hasSeenIntroduction) {
            setOpen(true);
        }
    }, [setOpen]);


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>初めに</DialogTitle>
            <DialogContent>
                <Typography>
                    <p>このアプリケーションは、医療費集計フォームの編集を補助する事を目的に開発されています。</p>
                    <p>以下の事項にご注意下さい。</p>
                    <ul>
                        <li>税理業務の代行を行うものではありません。作成した書類は、ご自身で確認・提出して頂く必要があります。</li>
                        <li>このアプリケーションの使用に際して発生した損害について、作者は一切の責任を負いません。</li>
                        <li>外部との通信を一切行っていません。フォームの編集に使用するデータは、お使いのブラウザに保存されます。</li>
                    </ul>
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>理解しました</Button>
            </DialogActions>
        </Dialog>
    );
};