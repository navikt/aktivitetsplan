import { Heading, Modal, Skeleton } from '@navikt/ds-react';
import { Await, Outlet, useMatches, useNavigate } from 'react-router';
import { useRoutes } from './useRoutes';
import { Suspense, useRef } from 'react';

export const ModalRoute = () => {
    return <ModalRouteInner />;
};

export const ModalRouteInner = () => {
    const navigate = useNavigate();
    const { hovedsideRoute } = useRoutes();
    const modalHandle = useRef<ModalRouteHandle>(null);

    const matches = useMatches().at(-1); //.find((it) => it.handle);

    const closeFuncOrDefault = () => {
        console.log('ModalRoute - closeFuncOrDefault');
        if (modalHandle?.current?.onRequestClose) {
            const shouldClose = modalHandle.current.onRequestClose();
            console.log(`ModalRoute -onRequestClose from sub-route - shouldClose ${shouldClose}`);
            return shouldClose;
        }
        console.log('ModalRoute - navigating to hovedsideroute');
        navigate(hovedsideRoute());
        return true;
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
                <Suspense fallback={<Skeleton height={40} width={500} />}>
                    <Await resolve={matches?.loaderData}>
                        <Heading size={'large'}>{matches?.loaderData?.aktivitet?.tittel ?? '<mangler>'}</Heading>
                    </Await>
                </Suspense>
            </Modal.Header>
            <Modal.Body>
                <Outlet context={{ modalHandle }} />
            </Modal.Body>
        </Modal>
    );
};

export interface ModalRouteHandle {
    getHeading: () => string;
    onRequestClose: () => boolean;
    getLoaderPromise: () => Promise<boolean>;
}

export type OutletContext = {
    modalHandle: React.RefObject<ModalRouteHandle>;
};
