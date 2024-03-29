import { Resolver, ResolverResult } from 'react-hook-form';
import { ResolverOptions } from 'react-hook-form/dist/types/resolvers';

export function avtaltResolver<FormValues extends object>(
    avtalt: boolean,
    validatedFields: (keyof FormValues)[],
    resolver: Resolver<FormValues>
) {
    return async (
        values: FormValues,
        context: any,
        options: ResolverOptions<FormValues>
    ): Promise<ResolverResult<FormValues>> => {
        const result = await resolver(values, context, options);
        if (!avtalt) return result;

        const newErrors = Object.entries(result.errors)
            .filter(([fieldKey, _]) => validatedFields.includes(fieldKey as keyof FormValues))
            .reduce((values, [key, val]) => ({ ...values, [key]: val }), {});
        const newValues = Object.keys(newErrors).length > 0 ? {} : values;

        return {
            values: newValues,
            errors: newErrors,
        };
    };
}
