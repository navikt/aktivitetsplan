import { GuidePanel } from '@navikt/ds-react';
import { useFnrOgEnhetContext } from '../../../Provider';
import { is18OrOlder } from '../../../utils/utils';


export const Under18Info = () => {
    const {fnr} = useFnrOgEnhetContext()
    console.log("fnr", fnr)

    if (!fnr || is18OrOlder(fnr)) return null;

        return (
            <GuidePanel>
                Husk at dine foreldre eller foresatte kan lese det du skriver her.
            </GuidePanel>
        );
    }



