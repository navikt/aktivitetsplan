import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import visibleIfHOC from '../../../hocs/visible-if';
import TallAlert from '../../../felles-komponenter/tall-alert';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';
import { selectDialogForAktivitetId } from '../../dialog/dialog-selector';
import * as AppPT from '../../../proptypes';
import AvtaltMarkering from '../avtalt-markering/avtalt-markering';
import SokeStatusEtikett from '../etikett/sokeStatusEtikett';

function AktivitetskortTillegg({
    antallHendvendelser,
    antallUlesteHenvendelser,
    aktivitet,
    erAvtalt,
    harEtikett,
    harDialog
}) {
    return (
        <HiddenIfDiv hidden={!(erAvtalt || harEtikett || harDialog)} className="aktivitetskort__ikon-blokk">
            <HiddenIfDiv hidden={antallHendvendelser <= 0} className="aktivitetskort__henvendelser">
                <TallAlert hidden={antallUlesteHenvendelser <= 0}>{antallUlesteHenvendelser}</TallAlert>
                <HiddenIfDiv hidden={antallUlesteHenvendelser > 0} className="sr-only">
                    <FormattedMessage id="aktivitetskort-dialog-tidligere-meldinger" />
                </HiddenIfDiv>
            </HiddenIfDiv>

            <div className="aktivitetskort__etiketter">
                <AvtaltMarkering visible={aktivitet.avtalt} />
                <SokeStatusEtikett
                    hidden={!aktivitet.etikett}
                    etikett={aktivitet.etikett}
                    className="aktivitetskort__etikett"
                />
            </div>
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
