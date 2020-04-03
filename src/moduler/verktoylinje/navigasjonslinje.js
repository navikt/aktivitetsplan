import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectDialoger } from '../dialog/dialog-selector';
import { dialogFilter } from '../filtrering/filter/filter-utils';
import { LenkepanelBase } from 'nav-frontend-lenkepanel/lib';
import { Panel } from 'nav-frontend-paneler';
import { selectErVeileder } from '../identitet/identitet-selector';
import DialogIkon from '../aktivitet/visning/underelement-for-aktivitet/dialog/DialogIkon';

const DITTNAV_PATH = '/dittnav/';
const DIALOG_PATH = '/arbeidsrettet-dialog';

class Navigasjonslinje extends Component {
    render() {
        const { erVeileder, antallUlesteDialoger } = this.props;
        if (erVeileder) {
            return null;
        } else {
            return (
                <Panel className="navigasjonslinje">
                    <LenkepanelBase className="tilDittNav" href={DITTNAV_PATH}>
                        <span className="tekst">Ditt NAV</span>
                    </LenkepanelBase>
                    <LenkepanelBase className="tilDialog" href={DIALOG_PATH}>
                        <DialogIkon antallUleste={antallUlesteDialoger} />
                        <span className="avstand" hidden={antallUlesteDialoger > 0} />
                        <span className="tekst">Dialog</span>
                    </LenkepanelBase>
                </Panel>
            );
        }
    }
}

Navigasjonslinje.propTypes = {
    erVeileder: PT.bool.isRequired,
    antallUlesteDialoger: PT.number.isRequired
};

const mapStateToProps = state => {
    const dialoger = selectDialoger(state)
        .filter(d => !d.lest)
        .filter(d => dialogFilter(d, state)).length;
    return {
        erVeileder: selectErVeileder(state),
        antallUlesteDialoger: dialoger
    };
};

export default connect(mapStateToProps)(Navigasjonslinje);
