import { zodResolver } from '@hookform/resolvers/zod';
import { checkText, Spraksjekk } from '@navikt/dab-spraksjekk';
import { BodyShort, Button, InfoCard, Switch, Tabs, Textarea } from '@navikt/ds-react';
import { isFulfilled } from '@reduxjs/toolkit';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';

import { logReferatFullfort, logToggleSpraksjekkToggle } from '../../../../analytics/analytics';
import { Status } from '../../../../store/createGenericSlice';
import { MoteAktivitet, SamtalereferatAktivitet } from '../../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../../felles-komponenter/hooks/useAppDispatch';
import { DirtyContext } from '../../../context/dirty-context';
import { selectPubliserOgOppdaterReferatFeil } from '../../../feilmelding/feil-selector';
import Feilmelding from '../../../feilmelding/Feilmelding';
import { oppdaterReferat, utenHistorikk } from '../../aktivitet-actions';
import { useHilsenVeilederTekst } from '../../aktivitet-forms/samtalereferat/useHilsenVeilederTekst';
import { selectAktivitetStatus } from '../../aktivitet-selector';
import { TryggTekstBakFeatureToggle } from '../../aktivitet-forms/tryggtekst/TryggTekst';
import { notifiserTryggTekstVedLagring } from '../../aktivitet-forms/tryggtekst/tryggtekst-slice';
import { useSamtalereferatKladd } from '../../aktivitet-forms/samtalereferat/useSamtalereferatKladd';
import { FloppydiskIcon, PencilIcon } from '@navikt/aksel-icons';
import EkspanderbartTekstomrade from '../../../../felles-komponenter/EkspanderbartTekstomrade';

const schema = z.object({
    referat: z.string().min(0).max(5000),
});

type ReferatInputProps = z.infer<typeof schema>;

interface Props {
    aktivitet: MoteAktivitet | SamtalereferatAktivitet;
    onFerdig: () => void;
}

const OppdaterReferatForm = (props: Props) => {
    const { aktivitet, onFerdig } = props;
    const [open, setOpen] = useState(true);
    const startTekst = useHilsenVeilederTekst();
    const dispatch = useAppDispatch();
    const aktivitetsStatus = useSelector(selectAktivitetStatus);
    const erReferatPublisert = aktivitet.erReferatPublisert;
    const {
        lagreSamtalereferatKladdLagretAktivitet,
        hentSamtaleReferatKladdLagretAktivitet,
        slettSamtaleReferatKladd,
    } = useSamtalereferatKladd({ aktivitetId: aktivitet.id });
    const [kladd, setKladd] = useState(hentSamtaleReferatKladdLagretAktivitet());

    const {
        watch,
        setValue,
        formState: { isDirty, isSubmitting },
        register,
        handleSubmit,
    } = useForm<ReferatInputProps>({
        resolver: zodResolver(schema),
        defaultValues: {
            referat: aktivitet.referat || startTekst,
        },
    });

    const oppdaterer = isSubmitting || aktivitetsStatus === Status.PENDING || aktivitetsStatus === Status.RELOADING;

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        setFormIsDirty('referat', isDirty);
        return () => setFormIsDirty('referat', false);
    }, [setFormIsDirty, isDirty]);

    const updateReferat = (referatData: ReferatInputProps, log = true) => {
        const aktivitetMedOppdatertReferat = {
            ...aktivitet,
            referat: referatData.referat,
        };
        return dispatch(oppdaterReferat(aktivitetMedOppdatertReferat)).then((action) => {
            if (log) {
                const analysis = checkText(referatData.referat);
                logReferatFullfort(analysis, aktivitet.erReferatPublisert, open);
            }
            if (isFulfilled(action)) {
                dispatch(notifiserTryggTekstVedLagring(referatData.referat));
                onFerdig();
                slettSamtaleReferatKladd();
            }
            return action;
        });
    };

    const updateAndPubliser = handleSubmit((values) => {
        const oppdatertAktivitet = { ...utenHistorikk(aktivitet), erReferatPublisert: true, referat: values.referat };
        return dispatch(oppdaterReferat(oppdatertAktivitet)).then((action) => {
            const analysis = checkText(values.referat);
            logReferatFullfort(analysis, aktivitet.erReferatPublisert, open);
            if (isFulfilled(action)) {
                dispatch(notifiserTryggTekstVedLagring(values.referat));
                onFerdig();
                slettSamtaleReferatKladd();
            }
            return action;
        });
    });

    const feil = useSelector(selectPubliserOgOppdaterReferatFeil);
    const referatValue = watch('referat');

    useEffect(() => {
        lagreSamtalereferatKladdLagretAktivitet(referatValue);
    }, [referatValue]);

    const slettKladd = () => {
        slettSamtaleReferatKladd();
        setKladd(null);
    };

    const onBeholdKladd = () => {
        if (!kladd) return;
        setValue('referat', kladd, { shouldDirty: true });
        updateReferat({ referat: kladd });
    };

    return (
        <div className="relative">
            <Overlay
                kladd={kladd}
                referat={referatValue}
                onBeholdKladd={onBeholdKladd}
                onBeholdLagret={slettKladd}
                skalViseKladdAdvarsel={!!kladd}
            >
                <form
                    onSubmit={handleSubmit((values) => updateReferat(values))}
                    className="space-y-4 bg-ax-bg-brand-blue-soft p-4 border border-ax-border-brand-blue rounded-md"
                >
                    <div className="relative">
                        <Textarea
                            label={`Samtalereferat`}
                            disabled={oppdaterer}
                            maxLength={5000}
                            placeholder="Skriv samtalereferatet her"
                            {...register('referat')}
                            value={referatValue}
                        />
                    </div>
                    <>
                        <Switch
                            checked={open}
                            onChange={() => {
                                setOpen(!open);
                                logToggleSpraksjekkToggle(!open);
                            }}
                        >
                            Klarspråkhjelpen
                        </Switch>
                        <TryggTekstBakFeatureToggle value={referatValue} />
                        <Spraksjekk value={referatValue} open={open} options={{ tools: false, longWords: false }} />
                    </>
                    <Feilmelding feilmeldinger={feil} />
                    <div className="flex gap-4">
                        {erReferatPublisert ? null : (
                            <Button loading={oppdaterer} disabled={oppdaterer} onClick={updateAndPubliser}>
                                Del med bruker
                            </Button>
                        )}

                        <Button
                            variant={erReferatPublisert ? 'primary' : 'secondary'}
                            loading={oppdaterer}
                            disabled={oppdaterer || !isDirty}
                        >
                            {erReferatPublisert ? 'Del endring' : 'Lagre utkast'}
                        </Button>

                        {aktivitet.referat && (
                            <Button
                                variant="tertiary"
                                onClick={() => {
                                    slettSamtaleReferatKladd();
                                    onFerdig();
                                }}
                            >
                                Avbryt
                            </Button>
                        )}
                    </div>
                </form>
            </Overlay>
        </div>
    );
};

const Overlay = ({ children, skalViseKladdAdvarsel, onBeholdKladd, onBeholdLagret, kladd, referat }) => {
    if (!skalViseKladdAdvarsel) return children;
    return (
        <div>
            <div className="top-10 absolute z-20 flex flex-col">
                <InfoCard>
                    <InfoCard.Header>
                        <InfoCard.Title>Kladd funnet</InfoCard.Title>
                    </InfoCard.Header>
                    <InfoCard.Content className="gap-2">
                        <BodyShort className="mb-4">
                            Vi fant en kladd som ikke ble lagret riktig på dette samtalereferatet. Ønsker du å beholde
                            kladden?
                        </BodyShort>
                        <Tabs defaultValue="lagret" className="">
                            <Tabs.List>
                                <Tabs.Tab icon={<FloppydiskIcon />} label={'Lagret 10:34 igår'} value={'lagret'} />
                                <Tabs.Tab icon={<PencilIcon />} label={'Kladd kl 11.52 idag'} value={'kladd'} />
                            </Tabs.List>
                            <Tabs.Panel value={'lagret'}>
                                <EkspanderbartTekstomrade
                                    className="mt-2 bg-ax-bg-neutral-moderate p-3 border-ax-bg-neutral-moderate-pressed border rounded-xl"
                                    tekst={referat}
                                    antallTegn={200}
                                />
                            </Tabs.Panel>
                            <Tabs.Panel value={'kladd'}>
                                <EkspanderbartTekstomrade
                                    className="mt-2 bg-ax-bg-neutral-moderate p-3 border-ax-bg-neutral-moderate-pressed border rounded-xl"
                                    tekst={kladd}
                                    antallTegn={200}
                                />
                            </Tabs.Panel>
                        </Tabs>
                        <div className="flex gap-2 mt-4">
                            <Button onClick={onBeholdLagret} icon={<FloppydiskIcon />}>
                                Behold lagret
                            </Button>
                            <Button onClick={onBeholdKladd} icon={<PencilIcon />}>
                                Behold kladd
                            </Button>
                        </div>
                    </InfoCard.Content>
                </InfoCard>
            </div>
            <div className="blur h-full w-full">{children}</div>
        </div>
    );
};

export default OppdaterReferatForm;
