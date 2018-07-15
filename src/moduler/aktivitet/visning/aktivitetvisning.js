import React from 'react';
import PT from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import UnderelementerForAktivitet from './underelement-for-aktivitet/underelementer-for-aktivitet';
import * as AppPT from '../../../proptypes';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import AvtaltContainer from './avtalt-container/avtalt-container';
import {
    TILTAK_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../../constant';
import BegrunnelseBoks from './hjelpekomponenter/begrunnelse-boks';
import VarslingBoks from './hjelpekomponenter/varsling-boks';
import AktivitetinformasjonVisning from './hjelpekomponenter/aktivitetinformasjon-visning';
import Statusadministrasjon from './hjelpekomponenter/statusadministrasjon';
import OppdaterReferatContainer from './status-oppdatering/oppdater-referat-container';
import lazyHOC from '../../../felles-komponenter/lazy/lazyHOC';
import { trengerBegrunnelse } from '../aktivitet-util';

function Aktivitetvisning({
    aktivitet,
    tillatSletting,
    tillatEndring,
    history,
}) {
    const arenaAktivitet = [
        TILTAK_AKTIVITET_TYPE,
        GRUPPE_AKTIVITET_TYPE,
        UTDANNING_AKTIVITET_TYPE,
    ].includes(aktivitet.type);

    const visBegrunnelse =
        !arenaAktivitet &&
        trengerBegrunnelse(aktivitet.avtalt, aktivitet.status, aktivitet.type);

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
    history: AppPT.history.isRequired,
};

export default withRouter(lazyHOC(Aktivitetvisning));
