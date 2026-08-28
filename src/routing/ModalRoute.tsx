import { Heading, Modal, Skeleton } from '@navikt/ds-react';
import { Link, Navigate, Outlet, UIMatch, useMatches, useNavigate, useParams } from 'react-router';
import { useRoutes } from './useRoutes';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import {
    selectAktivitetsVersjonLoading,
    selectAktivitetVersjon,
} from '../moduler/aktivitet/visning/versjoner/aktivitet-versjon-slice';
import { RootState } from '../store/rootReducer';
import { selectAktivitetMedId } from '../moduler/aktivitet/aktivitetlisteSelector';
import { AlleAktiviteter } from '../datatypes/aktivitetTypes';
import { TidligereReferatAktivitet } from '../api/aktivitetsplanGraphql';
import { Link as AkselLink } from '@navikt/ds-react/Link';
import { selectAktivitetsVisningsAvhengigheter } from '../moduler/aktivitet/visning/AktivitetvisningContainer';
import { Status } from '../store/createGenericSlice';
import {
    canCloseAktivitetVisningModal,
    skalBlokkereLukkingAvModalAktivitetsVisningPgaFHO,
} from '../moduler/aktivitet/visning/AktivitetvisningModal';
import { DirtyContext, DirtyProvider } from '../moduler/context/dirty-context';
import { useErVeileder } from '../Provider';

enum MatchedRoute {
    AKTIVITETS_VISNINING,
    AKTIVITETS_VERSJON_VISNINING,
    UKJENT,
}

const getMatchedRoute = (match: UIMatch) => {
    if (match.id === 'aktivitetsVisning') return MatchedRoute.AKTIVITETS_VISNINING;
    if (match.id === 'aktivitetsVersjonVisning') return MatchedRoute.AKTIVITETS_VERSJON_VISNINING;
    return MatchedRoute.UKJENT;
};

export const ModalRoute = () => {
    return (
        <DirtyProvider>
            <ModalRouteInner />
        </DirtyProvider>
    );
};

export const ModalRouteInner = () => {
    const navigate = useNavigate();
    const { hovedsideRoute, aktivitetRoute } = useRoutes();
    const { id: aktivitetId } = useParams<{ id: string }>();
    const erBruker = !useErVeileder();
    const dirty = useContext(DirtyContext);

    const matches = useMatches().at(-1);
    const matchedRoute = getMatchedRoute(matches as UIMatch);

    /* Aktivitet-versjon visning */
    const isTidligereAktivitetLoading = useSelector(selectAktivitetsVersjonLoading);
    const tidligereAktivitet: TidligereReferatAktivitet | undefined = useSelector(selectAktivitetVersjon);

    /* Aktivitetsvisning */
    const isAktivitetLoading: Status[] = useSelector(selectAktivitetsVisningsAvhengigheter);
    const aktivitet: AlleAktiviteter | undefined = aktivitetId
        ? useSelector((state: RootState) => selectAktivitetMedId(state, aktivitetId))
        : undefined;
    const skalBlokkereLukkingPgaFHO = skalBlokkereLukkingAvModalAktivitetsVisningPgaFHO(aktivitet, erBruker);

    const isLoading =
        matchedRoute === MatchedRoute.AKTIVITETS_VERSJON_VISNINING
            ? isTidligereAktivitetLoading
            : isAktivitetLoading.some((status) => status !== Status.OK);

    const closeFuncOrDefault = () => {
        if (matchedRoute === MatchedRoute.AKTIVITETS_VISNINING) {
            return canCloseAktivitetVisningModal(dirty, skalBlokkereLukkingPgaFHO);
        } else {
            navigate(hovedsideRoute());
            return true;
        }
    };

    if (matchedRoute === MatchedRoute.UKJENT) {
        return <Navigate to={hovedsideRoute()}></Navigate>;
    }

    const getModalHeader = () => {
        if (matchedRoute === MatchedRoute.AKTIVITETS_VISNINING) {
            return (
                <>
                    <Heading size="large">{aktivitet?.tittel}</Heading>
                </>
            );
        } else if (matchedRoute === MatchedRoute.AKTIVITETS_VERSJON_VISNINING) {
            return (
                <>
                    {tidligereAktivitet?.id ? (
                        <AkselLink as={'div'}>
                            <Link to={aktivitetRoute(tidligereAktivitet.id)}>Tilbake</Link>
                        </AkselLink>
                    ) : null}
                    <div className="space-y-2">
                        <Heading size="large">{tidligereAktivitet?.tittel}</Heading>
                    </div>
                </>
            );
        }
    };

    return (
        <Modal
            closeOnBackdropClick={true}
            open
            onClose={() => navigate(hovedsideRoute())}
            onBeforeClose={closeFuncOrDefault}
            className="lg:w-120"
            aria-labelledby="modal-heading"
        >
            <Modal.Header closeButton={true}>
                {isLoading ? <Skeleton height={40} width={500} /> : getModalHeader()}
            </Modal.Header>
            <Modal.Body>
                <Outlet />
            </Modal.Body>
        </Modal>
    );
};
