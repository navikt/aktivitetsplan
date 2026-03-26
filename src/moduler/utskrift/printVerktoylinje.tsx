import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { ArrowCirclepathIcon, EnvelopeOpenIcon, PrinterSmallIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, Heading } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link as ReactRouterLink } from 'react-router-dom';
import { z } from 'zod';
import loggEvent, { TRYK_PRINT } from '../../felles-komponenter/utils/logging';
import Filter from '../filtrering/Filter';
import VisValgtFilter from '../filtrering/VisValgtFilter';
import { logKlikkKnapp, logValgtFilter } from '../../analytics/analytics';
import { useSelector } from 'react-redux';
import { selectSendTilBrukerStatus } from '../verktoylinje/arkivering/arkiv-slice';
import { Status } from '../../createGenericSlice';
import DateRangePicker from '../../felles-komponenter/skjema/datovelger/DateRangePicker';
import { selectValgtPeriode } from '../oppfolging-status/oppfolging-selector';
import { dateOrUndefined } from '../aktivitet/aktivitet-forms/ijobb/AktivitetIjobbForm';
import { DatoPeriode } from '../journalforing/journalforingFilter';

const schema = z.object({
    inkluderDialoger: z.boolean(),
    fraDato: z.date().optional(),
    tilDato: z.date().optional(),
});

export type PrintVerktoylinjeFormValues = z.infer<typeof schema>;

interface Props {
    tilbakeRoute?: string;
    kanSkriveUt: boolean;
    oppdaterForhaandsvistPdf: () => void;
    skrivUt: () => void;
    sendTilBruker: () => void;
    kanSendeTilBruker: boolean;
    pdfMåOppdateresEtterFilterendring: boolean;
    inkluderDialoger: boolean;
    setInkluderDialoger: (inkluderDialoger: boolean) => void;
    setValgtDatoRange: (datoPeriode: DatoPeriode | undefined) => void;
}

function PrintVerktoylinje({
                               tilbakeRoute,
                               kanSkriveUt,
                               oppdaterForhaandsvistPdf,
                               skrivUt,
                               kanSendeTilBruker,
                               sendTilBruker,
                               pdfMåOppdateresEtterFilterendring,
                               inkluderDialoger,
                               setInkluderDialoger,
                               setValgtDatoRange
                           }: Props) {
    const sendTilBrukerStatus = useSelector(selectSendTilBrukerStatus);
    const valgtOppfolgingsperiode = useSelector(selectValgtPeriode); // TODO: Fiks, alltid undefined nå
    const senderTilBruker = [Status.PENDING, Status.RELOADING].includes(sendTilBrukerStatus);

    const defaultValues = {
        inkluderDialoger: inkluderDialoger,
            fraDato: undefined,
            tilDato: undefined
    };

    const formHandlers = useForm<PrintVerktoylinjeFormValues>({
        defaultValues: defaultValues,
        resolver: zodResolver(schema),
    });

    const { register, watch } = formHandlers;

    const inkluderDialogerValue = watch('inkluderDialoger');
    const fraDatoValue = watch('fraDato');
    const tilDatoValue = watch('tilDato');

    useEffect(() => {
        setInkluderDialoger(inkluderDialogerValue);
    }, [inkluderDialogerValue]);

    useEffect(() => {
        if (fraDatoValue && tilDatoValue && fraDatoValue instanceof Date && tilDatoValue instanceof Date) {
            setValgtDatoRange({fra: fraDatoValue.toISOString(), til: tilDatoValue.toISOString()});
        }
    }, [fraDatoValue, tilDatoValue]);

    const nullstillValgtDatoRange = () => {
        setValgtDatoRange(undefined);
    }

    console.log("OPpfolgingsperiode", valgtOppfolgingsperiode);

    return (
        <>
            <Heading className="print:hidden" spacing size={'large'}>
                Skriv ut aktivitetsplanen
            </Heading>
            <div className="print:hidden self-start flex flex-row mb-8 items-center gap-x-10">
                {tilbakeRoute ? (
                    <ReactRouterLink
                        className="text-ax-text-accent-subtle underline hover:no-underline"
                        to={tilbakeRoute}
                        tabIndex={0}
                    >
                        Tilbake
                    </ReactRouterLink>
                ) : null}
                    <div className="self-start flex flex-row gap-4 items-center">
                        <Filter /><Button icon={<ArrowCirclepathIcon />} onClick={oppdaterForhaandsvistPdf}>Oppdater
                        visning</Button>
                    </div>
                <div className="self-start flex flex-row items-center gap-4">
                    {kanSkriveUt ? (
                        <Button
                            icon={<PrinterSmallIcon />}
                            onClick={() => {
                                skrivUt();
                                loggEvent(TRYK_PRINT);
                                logKlikkKnapp('Skriv ut');
                                logValgtFilter(
                                    inkluderDialogerValue ? "Inkluder dialoger" : "Ekskluder dialoger"
                                );
                            }}
                            disabled={pdfMåOppdateresEtterFilterendring}
                        >
                            Skriv ut
                        </Button>
                    ) : null}
                    {kanSendeTilBruker &&
                        <Button icon={<EnvelopeOpenIcon />} onClick={() => {
                            sendTilBruker();
                            logKlikkKnapp('Journalfør og send til bruker');
                            logValgtFilter(
                                inkluderDialogerValue ? "Inkluder dialoger" : "Ekskluder dialoger"
                            );
                        }} loading={senderTilBruker} disabled={pdfMåOppdateresEtterFilterendring}>Journalfør og send til
                            bruker</Button>}
                </div>
            </div>
            <FormProvider {...formHandlers}>
                <div>
                    <Checkbox {...register('inkluderDialoger')}>
                        Inkluder dialoger
                    </Checkbox>
                    <div className="flex items-end gap-4">
                        <DateRangePicker
                            from={{ name: 'fraDato', required: false, defaultValue: defaultValues.fraDato, minDate: dateOrUndefined(valgtOppfolgingsperiode?.start) }}
                            to={{ name: 'tilDato', required: false, defaultValue: defaultValues.tilDato, maxDate: dateOrUndefined(valgtOppfolgingsperiode?.slutt) }}
                            onReset={nullstillValgtDatoRange}
                        />
                    </div>
                </div>
            </FormProvider>
            <div className="print:hidden mb-8">
                <VisValgtFilter />
            </div>
        </>
    );
}

export default PrintVerktoylinje;
