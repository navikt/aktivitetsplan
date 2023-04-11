import { Accordion, BodyShort, Heading, Link } from '@navikt/ds-react';
import PT from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as Api from '../../api/lestAPI';
import Modal from '../../felles-komponenter/modal/Modal';
import ModalContainer from '../../felles-komponenter/modal/ModalContainer';
import * as AppPT from '../../proptypes';
import { useRoutes } from '../../routes';
import { selectErBruker } from '../identitet/identitet-selector';
import { selectLestInformasjon } from '../lest/lest-reducer';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { BrukePlanenPanel } from './brukePlanenPanel';
import { OkonomiskStotte } from './okonomiskStottePanel';
import { RettigheterPanel } from './rettigheterPanel';
import Video from './Video';

export const INFORMASJON_MODAL_VERSJON = 'v1';

interface Props {
    erBruker: boolean;
    underOppfolging: boolean;
    lestInfo: { verdi: string; ressurs: string; tidspunkt: string };
}

const InformasjonModal = ({ erBruker, underOppfolging, lestInfo }: Props) => {
    const navigate = useNavigate();
    const { hovedsideRoute } = useRoutes();
    useEffect(() => {
        if (erBruker && underOppfolging && (!lestInfo || lestInfo.verdi !== INFORMASJON_MODAL_VERSJON)) {
            Api.postLest(INFORMASJON_MODAL_VERSJON);
        }
    }, []);

    return (
        <Modal
            className="informasjon-visning"
            onRequestClose={() => {
                navigate(hovedsideRoute());
            }}
        >
            <ModalContainer className="max-w-2xl">
                <Heading id="modal-heading" level="1" size="large" className="mb-4">
                    Hva er aktivitetsplanen?
                </Heading>
                <BodyShort className="pb-4">
                    I aktivitetsplanen holder du oversikt over det du gjør for å komme i jobb eller annen aktivitet.
                    Både du og veilederen din kan se og endre aktivitetsplanen.
                </BodyShort>
                <BodyShort>
                    Du kan legge inn målet ditt, aktiviteter du skal gjøre og stillinger du vil søke på. Veilederen kan
                    blant annet legge inn forslag til aktiviteter eller skrive referat fra et møte dere har hatt. Du kan
                    kommunisere med veilederen din om aktivitetene i{' '}
                    <Link href={import.meta.env.VITE_ARBEIDSRETTET_DIALOG_URL}>dialogen</Link>.
                </BodyShort>
                <Accordion className="mt-4">
                    <BrukePlanenPanel />
                    <OkonomiskStotte />
                    <RettigheterPanel />
                </Accordion>
                <Video />
            </ModalContainer>
        </Modal>
    );
};

(InformasjonModal as any).defaultProps = {
    lestInfo: null,
    erBruker: false,
    underOppfolging: false,
};

(InformasjonModal as any).propTypes = {
    erBruker: PT.bool,
    underOppfolging: PT.bool,
    lestInfo: AppPT.lest,
};

const mapStateToProps = (state: any) => ({
    lestInfo: selectLestInformasjon(state),
    erBruker: selectErBruker(state),
    underOppfolging: selectErUnderOppfolging(state),
});
export default connect(mapStateToProps)(InformasjonModal);
