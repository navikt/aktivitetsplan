import { useSelector } from 'react-redux';
import { selectFeatureData } from './feature-selector';
import { selectErBruker } from '../../moduler/identitet/identitet-selector';

export const VIS_NY_DIALOG = 'veilarbpersonflatefs.vis_ny_dialog';
export const VIS_NY_DIALOG_FOR_BRUKER = 'aktivitetsplan.ny_dialog';
export const ALL_FEATURES = [VIS_NY_DIALOG, VIS_NY_DIALOG_FOR_BRUKER];

export const harFeature = (name: string, features: { [key: string]: boolean }, reverse?: boolean) => {
    return features[name] === !reverse;
};

export const useHarFeature = (name: string, reverse?: boolean): boolean => {
    const features = useSelector(selectFeatureData);
    return harFeature(name, features, reverse);
};

export function harNyDialogToggel(features: { [key: string]: boolean }, bruker: boolean) {
    const visNyDialog = harFeature(VIS_NY_DIALOG, features);
    const visNyDialogForBruker = harFeature(VIS_NY_DIALOG_FOR_BRUKER, features);

    return (bruker && visNyDialogForBruker) || (!bruker && visNyDialog);
}

export function useHarNyDialog(): boolean {
    const features = useSelector(selectFeatureData);
    const bruker = useSelector(selectErBruker);

    return harNyDialogToggel(features, bruker);
}
