import React, { Component, PropTypes as PT } from 'react';
import Icon from 'nav-frontend-ikoner-assets';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import { Radio } from 'nav-frontend-skjema';
import { HjelpetekstOver } from 'nav-frontend-hjelpetekst';
import { Knapp } from 'nav-frontend-knapper';
import { oppdaterAktivitet } from '../../ducks/aktiviteter';
import * as AppPT from '../../proptypes';
import {TILLAT_SET_AVTALT} from '~config' // eslint-disable-line


class AvtaltContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visBekreftAvtalt: false
        };
    }

    render() {
        const { aktivitet, aktivitetData, doSetAktivitetTilAvtalt } = this.props;

        if (!TILLAT_SET_AVTALT) return null;

        const setAvtaltInnhold = (<div>
            <Undertittel>Noe tull med nav</Undertittel>
            <div className="avtaltRadio">
            <Radio onClick={() => this.setState({ visBekreftAvtalt: true })} label="Avtalt med NAV" name="avtalt" />
            <HjelpetekstOver>
                Dette er en lang hjelpetekst med noe sært innhold
            </HjelpetekstOver>
            </div>
            {this.state.visBekreftAvtalt &&
            <Knapp
                spinner={aktivitetData.oppdaterer}
                onClick={() => doSetAktivitetTilAvtalt(aktivitet)}
            >Bekreft</Knapp> }
        </div>);

        const visAvtalt = (<div className="visAvtalt">
            <Icon kind="ok-sirkel-fylt" height="21px" />
            <Undertittel>
                Aktivitet er satt til avtalt med NAV
            </Undertittel>
        </div>);

        return (
            <div className="avtaltContainer">
                {aktivitet.avtalt ? visAvtalt : setAvtaltInnhold}
            </div>
        );
    }
}
AvtaltContainer.propTypes = {
    doSetAktivitetTilAvtalt: PT.func.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
    aktivitetData: PT.shape({
        oppdaterer: PT.string
    })
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
