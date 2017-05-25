import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Sidetittel } from 'nav-frontend-typografi';
import moment from 'moment';
import { Knapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Aktivitetsbeskrivelse from './aktivitetsbeskrivelse';
import UnderelementerForAktivitet from './underelementer-for-aktivitet';
import ModalHeader from '../modal-header';
import history from '../../history';
import AktivitetsDetaljer from './aktivitetsdetaljer';
import { slettAktivitet, hentAktivitet } from '../../ducks/aktiviteter';
import * as AppPT from '../../proptypes';
import ModalFooter from './../modal-footer';
import ModalContainer from '../modal-container';
import {TILLAT_SLETTING, TILLAT_SET_AVTALT} from "~config"; // eslint-disable-line
import BekreftSlettVisning from './bekreft-slett-visning';
import OppdaterAktivitetStatus from './oppdater-aktivitet-status';
import AvtaltContainer from './avtalt-container';
import './aktivitetvisning.less';
import {
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
    TILTAK_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
    AVTALT_MED_NAV
} from '../../constant';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import BegrunnelseBoks from './begrunnelse-boks';
import AktivitetEtikett from '../../felles-komponenter/aktivitet-etikett';
import StandardModal from '../modal-standard';

class Aktivitetvisning extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visBekreftSletting: false,
            settAutoFocusSlett: false
        };
    }

    componentDidMount() {
        if (!this.props.params.id.startsWith('arena')) {
            this.props.doHentAktivitet(this.props.params.id);
        }
    }

    render() {
        const { params, aktiviteter, doSlettAktivitet, oppfolgingStatus } = this.props;
        const { id } = params;
        const valgtAktivitet = aktiviteter.find((aktivitet) => aktivitet.id === id);

        if (!valgtAktivitet) {
            return null;
        } else if (this.state.visBekreftSletting) {
            const slettAction = () => {
                doSlettAktivitet(valgtAktivitet);
                history.push('/');
            };

            return (
                <StandardModal name="aktivitetsvisningModal">
                    <BekreftSlettVisning
                        slettAction={slettAction}
                        avbrytAction={() => this.setState({
                            visBekreftSletting: false,
                            settAutoFocusSlett: true
                        })}
                    />
                </StandardModal>
            );
        }
        const tillatSletting = TILLAT_SLETTING && (
                !oppfolgingStatus.underOppfolging ||
                moment(oppfolgingStatus.oppfolgingUtgang).isAfter(valgtAktivitet.opprettetDato)
            );

        const tillattEndring = (valgtAktivitet.avtalt !== true || TILLAT_SET_AVTALT) &&
            (valgtAktivitet.status !== STATUS_FULLFOERT && valgtAktivitet.status !== STATUS_AVBRUTT);

        const arenaAktivitet = [TILTAK_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE].includes(valgtAktivitet.type);

        const visBegrunnelse = !arenaAktivitet && valgtAktivitet.avtalt === true &&
            (valgtAktivitet.status === STATUS_FULLFOERT || valgtAktivitet.status === STATUS_AVBRUTT);

        const aktivitetErLaast = valgtAktivitet.status === STATUS_FULLFOERT || valgtAktivitet.status === STATUS_AVBRUTT;

        return (
            <StandardModal name="aktivitetsvisningModal">
                <ModalHeader
                    normalTekstId="aktivitetvisning.header"
                    normalTekstValues={{ status: valgtAktivitet.status, type: valgtAktivitet.type }}
                    className="side-innhold"
                    aria-labelledby="modal-aktivitetsvisning-header"
                    aktivitetErLaast={aktivitetErLaast}
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
                                <div className="aktivitetskort__etiketter blokk-s">
                                    <AktivitetEtikett
                                        visible={!!valgtAktivitet.etikett}
                                        etikett={valgtAktivitet.etikett}
                                        id={`etikett.${valgtAktivitet.etikett}`}
                                    />
                                    <AktivitetEtikett
                                        visible={valgtAktivitet.avtalt}
                                        etikett={AVTALT_MED_NAV}
                                        id={AVTALT_MED_NAV}
                                    />
                                </div>
                                <AktivitetsDetaljer
                                    className="aktivitetvisning__detaljer"
                                    valgtAktivitet={valgtAktivitet}
                                />
                                <Aktivitetsbeskrivelse beskrivelse={valgtAktivitet.beskrivelse} />
                            </div>
                            <hr className="aktivitetvisning__delelinje" />
                            {arenaAktivitet ? (
                                <div className="aktivitetvisning__underseksjon">
                                    <AlertStripeInfo className="aktivitetvisning__alert">Denne aktiviteten
                                            administreres av veilerder. Endringer er ikke mulig.</AlertStripeInfo>
                                </div>
                                ) : (
                                    <OppdaterAktivitetStatus
                                        status={valgtAktivitet.status}
                                        paramsId={id}
                                        className="aktivitetvisning__underseksjon"
                                    />
                                )
                            }
                            <hr className="aktivitetvisning__delelinje" />
                            <AvtaltContainer aktivitet={valgtAktivitet} className="aktivitetvisning__underseksjon" />
                            <UnderelementerForAktivitet
                                aktivitet={valgtAktivitet}
                                className="aktivitetvisning__underseksjon"
                            />
                        </div>
                    </ModalContainer>

                    <ModalFooter visible={!arenaAktivitet}>
                        { tillattEndring && <Knapp
                            onClick={() => history.push(`/aktivitet/aktivitet/${valgtAktivitet.id}/endre`)}
                            className="knapp-liten modal-footer__knapp"
                        >
                            <FormattedMessage id="aktivitetvisning.endre-knapp" />
                        </Knapp>}

                        {tillatSletting &&
                        <Knapp
                            onClick={() => this.setState({ visBekreftSletting: true, settAutoFocusSlett: false })}
                            className="knapp-liten modal-footer__knapp"
                            autoFocus={this.state.settAutoFocusSlett}
                        >
                            <FormattedMessage id="aktivitetvisning.slett-knapp" />
                        </Knapp>}
                    </ModalFooter>
                </ModalHeader>
            </StandardModal>
        );
    }
}
Aktivitetvisning.propTypes = {
    doSlettAktivitet: PT.func.isRequired,
    doHentAktivitet: PT.func.isRequired,
    params: PT.shape({ id: PT.string }),
    oppfolgingStatus: AppPT.oppfolgingStatus.isRequired,
    aktiviteter: PT.arrayOf(PT.object)
};

Aktivitetvisning.defaultProps = {
    params: undefined,
    oppfolgingStatus: undefined,
    aktiviteter: undefined
};

const mapStateToProps = (state) => {
    const aktivitetListe = state.data.aktiviteter.data || [];
    return {
        oppfolgingStatus: state.data.oppfolgingStatus.data,
        aktiviteter: aktivitetListe.concat(state.data.arenaAktiviteter.data)
    };
};

const mapDispatchToProps = {
    doSlettAktivitet: (aktivitet) => slettAktivitet(aktivitet),
    doHentAktivitet: (aktivitetId) => hentAktivitet(aktivitetId)
};

export default connect(mapStateToProps, mapDispatchToProps)(Aktivitetvisning);
