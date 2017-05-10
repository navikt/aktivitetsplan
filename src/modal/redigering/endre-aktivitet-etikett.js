import React, { Component } from 'react';
import PT from 'prop-types'
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import classNames from 'classnames';
import * as AppPT from '../../proptypes';
import { hentEtiketter } from '../../ducks/etiketter';

const mellomromKeyCode = 32;

function EtikettKnapp({ etikett, velgEtikett, erValgt }) {
    const etikettId = etikett.id;
    const htmlId = `aktivitet-etikett-${etikettId}`;

    // Bruker radiobutton som input-element.
    // Legger her til mulighet for å toggle disse
    function onChange(e) {
        if (erValgt) {
            e.preventDefault();
            velgEtikett(null);
        }
    }

    function onKeyUp(e) {
        if (e.keyCode === mellomromKeyCode && erValgt) {
            e.preventDefault();
            velgEtikett('INGEN');
        }
    }

    return (
        <span>
            <Field
                name="etikett"
                type="radio"
                className="endre-aktivitet-etikett__etikett-radio"
                component="input"
                value={etikettId}
                onChange={onChange}
                onKeyUp={onKeyUp}
                id={htmlId}
            />
            <label
                htmlFor={htmlId}
                className={classNames(
                    'endre-aktivitet-etikett__etikett',
                    `endre-aktivitet-etikett__etikett--${etikett.type}`,
                    erValgt && `endre-aktivitet-etikett__etikett--${etikett.type}-valgt`
                )}
            >{etikett.visningsTekst}</label>
        </span>
    );
}
EtikettKnapp.propTypes = {
    etikett: AppPT.etikett.isRequired,
    erValgt: PT.bool.isRequired,
    velgEtikett: PT.func.isRequired
};

const typePrioritet = {
    ok: 3,
    varsling: 1,
    info: 2
};

class EndreAktivitetEtikett extends Component {

    componentDidMount() {
        this.props.doHentEtiketter();
    }

    render() {
        const { etiketter, velgEtikett, valgtEtikett } = this.props;

        const etikettKnapper = etiketter
            .sort((a, b) => typePrioritet[b.type] - typePrioritet[a.type])
            .map((e) => <EtikettKnapp
                key={e.id}
                etikett={e}
                erValgt={e.id === valgtEtikett}
                velgEtikett={velgEtikett}
            />
            );

        return (
            <section className="endre-aktivitet-etikett">
                <Undertittel><FormattedMessage id="aktivitet.etikett" /></Undertittel>
                {etikettKnapper}
                <Field
                    name="etikett"
                    type="radio"
                    className="endre-aktivitet-etikett__etikett-radio"
                    component="input"
                />
            </section>
        );
    }
}

EndreAktivitetEtikett.propTypes = {
    doHentEtiketter: PT.func.isRequired,
    etiketter: PT.arrayOf(PT.object).isRequired,

    valgtEtikett: PT.string,
    velgEtikett: PT.func.isRequired
};

EndreAktivitetEtikett.defaultProps = {
    valgtEtikett: undefined
};

const mapStateToProps = (state) => ({
    etiketter: state.data.etiketter.data
});

const mapDispatchToProps = (dispatch) => ({
    doHentEtiketter: () => hentEtiketter()(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EndreAktivitetEtikett);
