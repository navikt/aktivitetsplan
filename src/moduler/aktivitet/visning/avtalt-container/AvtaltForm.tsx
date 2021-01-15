import useFormstate, { SubmitHandler } from '@nutgaard/use-formstate';
import classNames from 'classnames';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { Knapp } from 'nav-frontend-knapper';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Checkbox from '../../../../felles-komponenter/skjema/input/checkbox';
import Innholdslaster from '../../../../felles-komponenter/utils/innholdslaster';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import { DirtyContext } from '../../../context/dirty-context';
import { selectNivaa4Status } from '../../../tilgang/tilgang-selector';
import styles from './AvtaltForm.module.less';
import { useKanSendeVarsel } from './avtaltHooks';
import ForhaandsorienteringMelding from './ForhaandsorienteringsMelding';
import KanIkkeSendeForhaandsorienteringInfotekst from './KanIkkeSendeForhaandsorienteringInfotekst';

export const SEND_FORHAANDSORIENTERING = 'send_forhandsorientering';
export const SEND_PARAGRAF_11_9 = 'send_paragraf_11_9';
export const IKKE_SEND_FORHAANDSORIENTERING = 'ikke_send_forhandsorientering';

const validateForhandsorienter = (val: string, values: { avtaltSelect?: string }): string | undefined => {
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
};

const noValidate = (): undefined => {
    return undefined;
};

const avtaltTekst =
    `Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at ` +
    'stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ' +
    'ber vi deg ta kontakt med veilederen din så snart som mulig.';

const avtaltTekst119 =
    'Du kan få redusert utbetaling av arbeidsavklaringspenger med én stønadsdag hvis du lar være å ' +
    '[komme på møtet vi har innkalt deg til [dato]/ møte på … /levere ... innen [dato]] uten rimelig grunn. Dette går ' +
    'fram av folketrygdloven § 11-9.';

interface SubmitProps {
    avtaltCheckbox: string;
    avtaltSelect: string;
    avtaltText119: string;
    avtaltText: string;
}

export type Handler = SubmitHandler<SubmitProps>;

interface Props {
    aktivitetId: string;
    onSubmit: Handler;
    className?: string;
    oppdaterer: boolean;
    lasterData: boolean;
    mindreEnnSyvDagerTil: boolean;
}

const AvtaltForm = (props: Props) => {
    const { onSubmit, className, aktivitetId, oppdaterer, lasterData, mindreEnnSyvDagerTil } = props;

    const validator = useFormstate({
        avtaltCheckbox: noValidate,
        avtaltSelect: noValidate,
        avtaltText119: validateForhandsorienter,
        avtaltText: noValidate,
    });

    const kanSendeForhaandsvarsel = useKanSendeVarsel();

    const state = validator({
        avtaltCheckbox: 'false',
        avtaltSelect: kanSendeForhaandsvarsel ? SEND_FORHAANDSORIENTERING : IKKE_SEND_FORHAANDSORIENTERING,
        avtaltText119: avtaltTekst119,
        avtaltText: avtaltTekst,
    });

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        setFormIsDirty('avtalt', !state.pristine);
        return () => setFormIsDirty('avtalt', false);
    }, [setFormIsDirty, state.pristine]);

    const avtalt = state.fields.avtaltCheckbox.input.value === 'true';
    const avtaltSelect = state.fields.avtaltSelect.input.value;
    const avhengigheter = useSelector(selectNivaa4Status);

    return (
        <form onSubmit={state.onSubmit(onSubmit)} noValidate autoComplete="off" className={className}>
            <Undertittel>Merk aktiviteten som "Avtalt med NAV"</Undertittel>
            <SkjemaGruppe>
                <div className={styles.checkbox}>
                    <Checkbox label="Avtalt med NAV" disabled={lasterData} {...state.fields.avtaltCheckbox} />
                    <Hjelpetekst id="hjelp">
                        <div className={styles.maxWidth300}>
                            Aktiviteter som oppfyller brukerens aktivitets- og medvirkningsplikt skal settes som "Avtalt
                            med NAV"
                        </div>
                    </Hjelpetekst>
                </div>
                <Innholdslaster avhengigheter={avhengigheter} visChildrenVedFeil>
                    <VisibleIfDiv className={classNames(kanSendeForhaandsvarsel && styles.innhold)} visible={avtalt}>
                        <KanIkkeSendeForhaandsorienteringInfotekst mindreEnnSyvDagerTil={mindreEnnSyvDagerTil} />
                        <ForhaandsorienteringMelding
                            state={state}
                            hidden={!kanSendeForhaandsvarsel}
                            oppdaterer={oppdaterer}
                        />
                        <Knapp spinner={oppdaterer} disabled={lasterData}>
                            {avtaltSelect === IKKE_SEND_FORHAANDSORIENTERING ? 'Bekreft' : 'Bekreft og send'}
                        </Knapp>
                    </VisibleIfDiv>
                </Innholdslaster>
            </SkjemaGruppe>
        </form>
    );
};

export default AvtaltForm;
