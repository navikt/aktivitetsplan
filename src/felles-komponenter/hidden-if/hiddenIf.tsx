import React, { ReactElement } from 'react';

export default function hiddenIfHOC<Props>(
    Component: (props: Props) => ReactElement<Props>
): (props: Props & { hidden?: boolean }) => React.ReactElement | null {
    return (props: Props & { hidden?: boolean }): ReactElement | null => {
        if (props.hidden) return null;
        return <Component {...props} />;
    };
}
