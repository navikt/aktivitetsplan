import React, { Component } from 'react';
import PT from 'prop-types';
import Icon from 'nav-frontend-ikoner-assets';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';
import { Radio } from 'nav-frontend-skjema';
import { HjelpetekstOver } from 'nav-frontend-hjelpetekst';
import { Knapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import {
    STATUS_AVBRUTT,
    STATUS_FULLFOERT,
    UTDANNING_AKTIVITET_TYPE,
} from '../../../../constant';
import { oppdaterAktivitet } from '../../aktivitet-actions';
import * as AppPT from '../../../../proptypes';
import { TILLAT_SET_AVTALT } from '~config'; // eslint-disable-line
import { STATUS } from '../../../../ducks/utils';
import { selectAktivitetStatus } from '../../aktivitet-selector';
import { erMerEnnSyvDagerTil } from '../../../../utils';
import {
    FORHANDSORIENTERING,
    harFeature,
} from '../../../../felles-komponenter/feature/feature';
import { selectFeatureData } from '../../../../felles-komponenter/feature/feature-selector';

class AvtaltContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visBekreftAvtalt: false,
        };
    }

    render() {
        const {
            aktivitet,
            aktivitetStatus,
            doSetAktivitetTilAvtalt,
            className,
            features,
        } = this.props;

        const { type, status, historisk, avtalt } = aktivitet;

        const lasterData = aktivitetStatus !== STATUS.OK;
        const oppdaterer = aktivitetStatus === STATUS.RELOADING;
        const arenaAktivitet = UTDANNING_AKTIVITET_TYPE === type;

        if (
            !TILLAT_SET_AVTALT ||
            historisk ||
            status === STATUS_FULLFOERT ||
            status === STATUS_AVBRUTT ||
            arenaAktivitet
        ) {
            return null;
        }

        if (
            harFeature(FORHANDSORIENTERING, features) &&
            !avtalt &&
            !erMerEnnSyvDagerTil(aktivitet.fraDato)
        ) {
            return (
                <div>
                    <div className={`${className} avtalt-container`}>
                        <AlertStripeInfo>
                            <FormattedMessage
                                id={'sett-til-avtalt-mindre-enn-syv-dager'}
                            />
                        </AlertStripeInfo>
                    </div>
                    <hr className="aktivitetvisning__delelinje" />
                </div>
            );
        }

        // Kun vis bekreftet hvis nettopp satt til avtalt.
        if (this.state.visBekreftAvtalt === false && avtalt) {
            return null;
        }

        const setAvtaltInnhold = (
            <div className={`${className} avtalt-container`}>
                <Undertittel>
                    <FormattedMessage id="sett-avtalt.header" />
                </Undertittel>
                <div className="avtalt-container__radio">
                    <Radio
                        onClick={() =>
                            this.setState({ visBekreftAvtalt: true })}
                        label={<FormattedMessage id="sett-avtalt.label" />}
                        name="avtalt"
                        disabled={lasterData}
                    />
                    <HjelpetekstOver>
                        <FormattedMessage id="sett-avtalt.hjelpetekst" />
                    </HjelpetekstOver>
                </div>
                {this.state.visBekreftAvtalt &&
                    <Knapp
                        spinner={oppdaterer}
                        onClick={() => doSetAktivitetTilAvtalt(aktivitet)}
                        disabled={lasterData}
                    >
                        <FormattedMessage id="sett-til-avtalt.bekreft-knapp" />
                    </Knapp>}
            </div>
        );

        const cls = classes =>
            classNames('avtalt-container__vis-avtalt', classes);
        const visAvtalt = (
            <div className={cls(className)}>
                <Icon kind="ok-sirkel-fylt" height="21px" />
                <Undertittel>
                    <FormattedMessage id="satt-til-avtalt.tekst" />
                </Undertittel>
            </div>
        );

        return (
            <div>
                {aktivitet.avtalt ? visAvtalt : setAvtaltInnhold}
                <hr className="aktivitetvisning__delelinje" />
            </div>
        );
    }
}
AvtaltContainer.propTypes = {
    doSetAktivitetTilAvtalt: PT.func.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
    aktivitetStatus: AppPT.status,
    className: PT.string,
    features: PT.object.isRequired,
};

AvtaltContainer.defaultProps = {
    aktivitetStatus: undefined,
    className: undefined,
};

const mapStateToProps = state => ({
    aktivitetStatus: selectAktivitetStatus(state),
    features: selectFeatureData(state),
});

const mapDispatchToProps = dispatch => ({
    doSetAktivitetTilAvtalt: aktivitet => {
        oppdaterAktivitet({ ...aktivitet, avtalt: true })(dispatch);
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AvtaltContainer);
