import { BodyLong, Heading } from '@navikt/ds-react';
import React from 'react';

interface Props {}
interface State {
    hasError: boolean;
    errorMessage?: string;
}
class ErrorBoundry extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, errorMessage: undefined };
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, errorMessage: error };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="space-y-8 mt-8">
                    <Heading size="medium">Noe gikk galt</Heading>
                    <BodyLong>{this.state.errorMessage?.toString()}</BodyLong>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundry;
