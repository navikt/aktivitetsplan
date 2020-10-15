import React from 'react';
import PT from 'prop-types';
import * as AppPT from '../../../../proptypes';
import OppdaterReferatForm from './oppdater-referat-form';
import ReferatVisning from './referat-visning';

function ReferatSeksjon(props) {
    const { aktivitet, visOppdaterReferatForm, stoppOppdaterReferat } = props;

    if (visOppdaterReferatForm) {
        return <OppdaterReferatForm aktivitet={aktivitet} onFerdig={stoppOppdaterReferat} />;
    }

    return <ReferatVisning {...props} />;
}

ReferatSeksjon.propTypes = {
    referat: PT.string,
    aktivitet: AppPT.aktivitet.isRequired,
    erVeileder: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    visOppdaterReferatForm: PT.bool.isRequired,
    dispatchPubliserReferat: PT.func.isRequired,
    publiserer: PT.bool.isRequired,
    erReferatPublisert: PT.bool.isRequired,
    startOppdaterReferat: PT.func.isRequired,
    stoppOppdaterReferat: PT.func.isRequired,
};

ReferatSeksjon.defaultProps = {
    referat: undefined,
};

export default ReferatSeksjon;
