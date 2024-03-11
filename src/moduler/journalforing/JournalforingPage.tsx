import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import React, { useEffect, useState } from 'react';
import { hentPdfTilForhaandsvisning, selectArkivStatus, selectPdf } from '../verktoylinje/arkivering/arkivering-slice';
import { useSelector } from 'react-redux';
import { PdfViewer } from './PdfViewer';
import Sidebar from './Sidebar';
import { selectVistOppfolgingsperiode } from '../aktivitet/aktivitetlisteSelector';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { Status } from '../../createGenericSlice';
import { Loader } from '@navikt/ds-react';

export const JournalforingPage = () => {
    const arkivStatus = useSelector(selectArkivStatus);
    const arkiverer = [Status.PENDING, Status.RELOADING].includes(arkivStatus);
    const pdf = useSelector(selectPdf);
    const vistOppfolgingsperiode = useSelector(selectVistOppfolgingsperiode);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(hentPdfTilForhaandsvisning(vistOppfolgingsperiode!!.uuid));
    }, []);

    return (
        <div className="flex flex-col grow ">
            {arkiverer ? (
                <Loader size="3xlarge" title="Venter..." variant="interaction" className="mt-32 self-center" />
            ) : (
                <section className="flex flex-row py-8">
                    <Sidebar />

                    {pdf && (
                        <Innholdslaster avhengigheter={[arkivStatus]}>
                            <div className="h-full grow bg-gray-300 overflow-y-scroll max-h-100vh pb-4">
                                {<PdfViewer pdf={pdf} />}
                            </div>
                        </Innholdslaster>
                    )}
                </section>
            )}
        </div>
    );
};
