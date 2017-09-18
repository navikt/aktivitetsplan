import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { STATUS } from '../../../ducks/utils';

function LagreAktivitet({ venter }) {
    return (
        <div className="aktivitetskjema__lagre-knapp">
            <Hovedknapp spinner={venter} disabled={venter}>
                <FormattedMessage id="aktivitet-form.lagre" />
            </Hovedknapp>
        </div>
    );
}

LagreAktivitet.propTypes = {
    venter: PT.bool.isRequired,
};

const mapStateToProps = state => {
    const aktivitetStatus = selectAktivitetStatus(state);
    return {
        venter: !(
            aktivitetStatus === STATUS.OK || aktivitetStatus === STATUS.ERROR
        ),
    };
};

export default connect(mapStateToProps)(LagreAktivitet);
