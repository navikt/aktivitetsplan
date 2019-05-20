import { Selector } from 'testcafe';

export default class Dialog {

    constructor () {
        this.side = Selector('.dialog-modal__content');
        this.dialogTrad = Selector('.dialoger__dialog');
        this.dialogDetaljvisning = Selector('#dialog-modal__hoyre-kolonne');
    }

}
