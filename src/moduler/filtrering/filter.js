import classNames from 'classnames';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { isArenaAktivitet } from '../../datatypes/aktivitetTypes';
import Dropdown from '../../felles-komponenter/dropdown/dropdown';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import loggEvent, { OPNE_AKTIVITETFILTER } from '../../felles-komponenter/utils/logging';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import * as AppPT from '../../proptypes';
import { selectAktiviterForAktuellePerioden, selectAktivitetListeStatus } from '../aktivitet/aktivitetlisteSelector';
import ArenaEtikettFilter from './filter/ArenaEtikettFilter';
import AvtaltMedNavFilter from './filter/avtalt-filter';
import EtikettFilter from './filter/EtikettFilter';
import StatusFilter from './filter/status-filter';
import TypeFilter from './filter/type-filter';

function sjekkAttFinnesFilteringsAlternativ(aktivitetsListe) {
    const muligeFilterKombinasjoner = aktivitetsListe.reduce(
        (res, aktivitet) => {
            const { status, type, etikett, avtalt } = aktivitet;
            res.muligeStatus.add(status);
            res.muligeTyper.add(type);
            if (etikett) {
                if (isArenaAktivitet(aktivitet)) {
                    res.muligeArenaEtiketter.add(etikett);
                } else {
                    res.muligeEtiketter.add(etikett);
                }
            }
            res.muligeAvtalt.add(avtalt);
            return res;
        },
        {
            muligeStatus: new Set(),
            muligeTyper: new Set(),
            muligeEtiketter: new Set(),
            muligeArenaEtiketter: new Set(),
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
                <Dropdown
                    name="filter"
                    knappeTekst="Filtrer"
                    className="dropdown--alignright"
                    onOpen={() => {
                        loggEvent(OPNE_AKTIVITETFILTER);
                    }}
                >
                    <div className="filter__container">
                        <AvtaltMedNavFilter />
                        <EtikettFilter />
                        <ArenaEtikettFilter />
                        <StatusFilter />
                        <TypeFilter />
                    </div>
                </Dropdown>
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
