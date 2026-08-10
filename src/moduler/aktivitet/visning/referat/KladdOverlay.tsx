import { BodyShort, Button, InfoCard, Tabs } from '@navikt/ds-react';
import EkspanderbartTekstomrade from '../../../../felles-komponenter/EkspanderbartTekstomrade';
import { FloppydiskIcon, PencilIcon } from '@navikt/aksel-icons';
import { format } from 'date-fns';

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
                        <Tabs defaultValue="lagret" className="">
                            <Tabs.List>
                                <Tabs.Tab
                                    icon={<FloppydiskIcon />}
                                    label={`Lagret ${format(referat.sistEndret, 'd.M H:mm')}`}
                                    value={'lagret'}
                                />
                                <Tabs.Tab
                                    icon={<PencilIcon />}
                                    label={`Kladd ${format(kladd?.sistEndret, 'd.M H:mm')}`}
                                    value={'kladd'}
                                />
                            </Tabs.List>
                            <Tabs.Panel value={'lagret'}>
                                <EkspanderbartTekstomrade
                                    className="mt-2 bg-ax-bg-neutral-moderate p-3 border-ax-bg-neutral-moderate-pressed border rounded-xl"
                                    tekst={referat.value}
                                    antallTegn={200}
                                />
                            </Tabs.Panel>
                            <Tabs.Panel value={'kladd'}>
                                <EkspanderbartTekstomrade
                                    className="mt-2 bg-ax-bg-neutral-moderate p-3 border-ax-bg-neutral-moderate-pressed border rounded-xl"
                                    tekst={kladd?.value}
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
            <div onClick={(e) => e.stopPropagation()} className="absolute top-0 -z-10 blur h-full w-full">
                {children}
            </div>
        </div>
    );
};
