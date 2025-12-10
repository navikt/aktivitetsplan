import { Alert } from '@navikt/ds-react';
import { ReactElement, useEffect, useState } from 'react';
import { Status } from '../../createGenericSlice';

interface Props {
    statuser: Status[];
    children: ReactElement;
    errorMessage?: string;
}

export const StatusErrorBoundry = ({ statuser, children, errorMessage }: Props) => {
    const [visErrorAlert, setVisErrorAlert] = useState(false);

    const hasError = statuser.includes(Status.ERROR);

    useEffect(() => {
        if (!hasError) {
            setVisErrorAlert(false);
            return;
        }
        setVisErrorAlert(true);
        const timeout = setTimeout(() => setVisErrorAlert(false), 5000);
        return () => clearTimeout(timeout);
    }, [hasError]);

    if (!hasError) {
        return children;
    }

    return (
        <div className="flex grow flex-col pt-10 items-center">
            {visErrorAlert && <Alert variant={'error'}>{errorMessage}</Alert>}
        </div>
    );
};
