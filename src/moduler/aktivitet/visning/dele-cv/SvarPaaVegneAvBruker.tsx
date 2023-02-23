import { BodyShort, Heading, UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
import { FieldState } from '@nutgaard/use-formstate';
import React from 'react';
import { useSelector } from 'react-redux';

import EtikettBase from '../../../../felles-komponenter/etikett-base/EtikettBase';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import styles from './SvarPaaVegneAvBruker.module.less';

interface Props {
    formhandler: FieldState;
    datoBegrensninger: { after: Date; before: Date };
}

export const SvarPaaVegneAvBruker = ({ formhandler, datoBegrensninger }: Props) => {
    const erVeileder = useSelector(selectErVeileder);

    const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
        disabled: [datoBegrensninger],
        onDateChange: (val) => {
            formhandler.setValue(val?.toISOString() || '');
        },
    });

    if (!erVeileder) return null;

    const feil = formhandler.touched ? formhandler.error : undefined;
    // const cls = classNames(styles.svarPaaVegneAvBruker, { [styles.feil]: !!feil });
    return (
        <div className="mb-4">
            <EtikettBase className={styles.etikett}>FOR NAV-ANSATT</EtikettBase>
            <Heading size="medium" level="3">
                Svar på vegne av brukeren
            </Heading>
            <UNSAFE_DatePicker {...datepickerProps}>
                <UNSAFE_DatePicker.Input
                    {...inputProps}
                    error={feil}
                    label={
                        <BodyShort>
                            Når var du i dialog med brukeren om å dele CV-en deres med denne arbeidsgiveren
                        </BodyShort>
                    }
                />
            </UNSAFE_DatePicker>
        </div>
    );
};
