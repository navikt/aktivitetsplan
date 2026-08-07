import { zodResolver } from '@hookform/resolvers/zod';
import { checkText, Spraksjekk } from '@navikt/dab-spraksjekk';
import { BodyShort, Button, InfoCard, Switch, Tag, Textarea } from '@navikt/ds-react';
import { isFulfilled } from '@reduxjs/toolkit';
import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import { ArrowsSquarepathIcon, TrashIcon } from '@navikt/aksel-icons';

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
    const [visKladdIndikator, setVisKladdIndikator] = useState(false);
    const kladd = useMemo(() => hentSamtaleReferatKladdLagretAktivitet(), []);
    const [skalViseKladdAdvarsel, setSkalViseKladdAdvarsel] = useState(!!kladd);

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

    useEffect(() => {
        const kladd = hentSamtaleReferatKladdLagretAktivitet();
        if (kladd) {
            setValue('referat', kladd, { shouldDirty: true });
            setVisKladdIndikator(true);
        }
    }, []);

    const oppdaterer = isSubmitting || aktivitetsStatus === Status.PENDING || aktivitetsStatus === Status.RELOADING;

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        if (kladd) {
            setValue('referat', kladd, { shouldDirty: true });
        }
    }, []);

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
        setVisKladdIndikator(false);
        setValue('referat', aktivitet.referat || startTekst, { shouldDirty: true });
    };

    return (
        <div className="relative">
            <Overlay
                onBehold={() => {
                    setValue('referat', kladd);
                    setSkalViseKladdAdvarsel(false);
                }}
                onSlett={() => {
                    slettKladd();
                    setSkalViseKladdAdvarsel(false);
                }}
                skalViseKladdAdvarsel={skalViseKladdAdvarsel}
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
                        {visKladdIndikator && (
                            <div className="absolute right-0 -top-1 flex items-center gap-2">
                                <Tag data-color="warning" variant="outline" size="small">
                                    Kladd
                                </Tag>
                                <Button type="button" variant="tertiary" size="small" onClick={slettKladd}>
                                    Slett kladd
                                </Button>
                            </div>
                        )}
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

const Overlay = ({ children, skalViseKladdAdvarsel, onBehold, onSlett }) => {
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
                            Hei vi fant en kladd som ikke ble lagret riktig på dette samtalereferatet. Ønsker du å hente
                            inn igjen kladden?
                        </BodyShort>
                        <div className="flex gap-2">
                            <Button onClick={onBehold} icon={<ArrowsSquarepathIcon />}>
                                Behold kladd
                            </Button>
                            <Button onClick={onSlett} icon={<TrashIcon />} data-color="danger">
                                Slett kladd
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
