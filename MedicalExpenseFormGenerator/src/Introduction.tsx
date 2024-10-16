import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Introduction = ({ onComplete }: { onComplete: () => void }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const hasSeenIntroduction = localStorage.getItem("hasSeenIntroduction");
        if (!hasSeenIntroduction) {
            setOpen(true);
        } else {
            onComplete();
        }
    }, [onComplete]);

    const handleClose = () => {
        localStorage.setItem("hasSeenIntroduction", "true");
        setOpen(false);
        onComplete();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>初めに</DialogTitle>
            <DialogContent>
                <Typography>
                    このアプリケーションは、医療費集計フォームを編集するためのものです。<br />
                    税理業務の代行を行うものではなく、このアプリケーションの使用に際して発生した損害について、作者は一切の責任を負いません。<br />
                    予めご了承のほどよろしくお願いいたします。<br />
                    <br />
                    なおこのアプリケーションは、外部との通信を一切行っていません。<br />
                    フォームの編集に使用するデータは、お使いのブラウザに保存されます。<br />
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>理解しました</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Introduction;