import 'moment-timezone';
import 'moment/locale/nb';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import moment from 'moment';

moment.locale('nb');
moment.tz.setDefault('Europe/Oslo');
moment.updateLocale('nb', {
    monthsShort: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
});

configure({ adapter: new Adapter() });

window.IntersectionObserver = jest.fn();
// Mocked because react-dnd uses es6 import and have to be transpiled to work in these tests
jest.mock('react-dnd', () => ({
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
jest.mock('react-dnd-html5-backend', () => ({}));
jest.mock('react-intl', () => ({
    FormattedMessage: ({ id }) => id,
}));
