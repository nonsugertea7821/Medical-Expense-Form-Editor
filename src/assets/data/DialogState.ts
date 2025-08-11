export interface DialogState {
    [key: string]: {
        isOpen?: boolean;
    };
};

export const DefaultDialogState: DialogState = {
    initialDataWriterDialog: { isOpen: true },
    introductionDialog: { isOpen: true },
    explainDialog: { isOpen: false },
    meDataWriterDialog: { isOpen: false },
};