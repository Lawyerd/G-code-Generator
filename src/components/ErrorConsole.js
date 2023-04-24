import "../css/ErrorConsole.css"

function ErrorConsole({ error }) {
    return (
        <pre className="error-console">
            {error}
        </pre>
    );
}

export default ErrorConsole;
