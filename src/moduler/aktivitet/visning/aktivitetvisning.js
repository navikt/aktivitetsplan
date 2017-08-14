import React from 'react';
import PT from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import UnderelementerForAktivitet from './underelement-for-aktivitet/underelementer-for-aktivitet';
import history from '../../../history';
import * as AppPT from '../../../proptypes';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import { TILLAT_SLETTING, TILLAT_SET_AVTALT } from '~config'; // eslint-disable-line
import AvtaltContainer from './avtalt-container/avtalt-container';
import {
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
    TILTAK_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../../constant';
import BegrunnelseBoks from './hjelpekomponenter/begrunnelse-boks';
import VarslingBoks from './hjelpekomponenter/varsling-boks';
import AktivitetinformasjonVisning from './hjelpekomponenter/aktivitetinformasjon-visning';
import Statusadministrasjon from './hjelpekomponenter/statusadministrasjon';
import OppdaterReferatContainer from './status-oppdatering/oppdater-referat-container';

function Aktivitetvisning({ aktivitet, tillatSletting, tillatEndring }) {
    const arenaAktivitet = [
        TILTAK_AKTIVITET_TYPE,
        GRUPPE_AKTIVITET_TYPE,
        UTDANNING_AKTIVITET_TYPE,
    ].includes(aktivitet.type);

    const visBegrunnelse =
        !arenaAktivitet &&
        aktivitet.avtalt === true &&
        (aktivitet.status === STATUS_FULLFOERT ||
            aktivitet.status === STATUS_AVBRUTT);

    const AktivitetvisningFooter = ({ visible }) =>
        <ModalFooter visible={visible}>
            <Knapp
                onClick={() => history.push(`aktivitet/slett/${aktivitet.id}`)}
                className="knapp-liten modal-footer__knapp"
            >
                <FormattedMessage id="aktivitetvisning.slett-knapp" />
            </Knapp>
        </ModalFooter>;

    AktivitetvisningFooter.propTypes = {
        visible: PT.bool,
    };

    AktivitetvisningFooter.defaultProps = {
        visible: true,
    };

    return (
        <div>
            <ModalContainer className="aktivitetvisning">
                <VarslingBoks
                    className="aktivitetvisning__underseksjon"
                    aktivitet={aktivitet}
                />

                <BegrunnelseBoks
                    className="aktivitetvisning__underseksjon"
                    begrunnelse={aktivitet.avsluttetKommentar}
                    visible={visBegrunnelse}
                />

                <AktivitetinformasjonVisning
                    valgtAktivitet={aktivitet}
                    arenaAktivitet={arenaAktivitet}
                    tillatEndring={tillatEndring}
                />

                <AvtaltContainer
                    aktivitet={aktivitet}
                    className="aktivitetvisning__underseksjon"
                />

                <OppdaterReferatContainer
                    aktivitet={aktivitet}
                    className="aktivitetvisning__underseksjon"
                    delelinje
                />

                <Statusadministrasjon
                    valgtAktivitet={aktivitet}
                    arenaAktivitet={arenaAktivitet}
                />

                <UnderelementerForAktivitet
                    aktivitet={aktivitet}
                    className="aktivitetvisning__underseksjon"
                />
            </ModalContainer>

            <AktivitetvisningFooter
                visible={tillatSletting && !arenaAktivitet}
            />
        </div>
    );
}

Aktivitetvisning.defaultProps = {
    aktivitet: {},
};

Aktivitetvisning.propTypes = {
    aktivitet: AppPT.aktivitet,
    tillatSletting: PT.bool.isRequired,
    tillatEndring: PT.bool.isRequired,
};

export default Aktivitetvisning;
