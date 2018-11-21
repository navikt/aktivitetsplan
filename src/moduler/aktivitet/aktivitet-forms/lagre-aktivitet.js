import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { STATUS } from '../../../ducks/utils';
import { erPrivateBrukerSomSkalSkrusAv } from '../../privat-modus/privat-modus-selector';

function LagreAktivitet({ venter, privateMode }) {
    return (
        <div className="aktivitetskjema__lagre-knapp">
            <Hovedknapp spinner={venter} disabled={venter || privateMode}>
                <FormattedMessage id="aktivitet-form.lagre" />
            </Hovedknapp>
        </div>
    );
}

LagreAktivitet.propTypes = {
    venter: PT.bool.isRequired,
    privateMode: PT.bool.isRequired, // todo remove me
};

const mapStateToProps = state => {
    const aktivitetStatus = selectAktivitetStatus(state);
    return {
        venter: !(
            aktivitetStatus === STATUS.OK || aktivitetStatus === STATUS.ERROR
        ),
        privateMode: erPrivateBrukerSomSkalSkrusAv(state),
    };
};

export default connect(mapStateToProps)(LagreAktivitet);
