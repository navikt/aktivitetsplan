import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import Dropdown from '../../felles-komponenter/dropdown/dropdown';
import {
    selectAktivitetListeReducer,
    selectAlleAktiviter,
} from '../aktivitet/aktivitetliste-selector';
import TypeFilter from './type-filter';
import EtikettFilter from './etikett-filter';
import StatusFilter from './status-filter';

function Filter({ avhengigheter, harAktivitet }) {
    return (
        <Innholdslaster avhengigheter={avhengigheter}>
            <VisibleIfDiv className="filter" visible={harAktivitet}>
                <FormattedMessage id="filter.tittel">
                    {tittel =>
                        <Dropdown name={tittel}>
                            <div className="filter__container">
                                <TypeFilter />
                                <StatusFilter />
                                <EtikettFilter />
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
};

Filter.defaultProps = {
    harAktivitet: true,
};

const mapStateToProps = state => {
    const aktiviteter = selectAlleAktiviter(state);
    const harAktivitet = aktiviteter.length > 0;
    return {
        avhengigheter: [selectAktivitetListeReducer(state)],
        harAktivitet,
    };
};

export default connect(mapStateToProps)(Filter);
