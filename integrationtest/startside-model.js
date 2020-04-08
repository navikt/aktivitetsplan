import { Selector } from 'testcafe';

export default class Startside {
    constructor() {
        this.side = Selector('.aktivitetsplanfs');
        this.btnMittMal = Selector('.maal__inner .mal-endre-knapp');
        this.btnPrint = Selector('.utskrift-lenke');
        this.aktivitetsTavle = Selector('.aktivitetstavle');
        this.kolForslag = Selector('[data-testid="aktivitetstavle.BRUKER_ER_INTERESSERT"]');
        this.kolPlanlegger = Selector('[data-testid="aktivitetstavle.PLANLAGT"]');
        this.kolGjennomforer = Selector('[data-testid="aktivitetstavle.GJENNOMFORES"]');
    }
}
