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
import Forhaandsorenteringsvisning from './Forhaandsorenteringsvisning';
import IkkeDeltMarkering from "../../ikke-delt-markering/ikke-delt-markering";
import {selectErVeileder} from "../../../identitet/identitet-selector";
import {selectDialogForAktivitetId} from "../../../dialog/dialog-selector";
import {connect} from "react-redux";

function visningsIngress(type) {
    if (
        [EGEN_AKTIVITET_TYPE, IJOBB_AKTIVITET_TYPE, STILLING_AKTIVITET_TYPE, BEHANDLING_AKTIVITET_TYPE].includes(type)
    ) {
        return null;
    }

    return <AktivitetIngress aktivitetsType={type} />;
}

function AktivitetinformasjonVisning({ valgtAktivitet, tillatEndring, laster, underOppfolging, manglerReferat, manglerDialog }) {
    const { tittel, type, arenaAktivitet } = valgtAktivitet;
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
                        href={endreAktivitetRoute(valgtAktivitet.id)}
                        onClick={() => loggEvent(APNE_ENDRE_AKTIVITET)}
                        disabled={laster || !underOppfolging}
                    >
                        <FormattedMessage id="aktivitetvisning.endre-knapp" />
                    </InternLenke>
                </div>
                {visningsIngress(type)}
                <AvtaltMarkering visible={valgtAktivitet.avtalt} className="aktivitetvisning__etikett" />
                <IkkeDeltMarkering visible={ikkeDelt} className="aktivitetvisning__etikett" />
            </div>
            <Forhaandsorenteringsvisning forhaandsorientering={valgtAktivitet.forhaandsorientering} />
            <div className="aktivitetvisning__underseksjon">

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

const mapStateToProps = (state, props) => {
    const { valgtAktivitet } = props;
    return {
        manglerReferat:
            valgtAktivitet.type === SAMTALEREFERAT_TYPE && selectErVeileder(state) && !valgtAktivitet.erReferatPublisert,
        manglerDialog:
            valgtAktivitet.type === MOTE_TYPE && selectErVeileder(state) && !selectDialogForAktivitetId(state, valgtAktivitet.id),
    };
};

export default connect(mapStateToProps)(AktivitetinformasjonVisning);
