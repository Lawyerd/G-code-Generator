import "../css/CodeConsole.css"
import CopyButton from "./CopyButton"

function CodeConsole({code}) {
    return (
        <div className="code-console">
        <CopyButton />
        <pre className="code">{code}</pre>
      </div>
    );
  }

export default CodeConsole;
