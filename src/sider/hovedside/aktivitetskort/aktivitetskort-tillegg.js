import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import AktivitetEtikett from '../../../felles-komponenter/aktivitet-etikett';
import { AVTALT_MED_NAV } from '../../../constant';
import visibleIfHOC from '../../../hocs/visible-if';
import TallAlert from '../../../felles-komponenter/tall-alert';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';
import { selectDialogForAktivitetId } from '../../../moduler/dialog/dialog-selector';

function AktivitetskortTillegg({
    antallHendvendelser,
    antallUlesteHenvendelser,
    etikett,
    erAvtalt,
    harEtikett,
    harDialog,
}) {
    return (
        <HiddenIfDiv
            hidden={!(erAvtalt || harEtikett || harDialog)}
            className="aktivitetskort__ikon-blokk"
        >
            <div className="aktivitetskort__etiketter">
                <AktivitetEtikett
                    visible={erAvtalt}
                    etikett={AVTALT_MED_NAV}
                    id={AVTALT_MED_NAV}
                />
                <AktivitetEtikett
                    visible={harEtikett}
                    etikett={etikett}
                    id={`etikett.${etikett}`}
                />
            </div>
            <HiddenIfDiv
                hidden={antallHendvendelser <= 0}
                className="aktivitetskort__henvendelser"
            >
                <TallAlert hidden={antallUlesteHenvendelser <= 0}>
                    {antallUlesteHenvendelser}
                </TallAlert>
            </HiddenIfDiv>
        </HiddenIfDiv>
    );
}

AktivitetskortTillegg.defaultProps = {
    etikett: undefined,
};

AktivitetskortTillegg.propTypes = {
    antallHendvendelser: PT.number.isRequired,
    antallUlesteHenvendelser: PT.number.isRequired,
    erAvtalt: PT.bool.isRequired,
    harDialog: PT.bool.isRequired,
    harEtikett: PT.bool.isRequired,
    etikett: PT.string,
};

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet;
    const aktivitetId = aktivitet.id;
    const dialog = selectDialogForAktivitetId(state, aktivitetId);
    const henvendelser = dialog ? dialog.henvendelser : [];
    const antallHendvendelser = henvendelser.length;
    const antallUlesteHenvendelser = henvendelser.filter(h => !h.lest).length;
    const etikett = aktivitet.etikett;
    return {
        antallHendvendelser,
        antallUlesteHenvendelser,
        erAvtalt: aktivitet.avtalt,
        harDialog: antallHendvendelser > 0,
        harEtikett: !!etikett,
        etikett,
    };
};

export default visibleIfHOC(
    connect(mapStateToProps, null)(AktivitetskortTillegg)
);
