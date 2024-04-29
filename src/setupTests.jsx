// Ikkje bra!
import.meta.env.VITE_API_URL_BASE = 'http://localhost:3000'; // Dette er det som ligger på window.location i jsdom

HTMLDialogElement.prototype.showModal = () => {};
window.IntersectionObserver = vi.fn();
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

vi.mock('./felles-komponenter/utils/logging', async () => {
    const actual = await vi.importActual('./felles-komponenter/utils/logging');
    return {
        ...actual,
        default: vi.fn(),
        loggTidBruktGaaInnPaaAktivitetsplanen: vi.fn(),
        logTimeToAktivitestavlePaint: vi.fn(),
        loggingAntallBrukere: vi.fn(),
    };
});
