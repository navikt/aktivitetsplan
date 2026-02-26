import { selectPersonopplusningSjekk } from './tryggtekst-selector';
import { useSelector } from 'react-redux';
import { BodyLong, BodyShort, ExpansionCard, Heading, List, Loader, Box, Button } from '@navikt/ds-react';
import { Status } from '../../../../createGenericSlice';
import { sjekkForPersonopplysninger, nullstillTryggTekst } from './tryggtekst-slice';
import useAppDispatch from '../../../../felles-komponenter/hooks/useAppDispatch';
import { useEffect, useRef, useState } from 'react';
import { hentFeatures } from '../../../feature/feature-slice';
import { selectFeatureSlice } from '../../../feature/feature-selector';
import KISymbol from '../../../../Ikoner/KI_symbol';
import { useParams } from 'react-router-dom';

const TryggTekst = ({ value }: { value: string }) => {
    const dispatch = useAppDispatch();
    const { status, data } = useSelector(selectPersonopplusningSjekk);
    const { id: aktivitetId } = useParams<{ id: string }>();
    const prevAktivitetIdRef = useRef<string | undefined>(aktivitetId);
    const [lastCheckedValue, setLastCheckedValue] = useState<string | null>(null);

    const hasTextChanged = lastCheckedValue !== null && lastCheckedValue !== value;

    useEffect(() => {
        const prevAktivitetId = prevAktivitetIdRef.current;
        if (prevAktivitetId && prevAktivitetId !== aktivitetId) {
            dispatch(nullstillTryggTekst());
            setLastCheckedValue(null);
        }
        prevAktivitetIdRef.current = aktivitetId;
    }, [aktivitetId, dispatch]);

    const sjekkPersonopplysninger = (isOpen?: boolean) => {
        if (isOpen === false) return;
        setLastCheckedValue(value);
        dispatch(sjekkForPersonopplysninger({
            tekst: value,
            tryggTekstReferatId: data?.tryggTekstReferatId
        }));
    };

    return (
        <ExpansionCard
            aria-label="Sjekk for sensitive personopplysninger"
            className="bg-ax-bg-info-soft"
            onToggle={sjekkPersonopplysninger}
        >
            <ExpansionCard.Header className="">
                <div className="flex items-center space-x-4">
                    <KISymbol />
                    <Heading size="small">Sjekk teksten med TryggTekst</Heading>
                </div>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                {status === Status.PENDING || status === Status.RELOADING ? (
                    <div className="flex flex-col gap-y-4 mt-4 justify-center items-center">
                        <BodyShort>KI-modellen sjekker for særlige kategorier av personopplysninger</BodyShort>
                        <Loader className="mb-4" size="2xlarge" />
                    </div>
                ) : status === Status.OK ? (
                    (() => {
                        const kategorier = (data?.kategorier || []).filter(
                            (k) => k.kategori.toLowerCase() !== 'ingen'
                        );
                        return kategorier.length > 0 ? (
                            <Box marginBlock="space-16" asChild>
                                <List data-aksel-migrated-v8>
                                    {kategorier.map((kategori) => (
                                        <List.Item key={kategori.kategori}>
                                            <BodyShort><b>{capitalize(kategori.kategori)}</b></BodyShort>
                                            <BodyLong>{kategori.trigger}</BodyLong>
                                        </List.Item>
                                    ))}
                                </List>
                            </Box>
                        ) : (
                            <BodyShort className="mt-4">Ingen sensitive personopplysninger ble funnet i teksten.</BodyShort>
                        );
                    })()
                ) : null}
                {hasTextChanged && (
                    <div className="mt-4">
                        <Button variant="secondary" onClick={() => sjekkPersonopplysninger()}>Sjekk teksten igjen</Button>
                    </div>
                )}
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

const capitalize = (tekst: string) => {
    return tekst.charAt(0).toUpperCase() + tekst.slice(1);
};

export const TryggTekstBakFeatureToggle = ({ value }: { value: string }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(hentFeatures());
    }, []);

    const { status, data } = useSelector(selectFeatureSlice);

    return status === Status.OK && data && data['aktivitetsplan.tryggtekst'] === true ? (
        <TryggTekst value={value} />
    ) : null;
};
