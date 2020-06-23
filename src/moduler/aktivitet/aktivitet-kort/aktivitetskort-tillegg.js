import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import visibleIfHOC from '../../../hocs/visible-if';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';
import { selectDialogForAktivitetId } from '../../dialog/dialog-selector';
import * as AppPT from '../../../proptypes';
import AvtaltMarkering from '../avtalt-markering/avtalt-markering';
import SokeStatusEtikett from '../etikett/sokeStatusEtikett';
import DialogIkon from "../visning/underelement-for-aktivitet/dialog/DialogIkon";

function AktivitetskortTillegg({
    antallHendvendelser,
    antallUlesteHenvendelser,
    aktivitet,
    erAvtalt,
    harEtikett,
    harDialog
}) {
    return (
        <HiddenIfDiv hidden={!(erAvtalt || harEtikett || harDialog)}
                     className="aktivitetskort__tillegg">
            <div>
                <AvtaltMarkering visible={aktivitet.avtalt} />
                <SokeStatusEtikett
                    hidden={!aktivitet.etikett}
                    etikett={aktivitet.etikett}
                    className="aktivitetskort__etikett"
                />
            </div>

            <HiddenIfDiv hidden={!harDialog} className="aktivitetskort__ikon-blokk">
                <HiddenIfDiv hidden={antallHendvendelser <= 0} className="aktivitetskort--dialogikon">
                    <DialogIkon antallUleste={antallUlesteHenvendelser} />
                </HiddenIfDiv>
            </HiddenIfDiv>
        </HiddenIfDiv>
    );
}

AktivitetskortTillegg.defaultProps = {
    etikett: undefined
};

AktivitetskortTillegg.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    antallHendvendelser: PT.number.isRequired,
    antallUlesteHenvendelser: PT.number.isRequired,
    erAvtalt: PT.bool.isRequired,
    harDialog: PT.bool.isRequired,
    harEtikett: PT.bool.isRequired,
    etikett: PT.string
};

const mapStateToProps = (state, props) => {
    const { aktivitet } = props;
    const aktivitetId = aktivitet.id;
    const dialog = selectDialogForAktivitetId(state, aktivitetId);
    const henvendelser = dialog ? dialog.henvendelser : [];
    const antallHendvendelser = henvendelser.length;
    const antallUlesteHenvendelser = henvendelser.filter(h => !h.lest).length;
    const { etikett } = aktivitet;
    return {
        antallHendvendelser,
        antallUlesteHenvendelser,
        erAvtalt: aktivitet.avtalt,
        harDialog: antallHendvendelser > 0,
        harEtikett: !!etikett,
        aktivitet
    };
};

export default visibleIfHOC(
    connect(
        mapStateToProps,
        null
    )(AktivitetskortTillegg)
);
