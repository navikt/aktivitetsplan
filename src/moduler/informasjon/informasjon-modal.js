import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import PT from 'prop-types';
import Modal from '../../felles-komponenter/modal/modal';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import HtmlText from '../../htmlText';
import Ekspanderbartpanel from '../../felles-komponenter/utils/ekspanderbartpanel-med-tittel-og-innhold';
import Video from './video';
import { selectLestInformasjon } from '../lest/lest-reducer';
import * as Api from '../lest/lest-api';
import { selectErBruker } from '../identitet/identitet-selector';
import * as AppPT from '../../proptypes';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { selectBackPath, setBackPath } from './informasjon-reducer';

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
                    <Innholdstittel>
                        <FormattedMessage id="informasjon.ny_tittel" />
                    </Innholdstittel>
                    <HtmlText
                        className="mellomrom"
                        id="informasjon.ny_hjelpetekst"
                    />
                    <Video />
                    <Ekspanderbartpanel
                        tittelId="informasjon.tittel.seksjon.bruk"
                        htmlTextId="informasjon.informasjonstekst.seksjon.bruk"
                        border
                    />

                    <Ekspanderbartpanel
                        tittelId="informasjon.tittel.seksjon.ytelser"
                        htmlTextId="informasjon.informasjonstekst.seksjon.ytelser"
                        border
                    />

                    <Ekspanderbartpanel
                        tittelId="informasjon.tittel.seksjon.meldekort"
                        htmlTextId="informasjon.informasjonstekst.seksjon.meldekort"
                        border
                    />

                    <Ekspanderbartpanel
                        tittelId="informasjon.tittel.seksjon.personvern"
                        htmlTextId="informasjon.informasjonstekst.seksjon.personvern"
                        border
                    />
                </ModalContainer>
            </Modal>
        );
    }
}

InformasjonModal.defaultProps = {
    lestInfo: null,
    backPath: '/',
};

InformasjonModal.propTypes = {
    erBruker: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    lestInfo: AppPT.lest,
    resetBackPath: PT.func.isRequired,
    backPath: PT.string,
    history: AppPT.history.isRequired,
};

const mapStateToProps = state => ({
    lestInfo: selectLestInformasjon(state),
    erBruker: selectErBruker(state),
    underOppfolging: selectErUnderOppfolging(state),
    backPath: selectBackPath(state),
});

const mapDispatchToProps = dispatch => ({
    resetBackPath: () => dispatch(setBackPath('/')),
});

export default connect(mapStateToProps, mapDispatchToProps)(InformasjonModal);
