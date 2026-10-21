import { Accordion, BodyShort, Link } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import * as Api from '../../api/lestAPI';
import Modal from '../../felles-komponenter/modal/Modal';
import ModalContainer from '../../felles-komponenter/modal/ModalContainer';
import { selectLestInformasjon } from '../lest/lest-selector';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { BrukePlanenPanel } from './brukePlanenPanel';
import { OkonomiskStotte } from './okonomiskStottePanel';
import { RettigheterPanel } from './rettigheterPanel';
import { DialogPanel } from './dialogPanel';
import IntroduksjonVideo from './Video/IntroduksjonVideo';
import { useNavigate } from 'react-router';
import { useRoutes } from '../../routing/useRoutes';
import { InnsynsrettPanel } from './innsynsrettPanel';
import { useErVeileder } from '../../Provider';
import { Lest } from '../../datatypes/lestTypes';

export const INFORMASJON_MODAL_VERSJON = 'v1';

interface Props {
    underOppfolging: boolean;
    lestInfo: Lest | undefined;
}

const InformasjonModal = ({ underOppfolging, lestInfo }: Props) => {
    const erVeileder = useErVeileder();
    const navigate = useNavigate();
    const { hovedsideRoute } = useRoutes();
    const tilHovedside = () => navigate(hovedsideRoute());
    useEffect(() => {
        if (!erVeileder && underOppfolging && (!lestInfo || lestInfo.verdi !== INFORMASJON_MODAL_VERSJON)) {
            Api.postLest(INFORMASJON_MODAL_VERSJON);
        }
    }, []);

    return (
        <Modal
            lukkPåKlikkUtenfor={true}
            onClose={tilHovedside}
            className="informasjon-visning"
            heading="Hva er aktivitetsplanen?"
        >
            <ModalContainer className="max-w-2xl">
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
                <IntroduksjonVideo />
                <Accordion className="mt-4">
                    <InnsynsrettPanel />
                    <BrukePlanenPanel />
                    <DialogPanel />
                    <OkonomiskStotte />
                    <RettigheterPanel />
                </Accordion>
            </ModalContainer>
        </Modal>
    );
};

const mapStateToProps = (state: any) => ({
    lestInfo: selectLestInformasjon(state),
    underOppfolging: selectErUnderOppfolging(state),
});
export default connect(mapStateToProps)(InformasjonModal);
