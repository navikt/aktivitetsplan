import { Button, HelpText, Label } from '@navikt/ds-react';
import useFormstate, { FieldState, SubmitHandler } from '@nutgaard/use-formstate';
import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import Checkbox from '../../../../../felles-komponenter/skjema/input/Checkbox';
import Innholdslaster from '../../../../../felles-komponenter/utils/Innholdslaster';
import VisibleIfDiv from '../../../../../felles-komponenter/utils/visible-if-div';
import { DirtyContext } from '../../../../context/dirty-context';
import { selectNivaa4Status } from '../../../../tilgang/tilgang-selector';
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
        <form
            onSubmit={state.onSubmit(onSubmit)}
            noValidate
            autoComplete="off"
            className={classNames('bg-surface-alt-3-subtle py-2 px-4 mx-6 border border-border-alt-3 rounded-md')}
        >
            <div>
                <div className={'flex items-center'}>
                    <Checkbox
                        disabled={lasterData}
                        {...(state.fields.avtaltCheckbox as FieldState & { error: never })}
                        className={styles.checkboxNoSpace}
                    >
                        Avtalt med NAV
                    </Checkbox>
                    <HelpText id="hjelp" className="ml-2 justify-self-start">
                        <div className={styles.maxWidth300}>
                            Aktiviteter som oppfyller brukerens aktivitets- og medvirkningsplikt skal settes som "Avtalt
                            med NAV"
                        </div>
                    </HelpText>
                    <Label className="text-right flex-grow">FOR NAV-ANSATT</Label>
                </div>
                <Innholdslaster avhengigheter={avhengigheter} visChildrenVedFeil>
                    <VisibleIfDiv
                        className={classNames('space-y-4', kanSendeForhaandsvarsel && styles.innhold)}
                        visible={avtalt}
                    >
                        <KanIkkeSendeForhaandsorienteringInfotekst
                            mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                            manglerTilDato={manglerTilDato}
                        />
                        <ForhaandsorienteringsMelding
                            state={state}
                            hidden={!kanSendeForhaandsvarsel}
                            oppdaterer={oppdaterer}
                        />
                        <Button loading={oppdaterer} disabled={lasterData}>
                            Bekreft
                        </Button>
                    </VisibleIfDiv>
                </Innholdslaster>
            </div>
        </form>
    );
};

export default AvtaltForm;
