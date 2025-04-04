import '@testing-library/jest-dom/vitest';
// Ikkje bra!
import.meta.env.VITE_API_URL_BASE = 'http://localhost:3000'; // Dette er det som ligger på window.location i jsdom

HTMLDialogElement.prototype.showModal = () => {};
window.IntersectionObserver = vi.fn();
window.matchMedia = ()  => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });
// Mocked because react-dnd uses es6 import and have to be transpiled to work in these tests
vi.mock('react-dnd', () => ({
    useDrag: () => {
        let ref = null;
        return [{}, ref];
    },
    useDrop: () => {
        let ref = null;
        return [{}, ref];
    },
    DndProvider: ({ children }) => <>{children}</>,
}));
vi.mock('react-dnd-html5-backend', () => ({}));
vi.mock('./felles-komponenter/utils/logging', () => ({
    default: vi.fn(),
}));
// FAIL LOUDLY on unhandled promise rejections / errors
process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.log(`FAILED TO HANDLE PROMISE REJECTION`);
    throw reason;
});

vi.mock('./felles-komponenter/utils/logging', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        default: vi.fn(),
        loggTidBruktGaaInnPaaAktivitetsplanen: vi.fn(),
        logTimeToAktivitestavlePaint: vi.fn(),
        loggingAntallBrukere: vi.fn(),
    };
});

/* Mock fetchHarFlereAktorId,
   its run on-mount and has no side-effects visible for this app
   so it cant be tested
*/
vi.mock('./api/oppfolgingAPI', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        fetchHarFlereAktorId: vi.fn(),
    };
});
