import useFormstate, { SubmitHandler } from '@nutgaard/use-formstate';
import classNames from 'classnames';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { Hovedknapp } from 'nav-frontend-knapper';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import Checkbox from '../../../../../felles-komponenter/skjema/input/Checkbox';
import Innholdslaster from '../../../../../felles-komponenter/utils/Innholdslaster';
import VisibleIfDiv from '../../../../../felles-komponenter/utils/visible-if-div';
import { DirtyContext } from '../../../../context/dirty-context';
import { selectNivaa4Status } from '../../../../tilgang/tilgang-selector';
import ForNavAnsattMarkeringWrapper from '../../hjelpekomponenter/ForNavAnsattMarkeringWrapper';
import { useKanSendeVarsel } from '../avtaltHooks';
import styles from './AvtaltForm.module.less';
import ForhaandsorienteringsMelding from './ForhaandsorienteringsMelding';
import KanIkkeSendeForhaandsorienteringInfotekst from './KanIkkeSendeForhaandsorienteringInfotekst';

const validateForhandsorientering = (val: string, values: { forhaandsorienteringType: string }): string | undefined => {
    if (values.forhaandsorienteringType !== ForhaandsorienteringType.SEND_PARAGRAF_11_9) {
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

type SubmitProps = {
    avtaltCheckbox: string;
    forhaandsorienteringType: ForhaandsorienteringType;
    avtaltText119: string;
    avtaltText: string;
};

export type Handler = SubmitHandler<SubmitProps>;

interface Props {
    onSubmit: Handler;
    className?: string;
    oppdaterer: boolean;
    lasterData: boolean;
    mindreEnnSyvDagerTil: boolean;
    manglerTilDato: boolean;
}

const AvtaltForm = (props: Props) => {
    const { onSubmit, className, oppdaterer, lasterData, mindreEnnSyvDagerTil, manglerTilDato } = props;

    const validator = useFormstate<SubmitProps>({
        avtaltCheckbox: noValidate,
        forhaandsorienteringType: noValidate,
        avtaltText119: validateForhandsorientering,
        avtaltText: noValidate,
    });

    const kanSendeForhaandsvarsel = useKanSendeVarsel() && !mindreEnnSyvDagerTil;

    const state = validator({
        avtaltCheckbox: 'false',
        forhaandsorienteringType: kanSendeForhaandsvarsel
            ? ForhaandsorienteringType.SEND_STANDARD
            : ForhaandsorienteringType.IKKE_SEND,
        avtaltText119: avtaltTekst119,
        avtaltText: avtaltTekst,
    });

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        setFormIsDirty('avtalt', !state.pristine);
        return () => setFormIsDirty('avtalt', false);
    }, [setFormIsDirty, state.pristine]);

    const avtalt = state.fields.avtaltCheckbox.input.value === 'true';
    const avhengigheter = useSelector(selectNivaa4Status);

    return (
        <form onSubmit={state.onSubmit(onSubmit)} noValidate autoComplete="off" className={className}>
            <SkjemaGruppe>
                <ForNavAnsattMarkeringWrapper>
                    <div className={styles.checkbox}>
                        <Checkbox
                            label="Avtalt med NAV"
                            disabled={lasterData}
                            {...state.fields.avtaltCheckbox}
                            className={styles.checkboxNoSpace}
                        />
                        <Hjelpetekst id="hjelp">
                            <div className={styles.maxWidth300}>
                                Aktiviteter som oppfyller brukerens aktivitets- og medvirkningsplikt skal settes som
                                "Avtalt med NAV"
                            </div>
                        </Hjelpetekst>
                    </div>
                </ForNavAnsattMarkeringWrapper>
                <Innholdslaster avhengigheter={avhengigheter} visChildrenVedFeil>
                    <VisibleIfDiv className={classNames(kanSendeForhaandsvarsel && styles.innhold)} visible={avtalt}>
                        <KanIkkeSendeForhaandsorienteringInfotekst
                            mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                            manglerTilDato={manglerTilDato}
                        />
                        <ForhaandsorienteringsMelding
                            state={state}
                            hidden={!kanSendeForhaandsvarsel}
                            oppdaterer={oppdaterer}
                        />
                        <Hovedknapp spinner={oppdaterer} disabled={lasterData}>
                            Bekreft
                        </Hovedknapp>
                    </VisibleIfDiv>
                </Innholdslaster>
            </SkjemaGruppe>
        </form>
    );
};

export default AvtaltForm;
