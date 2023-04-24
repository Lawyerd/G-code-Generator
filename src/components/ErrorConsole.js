import "../css/ErrorConsole.css"

function ErrorConsole({ error }) {
    return (
        <pre className="error-console">
            <div className="error-message">
            {error}
            </div>
            
        </pre>
    );
}

export default ErrorConsole;
