import React, { useContext, useImperativeHandle } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router';

import { AlleAktiviteter, isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import Innholdslaster, { Avhengighet } from '../../../felles-komponenter/utils/Innholdslaster';
import { useRoutes } from '../../../routing/useRoutes';
import { aktivitetStatusMap, getAktivitetType } from '../../../utils/textMappers';
import { DirtyContext } from '../../context/dirty-context';
import { selectDialogFeilmeldinger } from '../../dialog/dialog-selector';
import { selectErBruker } from '../../identitet/identitet-selector';
import { selectAktivitetFeilmeldinger } from '../aktivitet-selector';
import { selectArenaFeilmeldinger } from '../arena-aktivitet-selector';
import { skalMarkereForhaandsorienteringSomLest } from './avtalt-container/utilsForhaandsorientering';
import { ModalRouteHandle, OutletContext } from '../../../routing/ModalRoute';
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
    const dirty = useContext(DirtyContext);
    const navigate = useNavigate();
    const { hovedsideRoute } = useRoutes();

    const outletContext = useOutletContext<OutletContext>();
    useImperativeHandle(
        outletContext.modalHandle,
        () => {
            return {
                getHeading: () => {
                    return aktivitet?.tittel;
                },
                onRequestClose: () => {
                    console.log(`Close requested - isDirty ${dirty.isDirty}`);
                    if (dirty.isDirty) {
                        // Avoid calling focus if not dirty
                        window.focus();
                        const userWantToClose = window.confirm(DIALOG_TEKST);
                        if (userWantToClose) {
                            console.log('Close rejected because confirm returned false');
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (skalLeses && fho) {
                        window.alert('Det er en viktig beskjed om ansvaret ditt som du må lese.');
                        return false;
                    }
                    navigate(hovedsideRoute());
                    return true;
                },
            } as ModalRouteHandle;
        },
        [aktivitet, dirty],
    );

    const selectFeilMeldinger = (a: AlleAktiviteter) =>
        isArenaAktivitet(a) ? selectArenaFeilmeldinger : selectAktivitetFeilmeldinger;
    const aktivitetFeilSelector = aktivitet === undefined ? emptySelector : selectFeilMeldinger(aktivitet);

    const aktivitetFeil = useSelector(aktivitetFeilSelector, shallowEqual);
    const dialogFeil = useSelector(selectDialogFeilmeldinger, shallowEqual);
    const alleFeil = [...aktivitetFeil, ...dialogFeil];
    const erBruker = useSelector(selectErBruker);

    const fho = aktivitet?.forhaandsorientering;
    const skalLeses = skalMarkereForhaandsorienteringSomLest(erBruker ?? false, aktivitet);

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

export default AktivitetvisningModal;
