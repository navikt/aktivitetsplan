import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
// import { fetch } from 'undici';
// globalThis.fetch = fetch;

configure({ adapter: new Adapter() });

// Ikkje bra!
import.meta.env.BASE_URL = 'http://localhost:3000'; // Dette er det som ligger på window.location i jsdom

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

// FAIL LOUDLY on unhandled promise rejections / errors
process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.log(`FAILED TO HANDLE PROMISE REJECTION`);
    throw reason;
});
