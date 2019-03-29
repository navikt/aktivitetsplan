import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavFrontendModal from 'nav-frontend-modal';
import PT from 'prop-types';
import {
    hentLest,
    selectLestInformasjon,
    selectLestStatus,
} from '../lest/lest-reducer';
import * as Api from './../lest/lest-api';
import { selectErBruker } from '../identitet/identitet-selector';
import * as AppPT from '../../proptypes';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import {
    alleredeAutomatiskOpned,
    automatiskOpning,
    informasjonErOpen,
    visInformasjon,
} from './Informasjon-modal-reducer';
import { STATUS } from '../../ducks/utils';
import InformasjonsContent from './informasjons-content';

export const INFORMASJON_MODAL_VERSJON = 'v1';

function harUlestInfo(lestInfo) {
    return !lestInfo || lestInfo.verdi !== INFORMASJON_MODAL_VERSJON;
}

class AutomatiskInformasjonModal extends Component {
    componentWillMount() {
        if (this.props.underOppfolging) {
            this.props.doHentLest();
        }
    }

    componentDidUpdate(prevProps) {
        const {
            erBruker,
            underOppfolging,
            lestInfo,
            harLastetLest,
            aleredeAutomatiskOpned,
        } = this.props;

        if (!erBruker || !underOppfolging) {
            return;
        }

        if (!prevProps.open && this.props.open) {
            if (harUlestInfo(lestInfo)) {
                Api.lesInformasjon(INFORMASJON_MODAL_VERSJON);
            }
        } else if (
            harUlestInfo(lestInfo) &&
            harLastetLest &&
            !aleredeAutomatiskOpned
        ) {
            this.props.doAutomatiskOpning();
            this.props.openInformasjon();
        }
    }

    render() {
        return (
            <NavFrontendModal
                isOpen={this.props.open}
                className="aktivitet-modal"
                contentLabel="informasjon-modal"
                contentClass="informasjon-visning"
                overlayClassName="aktivitet-modal__overlay"
                portalClassName="aktivitetsplanfs aktivitet-modal-portal"
                onRequestClose={() => this.props.onRequestClose()}
            >
                <InformasjonsContent />
            </NavFrontendModal>
        );
    }
}

AutomatiskInformasjonModal.defaultProps = {
    lestInfo: null,
};

AutomatiskInformasjonModal.propTypes = {
    erBruker: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    lestInfo: AppPT.lest,
    open: PT.bool.isRequired,
    onRequestClose: PT.func.isRequired,
    openInformasjon: PT.func.isRequired,
    doHentLest: PT.func.isRequired,
    harLastetLest: PT.bool.isRequired,
    doAutomatiskOpning: PT.func.isRequired,
    aleredeAutomatiskOpned: PT.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
    onRequestClose: () => dispatch(visInformasjon(false)),
    openInformasjon: () => dispatch(visInformasjon(true)),
    doHentLest: () => dispatch(hentLest()),
    doAutomatiskOpning: () => dispatch(automatiskOpning()),
});

const mapStateToProps = state => ({
    lestInfo: selectLestInformasjon(state),
    erBruker: selectErBruker(state),
    underOppfolging: selectErUnderOppfolging(state),
    open: informasjonErOpen(state),
    harLastetLest: selectLestStatus(state) === STATUS.OK,
    aleredeAutomatiskOpned: alleredeAutomatiskOpned(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    AutomatiskInformasjonModal
);
