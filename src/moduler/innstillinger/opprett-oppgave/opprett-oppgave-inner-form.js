import React from 'react';
import PT from 'prop-types';
import { intlShape } from 'react-intl';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import Select from '../../../felles-komponenter/skjema/input/select';
import {
    BESKRIVELSE_MAKS_LENGDE,
    erValgtEnhetLikInnloggetEnhet,
    filtrerBasertPaTema,
    oppgavetyper,
    optionsFromObjectWithIntl,
    prioritet,
} from './opprett-oppgave-utils';
import PeriodeValidering from '../../../felles-komponenter/skjema/datovelger/periode-validering';
import Datovelger from '../../../felles-komponenter/skjema/datovelger/datovelger';
import Textarea from '../../../felles-komponenter/skjema/textarea/textarea';
import { STATUS } from '../../../ducks/utils';
import * as AppPT from '../../../proptypes';
import VelgVeileder from './velg-veileder';
import VelgEnhet from './velg-enhet';
import { HiddenIf } from '../../../utils';

export function OpprettOppgaveInnerForm({
    behandlendeEnheter,
    tema,
    intl,
    currentFraDato,
    currentTilDato,
    hentVeiledere,
    valgtEnhet,
    veiledere,
}) {
    const enhetliste = Array.isArray(behandlendeEnheter.data)
        ? behandlendeEnheter.data
        : [];

    const veilederliste = veiledere.data.veilederListe ? veiledere.data.veilederListe : [];

    return (
        <HiddenIf
            hidden={behandlendeEnheter.status === STATUS.NOT_STARTED || !tema}
        >
            <Innholdslaster avhengigheter={[behandlendeEnheter]}>
                <div>
                    <Select
                        feltNavn="type"
                        labelId="innstillinger.modal.opprett-oppgave.type.tittel"
                        bredde="fullbredde"
                        noBlankOption
                    >
                        {optionsFromObjectWithIntl(
                            filtrerBasertPaTema(oppgavetyper, tema),
                            intl
                        )}
                    </Select>

                    <Select
                        feltNavn="prioritet"
                        labelId="innstillinger.modal.opprett-oppgave.prioritet.tittel"
                        bredde="fullbredde"
                        noBlankOption
                    >
                        {optionsFromObjectWithIntl(prioritet, intl)}
                    </Select>
                    <PeriodeValidering
                        feltNavn="periodeValidering"
                        fraDato={currentFraDato}
                        tilDato={currentTilDato}
                        errorMessageId="datepicker.feilmelding.egen.fradato-etter-frist"
                    >
                        <div className="dato-container">
                            <Datovelger
                                feltNavn="fraDato"
                                labelId="opprett-oppgave-form.label.fra-dato"
                                senesteTom={currentTilDato}
                            />
                            <Datovelger
                                feltNavn="tilDato"
                                labelId="opprett-oppgave-form.label.til-dato"
                                tidligsteFom={currentFraDato}
                            />
                        </div>
                    </PeriodeValidering>
                    <div className="enhet-veileder-container blokk-m">
                        <VelgEnhet
                            enhetliste={enhetliste}
                            hentVeiledere={hentVeiledere}
                        />
                        <HiddenIf
                            hidden={!erValgtEnhetLikInnloggetEnhet(valgtEnhet)}
                        >
                            <Innholdslaster avhengigheter={[veiledere]}>
                                <VelgVeileder veilederliste={veilederliste} />
                            </Innholdslaster>
                        </HiddenIf>
                    </div>
                    <Textarea
                        labelId="innstillinger.modal.opprett-oppgave.label.beskrivelse"
                        feltNavn="beskrivelse"
                        maxLength={BESKRIVELSE_MAKS_LENGDE}
                    />
                </div>
            </Innholdslaster>
        </HiddenIf>
    );
}

OpprettOppgaveInnerForm.propTypes = {
    behandlendeEnheter: AppPT.behandlendeEnheter.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    hentVeiledere: PT.func.isRequired,
    veiledere: AppPT.veiledere.isRequired,
    valgtEnhet: PT.string,
    tema: PT.string,
    intl: intlShape.isRequired,
};

OpprettOppgaveInnerForm.defaultProps = {
    valgtEnhet: undefined,
    tema: undefined,
    currentFraDato: undefined,
    currentTilDato: undefined,
};

export default OpprettOppgaveInnerForm;
