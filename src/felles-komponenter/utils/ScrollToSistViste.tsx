import React, { ReactElement, useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';

import { selectSistVisteAktivitet } from '../../moduler/aktivitet/aktivitetview-reducer';
import { useEventListener } from '../hooks/useEventListner';

function doScroll(id: string) {
    document.getElementById(id)?.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center',
    });
}
const ScrollToSistViste = (props: RouteProps): ReactElement<RouteComponentProps<any>> => {
    let sistVisteAktivitetId: string = useSelector<RootStateOrAny, string>(
        (state) => `aktivitetskort-` + selectSistVisteAktivitet(state)?.id
    );
    let [skalScrolleTil, setSkalScrolleTil] = useState(false);

    useEventListener('veilarbpersonflatefs.tab-clicked', () => {
        console.log('EVENT veilarbpersonflatefs.tab-clicked:');
        console.log('Setter skal scrolle til TRUE');
        setSkalScrolleTil(true);
    });

    useEffect(() => {
        console.log('effect sist vist eller skal scrolle til');
        if (skalScrolleTil && !!sistVisteAktivitetId) {
            console.log('effect sist vist OG skal scrolle til');
            doScroll(sistVisteAktivitetId);
            console.log('Setter skal scrolle til FALSE');
            setSkalScrolleTil(false);
        }
    }, [skalScrolleTil, sistVisteAktivitetId]);

    useEffect(() => {
        console.log('Endring i location:');
        console.log('Setter skal scrolle til TRUE');
        setSkalScrolleTil(true);
    }, [props.location]);

    return <>{props.children}</>;
};

export default withRouter(ScrollToSistViste);
