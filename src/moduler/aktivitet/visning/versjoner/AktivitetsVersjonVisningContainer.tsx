import { Modal, Link as AkselLink, InfoCard, Heading, Skeleton, LocalAlert } from '@navikt/ds-react';
import React, { Suspense } from 'react';
import { Await, Link, Navigate, useParams } from 'react-router';
import { AktivitetsVersjonPromise, useAktivitetsVersjonVisningLoaderData } from './aktivitet-versjon-slice';
import EkspanderbartTekstomrade from '../../../../felles-komponenter/EkspanderbartTekstomrade';
import { useRoutes } from '../../../../routing/useRoutes';
import { TidligereReferatAktivitet } from '../../../../api/aktivitetsplanGraphql';
import { PayloadAction } from '@reduxjs/toolkit';
import { GraphqlResponse } from '../../../../api/graphql/graphqlResult';

const VisModal = ({ children, link, heading }: { children: React.ReactNode; link: string; heading?: string }) => {
    return (
        <Modal open onClose={() => {}} aria-label="Tidligere versjon av aktivitet">
            <Modal.Header>
                {link ? (
                    <AkselLink>
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
    const { aktivitet } = useAktivitetsVersjonVisningLoaderData();
    const { aktivitetRoute, hovedsideRoute } = useRoutes();
    const { id } = useParams<{ id: string }>();

    if (!id) return <Navigate to={hovedsideRoute()} />;

    return (
        <Suspense
            fallback={
                <VisModal heading="Laster tidligere versjon..." link={'222'}>
                    <div>
                        <Skeleton />
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
            }
        >
            <Await
                resolve={aktivitet}
                errorElement={
                    <VisModal link={aktivitetRoute(id)} heading="Noe gikk galt">
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>Feil</LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>Klarte ikke hente tidligere versjon av aktiviteten</LocalAlert.Content>
                        </LocalAlert>
                    </VisModal>
                }
            >
                {(arg) => {
                    const data = arg as PayloadAction<GraphqlResponse<{ aktivitet: TidligereReferatAktivitet }>>;
                    return <AktivitetsVersjonVisningContent aktivitet={data.payload.data.aktivitet} />;
                }}
            </Await>
        </Suspense>
    );
};
