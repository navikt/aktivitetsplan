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
import { TILTAK_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE } from '../../constant';
import { oppdaterAktivitet } from '../../ducks/aktiviteter';
import * as AppPT from '../../proptypes';
import './avtalt-container.less';
import {TILLAT_SET_AVTALT} from '~config' // eslint-disable-line
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../constant';
import { STATUS } from '../../ducks/utils';

class AvtaltContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visBekreftAvtalt: false
        };
    }

    render() {
        const { aktivitet, aktivitetData, doSetAktivitetTilAvtalt, className } = this.props;
        const lasterData = aktivitetData.status !== STATUS.OK;
        const arenaAktivitet = UTDANNING_AKTIVITET_TYPE === aktivitet.type;
        if (!TILLAT_SET_AVTALT ||
            aktivitet.status === STATUS_FULLFOERT ||
            aktivitet.status === STATUS_AVBRUTT ||
            arenaAktivitet) return null;

        // Kun vis bekreftet hvis nettopp satt til avtalt.
        if (this.state.visBekreftAvtalt === false && aktivitet.avtalt) return null;

        const setAvtaltInnhold = (
            <div className={`${className} avtalt-container`}>
                <Undertittel>
                    <FormattedMessage id="sett-avtalt.header" />
                </Undertittel>
                <div className="avtalt-container__radio">
                    <Radio
                        onClick={() => this.setState({ visBekreftAvtalt: true })}
                        label={<FormattedMessage id="sett-avtalt.label" />} name="avtalt"
                        disabled={lasterData}
                    />
                    <HjelpetekstOver>
                        <FormattedMessage id="sett-avtalt.hjelpetekst" />
                    </HjelpetekstOver>
                </div>
                {this.state.visBekreftAvtalt &&
                <Knapp
                    spinner={aktivitetData.oppdaterer}
                    onClick={() => doSetAktivitetTilAvtalt(aktivitet)}
                    disabled={lasterData}
                >Bekreft</Knapp> }
            </div>);

        const cls = (classes) => classNames('avtalt-container__vis-avtalt', classes);
        const visAvtalt = (
            <div className={cls(className)}>
                <Icon kind="ok-sirkel-fylt" height="21px" />
                <Undertittel>
                    <FormattedMessage id="satt-til-avtalt.tekst" />
                </Undertittel>
            </div>);

        return (<div>{aktivitet.avtalt ? visAvtalt : setAvtaltInnhold}
            <hr className="aktivitetvisning__delelinje" />
        </div>);
    }
}
AvtaltContainer.propTypes = {
    doSetAktivitetTilAvtalt: PT.func.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
    aktivitetData: PT.shape({
        oppdaterer: PT.bool
    }),
    className: PT.string
};

AvtaltContainer.defaultProps = {
    aktivitetData: undefined,
    className: undefined
};

const mapStateToProps = (state) => ({
    aktivitetData: state.data.aktiviteter
});

const mapDispatchToProps = (dispatch) => ({
    doSetAktivitetTilAvtalt: (aktivitet) => {
        oppdaterAktivitet({ ...aktivitet, avtalt: true })(dispatch);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AvtaltContainer);
