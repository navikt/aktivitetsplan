import React from 'react';
import PT from 'prop-types';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';

function AktivitetskortEndring({ harEndringerIAktivitet }) {
    return (
        <VisibleIfDiv visible={harEndringerIAktivitet} className="aktivitetskort__nyendring">
            <span className="aktivitetskort__nyendring-sirkel" />
        </VisibleIfDiv>
    );
}

AktivitetskortEndring.propTypes = {
    harEndringerIAktivitet: PT.bool.isRequired,
};

export default AktivitetskortEndring;
