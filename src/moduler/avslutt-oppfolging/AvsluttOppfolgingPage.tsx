import { Heading } from '@navikt/ds-react';
import React from 'react';

export const AvsluttOppfolgingPage = () => {
    return (
        <main id="main" className="flex items-center flex-col w-full">
            <div className="container flex flex-col gap-y-6 mt-8">
                <Heading level="1" size="xlarge">
                    Avslutt arbeidsrettet oppfølging
                </Heading>
            </div>
        </main>
    );
};
