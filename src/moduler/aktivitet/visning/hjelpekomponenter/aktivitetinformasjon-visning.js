import { Sidetittel } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    STILLING_AKTIVITET_TYPE,
} from '../../../../constant';
import InternLenke from '../../../../felles-komponenter/utils/InternLenke';
import loggEvent, { APNE_ENDRE_AKTIVITET } from '../../../../felles-komponenter/utils/logging';
import * as AppPT from '../../../../proptypes';
import { endreAktivitetRoute } from '../../../../routes';
import AvtaltMarkering from '../../avtalt-markering/avtalt-markering';
import AktivitetIngress from '../aktivitetingress/aktivitetingress';
import DeleLinje from '../delelinje/delelinje';
import Aktivitetsdetaljer from './aktivitetsdetaljer';
import IkkeDeltMarkering from '../../ikke-delt-markering/IkkeDeltMarkering';
import {selectErVeileder} from '../../../identitet/identitet-selector';
import {selectDialogForAktivitetId} from '../../../dialog/dialog-selector';
import {useSelector} from 'react-redux';

function visningsIngress(type) {
    if (
        [EGEN_AKTIVITET_TYPE, IJOBB_AKTIVITET_TYPE, STILLING_AKTIVITET_TYPE, BEHANDLING_AKTIVITET_TYPE].includes(type)
    ) {
        return null;
    }

    return <AktivitetIngress aktivitetsType={type} />;
}

function AktivitetinformasjonVisning({ valgtAktivitet, tillatEndring, laster, underOppfolging }) {
    const { id, tittel, type, arenaAktivitet, avtalt, erReferatPublisert } = valgtAktivitet;

    const erVeileder = useSelector(selectErVeileder);
    const manglerReferat = type === SAMTALEREFERAT_TYPE && erVeileder && !erReferatPublisert;
    const dialog = useSelector((state) => selectDialogForAktivitetId(state, id))
    const manglerDialog = type === MOTE_TYPE && erVeileder && !dialog;
    const ikkeDelt = manglerReferat || manglerDialog;

    return (
        <div>
            <div className="aktivitetvisning__underseksjon">
                <div className="aktivitetvisning__header">
                    <Sidetittel id="modal-aktivitetsvisning-header" className="softbreak">
                        {tittel}
                    </Sidetittel>
                    <InternLenke
                        className="endreknapp"
                        role="button"
                        hidden={!tillatEndring || arenaAktivitet}
                        href={endreAktivitetRoute(id)}
                        onClick={() => loggEvent(APNE_ENDRE_AKTIVITET)}
                        disabled={laster || !underOppfolging}
                    >
                        <FormattedMessage id="aktivitetvisning.endre-knapp" />
                    </InternLenke>
                </div>
                {visningsIngress(type)}
                <AvtaltMarkering visible={avtalt} className="aktivitetvisning__etikett" />
                <IkkeDeltMarkering visible={ikkeDelt} className="aktivitetvisning__etikett" />
                <Aktivitetsdetaljer valgtAktivitet={valgtAktivitet} />
            </div>
            <DeleLinje />
        </div>
    );
}

AktivitetinformasjonVisning.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    tillatEndring: PT.bool.isRequired,
    laster: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
};

export default AktivitetinformasjonVisning;
