import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Innholdstittel, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import useFormstate from '@nutgaard/use-formstate';
import { velgPrintType } from './utskrift-duck';
import { selectKvpPeriodeForValgteOppfolging } from '../oppfolging-status/oppfolging-selector';
import { datoComparator, formaterDatoKortManed } from '../../utils';
import Radio from '../../felles-komponenter/skjema/input/radio';

function UtskriftValg({ tittel, tekst }) {
    return (
        <div>
            <Undertittel>{tittel}</Undertittel>
            <Normaltekst>{tekst}</Normaltekst>
        </div>
    );
}

UtskriftValg.propTypes = {
    tittel: PT.string.isRequired,
    tekst: PT.string.isRequired
};

function KvpPlanValg({ kvpPeriode, field }) {
    return (
        <Radio
            id={kvpPeriode.opprettetDato}
            label={<UtskriftValg tittel="KVP-perioden" tekst="Du skriver ut innholdet i KVP-perioden" />}
            value={kvpPeriode.opprettetDato}
            disabled={!kvpPeriode.avsluttetDato}
            {...field}
        />
    );
}

KvpPlanValg.propTypes = {
    kvpPeriode: PT.object.isRequired,
    field: PT.object.isRequired
};

function KvpPlanListeValg({ kvpPerioder, field }) {
    return (
        <div className="kvp-plan-valg">
            <UtskriftValg tittel="KVP-perioden" tekst="Du skriver ut innholdet i KVP-perioden" />
            {kvpPerioder &&
                kvpPerioder.map(kvp => (
                    <Radio
                        key={kvp.opprettetDato}
                        id={kvp.opprettetDato}
                        label={
                            <Normaltekst>
                                {`${formaterDatoKortManed(kvp.opprettetDato)} - ${formaterDatoKortManed(
                                    kvp.avsluttetDato
                                ) || 'nå'}`}
                            </Normaltekst>
                        }
                        className="kvp-periode-valg"
                        value={kvp.opprettetDato}
                        disabled={!kvp.avsluttetDato}
                        {...field}
                    />
                ))}
        </div>
    );
}

KvpPlanListeValg.propTypes = {
    kvpPerioder: PT.arrayOf(PT.object).isRequired,
    field: PT.object.isRequired
};

const validator = useFormstate({
    utskriftPlanType: () => null
});

function VelgPlanUtskriftForm(props) {
    const { onSubmit, kvpPerioder } = props;

    const initial = {
        utskriftPlanType: 'helePlanen'
    };

    const state = validator(initial);

    return (
        <form onSubmit={state.onSubmit(onSubmit)} className="printmelding__form">
            <div className="printmelding__skjema">
                <div className="printmelding__tittel">
                    <Innholdstittel>Velg hva du ønsker å skrive ut</Innholdstittel>
                </div>

                <div>
                    <Radio
                        label={
                            <UtskriftValg
                                tittel="Hele oppfølgingsperioden"
                                tekst="Du skriver ut alt innholdet du ser i aktivitetsplan, også KVP-perioden"
                            />
                        }
                        value="helePlanen"
                        id="id--helePlanen"
                        {...state.fields.utskriftPlanType}
                    />
                    <Radio
                        label={
                            <UtskriftValg
                                tittel="Oppfølgingsperioden uten KVP-perioden"
                                tekst="Du skriver ut alt innholdet du ser i aktivitetsplan, uten om KVP-perioden"
                            />
                        }
                        value="aktivitetsplan"
                        id="id--aktivitetsplan"
                        {...state.fields.utskriftPlanType}
                    />
                    {kvpPerioder.length === 1 ? (
                        <KvpPlanValg kvpPeriode={kvpPerioder[0]} field={state.fields.utskriftPlanType} />
                    ) : (
                        <KvpPlanListeValg kvpPerioder={kvpPerioder} field={state.fields.utskriftPlanType} />
                    )}
                </div>
            </div>
            <div className="printmelding__knapperad">
                <Hovedknapp>Velg</Hovedknapp>
            </div>
        </form>
    );
}

VelgPlanUtskriftForm.propTypes = {
    onSubmit: PT.func.isRequired,
    kvpPerioder: PT.arrayOf(PT.object)
};

VelgPlanUtskriftForm.defaultProps = {
    kvpPerioder: []
};

const mapStateToProps = state => {
    const kvpPerioderUsortert = selectKvpPeriodeForValgteOppfolging(state);
    const kvpPerioder = [...kvpPerioderUsortert].sort((a, b) => datoComparator(b.opprettetDato, a.opprettetDato));
    return {
        kvpPerioder
    };
};

const mapDispatchToProps = dispatch => ({
    onSubmit: data => {
        dispatch(velgPrintType(data));
        return Promise.resolve();
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VelgPlanUtskriftForm);
