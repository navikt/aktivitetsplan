import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { AlertStripeStopp } from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import {
    selectDialogForAktivitetId,
    selectDialogStatus,
} from '../../../dialog/dialog-selector';
import * as AppPT from '../../../../proptypes';
import Innholdslaster from '../../../../felles-komponenter/utils/innholdslaster';
import { MOTE_TYPE } from '../../../../constant';
import {
    selectErVeileder,
    selectIdentitetStatus,
} from '../../../identitet/identitet-selector';
import {
    FORHANDSORIENTERING,
    harFeature,
} from '../../../../felles-komponenter/feature/feature';
import { selectFeatureData } from '../../../../felles-komponenter/feature/feature-selector';

function VarslingBoks({
    avhengigheter,
    visVarselOmManglendeDialog,
    harForhandsorienteringFeature,
    ...rest
}) {
    const varslingTekstId = harForhandsorienteringFeature
        ? 'mote.varsling.forhandsorientering'
        : 'mote.varsling.ingen-dialog';
    return (
        <HiddenIfDiv hidden={!visVarselOmManglendeDialog}>
            <Innholdslaster avhengigheter={avhengigheter}>
                <HiddenIfDiv {...rest} hidden={!visVarselOmManglendeDialog}>
                    <AlertStripeStopp className="varsling-boks" role="alert">
                        <FormattedMessage id={varslingTekstId} />
                    </AlertStripeStopp>
                </HiddenIfDiv>
            </Innholdslaster>
        </HiddenIfDiv>
    );
}

VarslingBoks.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    visVarselOmManglendeDialog: PT.bool.isRequired,
    harForhandsorienteringFeature: PT.bool.isRequired,
};

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet;
    const features = selectFeatureData(state);
    return {
        avhengigheter: [
            selectIdentitetStatus(state),
            selectDialogStatus(state),
        ],
        visVarselOmManglendeDialog:
            aktivitet.type === MOTE_TYPE &&
            selectErVeileder(state) &&
            !selectDialogForAktivitetId(state, aktivitet.id),
        harForhandsorienteringFeature: harFeature(
            FORHANDSORIENTERING,
            features
        ),
    };
};

export default connect(mapStateToProps)(VarslingBoks);
