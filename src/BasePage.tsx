import { Outlet } from 'react-router-dom';
import OppfolgingStatus from './moduler/oppfolging-status/OppfolgingStatus';

export const BasePage = () => {
    return (
        <OppfolgingStatus>
            <Outlet />
        </OppfolgingStatus>
    );
};
