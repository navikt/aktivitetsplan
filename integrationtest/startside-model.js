import { Selector } from 'testcafe';

export default class Startside {
    constructor() {
        this.side = Selector('.aktivitetsplanfs');
        this.btnDialog = Selector('[href$="/dialog"]');
        this.btnMittMal = Selector('.maal .lenke-knapp');
        this.btnPrint = Selector('.verktoylinje__print-knapp');
        this.aktivitetsTavle = Selector('.aktivitetstavle');
        this.kolForslag = Selector('[data-testid="aktivitetstavle.BRUKER_ER_INTERESSERT"]');
        this.kolPlanlegger = Selector('[data-testid="aktivitetstavle.PLANLAGT"]');
        this.kolGjennomforer = Selector('[data-testid="aktivitetstavle.GJENNOMFORES"]');
    }
}
