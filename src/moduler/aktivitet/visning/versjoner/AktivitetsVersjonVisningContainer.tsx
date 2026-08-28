import { InfoCard, Skeleton, LocalAlert } from '@navikt/ds-react';
import React from 'react';
import { Navigate, useParams } from 'react-router';
import {
    selectAktivitetsVersjonHasError,
    selectAktivitetsVersjonLoading,
    selectAktivitetVersjon,
} from './aktivitet-versjon-slice';
import EkspanderbartTekstomrade from '../../../../felles-komponenter/EkspanderbartTekstomrade';
import { useRoutes } from '../../../../routing/useRoutes';
import { TidligereReferatAktivitet } from '../../../../api/aktivitetsplanGraphql';
import { useSelector } from 'react-redux';

const AktivitetsVersjonVisningContent = ({ aktivitet }: { aktivitet: TidligereReferatAktivitet }) => {
    return (
        <>
            <EkspanderbartTekstomrade tekst={aktivitet.referat ?? ''} antallTegn={275} />
            <InfoCard data-color={'info'}>
                <InfoCard.Header>
                    <InfoCard.Title>Du ser på en tidligere versjon av referatet</InfoCard.Title>
                </InfoCard.Header>
                <InfoCard.Content>Du ser på en gammel versjon av en aktivitet</InfoCard.Content>
            </InfoCard>
        </>
    );
};

export const AktivitetsVersjonVisningContainer = () => {
    const { hovedsideRoute } = useRoutes();
    const { id } = useParams<{ id: string }>();
    const isLoading = useSelector(selectAktivitetsVersjonLoading);
    const isError = useSelector(selectAktivitetsVersjonHasError);
    const tidligereAktivitet = useSelector(selectAktivitetVersjon);

    if (!id) return <Navigate to={hovedsideRoute()} />;

    if (isLoading) {
        return (
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
        );
    }

    if (isError) {
        return (
            <LocalAlert status="error">
                <LocalAlert.Header>
                    <LocalAlert.Title>Feil</LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>Klarte ikke hente tidligere versjon av aktiviteten</LocalAlert.Content>
            </LocalAlert>
        );
    }

    return <AktivitetsVersjonVisningContent aktivitet={tidligereAktivitet!} />;
};
