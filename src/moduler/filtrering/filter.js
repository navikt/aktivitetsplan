import classNames from 'classnames';
import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import Dropdown from '../../felles-komponenter/dropdown/dropdown';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import loggEvent, { OPNE_AKTIVITETFILTER } from '../../felles-komponenter/utils/logging';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import * as AppPT from '../../proptypes';
import { selectAktiviterForAktuellePerioden, selectAktivitetListeStatus } from '../aktivitet/aktivitetlisteSelector';
import AvtaltMedNavFilter from './filter/avtalt-filter';
import EtikettFilter from './filter/etikett-filter';
import StatusFilter from './filter/status-filter';
import TypeFilter from './filter/type-filter';

function sjekkAttFinnesFilteringsAlternativ(aktivitetsListe) {
    const muligeFilterKombinasjoner = aktivitetsListe.reduce(
        (res, aktivitet) => {
            const { status, type, etikett, avtalt } = aktivitet;
            res.muligeStatus.add(status);
            res.muligeTyper.add(type);
            if (etikett) {
                res.muligeEtiketter.add(etikett);
            }
            res.muligeAvtalt.add(avtalt);
            return res;
        },
        {
            muligeStatus: new Set(),
            muligeTyper: new Set(),
            muligeEtiketter: new Set(),
            muligeAvtalt: new Set(),
        }
    );

    return Object.keys(muligeFilterKombinasjoner).reduce(
        (acc, key) => muligeFilterKombinasjoner[key].size > 1 || acc,
        false
    );
}

function Filter({ avhengigheter, harAktivitet, className }) {
    const resolvedClassNames = classNames(className, 'filter', {
        skjult: !harAktivitet,
    });
    return (
        <Innholdslaster avhengigheter={avhengigheter}>
            <VisibleIfDiv className={resolvedClassNames}>
                <FormattedMessage id="filter.tittel">
                    {(tittel) => (
                        <Dropdown
                            name="filter"
                            knappeTekst={tittel}
                            className="dropdown--alignright"
                            onOpen={() => {
                                loggEvent(OPNE_AKTIVITETFILTER);
                            }}
                        >
                            <div className="filter__container">
                                <AvtaltMedNavFilter />
                                <EtikettFilter />
                                <StatusFilter />
                                <TypeFilter />
                            </div>
                        </Dropdown>
                    )}
                </FormattedMessage>
            </VisibleIfDiv>
        </Innholdslaster>
    );
}

Filter.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    harAktivitet: PT.bool,
    className: PT.string,
};

Filter.defaultProps = {
    harAktivitet: true,
    className: '',
};

const mapStateToProps = (state) => {
    const aktiviteter = selectAktiviterForAktuellePerioden(state);
    const harAktivitet = aktiviteter.length > 1 && sjekkAttFinnesFilteringsAlternativ(aktiviteter);
    return {
        avhengigheter: [selectAktivitetListeStatus(state)],
        harAktivitet,
    };
};

export default connect(mapStateToProps)(Filter);
