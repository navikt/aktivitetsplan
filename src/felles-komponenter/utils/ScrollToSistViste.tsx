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
        setSkalScrolleTil(true);
    });

    useEffect(() => {
        if (skalScrolleTil && !!sistVisteAktivitetId) {
            doScroll(sistVisteAktivitetId);
            setSkalScrolleTil(false);
        }
    }, [skalScrolleTil, sistVisteAktivitetId]);

    useEffect(() => {
        setSkalScrolleTil(true);
    }, [props.location, sistVisteAktivitetId]);

    return <>{props.children}</>;
};

export default withRouter(ScrollToSistViste);
