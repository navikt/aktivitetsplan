import OppfolgingStatus from './moduler/oppfolging-status/OppfolgingStatus';
import { Outlet } from 'react-router-dom';

export const BasePage = () => {
    return (
        <OppfolgingStatus>
            <Outlet />
        </OppfolgingStatus>
    );
};
