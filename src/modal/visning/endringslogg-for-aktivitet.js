import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
    hentEndringsloggForAktivtet,
    fjernEndringsLogg,
} from '../../ducks/endringslogg';
import * as AppPT from '../../proptypes';
import { formaterDatoDatoEllerTidSiden } from '../../utils';
import visibleIfHOC from '../../hocs/visible-if';
import { STATUS } from '../../ducks/utils';

function EndringsloggInnslag({ log }) {
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
EndringsloggInnslag.propTypes = {
    log: AppPT.endringslogg.isRequired,
};

class EndringsloggForAktivitet extends Component {
    componentWillMount() {
        const {
            doFjernEndringsLogg,
            doHentEndringsloggForAktivitet,
            aktivitet,
        } = this.props;
        doFjernEndringsLogg();
        doHentEndringsloggForAktivitet(aktivitet);
    }

    render() {
        const { status, endringslogg, className } = this.props;

        return (
            <section className={className}>
                {endringslogg.length === 0 &&
                    status === STATUS.OK &&
                    <FormattedMessage id="livslopsendring.empty" />}
                {endringslogg.map(log => <EndringsloggInnslag log={log} />)}
            </section>
        );
    }
}

EndringsloggForAktivitet.propTypes = {
    endringslogg: PT.arrayOf(AppPT.endringslogg),
    aktivitet: AppPT.aktivitet.isRequired,
    doHentEndringsloggForAktivitet: PT.func.isRequired,
    doFjernEndringsLogg: PT.func.isRequired,
    status: PT.string,
    className: PT.string,
};

EndringsloggForAktivitet.defaultProps = {
    endringslogg: undefined,
    status: undefined,
    className: '',
};

const mapStateToProps = state => ({
    status: state.data.endringslogg.status,
    endringslogg: state.data.endringslogg.data,
});

const mapDispatchToProps = dispatch => ({
    doHentEndringsloggForAktivitet: aktivitet =>
        hentEndringsloggForAktivtet(aktivitet)(dispatch),
    doFjernEndringsLogg: () => fjernEndringsLogg()(dispatch),
});

export default visibleIfHOC(
    connect(mapStateToProps, mapDispatchToProps)(EndringsloggForAktivitet)
);
