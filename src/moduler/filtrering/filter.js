import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import Dropdown from '../../felles-komponenter/dropdown/dropdown';
import { selectAktivitetListeStatus, selectAktiviterForAktuellePerioden } from '../aktivitet/aktivitetliste-selector';
import TypeFilter from './filter/type-filter';
import EtikettFilter from './filter/etikett-filter';
import StatusFilter from './filter/status-filter';
import AvtaltMedNavFilter from './filter/avtalt-filter';
import loggEvent, { OPNE_AKTIVITETFILTER } from '../../felles-komponenter/utils/logging';

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
