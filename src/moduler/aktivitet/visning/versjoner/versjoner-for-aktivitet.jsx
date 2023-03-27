import { ReadMore } from '@navikt/ds-react';
import PT from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Innholdslaster from '../../../../felles-komponenter/utils/Innholdslaster';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import visibleIfHOC from '../../../../hocs/visible-if';
import * as AppPT from '../../../../proptypes';
import { autobind } from '../../../../utils/utils';
import { fjernVersjoner, hentVersjonerForAktivtet } from '../../aktivitet-versjoner/aktivitet-versjoner-reducer';
import { selectSorterteVersjoner, selectVersjonerStatus } from '../../aktivitet-versjoner/aktivitet-versjoner-selector';
import VersjonInnslag from './VersjonInnslag';

const MAX_SIZE = 10;

class VersjonerForAktivitet extends Component {
    constructor(props) {
        super(props);
        autobind(this);
    }

    componentDidMount() {
        const { doFjernVersjoner, doHentVersjonerForAktivitet, aktivitet } = this.props;
        doFjernVersjoner();
        doHentVersjonerForAktivitet(aktivitet);
    }

    componentWillUnmount() {
        const { doFjernVersjoner } = this.props;
        doFjernVersjoner();
    }

    render() {
        const { avhengighet, versjoner, className } = this.props;

        const versjonerInnslag = versjoner
            .slice(0, MAX_SIZE)
            .map((versjon, index) => (
                <VersjonInnslag key={versjon.endretDato} aktivitet={versjon} forrigeAktivitet={versjoner[index + 1]} />
            ));

        const versjonerInnslagUnderAccordion = (
            <ReadMore header="Vis mer">
                {versjoner.slice(MAX_SIZE).map((versjon, index) => (
                    <VersjonInnslag
                        key={versjon.endretDato}
                        aktivitet={versjon}
                        forrigeAktivitet={versjoner[index + 1]}
                    />
                ))}
            </ReadMore>
        );

        return (
            <Innholdslaster className="flex m-auto my-4" avhengigheter={avhengighet} spinnerSize="xlarge">
                <section className={className}>
                    {versjonerInnslag}
                    <VisibleIfDiv visible={versjoner.length > MAX_SIZE}>{versjonerInnslagUnderAccordion}</VisibleIfDiv>
                </section>
            </Innholdslaster>
        );
    }
}

VersjonerForAktivitet.propTypes = {
    avhengighet: AppPT.avhengighet.isRequired,
    versjoner: AppPT.aktiviteter.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
    doHentVersjonerForAktivitet: PT.func.isRequired,
    doFjernVersjoner: PT.func.isRequired,
    className: PT.string,
};

VersjonerForAktivitet.defaultProps = {
    className: '',
};

const mapStateToProps = (state) => ({
    avhengighet: selectVersjonerStatus(state),
    versjoner: selectSorterteVersjoner(state),
});

const mapDispatchToProps = (dispatch) => ({
    doHentVersjonerForAktivitet: (aktivitet) => hentVersjonerForAktivtet(aktivitet)(dispatch),
    doFjernVersjoner: () => fjernVersjoner()(dispatch),
});

export default visibleIfHOC(connect(mapStateToProps, mapDispatchToProps)(VersjonerForAktivitet));
