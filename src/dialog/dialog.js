import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import NyDialog from './ny-dialog';
import * as AppPT from '../proptypes';

function DialogVisning({ dialog }) {
    return (
        <div>
            <Element>{dialog.overskrift}</Element>
            <Normaltekst>{dialog.sisteTekst}</Normaltekst>
        </div>
    );
}

DialogVisning.propTypes = {
    dialog: AppPT.dialog
};

function Dialog({ dialoger }) {
    return (
        <div>
            <NyDialog />
            <div>
                {dialoger.map((d) => <DialogVisning dialog={d} />)}
            </div>
        </div>
    );
}


Dialog.propTypes = {
    dialoger: PT.arrayOf(AppPT.dialog)
};

const mapStateToProps = (state) => {
    const dialoger = state.data.dialog.data;
    return {
        dialoger
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
