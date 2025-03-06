import { selectPersonopplusningSjekk } from './tryggtekst-selector';
import { useSelector } from 'react-redux';
import { BodyLong, BodyShort, ExpansionCard, Heading, List, Loader } from '@navikt/ds-react';
import { EyeIcon } from '@navikt/aksel-icons';
import { Status } from '../../../../createGenericSlice';
import { sjekkForPersonopplysninger } from './tryggtekst-slice';
import useAppDispatch from '../../../../felles-komponenter/hooks/useAppDispatch';

export const TryggTekst = ({ value }: { value: string }) => {
    const dispatch = useAppDispatch();
    const { status, data } = useSelector(selectPersonopplusningSjekk);

    const sjekkPersonopplysninger = (isOpen) => {
        if (!isOpen) return;
        dispatch(sjekkForPersonopplysninger(value));
    };

    return (
        <ExpansionCard
            aria-label="Sjekk for personopplysninger"
            className="bg-surface-info-subtle"
            onToggle={sjekkPersonopplysninger}
        >
            <ExpansionCard.Header className="">
                <div className="flex items-center space-x-4">
                    <EyeIcon fontSize={48} />
                    <Heading size="small">Sjekk for personopplysninger</Heading>
                </div>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                {status === Status.PENDING || status === Status.RELOADING ? (
                    <div className="flex flex-col space-y-4 mt-4 justify-center items-center">
                        <BodyShort>Teksten din sjekkes for sensitive personopplysninger</BodyShort>
                        <Loader size="2xlarge" />
                    </div>
                ) : status === Status.OK ? (
                    <List>
                        {data.kategorier.map((kategori) => {
                            return (
                                <List.Item key={kategori.kategori}>
                                    <BodyShort className="font-bold">{capitalize(kategori.kategori)}</BodyShort>
                                    <BodyLong>{kategori.grunn}</BodyLong>
                                </List.Item>
                            );
                        })}
                    </List>
                ) : null}
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

const capitalize = (tekst: string) => {
    return tekst.charAt(0).toUpperCase() + tekst.slice(1);
};
