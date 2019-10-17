import React, { useEffect, useContext } from 'react';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { HjelpetekstHoyre, HjelpetekstOver } from 'nav-frontend-hjelpetekst';
import { Knapp } from 'nav-frontend-knapper';
import classNames from 'classnames';
import useFormstate, { SubmitHandler } from '@nutgaard/use-formstate';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import AvtaltStripeKRRKvpManuellBruker from './avtalt-alertstripe-manuell-krr-kvp-bruker';
import AvtaltFormMindreEnnSyvDager from './avtalt-form-mindre-enn-syv-dager';
import { DirtyContext } from '../../../context/dirty-context';
import Checkbox from '../../../../felles-komponenter/skjema/input/checkbox';
import Select from '../../../../felles-komponenter/skjema/input/select';
import Textarea from '../../../../felles-komponenter/skjema/input/textarea';

export const SEND_FORHANDSORIENTERING = 'send_forhandsorientering';
export const SEND_PARAGRAF_11_9 = 'send_paragraf_11_9';
export const IKKE_SEND_FORHANDSORIENTERING = 'ikke_send_forhandsorientering';

function validateForhandsorienter(val: string, values: { avtaltSelect?: string }): string | undefined {
    if (values.avtaltSelect !== SEND_PARAGRAF_11_9) {
        return undefined;
    }

    if (val.trim().length === 0) {
        return 'Tekst til brukeren er påkrevd';
    }
    if (val.length > 500) {
        return 'Du må korte ned teksten til 500 tegn';
    }

    return undefined;
}
function noValidate(): undefined {
    return undefined;
}

const avtaltTekst =
    'Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at ' +
    'stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ' +
    'ber vi deg ta kontakt med veilederen din så snart som mulig.';
const avtaltTekst119 =
    'Du kan få redusert utbetaling av arbeidsavklaringspenger med én stønadsdag hvis du lar være å ' +
    '[komme på møtet vi har innkalt deg til [dato]/ møte på … /levere ... innen [dato]] uten rimelig grunn. Dette går ' +
    'fram av folketrygdloven § 11-9.';

const validator = useFormstate({
    avtaltCheckbox: noValidate,
    avtaltSelect: noValidate,
    avtaltText119: validateForhandsorienter,
    avtaltText: noValidate
});

function InfoHeader() {
    return (
        <div>
            <EtikettLiten className="avtalt-tekst-etikett">Tekst til brukeren</EtikettLiten>
            <HjelpetekstHoyre id="brukerinfo">
                Brukeren får en SMS eller e-post via kontaktinformasjon som brukeren selv har registrert i det
                offentlige kontaktregisteret. Brukeren får beskjed om en viktig oppgave og det lenkes til dialog.
                Beskjeden sendes gjennom Altinn etter en halv time. Sender du flere forhåndsorienteringer innen en halv
                time så blir det kun sendt én SMS eller e-post.
            </HjelpetekstHoyre>
        </div>
    );
}

interface Props {
    onSubmit: SubmitHandler<any>;
    className?: string;
    oppdaterer: boolean;
    lasterData: boolean;
    erManuellKrrKvpBruker: boolean;
    visAvtaltMedNavMindreEnnSyvDager: boolean;
}

function AvtaltForm(props: Props) {
    const {
        onSubmit,
        className,
        oppdaterer,
        lasterData,
        erManuellKrrKvpBruker,
        visAvtaltMedNavMindreEnnSyvDager
    } = props;

    const state = validator({
        avtaltCheckbox: 'false',
        avtaltSelect: SEND_FORHANDSORIENTERING,
        avtaltText119: avtaltTekst119,
        avtaltText: avtaltTekst
    });

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        setFormIsDirty('avtalt', !state.pristine);
        return () => setFormIsDirty('avtalt', false);
    }, [setFormIsDirty, state.pristine]);

    const avtalt = state.fields.avtaltCheckbox.input.value === 'true';
    const avtaltSelect = state.fields.avtaltSelect.input.value;

    const kanSendeForhandsvarsel = !erManuellKrrKvpBruker && !visAvtaltMedNavMindreEnnSyvDager;
    return (
        <form onSubmit={state.onSubmit(onSubmit)} noValidate autoComplete="off" className={className}>
            <Undertittel>{'Merk aktiviteten som "Avtalt med NAV"'}</Undertittel>
            <div className="avtalt-container__radio">
                <Checkbox label="Avtalt med NAV" disabled={lasterData} {...state.fields.avtaltCheckbox} />
                <HjelpetekstOver id="hjelp">
                    {
                        'Aktiviteter som oppfyller brukerens aktivitets- og medvirkningsplikt skal settes som "Avtalt med NAV"'
                    }
                </HjelpetekstOver>
            </div>
            <VisibleIfDiv
                className={classNames({
                    'avtalt-container__innhold': kanSendeForhandsvarsel,
                    'avtalt-container__alertstripe': erManuellKrrKvpBruker || visAvtaltMedNavMindreEnnSyvDager
                })}
                visible={avtalt}
            >
                <AvtaltStripeKRRKvpManuellBruker visible={erManuellKrrKvpBruker} />
                <AvtaltFormMindreEnnSyvDager visible={!erManuellKrrKvpBruker && visAvtaltMedNavMindreEnnSyvDager} />
                <VisibleIfDiv visible={kanSendeForhandsvarsel}>
                    <Select
                        label="Velg type forhåndsorientering"
                        disabled={oppdaterer}
                        noBlankOption
                        {...state.fields.avtaltSelect}
                    >
                        <option value={SEND_FORHANDSORIENTERING}>Send forhåndsorientering (standard melding)</option>
                        <option value={SEND_PARAGRAF_11_9}>Send forhåndsorientering for §11-9 (AAP)</option>
                        <option value={IKKE_SEND_FORHANDSORIENTERING}>Ikke send forhåndsorientering</option>
                    </Select>
                    <VisibleIfDiv visible={avtaltSelect !== IKKE_SEND_FORHANDSORIENTERING}>
                        <VisibleIfDiv visible={avtaltSelect === SEND_FORHANDSORIENTERING}>
                            <InfoHeader />
                            <Normaltekst className="blokk-xs">
                                Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det
                                medføre at stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du
                                ikke kan gjennomføre aktiviteten, ber vi deg ta kontakt med veilederen din så snart som
                                mulig.
                            </Normaltekst>
                        </VisibleIfDiv>
                        <VisibleIfDiv visible={avtaltSelect === SEND_PARAGRAF_11_9}>
                            <Textarea label={<InfoHeader />} maxLength={500} {...state.fields.avtaltText119} />
                        </VisibleIfDiv>
                    </VisibleIfDiv>
                </VisibleIfDiv>
                <Knapp spinner={oppdaterer} disabled={lasterData}>
                    {avtaltSelect === IKKE_SEND_FORHANDSORIENTERING || !kanSendeForhandsvarsel
                        ? 'Bekreft'
                        : 'Bekreft og send'}
                </Knapp>
            </VisibleIfDiv>
        </form>
    );
}

export default AvtaltForm;
