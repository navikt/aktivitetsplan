import { Sidetittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
} from '../../../../constant';
import { Aktivitet, AktivitetType } from '../../../../datatypes/aktivitetTypes';
import InternLenke from '../../../../felles-komponenter/utils/InternLenke';
import loggEvent, { APNE_ENDRE_AKTIVITET } from '../../../../felles-komponenter/utils/logging';
import { endreAktivitetRoute } from '../../../../routes';
import AvtaltMarkering from '../../avtalt-markering/AvtaltMarkering';
import IkkeDeltMarkering, { SkalIkkeDeltMarkeringVises } from '../../ikke-delt-markering/IkkeDeltMarkering';
import AktivitetIngress from '../aktivitetingress/AktivitetIngress';
import AvtaltContainerNy from '../avtalt-container/AvtaltContainerNy';
import DeleLinje from '../delelinje/delelinje';
import Aktivitetsdetaljer from './aktivitetsdetaljer';

const VisningIngress = ({ aktivitetstype }: { aktivitetstype: AktivitetType }) => {
    if (
        [EGEN_AKTIVITET_TYPE, IJOBB_AKTIVITET_TYPE, STILLING_AKTIVITET_TYPE, BEHANDLING_AKTIVITET_TYPE].includes(
            aktivitetstype
        )
    ) {
        return null;
    }

    return <AktivitetIngress aktivitetstype={aktivitetstype} />;
};

interface Props {
    valgtAktivitet: Aktivitet;
    tillatEndring: boolean;
    laster: boolean;
    underOppfolging: boolean;
}

const AktivitetinformasjonVisning = (props: Props) => {
    const { valgtAktivitet, tillatEndring, laster, underOppfolging } = props;
    const { id, tittel, type, arenaAktivitet, avtalt } = valgtAktivitet;

    const ikkeDelt = SkalIkkeDeltMarkeringVises(valgtAktivitet);

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
                <VisningIngress aktivitetstype={type} />
                <AvtaltMarkering hidden={!avtalt} className="aktivitetvisning__etikett" />
                <IkkeDeltMarkering visible={ikkeDelt} className="aktivitetvisning__etikett" />
            </div>
            <AvtaltContainerNy
                underOppfolging={underOppfolging}
                aktivitet={valgtAktivitet}
                className="aktivitetvisning__underseksjon"
            />
            <div className="aktivitetvisning__underseksjon">
                <Aktivitetsdetaljer valgtAktivitet={valgtAktivitet} />
            </div>
            <DeleLinje />
        </div>
    );
};

export default AktivitetinformasjonVisning;
