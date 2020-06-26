import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectDialoger } from '../dialog/dialog-selector';
import { dialogFilter } from '../filtrering/filter/filter-utils';
import { LenkepanelBase } from 'nav-frontend-lenkepanel/lib';
import { selectErVeileder } from '../identitet/identitet-selector';
import DialogIkon from '../aktivitet/visning/underelement-for-aktivitet/dialog/DialogIkon';
import { hentDialog } from '../dialog/dialog-reducer';

const DITTNAV_PATH = '/dittnav/';
const DIALOG_PATH = '/arbeidsrettet-dialog';

class Navigasjonslinje extends Component {
    componentDidMount() {
        const { erVeileder, doHentDialog } = this.props;
        if (!erVeileder) {
            setInterval(doHentDialog, 10000);
        }
    }

    render() {
        const { erVeileder, antallUlesteDialoger } = this.props;
        if (erVeileder) {
            return null;
        } else {
            return (
                <div className="navigasjonslinje">
                    <LenkepanelBase className="tilDittNav" href={DITTNAV_PATH}>
                        <span className="tilDittNavTekst">Ditt NAV</span>
                    </LenkepanelBase>
                    <LenkepanelBase className="tilDialog" href={DIALOG_PATH}>
                        <DialogIkon antallUleste={antallUlesteDialoger} />
                        <span className="avstand" hidden={antallUlesteDialoger > 0} />
                        <span className="tilDialogTekst">Dialog</span>
                    </LenkepanelBase>
                </div>
            );
        }
    }
}

Navigasjonslinje.propTypes = {
    erVeileder: PT.bool.isRequired,
    antallUlesteDialoger: PT.number.isRequired,
};

const mapStateToProps = (state) => {
    const dialoger = selectDialoger(state)
        .filter((d) => !d.lest)
        .filter((d) => dialogFilter(d, state)).length;
    return {
        erVeileder: selectErVeileder(state),
        antallUlesteDialoger: dialoger,
    };
};

const mapDispatchToProps = (dispatch) => ({
    doHentDialog: () => dispatch(hentDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigasjonslinje);
