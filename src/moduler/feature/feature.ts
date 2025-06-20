import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { useEffect } from 'react';
import { hentFeatures } from './feature-slice';
import { useSelector } from 'react-redux';
import { selectFeatureSlice } from './feature-selector';
import { Status } from '../../createGenericSlice';

const ALL_TOGGLES = ['aktivitetsplan.tryggtekst', 'aktivitetsplan.journalforing'] as const;

export type Feature = (typeof ALL_TOGGLES)[number];
export type Features = Record<Feature, boolean>;

export const toggles = ALL_TOGGLES.map((element: Feature) => 'feature=' + element).join('&');

export const useToggle = (feature: Feature) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(hentFeatures());
    }, []);

    const { status, data } = useSelector(selectFeatureSlice);
    return status === Status.OK && data && data[feature];
};
