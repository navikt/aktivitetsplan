import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/nb';

moment.locale('nb');
moment.tz.setDefault('Europe/Oslo');
moment.updateLocale('nb', {
    monthsShort: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
});

configure({ adapter: new Adapter() });
