import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Infotekst, Element, Normaltekst } from 'nav-frontend-typografi';
import * as AppPT from '../proptypes';
import './dialoger.less';
import { visibleIfHOC } from '../hocs/visible-if';
import Dato from '../felles-komponenter/dato';
import Lenkepanel from '../felles-komponenter/lenkepanel';
import Innholdslaster from '../felles-komponenter/utils/innholdslaster';

const Prikk = visibleIfHOC((props) => <div className="dialoger__prikk" {...props} />);

function DialogVisning({ dialog, erValgt }) {
    return (
        <Lenkepanel
            className={`dialoger__dialog ${erValgt && 'dialoger__dialog--valgt'} ${dialog.lest || 'dialoger__dialog--ulest'}`}
            href={`/dialog/${dialog.id}`}
        >
            <Prikk visible={!dialog.lest} />
            <Infotekst><Dato>{dialog.sisteDato}</Dato></Infotekst>
            <Element>{dialog.overskrift}</Element>
            <Normaltekst>{dialog.sisteTekst}</Normaltekst>
            <div className="dialoger__dialog-henvendelser">{dialog.henvendelser.length}</div>
        </Lenkepanel>
    );
}

DialogVisning.propTypes = {
    dialog: AppPT.dialog.isRequired,
    erValgt: PT.bool.isRequired
};

function compareDialoger(a, b) {
    if (a.lest !== b.lest) {
        return a.lest ? 1 : -1;
    }
    return b.sisteDato - a.sisteDato;
}

function Dialoger({ dialog, dialoger, valgtDialog, className }) {
    return (
        <Innholdslaster avhengigheter={[dialog]}>
            <div className={className}>
                {
                    [...dialoger]
                        .sort(compareDialoger)
                        .map((d) => <DialogVisning dialog={d} erValgt={d === valgtDialog} />)
                }
            </div>
        </Innholdslaster>
    );
}

Dialoger.propTypes = {
    className: PT.string,
    dialoger: PT.arrayOf(AppPT.dialog).isRequired,
    dialog: AppPT.reducer.isRequired,
    valgtDialog: AppPT.dialog
};

Dialoger.defaultProps = {
    className: undefined,
    valgtDialog: undefined
};

const mapStateToProps = (state) => {
    const dialog = state.data.dialog;
    const dialoger = dialog.data;
    return {
        dialog,
        dialoger
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Dialoger);
