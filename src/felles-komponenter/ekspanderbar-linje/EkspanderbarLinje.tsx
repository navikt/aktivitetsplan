import React, { useState } from 'react';

import EkspanderbarLinjeBase, { PropsBase } from './EkspanderbarLinjeBase';

type Props = Omit<PropsBase, 'onClick' | 'erAapen'>;

const EkspanderbarLinje = (props: Props) => {
    const [erAapen, setAapen] = useState(false);

    const toggle = () => {
        setAapen(!erAapen);
    };

    return <EkspanderbarLinjeBase {...props} onClick={toggle} erAapen={erAapen} />;
};

export default EkspanderbarLinje;
