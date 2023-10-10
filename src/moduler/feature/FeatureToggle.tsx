import React, { ReactNode } from 'react';

// import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
// import { useErVeileder } from '../../Provider';
// import { hentFeatures } from './feature-slice';

const FeatureToggle = ({ children }: { children: ReactNode }) => {
    // const dispatch = useAppDispatch();
    // const erVeileder = useErVeileder();

    // useEffect(() => {
    // NB: Vi har foreløpig feature toggles som kun påvirker veiledere
    // Dispatcher kun for veiledere for å unngå unødvendig kall for bruker
    // if (erVeileder) {
    // NB: Vi har foreløpig ingen toggles, utkommenter når vi trenger toggles
    // dispatch(hentFeatures());
    // }
    // }, []);

    return <>{children}</>;
};

export default FeatureToggle;
