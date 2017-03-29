import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Sidetittel } from 'nav-frontend-typografi';
import moment from 'moment';
import { Knapp } from 'nav-react-design/dist/knapp';
import Aktivitetsbeskrivelse from './aktivitetsbeskrivelse';
import EndringsloggForAktivitet from './endringslogg-for-aktivitet';
import AktivitetEtiketter from '../../felles-komponenter/aktivitet-etiketter';
import ModalHeader from '../modal-header';
import history from '../../history';
import AktivitetsDetaljer from './aktivitetsdetaljer';
import { slettAktivitet } from '../../ducks/aktiviteter';
import * as AppPT from '../../proptypes';
import ModalFooter from './../modal-footer';
import ModalContainer from '../modal-container';
import { TILLAT_SLETTING } from '~config' // eslint-disable-line


function Aktivitetvisning({ params, aktiviteter, oppfolgingStatus, doSlettAktivitet }) {
    const { id } = params;
    const valgtAktivitet = aktiviteter.find((aktivitet) => aktivitet.id === id);

    if (!valgtAktivitet) {
        return null;
    }

    function slett() {
        doSlettAktivitet(valgtAktivitet);
        history.push('/');
    }

    const tillatSletting = TILLAT_SLETTING  && (
        !oppfolgingStatus.underOppfolging ||
        moment(oppfolgingStatus.oppfolgingUtgang).isAfter(valgtAktivitet.opprettetDato)
        );

    return (
        <ModalHeader
            normalTekstId="aktivitetvisning.header"
            normalTekstValues={{ status: valgtAktivitet.status, type: valgtAktivitet.type }}
            className="side-innhold"
            aria-labelledby="modal-aktivitetsvisning-header"
        >
            <ModalContainer>
                <div className="aktivitetvisning">
                    <Sidetittel id="modal-aktivitetsvisning-header">
                        {valgtAktivitet.tittel}
                    </Sidetittel>
                    <AktivitetEtiketter etiketter={valgtAktivitet.tagger} className="aktivitetvisning__etikett" />
                    <AktivitetsDetaljer
                        className="aktivitetvisning__detaljer"
                        valgtAktivitet={valgtAktivitet}
                    />
                    <Aktivitetsbeskrivelse beskrivelse={valgtAktivitet.beskrivelse} />

                    <hr className="aktivitetvisning__delelinje" />

                    <EndringsloggForAktivitet aktivitet={valgtAktivitet} className="aktivitetvisning__historikk" />
                </div>
            </ModalContainer>

            <ModalFooter>
                {/* TODO: tekster*/}
                {tillatSletting && <Knapp onClick={slett} className="knapp-liten modal-footer__knapp">Slett</Knapp>}
            </ModalFooter>
        </ModalHeader>
    );
}
Aktivitetvisning.propTypes = {
    doSlettAktivitet: PT.func.isRequired,
    params: PT.shape({ id: PT.string }),
    aktiviteter: PT.arrayOf(AppPT.aktivitet)
};

const mapStateToProps = (state) => ({
    aktiviteter: state.data.aktiviteter,
    oppfolgingStatus: state.data.oppfolgingStatus.data
});

const mapDispatchToProps = (dispatch) => ({
    doSlettAktivitet: (aktivitet) => slettAktivitet(aktivitet)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Aktivitetvisning);
