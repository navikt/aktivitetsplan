import '@testing-library/jest-dom/vitest';

const ensureMemoryStorage = (storageName) => {
    const current = window[storageName];
    if (current && typeof current.getItem === 'function') {
        return;
    }
    let store = {};
    window[storageName] = {
        get length() {
            return Object.keys(store).length;
        },
        clear() {
            store = {};
        },
        getItem(key) {
            return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
        },
        key(index) {
            const keys = Object.keys(store);
            return keys[index] ?? null;
        },
        removeItem(key) {
            delete store[key];
        },
        setItem(key, value) {
            store[key] = String(value);
        },
    };
};

ensureMemoryStorage('localStorage');
ensureMemoryStorage('sessionStorage');

afterEach(() => {
    vi.clearAllTimers();
});

import.meta.env.VITE_API_URL_BASE = 'http://localhost:3000'; // Dette er det som ligger på window.location i jsdom

HTMLDialogElement.prototype.showModal = () => {};
window.IntersectionObserver = vi.fn();
window.matchMedia = () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });

// jsdom has no Web Animations API; dnd-kit queries animations when measuring cards.
Object.defineProperty(Document.prototype, 'getAnimations', { configurable: true, value: () => [] });
Object.defineProperty(Element.prototype, 'getAnimations', { configurable: true, value: () => [] });

// FAIL LOUDLY on unhandled promise rejections / errors
process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.log(`FAILED TO HANDLE PROMISE REJECTION`);
    // eslint-disable-next-line no-console
    console.error(reason);
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

vi.mock('react-pdf', () => {
    return {
        pdfjs: {
            GlobalWorkerOptions: {
                workerSrc: '',
            },
        },
        Document: () => null,
        Page: () => null,
    };
});

// Add this to your jest setup file
global.DOMMatrix = class DOMMatrix {
    constructor(init) {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.e = 0;
        this.f = 0;
        this.is2D = true;
        if (init) {
            /* Handle matrix initialization if needed */
        }
    }

    multiply(_other) {
        return this;
    }
    translate(_x, _y) {
        return this;
    }
    scale(_scaleX, _scaleY) {
        return this;
    }
    rotate(_angle) {
        return this;
    }
    inverse() {
        return this;
    }
};
