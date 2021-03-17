import AlertStripe from 'nav-frontend-alertstriper';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { MOTE_TYPE } from '../../../../constant';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import Innholdslaster from '../../../../felles-komponenter/utils/Innholdslaster';
import * as AppPT from '../../../../proptypes';
import { selectDialogForAktivitetId, selectDialogStatus } from '../../../dialog/dialog-selector';
import { selectErVeileder, selectIdentitetStatus } from '../../../identitet/identitet-selector';

function VarslingBoks({ className, avhengigheter, visVarselOmManglendeDialog }) {
    return (
        <HiddenIfDiv hidden={!visVarselOmManglendeDialog}>
            <Innholdslaster avhengigheter={avhengigheter}>
                <HiddenIfDiv className={className} hidden={!visVarselOmManglendeDialog}>
                    <AlertStripe type="advarsel">
                        Brukeren får ikke automatisk beskjed om at aktiviteten er opprettet. <br />
                        Send en dialogmelding slik at bruker får informasjon om møtet.
                    </AlertStripe>
                </HiddenIfDiv>
            </Innholdslaster>
        </HiddenIfDiv>
    );
}

VarslingBoks.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    className: PT.string.isRequired,
};

const mapStateToProps = (state, props) => {
    const { aktivitet } = props;
    return {
        avhengigheter: [selectIdentitetStatus(state), selectDialogStatus(state)],
        visVarselOmManglendeDialog:
            aktivitet.type === MOTE_TYPE && selectErVeileder(state) && !selectDialogForAktivitetId(state, aktivitet.id),
    };
};

export default connect(mapStateToProps)(VarslingBoks);
