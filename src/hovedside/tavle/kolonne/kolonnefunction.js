import React from 'react';
import PT from 'prop-types';
import KolonneHeader from './kolonneheader';
import DropTargetKolonne from './drop-target-kolonne';

function KolonneFunction({ status, children }) {
    return (
        <div className="aktivitetstavle__kolonne-wrapper">
            <DropTargetKolonne status={status}>
                <KolonneHeader status={status} />
                {children}
            </DropTargetKolonne>
        </div>
    );
}

KolonneFunction.propTypes = {
    status: PT.string.isRequired,
    children: PT.node,
};

KolonneFunction.defaultProps = {
    children: null,
};
export default KolonneFunction;
