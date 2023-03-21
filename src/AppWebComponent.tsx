import React from 'react';

const AppWebComponent = ({ fnr }: { fnr: string }) => {
    return React.createElement('dab-aktivitetsplan', {
        // eslint-disable-next-line
        ['data-fnr']: fnr,
    });
};

export default AppWebComponent;
