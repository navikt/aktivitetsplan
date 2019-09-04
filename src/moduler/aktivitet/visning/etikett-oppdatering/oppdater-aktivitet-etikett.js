import React, { useState } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { EtikettLiten } from 'nav-frontend-typografi';
import { UnmountClosed } from 'react-collapse';
import * as statuser from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import StillingEtikettForm from './stilling-etikett-form';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import Knappelenke from '../../../../felles-komponenter/utils/knappelenke';
import Etikett from '../../etikett/etikett';
import './oppdater-aktivitet-etikett.less';
import { oppdaterAktivitetEtikett } from '../../aktivitet-actions';

function OppdaterAktivitetStatus(props) {
    const { valgtAktivitet, underOppfolging, lagreEtikett } = props;

    const [endring, setEndring] = useState(false);

    const disableStatusEndring =
        valgtAktivitet.historisk ||
        valgtAktivitet.status === statuser.STATUS_AVBRUTT ||
        valgtAktivitet.status === statuser.STATUS_FULLFOERT;

    const onSubmit = val =>
        lagreEtikett(val)
            .then(() => setEndring(false))
            .then(() => document.querySelector('.aktivitet-modal').focus());

    return (
        <section className="aktivitetvisning__underseksjon">
            <div className="oppdater-etikett-linje">
                <EtikettLiten>Hvor i søknadsprossen?</EtikettLiten>

                <Etikett visible={!endring} etikett={valgtAktivitet.etikett} />

                <Knappelenke className="" onClick={() => setEndring(!endring)}>
                    {endring ? 'Avbryt' : 'Endre'}
                </Knappelenke>
            </div>
            <UnmountClosed isOpened={endring}>
                <StillingEtikettForm
                    disabled={disableStatusEndring || !underOppfolging}
                    aktivitet={valgtAktivitet}
                    onSubmit={val => onSubmit(val).then(setEndring(false))}
                />
            </UnmountClosed>
        </section>
    );
}

OppdaterAktivitetStatus.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    underOppfolging: PT.bool.isRequired,
    lagreEtikett: PT.func.isRequired,
};

const mapStateToProps = state => ({
    underOppfolging: selectErUnderOppfolging(state),
});

const mapDispatchToProps = (dispatch, props) => ({
    lagreEtikett: ({ etikettstatus }) => {
        const nyEtikett =
            etikettstatus === statuser.INGEN_VALGT ? null : etikettstatus;
        return dispatch(
            oppdaterAktivitetEtikett({
                ...props.valgtAktivitet,
                etikett: nyEtikett,
            })
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    OppdaterAktivitetStatus
);
