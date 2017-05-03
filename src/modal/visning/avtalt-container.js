import React, { Component, PropTypes as PT } from 'react';
import Icon from 'nav-frontend-ikoner-assets';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';
import { Radio } from 'nav-frontend-skjema';
import { HjelpetekstOver } from 'nav-frontend-hjelpetekst';
import { Knapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import { oppdaterAktivitet } from '../../ducks/aktiviteter';
import * as AppPT from '../../proptypes';
import './avtalt-container.less';
import {TILLAT_SET_AVTALT} from '~config' // eslint-disable-line

class AvtaltContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visBekreftAvtalt: false
        };
    }

    render() {
        const { aktivitet, aktivitetData, doSetAktivitetTilAvtalt, className } = this.props;

        if (!TILLAT_SET_AVTALT) return null;

        const setAvtaltInnhold = (
            <div className={className}>
                <Undertittel>
                    <FormattedMessage id="sett-avtalt.header" />
                </Undertittel>
                <div className="avtalt_radio">
                    <Radio
                        onClick={() => this.setState({ visBekreftAvtalt: true })}
                        label={<FormattedMessage id="sett-avtalt.label" />} name="avtalt"
                    />
                    <HjelpetekstOver>
                        <FormattedMessage id="sett-avtalt.hjelpetekst" />
                    </HjelpetekstOver>
                </div>
                {this.state.visBekreftAvtalt &&
                <Knapp
                    spinner={aktivitetData.oppdaterer}
                    onClick={() => doSetAktivitetTilAvtalt(aktivitet)}
                >Bekreft</Knapp> }
            </div>);

        const cls = (classes) => classNames('vis_avtalt', classes);
        const visAvtalt = (
            <div className={cls(className)}>
                <Icon kind="ok-sirkel-fylt" height="21px" />
                <Undertittel>
                    <FormattedMessage id="satt-til-avtalt.tekst" />
                </Undertittel>
            </div>);

        return aktivitet.avtalt ? visAvtalt : setAvtaltInnhold;
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

const mapStateToProps = (state) => ({
    aktivitetData: state.data.aktiviteter
});

const mapDispatchToProps = (dispatch) => ({
    doSetAktivitetTilAvtalt: (aktivitet) => {
        oppdaterAktivitet({ ...aktivitet, avtalt: true })(dispatch);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AvtaltContainer);
