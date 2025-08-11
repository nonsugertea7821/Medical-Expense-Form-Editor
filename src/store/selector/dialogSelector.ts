import { DefaultValue, selectorFamily } from 'recoil';
import { DefaultDialogState, DialogState } from '../../assets/data/DialogState';
import { dialogState } from '../atom/commonAtom';

// ダイアログの表示状態を取得するRecoil selector
export const isDialogOpenSelector = selectorFamily<boolean, keyof DialogState>({
    key: 'isDialogOpenSelector',
    get: (dialogKey) => ({ get }) => {
        const dialog = get(dialogState)[dialogKey];
        return dialog?.isOpen ?? false;
    },
    set: (dialogKey) => ({ set, get }, newValue) => {
        const prevState = get(dialogState);
        if (newValue instanceof DefaultValue) {
            set(dialogState, {
                ...prevState,
                [dialogKey]: {
                    ...DefaultDialogState[dialogKey]
                },
            });
        } else {
            set(dialogState, {
                ...prevState,
                [dialogKey]: {
                    ...prevState[dialogKey],
                    isOpen:newValue
                },
            });
        }
    },
});