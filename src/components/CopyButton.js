import "../css/CopyButton.css"


function CopyButton() {
    function handleCopy() {
      const code = document.querySelector('pre').innerText;
      navigator.clipboard.writeText(code);
    }
  
    return (
      <button className="copy-button" onClick={handleCopy}>코드 복사</button>
    );
  }

export default CopyButton;
