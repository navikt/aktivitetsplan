import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Infotekst, Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../proptypes';
import './dialoger.less';
import { visibleIfHOC } from '../hocs/visible-if';
import Dato from '../felles-komponenter/dato';
import Lenkepanel from '../felles-komponenter/lenkepanel';

const VisibleDiv = visibleIfHOC((props) => <div {...props} />);

function DialogVisning({ dialog, erValgt }) {
    return (
        <Lenkepanel
            className={`dialoger__dialog ${erValgt && 'dialoger__dialog--valgt'} ${dialog.lest || 'dialoger__dialog--ulest'}`}
            href={`/dialog/${dialog.id}`}
        >
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

function Gruppe({ dialoger, valgtDialog, labelId }) {
    return (
        <VisibleDiv visible={dialoger.length}>
            <Undertittel className="dialoger__gruppe-tittel"><FormattedMessage id={labelId} /></Undertittel>
            {
                [...dialoger]
                    .sort((a, b) => b.sisteDato - a.sisteDato)
                    .map((d) => <DialogVisning dialog={d} erValgt={d === valgtDialog} />)
            }
        </VisibleDiv>
    );
}

Gruppe.propTypes = {
    dialoger: PT.arrayOf(AppPT.dialog).isRequired,
    valgtDialog: AppPT.dialog,
    labelId: PT.string.isRequired
};

Gruppe.defaultProps = {
    valgtDialog: undefined
};

function Dialoger({ dialoger, valgtDialog, className }) {
    return (
        <div className={className}>
            <Gruppe
                dialoger={dialoger.filter((d) => !d.lest)}
                valgtDialog={valgtDialog}
                labelId="dialoggruppe.nye-meldinger"
            />
            <Gruppe
                dialoger={dialoger.filter((d) => d.lest)}
                valgtDialog={valgtDialog}
                labelId="dialoggruppe.leste-meldinger"
            />
        </div>
    );
}


Dialoger.propTypes = {
    className: PT.string,
    dialoger: PT.arrayOf(AppPT.dialog).isRequired,
    valgtDialog: AppPT.dialog
};

Dialoger.defaultProps = {
    className: undefined,
    valgtDialog: undefined
};

const mapStateToProps = (state) => {
    const dialoger = state.data.dialog.data;
    return {
        dialoger
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Dialoger);
