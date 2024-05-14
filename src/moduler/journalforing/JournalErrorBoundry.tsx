import { Alert } from '@navikt/ds-react';
import { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectForhaandsvisningStatus, selectJournalføringstatus } from '../verktoylinje/arkivering/arkiv-slice';
import { Status } from '../../createGenericSlice';

export const JournalErrorBoundry = ({ children }: { children: ReactElement }) => {
    const arkivStatus = useSelector(selectForhaandsvisningStatus);
    const journalførtStatus = useSelector(selectJournalføringstatus);
    const [visErrorAlert, setVisErrorAlert] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setVisErrorAlert(false);
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [journalførtStatus, arkivStatus]);

    if (arkivStatus !== Status.ERROR && journalførtStatus !== Status.ERROR) return children;

    return (
        <div className="flex grow flex-col pt-10 items-center">
            {visErrorAlert && <Alert variant={'error'}>Noe gikk galt med journalføringen</Alert>}
        </div>
    );
};
