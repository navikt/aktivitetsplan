import React, { ReactElement, useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';

import { selectSistVisteAktivitet } from '../../moduler/aktivitet/aktivitetview-reducer';
import { useEventListener } from '../hooks/useEventListner';

function doScroll(id: string) {
    setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center',
        });
    }, 400);
}
const ScrollToSistViste = (props: RouteProps): ReactElement<RouteComponentProps<any>> => {
    let sistVisteAktivitetId: string = useSelector<RootStateOrAny, string>(
        (state) => `aktivitetskort-` + selectSistVisteAktivitet(state)?.id
    );

    useEventListener('veilarbpersonflatefs.tab-clicked', () => {
        doScroll(sistVisteAktivitetId);
    });

    useEffect(() => {
        doScroll(sistVisteAktivitetId);
    }, [props.location, sistVisteAktivitetId]);

    return <>{props.children}</>;
};

export default withRouter(ScrollToSistViste);
