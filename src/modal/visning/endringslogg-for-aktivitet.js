import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { hentEndringsloggForAktivtet, fjernEndringsLogg } from '../../ducks/endringslogg';
import * as AppPT from '../../proptypes';
import { formaterDatoDatoEllerTidSiden } from '../../utils';

class EndringsloggForAktivitet extends Component {

    componentWillMount() {
        this.props.doFjernEndringsLogg();
    }

    handleClick = () => {
        const { endringslogg, doHentEndringsloggForAktivitet, aktivitet, doFjernEndringsLogg } = this.props;
        if (endringslogg.length === 0) {
            doHentEndringsloggForAktivitet(aktivitet);
        } else {
            doFjernEndringsLogg();
        }
    };

    render() {
        const { endringslogg, className } = this.props;

        function lagEndringsloggInnslag(log) {
            const beskrivelse = log.endringsBeskrivelse.split(/,(.+)/);
            return (
                <p key={log.endretDato} className="endringslogg-for-aktivitet__innslag">
                    <b>Du </b>
                    <FormattedMessage
                        id={beskrivelse[0]}
                        values={JSON.parse(beskrivelse[1])}
                    />
                    <br />
                    {formaterDatoDatoEllerTidSiden(log.endretDato)}
                </p>
            );
        }

        function lagEndringslogg(logg) {
            return logg.map((log, i) => lagEndringsloggInnslag(log)); // eslint-disable-line no-unused-vars
        }

        const cls = (givenClass) => classNames('endringslogg-for-aktivitet', givenClass);
        const visSkjulTekst = `${endringslogg.length === 0 ? 'Vis ' : 'Skjul '}historikk`;
        return (
            <section className={cls(className)}>
                <a
                    href="javascript:" // eslint-disable-line no-script-url
                    className="endringslogg-for-aktivitet__lenke-knapp"
                    onClick={this.handleClick}
                >{visSkjulTekst}</a>
                {lagEndringslogg(endringslogg)}
            </section>
        );
    }
}


EndringsloggForAktivitet.propTypes = {
    endringslogg: PT.arrayOf(AppPT.endringslogg),
    aktivitet: AppPT.aktivitet.isRequired,
    doHentEndringsloggForAktivitet: PT.func.isRequired,
    doFjernEndringsLogg: PT.func.isRequired,
    className: PT.string
};

const mapStateToProps = (state) => ({
    status: state.status,
    endringslogg: state.data.endringslogg.data
});

const mapDispatchToProps = (dispatch) => ({
    doHentEndringsloggForAktivitet: (aktivitet) => hentEndringsloggForAktivtet(aktivitet)(dispatch),
    doFjernEndringsLogg: () => fjernEndringsLogg()(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EndringsloggForAktivitet);
