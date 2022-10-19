import React, { ReactElement, useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';

import { selectSistVisteAktivitet } from '../../moduler/aktivitet/aktivitetview-reducer';

function doScroll(id: string) {
    document.getElementById(id)?.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center',
    });
}

const ScrollToSistViste = (props: RouteProps): ReactElement<RouteComponentProps<any>> => {
    console.log('Rendrer ScrollToSistViste');
    let sistVisteAktivitetId: string = useSelector<RootStateOrAny, string>(
        (state) => `aktivitetskort-` + selectSistVisteAktivitet(state)?.id
    );

    useEffect(() => {
        console.log('ScrollToSistViste props.location er endret - scroller til element med Id ', sistVisteAktivitetId);
        doScroll(sistVisteAktivitetId);
    }, [props.location]);

    return <>{props.children}</>;
};

export default withRouter(ScrollToSistViste);
