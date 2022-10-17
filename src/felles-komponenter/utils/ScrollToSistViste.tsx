import React, { ReactElement, useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';

import { Aktivitet } from '../../datatypes/aktivitetTypes';

const ScrollToSistViste = (props: RouteProps): ReactElement<RouteComponentProps<any>> => {
    let sistVisteAktivitetId: string = useSelector<RootStateOrAny, string>(
        (state) =>
            `aktivitetskort-` +
            state?.view?.visteAktiviteterMedEndringer?.reduce((a: Aktivitet | null, b: Aktivitet) => b, null)?.id
    );

    console.log(useSelector((state) => state));

    useEffect(() => {
        console.log({ sistVisteAktivitetId });
        document.getElementById(sistVisteAktivitetId)?.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center',
        });
    }, [props.location, sistVisteAktivitetId]);

    return <>{props.children}</>;
};

export default withRouter(ScrollToSistViste);
