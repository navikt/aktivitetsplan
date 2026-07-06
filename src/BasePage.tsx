import { Outlet } from 'react-router-dom';
import OppfolgingStatus from './moduler/oppfolging-status/OppfolgingStatus';
import InternVmAlertStripe from './moduler/varslinger/InternVmAlertStripe';

export const BasePage = () => {
    return (
        <OppfolgingStatus>
            <InternVmAlertStripe />
            <Outlet />
        </OppfolgingStatus>
    );
};
