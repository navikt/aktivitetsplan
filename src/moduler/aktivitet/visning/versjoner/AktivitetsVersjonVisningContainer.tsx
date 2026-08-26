import { Modal, Link as AkselLink, InfoCard, Heading, Skeleton, LocalAlert } from '@navikt/ds-react';
import React from 'react';
import { Link, Navigate, useParams } from 'react-router';
import {
    selectAktivitetsVersjonHasError,
    selectAktivitetsVersjonLoading,
    selectAktivitetVersjon,
} from './aktivitet-versjon-slice';
import EkspanderbartTekstomrade from '../../../../felles-komponenter/EkspanderbartTekstomrade';
import { useRoutes } from '../../../../routing/useRoutes';
import { TidligereReferatAktivitet } from '../../../../api/aktivitetsplanGraphql';
import { useSelector } from 'react-redux';

const VisModal = ({
    children,
    link,
    heading,
}: {
    children: React.ReactNode;
    link: string;
    heading?: React.ReactNode;
}) => {
    return (
        <Modal open onClose={() => {}} aria-label="Tidligere versjon av aktivitet">
            <Modal.Header>
                {link ? (
                    <AkselLink as={'div'}>
                        <Link to={link}>Tilbake</Link>
                    </AkselLink>
                ) : null}
                <div className="space-y-2">
                    <Heading size="large">{heading}</Heading>
                </div>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
        </Modal>
    );
};

const AktivitetsVersjonVisningContent = ({ aktivitet }: { aktivitet: TidligereReferatAktivitet }) => {
    const { aktivitetRoute } = useRoutes();

    return (
        <VisModal link={aktivitetRoute(aktivitet.id)} heading={aktivitet?.tittel}>
            <EkspanderbartTekstomrade tekst={aktivitet.referat ?? ''} antallTegn={275} />
            <InfoCard data-color={'danger'}>
                <InfoCard.Header>
                    <InfoCard.Title>Du ser på en tidligere versjon av referatet</InfoCard.Title>
                </InfoCard.Header>
                <InfoCard.Content>Du ser på en gammel versjon av en aktivitet</InfoCard.Content>
            </InfoCard>
        </VisModal>
    );
};

export const AktivitetsVersjonVisningContainer = () => {
    const { aktivitetRoute, hovedsideRoute } = useRoutes();
    const { id } = useParams<{ id: string }>();
    const isLoading = useSelector(selectAktivitetsVersjonLoading);
    const isError = useSelector(selectAktivitetsVersjonHasError);
    const tidligereAktivitet = useSelector(selectAktivitetVersjon);

    if (!id) return <Navigate to={hovedsideRoute()} />;

    if (isLoading) {
        return (
            <VisModal heading={<Skeleton height={50} />} link={'222'}>
                <div>
                    <Skeleton width={650} />
                    <Skeleton />
                    <Skeleton />
                    <InfoCard data-color={'danger'}>
                        <InfoCard.Header>
                            <InfoCard.Title>Du ser på en tidligere versjon av referatet</InfoCard.Title>
                        </InfoCard.Header>
                        <InfoCard.Content>Du ser på en gammel versjon av en aktivitet</InfoCard.Content>
                    </InfoCard>
                </div>
            </VisModal>
        );
    }

    if (isError) {
        return (
            <VisModal link={aktivitetRoute(id)} heading="Noe gikk galt">
                <LocalAlert status="error">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Feil</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>Klarte ikke hente tidligere versjon av aktiviteten</LocalAlert.Content>
                </LocalAlert>
            </VisModal>
        );
    }

    return <AktivitetsVersjonVisningContent aktivitet={tidligereAktivitet!} />;
};
