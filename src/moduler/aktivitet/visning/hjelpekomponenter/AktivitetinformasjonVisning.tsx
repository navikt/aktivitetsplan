import { Sidetittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
    STILLING_FRA_NAV_TYPE,
} from '../../../../constant';
import { Aktivitet, AktivitetType } from '../../../../datatypes/aktivitetTypes';
import InternLenke from '../../../../felles-komponenter/utils/InternLenke';
import loggEvent, { APNE_ENDRE_AKTIVITET } from '../../../../felles-komponenter/utils/logging';
import { endreAktivitetRoute } from '../../../../routes';
import AvtaltMarkering from '../../avtalt-markering/AvtaltMarkering';
import IkkeDeltFerdigMarkering, { skalMarkeringVises } from '../../ikke-delt-ferdig-markering/IkkeDeltFerdigMarkering';
import aktivitetsvisningStyles from './../Aktivitetsvisning.module.less';
import AktivitetIngress from '../aktivitetingress/AktivitetIngress';
import AvtaltContainer from '../avtalt-container/AvtaltContainer';
import { DeleCvContainer } from '../dele-cv/DeleCvContainer';
import DeleLinje from '../delelinje/delelinje';
import Aktivitetsdetaljer from '../detaljer/aktivitetsdetaljer';
import styles from './AktivitetinformasjonVisning.module.less';

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

    const markeringSkalVises = skalMarkeringVises(valgtAktivitet);

    return (
        <div>
            <div className={aktivitetsvisningStyles.underseksjon}>
                <div className={styles.header}>
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
                <AvtaltMarkering hidden={!avtalt} />
                <IkkeDeltFerdigMarkering visible={markeringSkalVises} />
            </div>
            <AvtaltContainer
                underOppfolging={underOppfolging}
                aktivitet={valgtAktivitet}
                className={aktivitetsvisningStyles.underseksjon}
            />
            <div className={aktivitetsvisningStyles.underseksjon}>
                <Aktivitetsdetaljer valgtAktivitet={valgtAktivitet} />
            </div>
            {valgtAktivitet.type === STILLING_FRA_NAV_TYPE && <DeleCvContainer aktivitet={valgtAktivitet} />}
            <DeleLinje />
        </div>
    );
};

export default AktivitetinformasjonVisning;
