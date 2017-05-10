import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import AktivitetEtikett from '../../felles-komponenter/aktivitet-etikett';
import * as AppPT from '../../proptypes';
import { AVTALT_MED_NAV } from '../../constant';
import visibleIfHOC from '../../hocs/visible-if';
import TallAlert from '../../felles-komponenter/tall-alert';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';

function AktivitetskortTillegg({ aktivitet, antallUlesteHenvendelser }) {
    return (
        <div className="aktivitetskort__ikon-blokk">
            <div className="aktivitetskort__etiketter">
                <AktivitetEtikett
                    visible={!!aktivitet.etikett}
                    etikett={aktivitet.etikett}
                    id={`etikett.${aktivitet.etikett}`}
                />
                <AktivitetEtikett
                    visible={aktivitet.avtalt}
                    etikett={AVTALT_MED_NAV}
                    id={AVTALT_MED_NAV}
                />
            </div>
            <VisibleIfDiv visible={antallUlesteHenvendelser > 0} className="aktivitetskort__henvendelser">
                <TallAlert>{antallUlesteHenvendelser}</TallAlert>
            </VisibleIfDiv>
        </div>
    );
}

AktivitetskortTillegg.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    antallUlesteHenvendelser: PT.number.isRequired
};

const mapStateToProps = (state, props) => {
    const dialoger = state.data.dialog.data;
    const dialog = dialoger.find((d) => d.aktivitetId === props.aktivitet.id);
    const antallUlesteHenvendelser = dialog ? dialog.henvendelser.filter((h) => !h.lest).length : 0;
    return ({
        antallUlesteHenvendelser
    });
};

export default visibleIfHOC(connect(mapStateToProps, null)(AktivitetskortTillegg));
