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
import ModalContainer from '../../../../felles-komponenter/modal/modal-container';
import InternLenke from '../../../../felles-komponenter/utils/InternLenke';
import loggEvent, { APNE_ENDRE_AKTIVITET } from '../../../../felles-komponenter/utils/logging';
import { endreAktivitetRoute } from '../../../../routes';
import AvtaltMarkering from '../../avtalt-markering/avtalt-markering';
import IkkeDeltMarkering, { SkalIkkeDeltMarkeringVises } from '../../ikke-delt-markering/IkkeDeltMarkering';
import AktivitetIngress from '../aktivitetingress/aktivitetingress';
import AvtaltContainer from '../avtalt-container/AvtaltContainer';
import DeleLinje from '../delelinje/delelinje';
import Aktivitetsdetaljer from './aktivitetsdetaljer';
import Forhaandsorenteringsvisning from './Forhaandsorenteringsvisning';

const visningsIngress = (type: AktivitetType) => {
    if (
        [EGEN_AKTIVITET_TYPE, IJOBB_AKTIVITET_TYPE, STILLING_AKTIVITET_TYPE, BEHANDLING_AKTIVITET_TYPE].includes(type)
    ) {
        return null;
    }

    return <AktivitetIngress aktivitetsType={type} />;
};

interface Props {
    valgtAktivitet: Aktivitet;
    tillatEndring: boolean;
    laster: boolean;
    underOppfolging: boolean;
}

const AktivitetinformasjonVisning = ({ valgtAktivitet, tillatEndring, laster, underOppfolging }: Props) => {
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
                {visningsIngress(type)}
                <AvtaltMarkering visible={avtalt} className="aktivitetvisning__etikett" />
                <IkkeDeltMarkering visible={ikkeDelt} className="aktivitetvisning__etikett" />
            </div>
            <AvtaltContainer
                underOppfolging={underOppfolging}
                aktivitet={valgtAktivitet}
                className="aktivitetvisning__underseksjon"
            />
            <Forhaandsorenteringsvisning forhaandsorientering={valgtAktivitet.forhaandsorientering} />
            <div className="aktivitetvisning__underseksjon">
                <Aktivitetsdetaljer valgtAktivitet={valgtAktivitet} />
            </div>
            <DeleLinje />
        </div>
    );
};

export default AktivitetinformasjonVisning;
