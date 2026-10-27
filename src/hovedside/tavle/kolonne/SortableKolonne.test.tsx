import React, { useEffect } from 'react';
import { useDragDropManager, type DragDropManager } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as aktivitetAPI from '../../../api/aktivitetAPI';
import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import { AktivitetsId } from '../../../datatypes/brandedTypes';
import * as logging from '../../../felles-komponenter/utils/logging';
import { enEgenAktivitet } from '../../../mocks/fixtures/egenAktivitet';
import { flyttAktivitet } from '../../../moduler/aktivitet/aktivitet-actions';
import { BasePage } from '../../../BasePage';
import Aktivitetskolonner from '../Aktivitetskolonner';
import { selectAktivitet } from '../../../moduler/aktivitet/aktivitet-slice';
import { velgPeriode } from '../../../moduler/filtrering/filter/valgt-periode-slice';
import { ErVeilederContext } from '../../../Provider';
import { defaultAktivPeriode } from '../../../testUtils/store/defaultInitialStore';
import { gitt } from '../../../testUtils/store/mockStoreBuilder';

const kort = enEgenAktivitet({
    id: 'sortable-source' as AktivitetsId,
    tittel: 'Sortable source',
    oppfolgingsperiodeId: defaultAktivPeriode.id,
});
const destination = {
    ...kort,
    id: 'destination-card' as AktivitetsId,
    tittel: 'Destination card',
    status: AktivitetStatus.GJENNOMFOERT,
};

function Capture({ managerRef }: { managerRef: { current?: DragDropManager } }) {
    const manager = useDragDropManager();
    useEffect(() => {
        if (manager) managerRef.current = manager;
    }, [manager, managerRef]);
    return <output aria-label="Location">{useLocation().pathname}</output>;
}

async function renderBoard(aktiviteter = [kort, destination], onRender: React.ProfilerOnRenderCallback = () => {}) {
    const store = gitt().aktiviteter.medAktiviteter(aktiviteter).createStore();
    store.dispatch(velgPeriode(defaultAktivPeriode.id));
    const managerRef: { current?: DragDropManager } = {};
    render(
        <ErVeilederContext value={true}>
            <Provider store={store}>
                <MemoryRouter>
                    <Routes>
                        <Route element={<BasePage />}>
                            <Route
                                path="*"
                                element={
                                    <React.Profiler id="board" onRender={onRender}>
                                        <Aktivitetskolonner>
                                            <Capture managerRef={managerRef} />
                                        </Aktivitetskolonner>
                                    </React.Profiler>
                                }
                            />
                        </Route>
                    </Routes>
                </MemoryRouter>
            </Provider>
        </ErVeilederContext>,
    );
    await screen.findByRole('link', { name: new RegExp(aktiviteter[0].tittel) });
    const manager = managerRef.current;
    if (!manager) throw new Error('Missing drag manager');
    const hover = async (target: string | null) => {
        await act(async () => {
            void manager.actions.setDropTarget(target);
        });
    };
    const start = async (aktivitet = kort) => {
        await act(async () => {
            manager.actions.start({ source: `aktivitetskort-${aktivitet.id}`, coordinates: { x: 0, y: 0 } });
        });
        await waitFor(() => expect(store.getState().view.dragAndDrop.dragging).toBe(true));
    };
    const stop = async (canceled = false) => {
        await act(async () => {
            manager.actions.stop({ canceled });
        });
        await waitFor(() => expect(store.getState().view.dragAndDrop.dragging).toBe(false));
    };
    const titles = (status: AktivitetStatus) =>
        within(screen.getByTestId(`aktivitetstavle.${status}`))
            .queryAllByRole('link')
            .map((link) => link.textContent);
    return { store, manager, start, hover, stop, titles };
}

beforeEach(() => {
    class Observer {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', Observer);
    vi.stubGlobal('ResizeObserver', Observer);
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => null });
    Object.defineProperty(Element.prototype, 'animate', {
        configurable: true,
        value: vi.fn(() => ({
            finished: Promise.resolve(),
            cancel: vi.fn(),
            finish: vi.fn(),
        })),
    });
    vi.spyOn(aktivitetAPI, 'oppdaterAktivitetStatus').mockImplementation(async (updated) => updated);
    vi.spyOn(logging, 'flyttetAktivitetMetrikk').mockImplementation(() => {});
});

afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(document, 'elementFromPoint');
    Reflect.deleteProperty(Element.prototype, 'animate');
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('Controlled sortable columns', () => {
    it('renders the drag feedback inside the routed page with the default plugins enabled', async () => {
        const { manager, start, hover, stop, titles } = await renderBoard();
        await start();
        await hover(`aktivitetskolonne-${destination.status}`);
        expect(titles(destination.status)[0]).toContain(kort.tittel);
        await stop();
        await waitFor(() => expect(manager.dragOperation.status.idle).toBe(true));
        expect(titles(destination.status)[0]).toContain(kort.tittel);
        await waitFor(() => expect(aktivitetAPI.oppdaterAktivitetStatus).toHaveBeenCalledTimes(1), { timeout: 2000 });
    });

    it.each([
        { empty: true, status: AktivitetStatus.GJENNOMFOERT },
        { empty: false, status: AktivitetStatus.GJENNOMFOERT },
        { empty: true, status: AktivitetStatus.BRUKER_ER_INTRESSERT },
        { empty: false, status: AktivitetStatus.BRUKER_ER_INTRESSERT },
    ])('previews and keeps a top slot in $status (empty=$empty) until HTTP resolves', async ({ empty, status }) => {
        let resolveRequest!: (updated: typeof kort) => void;
        vi.mocked(aktivitetAPI.oppdaterAktivitetStatus).mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveRequest = resolve;
                }),
        );
        const { store, manager, start, hover, stop, titles } = await renderBoard(
            empty ? [kort] : [kort, { ...destination, status }],
        );
        await start();
        await hover(`aktivitetskolonne-${status}`);
        expect(titles(kort.status)).toHaveLength(0);
        expect(titles(status)[0]).toContain(kort.tittel);
        expect(selectAktivitet(store.getState(), kort.id)?.status).toBe(kort.status);
        const source = manager.dragOperation.source;
        expect(isSortable(source) && source.sortable.group).toBe(status);
        expect(isSortable(source) && source.sortable.index).toBe(0);
        await hover(`aktivitetskolonne-${status}`);
        await stop();
        expect(titles(status)[0]).toContain(kort.tittel);
        expect(titles(kort.status)).toHaveLength(0);
        expect(aktivitetAPI.oppdaterAktivitetStatus).toHaveBeenCalledTimes(1);
        expect(selectAktivitet(store.getState(), kort.id)?.status).toBe(kort.status);
        await waitFor(
            () =>
                expect(aktivitetAPI.oppdaterAktivitetStatus).toHaveBeenCalledExactlyOnceWith({
                    ...kort,
                    status,
                }),
            { timeout: 2000 },
        );
        await act(async () => resolveRequest({ ...kort, status }));
        expect(selectAktivitet(store.getState(), kort.id)?.status).toBe(status);
        expect(manager.registry.draggables.get(`aktivitetskort-${kort.id}`)?.disabled).toBe(false);
        expect(logging.flyttetAktivitetMetrikk).toHaveBeenCalledTimes(1);
    });

    it('keeps the destination slot while the HTTP request is unresolved, then rolls back on rejection', async () => {
        let rejectRequest: (error: Error) => void = () => {
            throw new Error('Request has not started');
        };
        vi.mocked(aktivitetAPI.oppdaterAktivitetStatus).mockImplementation(
            () =>
                new Promise((_resolve, reject) => {
                    rejectRequest = reject;
                }),
        );
        const { store, manager, start, hover, stop, titles } = await renderBoard();
        await start();
        await hover(`aktivitetskolonne-${destination.status}`);
        await stop();
        await waitFor(() => expect(aktivitetAPI.oppdaterAktivitetStatus).toHaveBeenCalledTimes(1), { timeout: 2000 });
        expect(titles(destination.status)[0]).toContain(kort.tittel);
        expect(titles(kort.status)).toHaveLength(0);
        expect(selectAktivitet(store.getState(), kort.id)?.status).toBe(kort.status);
        expect(manager.registry.draggables.get(`aktivitetskort-${kort.id}`)?.disabled).toBe(true);
        await act(async () => {
            rejectRequest(new Error('HTTP failed'));
        });
        expect(titles(kort.status)[0]).toContain(kort.tittel);
        expect(titles(destination.status)).toHaveLength(1);
        expect(manager.registry.draggables.get(`aktivitetskort-${kort.id}`)?.disabled).toBe(false);
    });

    it('never renders the source column during the handoff from pending placement to Redux', async () => {
        let resolveRequest!: (updated: typeof kort) => void;
        vi.mocked(aktivitetAPI.oppdaterAktivitetStatus).mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveRequest = resolve;
                }),
        );
        const placements: AktivitetStatus[][] = [];
        const { start, hover, stop, manager } = await renderBoard(undefined, () => {
            placements.push(
                Object.values(AktivitetStatus).filter((status) =>
                    screen.queryByTestId(`aktivitetstavle.${status}`)?.textContent?.includes(kort.tittel),
                ),
            );
        });
        await start();
        await hover(`aktivitetskolonne-${destination.status}`);
        await stop();
        placements.length = 0;
        await act(async () => resolveRequest({ ...kort, status: destination.status }));
        expect(placements.length).toBeGreaterThan(0);
        for (const placement of placements) expect(placement).toEqual([destination.status]);
        expect(manager.registry.draggables.get(`aktivitetskort-${kort.id}`)?.disabled).toBe(false);
    });

    it('uses the latest Redux activity data during preview and after cancellation', async () => {
        const { store, start, hover, stop, titles } = await renderBoard();
        await start();
        await hover(`aktivitetskolonne-${destination.status}`);
        const updated = { ...kort, tittel: 'Updated source' };
        await act(async () => {
            store.dispatch(
                flyttAktivitet.fulfilled(updated, 'external-update', {
                    aktivitet: kort,
                    status: kort.status,
                }),
            );
        });
        expect(titles(destination.status)[0]).toContain(updated.tittel);
        expect(titles(kort.status)).toHaveLength(0);
        await stop(true);
        expect(titles(kort.status)[0]).toContain(updated.tittel);
        expect(titles(destination.status)).toHaveLength(1);
        expect(aktivitetAPI.oppdaterAktivitetStatus).not.toHaveBeenCalled();
    });

    it('accepts the source as target after a keyboard-driven column change', async () => {
        const { start, hover, stop, titles } = await renderBoard();
        await start();
        await hover(`aktivitetskolonne-${destination.status}`);
        await hover(`aktivitetskort-${kort.id}`);
        expect(
            screen.getByTestId(`aktivitetstavle.${destination.status}`).firstElementChild?.firstElementChild,
        ).toHaveClass('bg-ax-bg-accent-moderate-hover');
        await stop();
        expect(titles(destination.status)[0]).toContain(kort.tittel);
        expect(aktivitetAPI.oppdaterAktivitetStatus).toHaveBeenCalledTimes(1);
    });

    it('preserves newest-first placement for multiple pending moves when Redux data changes', async () => {
        const second = { ...kort, id: 'second-source' as AktivitetsId, tittel: 'Second source' };
        const third = {
            ...kort,
            id: 'third-source' as AktivitetsId,
            tittel: 'Third source',
            endretDato: '2000-01-01T00:00:00',
        };
        const requests = new Map<AktivitetsId, (updated: typeof kort) => void>();
        vi.mocked(aktivitetAPI.oppdaterAktivitetStatus).mockImplementation(
            (updated) => new Promise((resolve) => requests.set(updated.id, resolve)),
        );
        const { store, start, hover, stop, titles } = await renderBoard([kort, second, third, destination]);
        for (const aktivitet of [kort, second, third]) {
            await start(aktivitet);
            await hover(`aktivitetskolonne-${destination.status}`);
            await stop();
        }
        const expected = titles(destination.status);
        expect(expected[0]).toContain(third.tittel);
        expect(expected[1]).toContain(second.tittel);
        expect(expected[2]).toContain(kort.tittel);
        await act(async () => {
            const updated = { ...destination, tittel: 'Updated destination' };
            store.dispatch(
                flyttAktivitet.fulfilled(updated, 'external-update', {
                    aktivitet: destination,
                    status: destination.status,
                }),
            );
        });
        expect(titles(destination.status).slice(0, 3)).toEqual(expected.slice(0, 3));
        for (const aktivitet of [kort, second, third]) {
            await act(async () => {
                const resolve = requests.get(aktivitet.id);
                if (!resolve) throw new Error('Missing pending request');
                resolve({ ...aktivitet, status: destination.status });
            });
            if (aktivitet === kort) {
                expect(titles(destination.status).slice(0, 2)).toEqual(expected.slice(0, 2));
            }
        }
    });

    it.each(['resolve', 'reject'])(
        'preserves another active preview and restores its original placement when an earlier request %ss',
        async (outcome) => {
            let resolveRequest!: (updated: typeof kort) => void;
            let rejectRequest!: (error: Error) => void;
            vi.mocked(aktivitetAPI.oppdaterAktivitetStatus).mockImplementation(
                () =>
                    new Promise((resolve, reject) => {
                        resolveRequest = resolve;
                        rejectRequest = reject;
                    }),
            );
            const { start, hover, stop, titles, manager } = await renderBoard();
            await start();
            await hover(`aktivitetskolonne-${destination.status}`);
            await stop();
            await start(destination);
            await hover(`aktivitetskolonne-${AktivitetStatus.BRUKER_ER_INTRESSERT}`);
            await act(async () => {
                if (outcome === 'resolve') resolveRequest({ ...kort, status: destination.status });
                else rejectRequest(new Error('HTTP failed'));
            });
            expect(titles(AktivitetStatus.BRUKER_ER_INTRESSERT)[0]).toContain(destination.tittel);
            expect(manager.registry.draggables.get(`aktivitetskort-${kort.id}`)?.disabled).toBe(false);
            await stop(true);
            expect(titles(AktivitetStatus.BRUKER_ER_INTRESSERT)).toHaveLength(0);
            expect(titles(destination.status).some((title) => title?.includes(destination.tittel))).toBe(true);
            expect(
                titles(outcome === 'resolve' ? destination.status : kort.status).some((title) =>
                    title?.includes(kort.tittel),
                ),
            ).toBe(true);
            expect(aktivitetAPI.oppdaterAktivitetStatus).toHaveBeenCalledTimes(1);
        },
    );

    it('does not dispatch Redux actions or remount cards when repeatedly hovering the same column', async () => {
        const { store, manager, start, hover, stop } = await renderBoard();
        expect(manager.registry.droppables.get(`aktivitetskort-${destination.id}`)?.disabled).toBe(true);
        await start();
        await hover(`aktivitetskolonne-${destination.status}`);
        const link = screen.getByTestId(`aktivitetstavle.${destination.status}`).querySelector('a');
        const dispatch = vi.spyOn(store, 'dispatch');
        for (let i = 0; i < 3; i++) {
            await hover(null);
            await hover(`aktivitetskolonne-${destination.status}`);
        }
        expect(dispatch).not.toHaveBeenCalled();
        expect(screen.getByTestId(`aktivitetstavle.${destination.status}`).querySelector('a')).toBe(link);
        await stop(true);
    });

    it.each(['cancel', 'outside', 'original column'])('restores business sorting after %s', async (reason) => {
        const { start, hover, stop, titles } = await renderBoard();
        await start();
        await hover(`aktivitetskolonne-${destination.status}`);
        expect(titles(destination.status)[0]).toContain(kort.tittel);
        if (reason !== 'cancel') {
            await hover(reason === 'outside' ? null : `aktivitetskolonne-${kort.status}`);
        }
        await stop(reason === 'cancel');
        expect(titles(kort.status)[0]).toContain(kort.tittel);
        expect(titles(destination.status)).toHaveLength(1);
        expect(aktivitetAPI.oppdaterAktivitetStatus).not.toHaveBeenCalled();
        expect(logging.flyttetAktivitetMetrikk).not.toHaveBeenCalled();
    });

    it.each([AktivitetStatus.FULLFOERT, AktivitetStatus.AVBRUTT])(
        'does not commit membership before confirming %s',
        async (status) => {
            const { store, start, hover, stop, titles } = await renderBoard();
            await start();
            await hover(`aktivitetskolonne-${status}`);
            expect(titles(status)[0]).toContain(kort.tittel);
            expect(selectAktivitet(store.getState(), kort.id)?.status).toBe(kort.status);
            await stop();
            expect(titles(kort.status)[0]).toContain(kort.tittel);
            expect(titles(status)).toHaveLength(0);
            expect(screen.getByLabelText('Location')).toHaveTextContent(
                status === AktivitetStatus.FULLFOERT ? '/fullfor/' : '/avbryt/',
            );
            expect(aktivitetAPI.oppdaterAktivitetStatus).not.toHaveBeenCalled();
        },
    );

    it('assigns unique contiguous sortable indices to visible and expanded older cards', async () => {
        const recent = { ...destination, status: AktivitetStatus.FULLFOERT };
        const older = {
            ...recent,
            id: 'older-card' as AktivitetsId,
            tittel: 'Older card',
            endretDato: '2020-01-01T00:00:00',
            fraDato: '2020-01-01T00:00:00',
            tilDato: '2020-01-01T00:00:00',
        };
        const { manager } = await renderBoard([kort, recent, older]);
        fireEvent.click(await screen.findByText('Vis eldre fullførte aktiviteter'));
        await screen.findByRole('link', { name: /Older card/ });
        for (const [index, aktivitet] of [recent, older].entries()) {
            const source = manager.registry.draggables.get(`aktivitetskort-${aktivitet.id}`);
            if (!source || !isSortable(source)) throw new Error('Expected a registered sortable card');
            expect(source.sortable.group).toBe(AktivitetStatus.FULLFOERT);
            expect(source.sortable.index).toBe(index);
        }
    });
});
