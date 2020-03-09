import React, { useState } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import * as statuser from '../../../../constant';
import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import StillingEtikettForm from './stilling-etikett-form';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { oppdaterAktivitetEtikett } from '../../aktivitet-actions';
import EndreLinje from '../endre-linje/endre-linje';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import { selectKanEndreAktivitetStatus } from '../../aktivitetliste-selector';
import SokeStatusEtikett from '../../etikett/sokeStatusEtikett';
import { useHarNyDialog } from '../../../../felles-komponenter/feature/feature';
import { endreStilingStatusMetrikk } from '../../../../felles-komponenter/utils/logging';

function OppdaterAktivitetEtikett(props) {
    const { aktivitet, disableEtikettEndringer, lagreEtikett } = props;
    const [endring, setEndring] = useState(false);
    const harNyDialog = useHarNyDialog();

    const onSubmit = val =>
        lagreEtikett(val, harNyDialog).then(() => {
            setEndring(false);
            document.querySelector('.aktivitet-modal').focus();
        });

    const form = <StillingEtikettForm disabled={disableEtikettEndringer} aktivitet={aktivitet} onSubmit={onSubmit} />;
    const kanEndre = aktivitet.status !== STATUS_FULLFOERT && aktivitet.status !== STATUS_AVBRUTT;

    return (
        <EndreLinje
            tittel="Hvor langt har du kommet i søknadsprosessen?"
            form={form}
            endring={endring}
            setEndring={setEndring}
            visning={<SokeStatusEtikett etikett={aktivitet.etikett} />}
            kanEndre={kanEndre}
        />
    );
}

OppdaterAktivitetEtikett.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    disableEtikettEndringer: PT.bool.isRequired,
    lagreEtikett: PT.func.isRequired
};

const mapStateToProps = (state, props) => ({
    disableEtikettEndringer:
        selectLasterAktivitetData(state) ||
        !selectKanEndreAktivitetStatus(state, props.aktivitet) ||
        !selectErUnderOppfolging(state)
});

const mapDispatchToProps = (dispatch, props) => ({
    lagreEtikett: ({ etikettstatus, harNyDialog }) => {
        if (etikettstatus === props.aktivitet.etikett) {
            return Promise.resolve();
        }

        const nyEtikett = etikettstatus === statuser.INGEN_VALGT ? null : etikettstatus;

        endreStilingStatusMetrikk(harNyDialog);

        return dispatch(
            oppdaterAktivitetEtikett({
                ...props.aktivitet,
                etikett: nyEtikett
            })
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(OppdaterAktivitetEtikett);
