import { Modal, Link as AkselLink, InfoCard, Heading, BodyShort } from '@navikt/ds-react';
import React from 'react';
import { Link, useLoaderData } from 'react-router';
import { selectAktivitetVersjon } from './aktivitet-versjon-slice';
import { useSelector } from 'react-redux';
import EkspanderbartTekstomrade from '../../../../felles-komponenter/EkspanderbartTekstomrade';
import { useRoutes } from '../../../../routing/useRoutes';

export const AktivitetsVersjonVisningContainer = () => {
    const aktivitetsVersjon = useSelector(selectAktivitetVersjon);
    const { aktivitetRoute } = useRoutes();

    return (
        <Modal open onClose={() => {}} aria-label="Gammel versjon av aktivitet">
            <Modal.Header>
                <AkselLink>
                    <Link to={aktivitetRoute(aktivitetsVersjon?.id)}>Tilbake</Link>
                </AkselLink>
                <div className="space-y-2">
                    <Heading id="modal-heading" size="large">
                        {aktivitetsVersjon?.tittel}
                    </Heading>
                </div>
            </Modal.Header>
            <Modal.Body>
                <EkspanderbartTekstomrade tekst={aktivitetsVersjon?.referat ?? ''} antallTegn={275} />
                <InfoCard data-color={'danger'}>
                    <InfoCard.Header>
                        <InfoCard.Title>Du ser på en tidligere versjon av referatet</InfoCard.Title>
                    </InfoCard.Header>
                    <InfoCard.Content>Du ser på en gammel versjon av en aktivitet</InfoCard.Content>
                </InfoCard>
            </Modal.Body>
        </Modal>
    );
};
