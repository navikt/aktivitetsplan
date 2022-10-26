import React, { ReactElement, useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';

import { selectSistVisteAktivitet } from '../../moduler/aktivitet/aktivitetview-reducer';

const ScrollToSistViste = (props: RouteProps): ReactElement<RouteComponentProps<any>> => {
    let sistVisteAktivitetId: string = useSelector<RootStateOrAny, string>(
        (state) => `aktivitetskort-` + selectSistVisteAktivitet(state)?.id
    );

    useEffect(() => {
        document.getElementById(sistVisteAktivitetId)?.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center',
        });
    }, [props.location, sistVisteAktivitetId]);

    return <>{props.children}</>;
};

export default withRouter(ScrollToSistViste);
