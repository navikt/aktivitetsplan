import React, { useEffect } from 'react';
import { useDragDropManager, type DragDropManager } from '@dnd-kit/react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as aktivitetAPI from '../../../api/aktivitetAPI';
import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';
import { AktivitetsId } from '../../../datatypes/brandedTypes';
import * as logging from '../../../felles-komponenter/utils/logging';
import { enEgenAktivitet } from '../../../mocks/fixtures/egenAktivitet';
import { enMoteAktivitet } from '../../../mocks/fixtures/moteAktivitetFixtures';
import Aktivitetskolonner from '../Aktivitetskolonner';
import { velgPeriode } from '../../../moduler/filtrering/filter/valgt-periode-slice';
import { ErVeilederContext } from '../../../Provider';
import { gitt } from '../../../testUtils/store/mockStoreBuilder';
import { defaultAktivPeriode } from '../../../testUtils/store/defaultInitialStore';
import { setReadMode } from '../../../utils/readOrWriteModeSlice';
import { Tavleadvarsel } from '../Tavleadvarsel';

const aktivitet = enEgenAktivitet({
    id: 'drag-test' as AktivitetsId,
    tittel: 'Drag test',
    oppfolgingsperiodeId: defaultAktivPeriode.id,
});

function Location() {
    return <output aria-label="Location">{useLocation().pathname}</output>;
}

function CaptureManager({ managerRef }: { managerRef: { current?: DragDropManager } }) {
    const manager = useDragDropManager();
    useEffect(() => {
        if (manager) managerRef.current = manager;
    }, [manager, managerRef]);
    return null;
}

async function renderBoard({
    kort = aktivitet,
    erVeileder = false,
    readOnly = false,
}: { kort?: VeilarbAktivitet; erVeileder?: boolean; readOnly?: boolean } = {}) {
    const store = gitt().aktiviteter.medAktiviteter([kort]).createStore();
    store.dispatch(velgPeriode(kort.oppfolgingsperiodeId));
    if (readOnly) store.dispatch(setReadMode());
    // Exercise real dnd-kit events without browser layout or visual feedback plugins.
    const managerRef: { current?: DragDropManager } = {};
    render(
        <ErVeilederContext value={erVeileder}>
            <Provider store={store}>
                <MemoryRouter>
                    <Aktivitetskolonner plugins={[]} sensors={[]}>
                        <CaptureManager managerRef={managerRef} />
                    </Aktivitetskolonner>
                    <Tavleadvarsel />
                    <Location />
                </MemoryRouter>
            </Provider>
        </ErVeilederContext>,
    );
    await screen.findByRole('link', { name: new RegExp(kort.tittel) });
    const manager = managerRef.current;
    if (!manager) throw new Error('DragDropProvider did not create a manager');

    const start = async () => {
        await act(async () => {
            manager.actions.start({
                source: `aktivitetskort-${kort.id}`,
                coordinates: { x: 0, y: 0 },
            });
        });
    };
    const drop = async (status?: AktivitetStatus, canceled = false) => {
        await act(async () => {
            void manager.actions.setDropTarget(status ? `aktivitetskolonne-${status}` : null);
        });
        await act(async () => {
            manager.actions.stop({ canceled });
        });
    };
    return { store, manager, start, drop };
}

beforeEach(() => {
    class Observer {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', Observer);
    vi.stubGlobal('ResizeObserver', Observer);
    Object.defineProperty(HTMLElement.prototype, 'showPopover', { configurable: true, value: vi.fn() });
    Object.defineProperty(Element.prototype, 'setPointerCapture', { configurable: true, value: vi.fn() });
    Object.defineProperty(Element.prototype, 'animate', {
        configurable: true,
        value: vi.fn(() => ({ finished: Promise.resolve(), cancel: vi.fn(), finish: vi.fn() })),
    });
    vi.spyOn(aktivitetAPI, 'oppdaterAktivitetStatus').mockImplementation(async (updated) => updated);
    vi.spyOn(logging, 'flyttetAktivitetMetrikk').mockImplementation(() => {});
});

afterEach(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'showPopover');
    Reflect.deleteProperty(Element.prototype, 'setPointerCapture');
    Reflect.deleteProperty(Element.prototype, 'animate');
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('Activity drag and drop', () => {
    it('tracks dragging and highlights only the active allowed column', async () => {
        const { manager, start, drop } = await renderBoard();
        await start();
        await act(async () => {
            void manager.actions.setDropTarget(`aktivitetskolonne-${AktivitetStatus.GJENNOMFOERT}`);
        });
        expect(
            screen.getByTestId(`aktivitetstavle.${AktivitetStatus.GJENNOMFOERT}`).firstElementChild?.firstElementChild,
        ).toHaveClass('bg-ax-bg-accent-moderate-hover');
        expect(
            screen.getByTestId(`aktivitetstavle.${AktivitetStatus.PLANLAGT}`).firstElementChild?.firstElementChild,
        ).toHaveClass('opacity-50');
        await drop(undefined, true);
        expect(
            screen.getByTestId(`aktivitetstavle.${AktivitetStatus.PLANLAGT}`).firstElementChild?.firstElementChild,
        ).not.toHaveClass('opacity-50');
    });

    it('moves an activity and logs exactly one metric', async () => {
        const { start, drop } = await renderBoard();
        await start();
        await drop(AktivitetStatus.GJENNOMFOERT);
        await waitFor(
            () =>
                expect(aktivitetAPI.oppdaterAktivitetStatus).toHaveBeenCalledExactlyOnceWith({
                    ...aktivitet,
                    status: AktivitetStatus.GJENNOMFOERT,
                }),
            { timeout: 2000 },
        );
        expect(logging.flyttetAktivitetMetrikk).toHaveBeenCalledExactlyOnceWith(
            'dragAndDrop',
            aktivitet,
            AktivitetStatus.GJENNOMFOERT,
        );
    });

    it('opens the drag warning in the top layer above the card and removes it when dragging stops', async () => {
        const showPopover = vi.mocked(HTMLElement.prototype.showPopover);
        const { start, drop } = await renderBoard({ kort: { ...aktivitet, status: AktivitetStatus.FULLFOERT } });
        await start();
        const warning = await screen.findByText('Aktiviteten er fullført og kan ikke endres.');
        const popover = warning.closest('[popover]');
        if (!popover) throw new Error('Expected the warning to be a popover');
        expect(popover).toHaveAttribute('popover', 'manual');
        expect(popover).toHaveClass('fixed', 'inset-auto', 'm-0');
        await waitFor(() => expect(showPopover).toHaveBeenCalledOnce());
        await drop(undefined, true);
        expect(screen.queryByText('Aktiviteten er fullført og kan ikke endres.')).not.toBeInTheDocument();
    });

    it.each([
        [AktivitetStatus.FULLFOERT, 'fullfor'],
        [AktivitetStatus.AVBRUTT, 'avbryt'],
    ])('opens the confirmation flow for %s instead of updating immediately', async (status, route) => {
        const { start, drop } = await renderBoard({ erVeileder: true });
        await start();
        await drop(status);
        expect(screen.getByLabelText('Location')).toHaveTextContent(
            `/aktivitetsplan/aktivitet/${route}/${aktivitet.id}`,
        );
        expect(aktivitetAPI.oppdaterAktivitetStatus).not.toHaveBeenCalled();
        expect(logging.flyttetAktivitetMetrikk).toHaveBeenCalledTimes(1);
    });

    it.each([
        { name: 'same status', status: AktivitetStatus.PLANLAGT, canceled: false },
        { name: 'cancellation', status: AktivitetStatus.GJENNOMFOERT, canceled: true },
        { name: 'no target', status: undefined, canceled: false },
    ])('ignores $name and clears drag state', async ({ status, canceled }) => {
        const { start, drop } = await renderBoard();
        await start();
        await drop(status, canceled);
        expect(aktivitetAPI.oppdaterAktivitetStatus).not.toHaveBeenCalled();
        expect(logging.flyttetAktivitetMetrikk).not.toHaveBeenCalled();
        expect(screen.getByLabelText('Location')).toHaveTextContent('/');
    });

    it.each([
        { name: 'read-only mode', readOnly: true, kort: aktivitet },
        { name: 'historical activity', kort: { ...aktivitet, historisk: true } },
        { name: 'completed activity', kort: { ...aktivitet, status: AktivitetStatus.FULLFOERT } },
        { name: 'cancelled activity', kort: { ...aktivitet, status: AktivitetStatus.AVBRUTT } },
        {
            name: 'meeting dragged by an end user',
            kort: enMoteAktivitet({ oppfolgingsperiodeId: defaultAktivPeriode.id }),
        },
    ])('rejects drops for $name', async ({ kort, ...options }) => {
        const { manager, start, drop } = await renderBoard({ kort, ...options });
        await start();
        expect(manager.registry.droppables.get(`aktivitetskolonne-${AktivitetStatus.GJENNOMFOERT}`)?.disabled).toBe(
            true,
        );
        await drop(AktivitetStatus.GJENNOMFOERT);
        expect(aktivitetAPI.oppdaterAktivitetStatus).not.toHaveBeenCalled();
        expect(logging.flyttetAktivitetMetrikk).not.toHaveBeenCalled();
    });

    it('keeps cards as links and does not start dragging on Enter', async () => {
        await renderBoard();
        const link = await screen.findByRole('link', { name: /Drag test/ });
        fireEvent.keyDown(link, { key: 'Enter', code: 'Enter' });
        fireEvent.click(link);
        expect(screen.getByLabelText('Location')).toHaveTextContent(`/aktivitet/vis/${aktivitet.id}`);
    });

    it('starts keyboard dragging with Space and cancels with Escape', async () => {
        await renderBoard();
        const link = await screen.findByRole('link', { name: /Drag test/ });
        fireEvent.keyDown(link, { key: ' ', code: 'Space' });
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
        expect(aktivitetAPI.oppdaterAktivitetStatus).not.toHaveBeenCalled();
    });

    it('starts pointer dragging from card content without following the link', async () => {
        await renderBoard();
        const title = await screen.findByText('Drag test');
        fireEvent.pointerDown(title, {
            isPrimary: true,
            pointerType: 'mouse',
            button: 0,
            clientX: 0,
            clientY: 0,
        });
        fireEvent.pointerMove(document, { clientX: 6, clientY: 0 });
        fireEvent.pointerUp(document);
        expect(screen.getByLabelText('Location')).toHaveTextContent('/');
        expect(aktivitetAPI.oppdaterAktivitetStatus).not.toHaveBeenCalled();
    });
});
