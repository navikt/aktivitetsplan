import classNames from 'classnames';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React from 'react';

import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import EkspanderbartTekstomrade from '../../../../felles-komponenter/EkspanderbartTekstomrade';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import * as AppPT from '../../../../proptypes';
import styles from './../Aktivitetsvisning.module.less';

function ReferatVisning(props) {
    const {
        aktivitet,
        referat,
        erVeileder,
        dispatchPubliserReferat,
        publiserer,
        erReferatPublisert,
        startOppdaterReferat,
        underOppfolging,
    } = props;

    const aktivitetStatus = aktivitet.status;
    const erHistorisk = aktivitet.historisk;
    return (
        <div className={classNames('oppdater-referat', styles.underseksjon)}>
            <Undertittel>Samtalereferat</Undertittel>
            <EkspanderbartTekstomrade className="oppdater-referat__referat" tekst={referat} antallTegn={275} />
            <HiddenIfDiv
                hidden={!erVeileder || aktivitetStatus === STATUS_FULLFOERT || aktivitetStatus === STATUS_AVBRUTT}
            >
                <HiddenIfDiv hidden={erHistorisk || !underOppfolging} className="oppdater-referat-knapper">
                    <HiddenIfDiv hidden={erReferatPublisert}>
                        <Hovedknapp kompakt onClick={dispatchPubliserReferat} spinner={publiserer}>
                            Del med bruker
                        </Hovedknapp>
                    </HiddenIfDiv>
                    <HiddenIfDiv hidden={!erReferatPublisert}>
                        <AlertStripeSuksess className="oppdater-referat-status">Delt med bruker</AlertStripeSuksess>
                    </HiddenIfDiv>
                    <Flatknapp kompakt onClick={startOppdaterReferat}>
                        Endre
                    </Flatknapp>
                </HiddenIfDiv>
            </HiddenIfDiv>
        </div>
    );
}

ReferatVisning.propTypes = {
    referat: PT.string.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
    erVeileder: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    dispatchPubliserReferat: PT.func.isRequired,
    publiserer: PT.bool.isRequired,
    erReferatPublisert: PT.bool.isRequired,
    startOppdaterReferat: PT.func.isRequired,
};
export default ReferatVisning;
