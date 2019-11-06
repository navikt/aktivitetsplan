import React from 'react';
import PT from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as AppPT from '../../../proptypes';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import { selectDialoger, selectDialogStatus } from '../dialog-selector';
import DialogVisning from './dialog-visning';
import { selectAlleAktiviter } from '../../aktivitet/aktivitetliste-selector';
import { selectErBruker } from '../../identitet/identitet-selector';
import { dialogSammenlingnerMedTilhorendeDialogIdOgErBruker } from '../dialog-utils';
import { selectGjeldendeEskaleringsVarsel } from '../../oppfolging-status/oppfolging-selector';

class Dialoger extends React.Component {
    render() {
        const {
            gjeldendeEskaleringsvarsel,
            dialoger,
            valgtDialog,
            className,
            aktiviteter,
            history,
            erBruker
        } = this.props;

        const dialogSammenligner = dialogSammenlingnerMedTilhorendeDialogIdOgErBruker(
            gjeldendeEskaleringsvarsel && gjeldendeEskaleringsvarsel.tilhorendeDialogId,
            erBruker
        );
        this.dialogIderSortert = [...dialoger].sort(dialogSammenligner).map(dialog => dialog.id);

        const dialogerSortert = [...dialoger].sort(
            (a, b) => this.dialogIderSortert.indexOf(a.id) - this.dialogIderSortert.indexOf(b.id)
        );

        const erTabBar = dialog =>
            dialog === valgtDialog || (valgtDialog === null && dialog.id === dialogerSortert[0].id);
        const valgtDialogIndex = valgtDialog !== null ? dialogerSortert.indexOf(valgtDialog) : 0;
        const dialogRefs = {};

        const byttTilNyDialog = id => {
            // eslint-disable-next-line react/no-find-dom-node
            findDOMNode(dialogRefs[id]).focus();
        };

        const fokusForrigeDialog = () => {
            const nydialogId = dialogerSortert[valgtDialogIndex - 1].id;
            byttTilNyDialog(nydialogId);
        };

        const fokusNesteDialog = () => {
            const nydialogId = dialogerSortert[valgtDialogIndex + 1].id;
            byttTilNyDialog(nydialogId);
        };

        const dialogPiling = e => {
            switch (e.which) {
                case 38: // pil opp
                    if (valgtDialogIndex > 0) {
                        fokusForrigeDialog();
                    }
                    break;
                case 40: // pil ned
                    if (valgtDialogIndex < dialoger.length - 1) {
                        fokusNesteDialog();
                    }
                    break;
                default:
                    break;
            }
        };

        return (
            <div className={className} onKeyDown={dialogPiling}>
                {dialogerSortert.map(d => (
                    <section className="dialoger__dialog--section" key={d.id}>
                        <DialogVisning
                            ref={ref => (dialogRefs[d.id] = ref)}
                            dialog={d}
                            erBruker={erBruker}
                            erTabBar={erTabBar(d)}
                            erValgt={d === valgtDialog}
                            aktiviteter={aktiviteter}
                            history={history}
                        />
                    </section>
                ))}
            </div>
        );
    }
}

Dialoger.defaultProps = {
    gjeldendeEskaleringsvarsel: undefined,
    erBruker: undefined,
    avhengigheter: undefined
};

Dialoger.propTypes = {
    className: PT.string,
    dialoger: PT.arrayOf(AppPT.dialog).isRequired,
    aktiviteter: PT.arrayOf(AppPT.aktivitet).isRequired,
    valgtDialog: AppPT.dialog,
    erBruker: PT.bool,
    gjeldendeEskaleringsvarsel: AppPT.eskaleringsvarsel,
    avhengigheter: AppPT.avhengigheter,
    history: AppPT.history.isRequired
};

Dialoger.defaultProps = {
    className: undefined,
    valgtDialog: undefined
};

function DialogerMedInnholdslaster({ avhengighet, ...props }) {
    return (
        <Innholdslaster avhengigheter={avhengighet}>
            <Dialoger {...props} />
        </Innholdslaster>
    );
}

DialogerMedInnholdslaster.propTypes = {
    avhengighet: AppPT.avhengighet.isRequired
};

const mapStateToProps = state => ({
    avhengighet: selectDialogStatus(state),
    dialoger: selectDialoger(state),
    aktiviteter: selectAlleAktiviter(state),
    erBruker: selectErBruker(state),
    gjeldendeEskaleringsvarsel: selectGjeldendeEskaleringsVarsel(state)
});
export default withRouter(connect(mapStateToProps)(DialogerMedInnholdslaster));

export const DialogerPure = Dialoger;
