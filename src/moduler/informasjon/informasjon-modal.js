import React, { Component } from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import PT from 'prop-types';
import Modal from '../../felles-komponenter/modal/modal';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import Video from './video';
import { selectLestInformasjon } from '../lest/lest-reducer';
import * as Api from '../lest/lest-api';
import { selectErBruker } from '../identitet/identitet-selector';
import * as AppPT from '../../proptypes';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { selectBackPath, setBackPath } from './informasjon-reducer';
import Tekstomrade from 'nav-frontend-tekstomrade';
import styles from './informasjon-modal.module.less';
import { MeldekortPanel } from './meldekortPanel';
import { RettigheterPanel } from './rettigheterPanel';
import { BrukePlanenPanel } from './brukePlanenPanel';
import { OkonomiskStotte } from './okonomiskStottePanel';
export const INFORMASJON_MODAL_VERSJON = 'v1';

class InformasjonModal extends Component {
    componentWillMount() {
        const { erBruker, underOppfolging, lestInfo } = this.props;

        if (erBruker && underOppfolging && (!lestInfo || lestInfo.verdi !== INFORMASJON_MODAL_VERSJON)) {
            Api.lesInformasjon(INFORMASJON_MODAL_VERSJON);
        }
    }

    render() {
        const { resetBackPath, backPath, history } = this.props;

        return (
            <Modal
                contentLabel="informasjon-modal"
                contentClass="informasjon-visning"
                onRequestClose={() => {
                    resetBackPath();
                    history.push(backPath);
                }}
            >
                <ModalContainer className="informasjon-modal-container">
                    <Innholdstittel className={styles.innholdsTittel}>Hva er aktivitetsplanen?</Innholdstittel>
                    <Tekstomrade>
                        {`Aktivitetsplanen din er verktøyet du skal bruke for å komme i aktivitet og jobb. Denne blir delt med veilederen din. For at vi skal kunne følge deg opp best mulig, er det viktig at du bruker aktivitetsplanen aktivt. Du må gjennomføre de aktivitetene du avtaler med NAV i planen.
                        
                        Du kan selv legge inn og redigere målet ditt, aktiviteter du skal gjøre og stillinger du vil søke på. Du får også tilgang til en dialog der du kan kommunisere med veilederen din og diskutere aktiviteter du skal gjennomføre.`}
                    </Tekstomrade>
                    <Video />
                    <BrukePlanenPanel />
                    <OkonomiskStotte />
                    <MeldekortPanel />
                    <RettigheterPanel />
                </ModalContainer>
            </Modal>
        );
    }
}

InformasjonModal.defaultProps = {
    lestInfo: null,
    backPath: '/'
};

InformasjonModal.propTypes = {
    erBruker: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    lestInfo: AppPT.lest,
    resetBackPath: PT.func.isRequired,
    backPath: PT.string,
    history: AppPT.history.isRequired
};

const mapStateToProps = state => ({
    lestInfo: selectLestInformasjon(state),
    erBruker: selectErBruker(state),
    underOppfolging: selectErUnderOppfolging(state),
    backPath: selectBackPath(state)
});

const mapDispatchToProps = dispatch => ({
    resetBackPath: () => dispatch(setBackPath('/'))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InformasjonModal);
