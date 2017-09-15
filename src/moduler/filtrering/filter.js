import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import Dropdown from '../../felles-komponenter/dropdown/dropdown';
import {
    selectAktivitetListeReducer,
    selectAlleAktiviter,
} from '../aktivitet/aktivitetliste-selector';
import TypeFilter from './filter/type-filter';
import EtikettFilter from './filter/etikett-filter';
import StatusFilter from './filter/status-filter';
import AvtaltMedNavFilter from './filter/avtalt-filter';

const filterClassNames = classes => classNames(classes, 'filter');

function sjekkAttFinnesFilteringsAlternativ(aktivitetsListe) {
    const muligeFilterKombinasjoner = aktivitetsListe.reduce(
        (res, aktivitet) => {
            res.status.add(aktivitet.status);
            res.type.add(aktivitet.type);
            res.etikket.add(aktivitet.etikett);
            res.avtalt.add(aktivitet.avtalt);
            return res;
        },
        {
            status: new Set(),
            type: new Set(),
            etikket: new Set(),
            avtalt: new Set(),
        }
    );

    return Object.keys(muligeFilterKombinasjoner).reduce(
        (acc, key) => muligeFilterKombinasjoner[key].size > 1 || acc,
        false
    );

    // return reduce;
}

function Filter({ avhengigheter, harAktivitet, className }) {
    return (
        <Innholdslaster avhengigheter={avhengigheter}>
            <VisibleIfDiv
                className={filterClassNames(className)}
                visible={harAktivitet}
            >
                <FormattedMessage id="filter.tittel">
                    {tittel =>
                        <Dropdown
                            name="filter"
                            knappeTekst={tittel}
                            className="dropdown--alignright"
                        >
                            <div className="filter__container">
                                <AvtaltMedNavFilter />
                                <EtikettFilter />
                                <StatusFilter />
                                <TypeFilter />
                            </div>
                        </Dropdown>}
                </FormattedMessage>
            </VisibleIfDiv>
        </Innholdslaster>
    );
}

Filter.propTypes = {
    avhengigheter: PT.arrayOf(AppPT.reducer).isRequired,
    harAktivitet: PT.bool,
    className: PT.string,
};

Filter.defaultProps = {
    harAktivitet: true,
    className: '',
};

const mapStateToProps = state => {
    const aktiviteter = selectAlleAktiviter(state);
    const harAktivitet =
        aktiviteter.length > 1 &&
        sjekkAttFinnesFilteringsAlternativ(aktiviteter);
    return {
        avhengigheter: [selectAktivitetListeReducer(state)],
        harAktivitet,
    };
};

export default connect(mapStateToProps)(Filter);
