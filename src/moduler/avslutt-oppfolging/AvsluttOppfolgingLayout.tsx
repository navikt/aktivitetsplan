import { Heading, VStack } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { Link as ReactRouterLink } from 'react-router';
import { useRoutes } from '../../routing/useRoutes';
import { AvsluttOppfolgingPiktogram } from './AvsluttOppfolgingPiktogram';

interface Props {
    visTilbakelenke?: boolean;
    children: ReactNode;
}

export const AvsluttOppfolgingLayout = ({ visTilbakelenke = false, children }: Props) => {
    const { hovedsideRoute } = useRoutes();

    return (
        <main id="main" className="flex items-center flex-col w-full">
            <div className="container flex flex-col">
                <VStack
                    gap="space-32"
                    paddingBlock="space-24 space-64"
                    className="max-w-2xl mx-auto w-full px-4 lg:px-0"
                >
                    {visTilbakelenke && (
                        <ReactRouterLink
                            to={hovedsideRoute()}
                            className="self-start text-ax-text-accent-subtle underline hover:no-underline"
                        >
                            Tilbake
                        </ReactRouterLink>
                    )}
                    <div className="relative">
                        <AvsluttOppfolgingPiktogram className="hidden lg:block absolute right-full mr-6 top-1/2 -translate-y-1/2" />
                        <Heading level="1" size="xlarge">
                            Avslutt arbeidsrettet oppfølging
                        </Heading>
                    </div>
                    {children}
                </VStack>
            </div>
        </main>
    );
};
