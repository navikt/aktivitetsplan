import { Heading, Link } from '@navikt/ds-react';
import { isAfter } from 'date-fns';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Link as ReactRouterLink } from 'react-router-dom';
import { AnyAction } from 'redux';

import { fetchSistOppdatert } from '../../api/dialogAPI';
import { ARBEIDSRETTET_DIALOG_URL, MINSIDE_URL } from '../../constant';
import loggEvent, { APNE_OM_TJENESTEN } from '../../felles-komponenter/utils/logging';
import { useErVeileder } from '../../Provider';
import { hentDialog } from '../dialog/dialog-reducer';
import { selectSistOppdatert } from '../dialog/dialog-selector';

function Navigasjonslinje() {
    const erVeileder = useErVeileder();
    const sistOppdatert = useSelector(selectSistOppdatert, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        const doHentDialog = () => dispatch(hentDialog() as unknown as AnyAction);

        if (!erVeileder) {
            let interval: NodeJS.Timeout;

            const pollForChanges = () =>
                fetchSistOppdatert()
                    .then((data) => {
                        const localSistOppdatert = new Date(sistOppdatert);
                        const remoteSistOppdatert = data.sistOppdatert;
                        if (!!data.sistOppdatert && isAfter(remoteSistOppdatert, localSistOppdatert)) {
                            doHentDialog();
                        }
                    })
                    .catch(() => clearInterval(interval));

            interval = setInterval(pollForChanges, 10000);
            return () => clearInterval(interval);
        }
    }, [dispatch, erVeileder, sistOppdatert]);

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex gap-y-2 gap-x-8 flex-col sm:flex-row mt-8 mb-4">
                {!erVeileder ? (
                    <>
                        <Link href={MINSIDE_URL}>Min side</Link>
                        <Link href={ARBEIDSRETTET_DIALOG_URL}>
                            <span>Min dialog med veileder</span>
                            {/*TODO vurder å ta det med i overgang til nytt designsystem*/}
                            {/*<DialogIkon antallUleste={antallUlesteDialoger} />*/}
                            {/*<span className={styles.avstand} hidden={antallUlesteDialoger > 0} />*/}
                        </Link>
                    </>
                ) : null}
                <ReactRouterLink
                    to="informasjon"
                    className="text-text-action underline hover:no-underline"
                    onClick={() => loggEvent(APNE_OM_TJENESTEN)}
                >
                    Hva er aktivitetsplanen?
                </ReactRouterLink>
                <ReactRouterLink to="utskrift" className="text-text-action underline hover:no-underline">
                    Skriv ut
                </ReactRouterLink>
            </div>
            <Heading level="1" size="xlarge">
                Aktivitetsplan
            </Heading>
        </div>
    );
}

export default Navigasjonslinje;
