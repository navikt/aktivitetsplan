import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Sidetittel } from 'nav-frontend-typografi';
import moment from 'moment';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import Aktivitetsbeskrivelse from './aktivitetsbeskrivelse';
import UnderelementerForAktivitet from './underelementer-for-aktivitet';
import ModalHeader from '../modal-header';
import history from '../../history';
import AktivitetsDetaljer from './aktivitetsdetaljer';
import { slettAktivitet, flyttAktivitet } from '../../ducks/aktiviteter';
import * as AppPT from '../../proptypes';
import ModalFooter from './../modal-footer';
import ModalContainer from '../modal-container';
import { TILLAT_SLETTING, TILLAT_SET_AVTALT } from '~config' // eslint-disable-line
import BekreftSlettVisning from './bekreft-slett-visning';
import OppdaterAktivitetStatus from './oppdater-aktivitet-status';
import AvtaltContainer from './avtalt-container';
import './aktivitetvisning.less';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../constant';
import VisibleIfDiv from '../../felles-komponenter/utils/visibleIfDiv';
import BegrunnelseBoks from './begrunnelse-boks';
import AktivitetEtiketter from '../../felles-komponenter/aktivitet-etiketter';
import { STATUS } from '../../ducks/utils';

class Aktivitetvisning extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visBekreftSletting: false,
            settAutoFocusSlett: false
        };
    }

    render() {
        const { params, aktiviteter, doSlettAktivitet, oppfolgingStatus } = this.props;
        const { id } = params;
        const valgtAktivitet = aktiviteter.data.find((aktivitet) => aktivitet.id === id);

        if (!valgtAktivitet) {
            return null;
        } else if (this.state.visBekreftSletting) {
            const slettAction = () => {
                doSlettAktivitet(valgtAktivitet);
                history.push('/');
            };

            return (
                <BekreftSlettVisning
                    slettAction={slettAction}
                    avbrytAction={() => this.setState({
                        visBekreftSletting: false,
                        settAutoFocusSlett: true })}
                />
            );
        }
        const tillatSletting = TILLAT_SLETTING && (
                !oppfolgingStatus.underOppfolging ||
                moment(oppfolgingStatus.oppfolgingUtgang).isAfter(valgtAktivitet.opprettetDato)
            );

        const tillattEndring = valgtAktivitet.avtalt !== true || TILLAT_SLETTING;

        const visBegrunnelse = valgtAktivitet.avtalt === true &&
            (valgtAktivitet.status === STATUS_FULLFOERT || valgtAktivitet.status === STATUS_AVBRUTT);

        const onLagre = (aktivitet) => {
            if (aktivitet.status === this.props.valgtStatus) {
                return history.push('/');
            } else if (this.props.valgtStatus === STATUS_FULLFOERT && aktivitet.avtalt) {
                history.push(`/aktivitet/aktivitet/${aktivitet.id}/fullfor`);
            } else if (this.props.valgtStatus === STATUS_AVBRUTT && aktivitet.avtalt) {
                history.push(`/aktivitet/aktivitet/${aktivitet.id}/avbryt`);
            } else {
                this.props.doFlyttAktivitet(aktivitet, this.props.valgtStatus);
                history.push('/');
            }
            return null;
        };

        const etiketter = valgtAktivitet.avtalt ?
            valgtAktivitet.tagger.concat({ tag: 'Avtalt med NAV', type: 'avtalt' }) :
            valgtAktivitet.tagger;

        return (
            <ModalHeader
                normalTekstId="aktivitetvisning.header"
                normalTekstValues={{ status: valgtAktivitet.status, type: valgtAktivitet.type }}
                className="side-innhold"
                aria-labelledby="modal-aktivitetsvisning-header"
            >
                <ModalContainer>
                    <div className="aktivitetvisning">
                        <VisibleIfDiv visible={visBegrunnelse} className="aktivitetvisning__underseksjon">
                            <BegrunnelseBoks
                                begrunnelse={valgtAktivitet.avsluttetKommentar}
                                visible={visBegrunnelse}
                            />
                        </VisibleIfDiv>
                        <div className="aktivitetvisning__underseksjon">
                            <Sidetittel id="modal-aktivitetsvisning-header">
                                {valgtAktivitet.tittel}
                            </Sidetittel>
                            <AktivitetEtiketter etiketter={etiketter} className="aktivitetvisning__etikett" />
                            <AktivitetsDetaljer
                                className="aktivitetvisning__detaljer"
                                valgtAktivitet={valgtAktivitet}
                            />
                            <Aktivitetsbeskrivelse beskrivelse={valgtAktivitet.beskrivelse} />
                        </div>
                        <hr className="aktivitetvisning__delelinje" />
                        <OppdaterAktivitetStatus
                            status={valgtAktivitet.status}
                            tagger={valgtAktivitet.tagger}
                            className="aktivitetvisning__underseksjon"
                        />
                        <hr className="aktivitetvisning__delelinje" />
                        <AvtaltContainer aktivitet={valgtAktivitet} className="aktivitetvisning__underseksjon" />
                        <hr className="aktivitetvisning__delelinje" />
                        <UnderelementerForAktivitet aktivitet={valgtAktivitet} className="aktivitetvisning__underseksjon" />
                    </div>
                </ModalContainer>

                <ModalFooter>
                    <Hovedknapp
                        className="aktivitetvisning__lagre--knapp"
                        spinner={this.props.aktiviteter.status !== STATUS.OK}
                        autoDisableVedSpinner
                        onClick={() => onLagre(valgtAktivitet)}
                    >
                        <FormattedMessage id="aktivitetvisning.lagre-knapp" />
                    </Hovedknapp>
                    { tillattEndring && <Knapp
                        onClick={() => history.push(`/aktivitet/aktivitet/${valgtAktivitet.id}/endre`)}
                        className="knapp-liten modal-footer__knapp"
                    >
                        <FormattedMessage id="aktivitetvisning.endre-knapp" />
                    </Knapp>}

                    {tillatSletting &&
                    <Knapp
                        onClick={() => this.setState({ visBekreftSletting: true, settAutoFocusSlett: false })}
                        className="knapp-liten modal-footer__knapp" autoFocus={this.state.settAutoFocusSlett}
                    >
                        <FormattedMessage id="aktivitetvisning.slett-knapp" />
                    </Knapp>}
                </ModalFooter>
            </ModalHeader>
        );
    }
}
Aktivitetvisning.propTypes = {
    doSlettAktivitet: PT.func.isRequired,
    params: PT.shape({ id: PT.string }),
    oppfolgingStatus: AppPT.oppfolgingStatus,
    aktiviteter: PT.shape({
        status: PT.string,
        data: PT.arrayOf(AppPT.aktivitet)
    }),
    valgtStatus: PT.string,
    doFlyttAktivitet: PT.func.isRequired
};

const mapStateToProps = (state) => ({
    oppfolgingStatus: state.data.oppfolgingStatus.data,
    valgtStatus: formValueSelector('oppdaterStatus-form')(state, 'aktivitetstatus'),
    aktiviteter: state.data.aktiviteter,
    dialoger: state.data.dialog.data
});

const mapDispatchToProps = (dispatch) => ({
    doSlettAktivitet: (aktivitet) => slettAktivitet(aktivitet)(dispatch),
    doFlyttAktivitet: (aktivitet, status) => flyttAktivitet(aktivitet, status)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Aktivitetvisning);
