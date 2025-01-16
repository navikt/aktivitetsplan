interface GraphqlError {
    message: string;
}

export interface GraphqlResponse<T> {
    data: T;
    errors?: GraphqlError[];
}

export const sjekkGraphqlFeil = <T>(response: GraphqlResponse<T>): Promise<GraphqlResponse<T>> => {
    if ((response?.errors?.length || 0) != 0) {
        return Promise.reject('Kunne ikke hente aktiviteter');
    }
    return Promise.resolve(response);
};
