import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export interface RouteComponentProps {
    location: ReturnType<typeof useLocation>;
    params: Record<string, string>;
    navigate: ReturnType<typeof useNavigate>;
}

export const withRouter = <T extends RouteComponentProps>(Component: React.FC<T>) => {
    return (props: Omit<T, keyof RouteComponentProps>) => {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();

        return <Component {...(props as T)} router={{ location, navigate, params }} />;
    };
};
