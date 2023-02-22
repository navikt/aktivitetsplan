import { Button, Heading } from '@navikt/ds-react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    EKSTERN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
} from '../../../../constant';
import { AktivitetType, AlleAktiviteter, isArenaAktivitet } from '../../../../datatypes/aktivitetTypes';
import { isSamtaleOrMote } from '../../../../datatypes/internAktivitetTypes';
import loggEvent, { APNE_ENDRE_AKTIVITET } from '../../../../felles-komponenter/utils/logging';
import { endreAktivitetRoute } from '../../../../routes';
import AvtaltMarkering from '../../avtalt-markering/AvtaltMarkering';
import IkkeDeltFerdigMarkering, {
    SkalIkkeDeltFerdigMarkeringVises,
} from '../../ikke-delt-ferdig-markering/IkkeDeltFerdigMarkering';
import aktivitetsvisningStyles from './../Aktivitetsvisning.module.less';
import AktivitetIngress from '../aktivitetingress/AktivitetIngress';
import AvtaltContainer from '../avtalt-container/AvtaltContainer';
import DeleLinje from '../delelinje/delelinje';
import Aktivitetsdetaljer from '../detaljer/aktivitetsdetaljer';
import styles from './AktivitetinformasjonVisning.module.less';

const VisningIngress = ({ aktivitetstype }: { aktivitetstype: AktivitetType }) => {
    if (
        [
            EGEN_AKTIVITET_TYPE,
            IJOBB_AKTIVITET_TYPE,
            STILLING_AKTIVITET_TYPE,
            BEHANDLING_AKTIVITET_TYPE,
            EKSTERN_AKTIVITET_TYPE,
        ].includes(aktivitetstype)
    ) {
        return null;
    }

    return <AktivitetIngress aktivitetstype={aktivitetstype} />;
};

interface Props {
    valgtAktivitet: AlleAktiviteter;
    tillatEndring: boolean;
    laster: boolean;
    underOppfolging: boolean;
}

const AktivitetinformasjonVisning = (props: Props) => {
    const { valgtAktivitet, tillatEndring, laster, underOppfolging } = props;
    const { id, tittel, type, avtalt } = valgtAktivitet;

    const deltFerdigMarkeringSkalVises = isSamtaleOrMote(valgtAktivitet)
        ? SkalIkkeDeltFerdigMarkeringVises(valgtAktivitet)
        : false;

    const history = useHistory();
    const goToEndre = () => {
        loggEvent(APNE_ENDRE_AKTIVITET);
        history.push(endreAktivitetRoute(id));
    };

    return (
        <div>
            <div className={aktivitetsvisningStyles.underseksjon}>
                <div className={styles.header}>
                    <Heading level="2" size="medium" id="modal-aktivitetsvisning-header" className="softbreak">
                        {tittel}
                    </Heading>
                </div>
                <VisningIngress aktivitetstype={type} />
                <AvtaltMarkering hidden={!avtalt} />
                <IkkeDeltFerdigMarkering visible={deltFerdigMarkeringSkalVises} />
            </div>
            <AvtaltContainer
                underOppfolging={underOppfolging}
                aktivitet={valgtAktivitet}
                className={aktivitetsvisningStyles.underseksjon}
            />
            <div className={aktivitetsvisningStyles.underseksjon}>
                <Aktivitetsdetaljer valgtAktivitet={valgtAktivitet} />
            </div>
            <div className="mx-6 gap-4 flex flex-wrap">
                {!tillatEndring || isArenaAktivitet(props.valgtAktivitet) ? null : (
                    <Button disabled={laster || !underOppfolging} onClick={goToEndre} variant="secondary">
                        Endre på aktiviteten
                    </Button>
                )}
                <Button variant="secondary">Send en melding</Button>
            </div>
            <DeleLinje />
        </div>
    );
};

export default AktivitetinformasjonVisning;
