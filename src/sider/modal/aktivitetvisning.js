import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Sidetittel } from 'nav-react-design/dist/typografi';
import Aktivitetsbeskrivelse from '../../felles-komponenter/aktivitetsbeskrivelse';
import AktivitetKnapperad from '../../felles-komponenter/aktivitet-knapperad';
// import KommentarForAktivitet from '../../felles-komponenter/kommentar-for-aktivitet';
import EndringsloggForAktivitet from './endringslogg-for-aktivitet';
import AktivitetEtiketter from '../../felles-komponenter/aktivitet-etiketter';
import ModalHeader from '../../felles-komponenter/modal-header';
import history from '../../history';
import AktivitetsDetaljer from '../../felles-komponenter/aktivitetsdetaljer';
import { slettAktivitet } from '../../ducks/aktiviteter';
import * as AppPT from '../../proptypes';


function Aktivitetvisning({ params, aktiviteter, doSlettAktivitet }) {
    const { id } = params;
    const valgtAktivitet = aktiviteter.find((aktivitet) => aktivitet.id === id);

    if (!valgtAktivitet) {
        return null;
    }

    function slett() {
        doSlettAktivitet(valgtAktivitet);
        history.push('/');
    }

    function startEndring() {
        history.push(`/aktiviter/aktivitet/${valgtAktivitet.id}/endre`);
    }


    return (
        <ModalHeader
            normalTekstId="aktivitetvisning.header"
            normalTekstValues={{ status: valgtAktivitet.status, type: valgtAktivitet.type }}
            className="aktivitetvisning side-innhold"
            aria-labelledby="modal-aktivitetsvisning-header"
        >
            <div className="row">
                <div className="col-md-9">
                    <Sidetittel id="modal-aktivitetsvisning-header">
                        {valgtAktivitet.tittel}
                    </Sidetittel>
                    <AktivitetEtiketter etiketter={valgtAktivitet.tagger} className="aktivitetvisning__etikett" />
                    <AktivitetsDetaljer
                        className="aktivitetvisning__detaljer"
                        valgtAktivitet={valgtAktivitet}
                    />
                    <div>
                        <Aktivitetsbeskrivelse beskrivelse={valgtAktivitet.beskrivelse} />
                    </div>
                </div>
                <div className="col-md-3">
                    <AktivitetKnapperad
                        handterRediger={startEndring}
                        handterSlett={slett}
                    />
                </div>
            </div>
            {/* <KommentarForAktivitet />*/}
            <EndringsloggForAktivitet aktivitet={valgtAktivitet} />
        </ModalHeader>
    );
}
Aktivitetvisning.propTypes = {
    doSlettAktivitet: PT.func.isRequired,
    params: PT.shape({ id: PT.string }),
    aktiviteter: PT.arrayOf(AppPT.aktivitet)
};

const mapStateToProps = (state) => ({
    aktiviteter: state.data.aktiviteter
});

const mapDispatchToProps = (dispatch) => ({
    doSlettAktivitet: (aktivitet) => slettAktivitet(aktivitet)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Aktivitetvisning);
