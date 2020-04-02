import React from 'react';
import { useHarNyDialog } from '../../felles-komponenter/feature/feature';
import loggEvent, { APNE_DIALOG } from '../../felles-komponenter/utils/logging';
import TallAlert from '../../felles-komponenter/tall-alert';
import LenkeTilDialog from '../dialog/DialogLink';
import InternLenke from '../../felles-komponenter/utils/internLenke';
import classNames from 'classnames';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';

const knapplenkeCls = (className: string, disabled: boolean) =>
    classNames(className, {
        knappelenke: !disabled,
        'knappelenke knappelenke--disabled': disabled
    });

interface Props {
    dialogLaster?: boolean;
    antallUlesteDialoger: number;
}

//TODO remove this when the toggel is removed
export function DialogLenkeToggel(props: Props) {
    const { dialogLaster, antallUlesteDialoger } = props;
    const toggel = useHarNyDialog();

    if (toggel) {
        return (
            <LenkeTilDialog
                className={knapplenkeCls('aktivitetskort__henvendelser', !dialogLaster)}
                onClick={() => loggEvent(APNE_DIALOG)}
                aria-live="polite"
            >
                <TallAlert hidden={antallUlesteDialoger <= 0}>{antallUlesteDialoger}</TallAlert>
                <span>
                    Dialog <HoyreChevron />
                </span>
            </LenkeTilDialog>
        );
    }

    return (
        <InternLenke
            href="/dialog"
            className={knapplenkeCls('aktivitetskort__henvendelser', !dialogLaster)}
            onClick={() => loggEvent(APNE_DIALOG)}
            aria-live="polite"
        >
            <TallAlert hidden={antallUlesteDialoger <= 0}>{antallUlesteDialoger}</TallAlert>
            <span>Dialog</span>
        </InternLenke>
    );
}
