import { Outlet } from 'react-router';
import OppfolgingStatus from './moduler/oppfolging-status/OppfolgingStatus';

export const BasePage = () => {
    return (
        <OppfolgingStatus>
            <Outlet />
        </OppfolgingStatus>
    );
};
