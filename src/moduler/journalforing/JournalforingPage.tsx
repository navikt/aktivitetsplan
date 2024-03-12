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
    const [lasterSide, setLasterSide] = useState(true);
    const pdf = useSelector(selectPdf);
    const vistOppfolgingsperiode = useSelector(selectVistOppfolgingsperiode);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(hentPdfTilForhaandsvisning(vistOppfolgingsperiode!!.uuid)).then(() => {
            setLasterSide(false);
        });
    }, []);

    return (
        <div className="flex flex-col grow ">
            {lasterSide ? (
                <Loader size="3xlarge" title="Venter..." variant="interaction" className="mt-32 self-center" />
            ) : (
                <section className="flex flex-row">
                    <Sidebar />

                    {pdf && (
                        <Innholdslaster avhengigheter={[arkivStatus]}>
                            <div className="h-full grow bg-bg-subtle overflow-y-scroll max-h-100vh pb-4">
                                {<PdfViewer pdf={pdf} />}
                            </div>
                        </Innholdslaster>
                    )}
                </section>
            )}
        </div>
    );
};
