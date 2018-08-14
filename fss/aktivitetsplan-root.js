import ReactModal from 'react-modal';
import '../src/index.less';
import App from '../src/app';
import NAVSPA from './NAVSPA';

ReactModal.setAppElement('#modal-a11y-wrapper');
NAVSPA.eksporter('aktivitetsplan', App);
