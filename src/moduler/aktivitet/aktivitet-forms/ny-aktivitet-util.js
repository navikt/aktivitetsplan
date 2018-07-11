import { lagNyAktivitet } from '../aktivitet-actions';
import { aktivitetRoute } from '../../../routing';

export function nyAktivitetMedType(aktivitet, type, history) {
    return dispatch => {
        const nyAktivitet = {
            ...aktivitet,
            type,
        };

        const nyAktivitetPromise = dispatch(lagNyAktivitet(nyAktivitet));

        nyAktivitetPromise.then(action =>
            history.push(aktivitetRoute(action.data.id))
        );
    };
}

export default {};
