import { GuidePanel } from '@navikt/ds-react';



export const Under18Info = () => {
   // const {fnr} = useFnrOgEnhetContext()
    //console.log("fnr", fnr)

   // if (!fnr || is18OrOlder(fnr)) return null;

        return (
            <GuidePanel poster={true}>
                Husk at dine foresatte kan lese det du skriver her.
            </GuidePanel>
        );
    }



