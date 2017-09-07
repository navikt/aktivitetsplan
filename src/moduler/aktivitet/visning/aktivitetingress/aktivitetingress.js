import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { selectErUnderOppfolging } from '../../../situasjon/situasjon-selector';
import {
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
} from '../../../../constant';

function AktivitetIngress({ type, underOppfolging }) {
    let tekstId = `aktivitetingress.${type}`.toLowerCase();
    if (
        [EGEN_AKTIVITET_TYPE, IJOBB_AKTIVITET_TYPE].includes(type) &&
        !underOppfolging
    ) {
        tekstId += '-privat';
    }
    return (
        <section className="aktivitetingress">
            <FormattedMessage id={tekstId}>
                {ingress =>
                    <Tekstomrade className="aktivitetingress__tekst">
                        {ingress}
                    </Tekstomrade>}
            </FormattedMessage>
        </section>
    );
}

AktivitetIngress.propTypes = {
    type: PT.string.isRequired,
    underOppfolging: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    underOppfolging: selectErUnderOppfolging(state),
});

export default connect(mapStateToProps)(AktivitetIngress);
