import React, { ReactElement, useEffect } from 'react';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';

const ScrollToFocused = (props: RouteProps): ReactElement<RouteComponentProps<any>> => {
    useEffect(
        () =>
            document.activeElement?.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'center',
            }),
        [props.location]
    );

    return <>{props.children}</>;
};

export default withRouter(ScrollToFocused);
