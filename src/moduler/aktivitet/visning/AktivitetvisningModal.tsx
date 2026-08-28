import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { AlleAktiviteter, isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import Innholdslaster, { Avhengighet } from '../../../felles-komponenter/utils/Innholdslaster';
import { aktivitetStatusMap, getAktivitetType } from '../../../utils/textMappers';
import { selectDialogFeilmeldinger } from '../../dialog/dialog-selector';
import { selectAktivitetFeilmeldinger } from '../aktivitet-selector';
import { selectArenaFeilmeldinger } from '../arena-aktivitet-selector';
import { skalMarkereForhaandsorienteringSomLest } from './avtalt-container/utilsForhaandsorientering';
import { Heading } from '@navikt/ds-react';
import Feilmelding from '../../feilmelding/Feilmelding';

const DIALOG_TEKST = 'Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?';

interface Props {
    aktivitet?: AlleAktiviteter;
    avhengigheter: Avhengighet[];
    children: React.ReactNode;
}

const emptySelector = () => [];

const AktivitetvisningModal = (props: Props) => {
    const { aktivitet, avhengigheter, children } = props;

    const selectFeilMeldinger = (a: AlleAktiviteter) =>
        isArenaAktivitet(a) ? selectArenaFeilmeldinger : selectAktivitetFeilmeldinger;
    const aktivitetFeilSelector = aktivitet === undefined ? emptySelector : selectFeilMeldinger(aktivitet);

    const aktivitetFeil = useSelector(aktivitetFeilSelector, shallowEqual);
    const dialogFeil = useSelector(selectDialogFeilmeldinger, shallowEqual);
    const alleFeil = [...aktivitetFeil, ...dialogFeil];

    const subHeading = aktivitet
        ? `${aktivitetStatusMap[aktivitet.status]} / ${getAktivitetType(aktivitet)}`
        : undefined;
    const feilmeldinger = alleFeil;

    return (
        <div className="flex flex-col max-w-2xl mx-auto">
            {subHeading ? (
                <Heading className="" level="2" size="xsmall">
                    {subHeading}
                </Heading>
            ) : null}
            {feilmeldinger && <Feilmelding feilmeldinger={feilmeldinger} />}
            <Innholdslaster className="flex m-auto my-8" minstEn={false} avhengigheter={avhengigheter}>
                {children}
            </Innholdslaster>
        </div>
    );
};

export const skalBlokkereLukkingAvModalAktivitetsVisningPgaFHO = (
    aktivitet: AlleAktiviteter | undefined,
    erBruker: boolean,
): boolean => {
    const fho = aktivitet?.forhaandsorientering;
    const skalLeses = skalMarkereForhaandsorienteringSomLest(erBruker ?? false, aktivitet);
    return (fho && skalLeses) || false;
};

export const canCloseAktivitetVisnings = (dirty: { isDirty: boolean }, skalBlokkereLukking: boolean) => {
    if (dirty.isDirty) {
        // Avoid calling focus if not dirty
        window.focus();
        const userWantToClose = window.confirm(DIALOG_TEKST);
        return userWantToClose;
    }
    if (skalBlokkereLukking) {
        window.alert('Det er en viktig beskjed om ansvaret ditt som du må lese.');
        return false;
    }
    return true;
};

export default AktivitetvisningModal;
