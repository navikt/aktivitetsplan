import { BodyShort, Button, InfoCard, Label } from '@navikt/ds-react';
import EkspanderbartTekstomrade from '../../../../felles-komponenter/EkspanderbartTekstomrade';
import { FloppydiskIcon, PencilIcon } from '@navikt/aksel-icons';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { loggKladdVist } from '../../../../analytics/analytics';

interface ReferatEndring {
    value: string;
    sistEndret: string;
}

export const KladdOverlay = ({
    children,
    onBeholdKladd,
    onBeholdLagret,
    kladd,
    referat,
}: {
    children: React.ReactElement;
    onBeholdKladd: () => void;
    onBeholdLagret: () => void;
    kladd: ReferatEndring | undefined | null;
    referat: ReferatEndring;
}) => {
    useEffect(() => {
        if (kladd) {
            loggKladdVist();
        }
    }, []);

    if (!kladd) return children;

    return (
        <div className="relative">
            <div className="py-20  flex flex-col">
                <InfoCard>
                    <InfoCard.Header>
                        <InfoCard.Title>Kladd funnet</InfoCard.Title>
                    </InfoCard.Header>
                    <InfoCard.Content className="gap-2">
                        <BodyShort className="mb-4">
                            Vi fant en kladd som ikke ble lagret riktig på dette samtalereferatet. Ønsker du å beholde
                            kladden?
                        </BodyShort>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label className="flex items-center gap-1">
                                    <FloppydiskIcon aria-hidden />
                                    {`Lagret ${format(referat.sistEndret, "d.M 'kl' H:mm")}`}
                                </Label>
                                <EkspanderbartTekstomrade
                                    className="mt-2 bg-ax-bg-neutral-moderate p-3 border-ax-bg-neutral-moderate-pressed border rounded-xl"
                                    tekst={referat.value}
                                    antallTegn={200}
                                />
                            </div>
                            <div className="flex-1">
                                <Label className="flex items-center gap-1">
                                    <PencilIcon aria-hidden />
                                    {`Kladd ${format(kladd?.sistEndret, "d.M 'kl' H:mm")}`}
                                </Label>
                                <EkspanderbartTekstomrade
                                    className="mt-2 bg-ax-bg-neutral-moderate p-3 border-ax-bg-neutral-moderate-pressed border rounded-xl"
                                    tekst={kladd?.value}
                                    antallTegn={200}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <div className="flex-1">
                                <Button onClick={onBeholdLagret} icon={<FloppydiskIcon />}>
                                    Behold lagret
                                </Button>
                            </div>
                            <div className="flex-1">
                                <Button onClick={onBeholdKladd} icon={<PencilIcon />}>
                                    Behold kladd
                                </Button>
                            </div>
                        </div>
                    </InfoCard.Content>
                </InfoCard>
            </div>
            <div onClick={(e) => e.stopPropagation()} className="absolute top-0 -z-10 blur h-full w-full">
                {children}
            </div>
        </div>
    );
};
