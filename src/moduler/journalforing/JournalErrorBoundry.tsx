import { Alert } from '@navikt/ds-react';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { selectForhaandsvisningStatus, selectJournalføringstatus } from '../verktoylinje/arkivering/arkiv-slice';
import { Status } from '../../createGenericSlice';

export const JournalErrorBoundry = ({ children }: { children: ReactElement }) => {
    const arkivStatus = useSelector(selectForhaandsvisningStatus);
    const journalførtStatus = useSelector(selectJournalføringstatus);
    if (arkivStatus !== Status.ERROR && journalførtStatus !== Status.ERROR) return children;
    return (
        <div className="flex grow flex-col pt-10 items-center">
            <Alert variant={'error'}>Noe gikk galt med journalføringen</Alert>
        </div>
    );
};
