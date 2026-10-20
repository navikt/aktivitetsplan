import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createRootMock, saveReduxStateToSessionStorageMock } = vi.hoisted(() => ({
    createRootMock: vi.fn(),
    saveReduxStateToSessionStorageMock: vi.fn(),
}));

vi.mock('react-dom/client', () => ({
    createRoot: createRootMock,
}));

vi.mock('@navikt/ds-react', () => ({
    Provider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('./app', () => ({
    default: () => null,
}));

vi.mock('./Provider', () => ({
    default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('./routing/routerConfig', () => ({
    createRouterWithWrapper: vi.fn(() => vi.fn()),
}));

vi.mock('./store/sessionStorageStoreCache', () => ({
    clearReduxCache: vi.fn(),
    getPreloadedStateFromSessionStorage: vi.fn(() => undefined),
    saveReduxStateToSessionStorage: saveReduxStateToSessionStorageMock,
}));

vi.mock('./mocks/demo/localStorage', () => ({
    LocalStorageElement: { FNR: 'FNR' },
    settSessionStorage: vi.fn(),
}));

vi.mock('./moduler/aktivitet/aktivitet-forms/samtalereferat/useSamtalereferatKladd', () => ({
    slettGamleSamtalereferatKladder: vi.fn(),
}));

import { DabAktivitetsplan } from './webcomponentWrapper';

const TEST_TAG_NAME = 'dab-aktivitetsplan-test';

describe('DabAktivitetsplan lifecycle', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        createRootMock.mockImplementation(() => ({
            render: vi.fn(),
            unmount: vi.fn(),
        }));

        if (!customElements.get(TEST_TAG_NAME)) {
            customElements.define(TEST_TAG_NAME, DabAktivitetsplan);
        }
    });

    it('should not mount twice when connectedCallback is called twice without disconnect', () => {
        const element = document.createElement(TEST_TAG_NAME) as DabAktivitetsplan;

        element.connectedCallback();
        element.connectedCallback();

        expect(createRootMock).toHaveBeenCalledTimes(1);
        const firstRoot = createRootMock.mock.results[0].value;
        expect(firstRoot.render).toHaveBeenCalledTimes(1);
    });

    it('should unmount and mount again when disconnected and reconnected', () => {
        const element = document.createElement(TEST_TAG_NAME) as DabAktivitetsplan;

        element.connectedCallback();
        const firstRoot = createRootMock.mock.results[0].value;

        element.disconnectedCallback();
        expect(firstRoot.unmount).toHaveBeenCalledTimes(1);
        expect(saveReduxStateToSessionStorageMock).toHaveBeenCalledTimes(1);

        element.connectedCallback();

        expect(createRootMock).toHaveBeenCalledTimes(2);
        const secondRoot = createRootMock.mock.results[1].value;
        expect(secondRoot.render).toHaveBeenCalledTimes(1);
    });

    it('should reuse appRoot across reconnects for the same element instance', () => {
        const element = document.createElement(TEST_TAG_NAME) as DabAktivitetsplan;

        element.connectedCallback();
        const appRootAfterFirstConnect = element.appRoot;

        element.disconnectedCallback();
        element.connectedCallback();

        expect(element.appRoot).toBe(appRootAfterFirstConnect);
        expect(createRootMock).toHaveBeenCalledTimes(2);
    });

    it('should not re-render root when data-fnr and data-aktivEnhet attributes change', () => {
        const element = document.createElement(TEST_TAG_NAME) as DabAktivitetsplan;

        element.connectedCallback();
        const root = createRootMock.mock.results[0].value;

        expect(createRootMock).toHaveBeenCalledTimes(1);
        expect(root.render).toHaveBeenCalledTimes(1);

        element.setAttribute('data-fnr', '123');
        element.setAttribute('data-aktivEnhet', '4321');

        expect(createRootMock).toHaveBeenCalledTimes(1);
        expect(root.render).toHaveBeenCalledTimes(1);
    });
});
