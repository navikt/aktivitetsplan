import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { hentEndringsloggForAktivtet, fjernEndringsLogg } from '../../ducks/endringslogg';
import * as AppPT from '../../proptypes';

class EndringsloggForAktivitet extends Component {

    componentWillMount() {
        this.props.doFjernEndringsLogg();
    }

    onClick = () => {
        const { endringslogg, doHentEndringsloggForAktivitet, aktivitet, doFjernEndringsLogg } = this.props;
        if (endringslogg.length === 0) {
            doHentEndringsloggForAktivitet(aktivitet);
        } else {
            doFjernEndringsLogg();
        }
    };

    render() {
        const { endringslogg } = this.props;
        return (
            <section className="endringslogg-for-aktivitet">
                <button className="knapp" onClick={this.onClick}>{endringslogg.length === 0 ? 'Se ' : 'Lukk '}endringslogg</button>
                {endringslogg.map((log, i) =>
                    <div key={log.endretDato}>
                        {log.endretDato}<br />
                        {log.endretAv}<br />
                        {log.endringsBeskrivelse}
                        {(endringslogg.length - 1) !== i ? <hr /> : ''}
                    </div>
                )}
            </section>
        );
    }
}


EndringsloggForAktivitet.propTypes = {
    endringslogg: PT.arrayOf(AppPT.endringslogg),
    aktivitet: AppPT.aktivitet.isRequired,
    doHentEndringsloggForAktivitet: PT.func.isRequired,
    doFjernEndringsLogg: PT.func.isRequired
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
