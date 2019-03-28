import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import Modal from '../../felles-komponenter/modal/modal';
import { selectLestInformasjon } from '../lest/lest-reducer';
import * as Api from './../lest/lest-api';
import { selectErBruker } from '../identitet/identitet-selector';
import * as AppPT from '../../proptypes';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import InformasjonsContent from './informasjons-content';

export const INFORMASJON_MODAL_VERSJON = 'v1';

class InformasjonModal extends Component {
    componentWillMount() {
        const { erBruker, underOppfolging, lestInfo } = this.props;

        if (
            erBruker &&
            underOppfolging &&
            (!lestInfo || lestInfo.verdi !== INFORMASJON_MODAL_VERSJON)
        ) {
            Api.lesInformasjon(INFORMASJON_MODAL_VERSJON);
        }
    }

    render() {
        return (
            <Modal
                contentLabel="informasjon-modal"
                contentClass="informasjon-visning"
            >
                <InformasjonsContent />
            </Modal>
        );
    }
}

InformasjonModal.defaultProps = {
    lestInfo: null,
};

InformasjonModal.propTypes = {
    erBruker: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    lestInfo: AppPT.lest,
};

const mapStateToProps = state => ({
    lestInfo: selectLestInformasjon(state),
    erBruker: selectErBruker(state),
    underOppfolging: selectErUnderOppfolging(state),
});

export default connect(mapStateToProps)(InformasjonModal);
