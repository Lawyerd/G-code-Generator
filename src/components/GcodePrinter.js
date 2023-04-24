import React, { useState } from 'react';
import CustomInput from './CustomInput';
import CodeConsole from './CodeConsole';
import ErrorConsole from './ErrorConsole';
import CustomCheckbox from './CustomCheckbox';
import "../css/GcodePrinter.css"

function GcodePrinter() {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(-100);
  const [cutAmountStart, setCutAmountStart] = useState(-1);
  const [cutAmountEnd, setCutAmountEnd] = useState(-1);
  const [cutAmountPoint, setCutAmountPoint] = useState(1);
  const [margin, setMargin] = useState(1);
  const [outpoint, setOutpoint] = useState(50);
  const [gcode, setGcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  function handleCheckboxChange(event) {
    setIsChecked(event.target.checked);
    if (event.target.checked === true) {
      // setCutAmountEnd(cutAmountStart);
      // setCutAmountPoint(1);
    } else {
      setCutAmountEnd(cutAmountStart);
      setCutAmountPoint(1);
    }

  }

  function printGcode(start, end, isVariableCut, cutAmountStart, cutAmountEnd, cutAmountPoint, margin, outpoint) {
    let progress = 0;
    const startPoint = start;
    let isArrived = false;
    let cutAmount = cutAmountStart;
    if(!isVariableCut){
      cutAmountEnd = cutAmountStart;
    }
    let gcode = `G0Z${addDecimal(outpoint)}\n`;
    while (start + cutAmountEnd >= end) {
      gcode += `Z${addDecimal(roundToTwo(start + margin))}\n`;
      gcode += `G1W${addDecimal(roundToTwo(cutAmount - margin))}\n`;
      gcode += `G0Z${addDecimal(outpoint)}\n`;
      progress = 1 - ((Math.abs(end) - Math.abs(start)) / ((Math.abs(end) - Math.abs(startPoint))));
      start += cutAmount;
      if (progress < cutAmountPoint) {
        cutAmount = cutAmountStart + (cutAmountEnd - cutAmountStart) * (progress / cutAmountPoint);
      } else {
        cutAmount = cutAmountEnd;
      }
      // gcode += `cut Amount: ${cutAmount.toFixed(2)}\n`;
      if (start === end) {
        isArrived = true;
      }
    }
    if (!isArrived) {
      gcode += `Z${addDecimal(roundToTwo(end - cutAmount + margin))}\n`;
      gcode += `G1Z${addDecimal(roundToTwo(end))}\n`;
      gcode += `G0Z${addDecimal(outpoint)}\n`;
    }
    return gcode;
  }

  function roundToTwo(num) {
    return Math.round(num * 100) / 100;
  }

  function addDecimal(num) {
    if (!/\./.test(num)) {
      num += ".";
    }
    return num;
  }

  function inputIsValid(start, end, cutAmountStart, cutAmountEnd, cutAmountPoint, margin, outpoint) {
    let isValid = true;
    let errorMessage = "";
    if (start > 0) {
      errorMessage += "[가공 시작 깊이]는 음수만 설정 가능합니다.\n";
      isValid = false;
    }
    if (start > 0) {
      errorMessage += "[가공 최종 깊이]는 음수만 설정 가능합니다.\n";
      isValid = false;
    }
    if (start < end) {
      errorMessage += "[가공 시작 깊이]는 [가공 최종 깊이]보다 얕아야 합니다.\n";
      isValid = false;
    }
    if (cutAmountStart >= 0) {
      errorMessage += "[절삭량] 혹은 [최초 절삭량]는 음수만 설정 가능합니다.\n";
      isValid = false;
    }
    if (cutAmountEnd >= 0) {
      errorMessage += "[최종 절삭량]는 음수만 설정 가능합니다.\n";
      isValid = false;
    }
    if (cutAmountPoint > 1 || cutAmountPoint < 0) {
      errorMessage += "[절삭량 변화 한계점]은 0 이상 1이하의 값만 설정 가능합니다.\n";
      isValid = false;
    }
    if (margin < 0) {
      errorMessage += "[가공 여유]값은 양수만 설정 가능합니다. \n";
      isValid = false;

    }
    if (outpoint <= start) {
      errorMessage += "[후퇴 좌표]값은 [가공 시작 깊이]값보다 커야합니다.\n";
      isValid = false;
    }
    return [isValid, errorMessage];
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    let [isValid, error] = inputIsValid(parseFloat(start),
      parseFloat(end),
      parseFloat(cutAmountStart),
      parseFloat(cutAmountEnd),
      parseFloat(cutAmountPoint),
      parseFloat(margin),
      parseFloat(outpoint));
    setErrorMessage(error)
    console.log(error)

    if (isValid) {
      const calculatedGcode = printGcode(
        parseFloat(start),
        parseFloat(end),
        isChecked,
        parseFloat(cutAmountStart),
        parseFloat(cutAmountEnd),
        parseFloat(cutAmountPoint),
        parseFloat(margin),
        parseFloat(outpoint)
      );
      setGcode(calculatedGcode);
    }
  };

  return (
    <div>
      <div className='container'>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-body">
            <div className='input-items'>
              <div className="input-item">
                <div className='label-class'>
                  <label htmlFor="start-input" title="G01로 진입할 Z 좌표를 입력">가공 시작 깊이</label></div>
                <CustomInput id="start-input" type="number" value={start} onChange={(event) => setStart(event.target.value)} />
              </div>
              <div className="input-item">
                <div className='label-class'>

                  <label htmlFor="end-input" title="G01로 가공할 최종 깊이의 Z좌표를 입력">가공 최종 깊이</label>
                </div>
                <CustomInput id="end-input" type="number" value={end} onChange={(event) => setEnd(event.target.value)} />

              </div><div className="input-item">
                <div className='label-class'>

                  <label htmlFor="margin-input" title="매 가공 사이클 마다 해당 값 만큼 여유를 두고 진입을 시작">가공 여유</label>
                </div>
                <CustomInput id="margin-input" type="number" value={margin} onChange={(event) => setMargin(event.target.value)} />
              </div>
              <div className="input-item">
                <div className='label-class'>
                  <label htmlFor="outpoint-input" title="가공 사이클 한 번이 끝났을 때 복귀하는 지점의 Z 좌표를 입력">후퇴 좌표</label>
                </div>
                <CustomInput id="outpoint-input" type="number" value={outpoint} onChange={(event) => setOutpoint(event.target.value)} />
              </div>
            </div>
            <div className='divider'></div>
            <div className='input-items'>
              <div className="input-item">
                <div className='label-class'>
                  <label title="가공이 진행됨에 따라 절삭량의 변화를 줄 것인지에 대한 여부, 만약 사용하지 않는다면 최초 절삭량으로 끝까지 가공">
                    가변 절삭량 사용
                  </label>
                </div>
                <CustomCheckbox checked={isChecked} onChange={handleCheckboxChange} />
              </div>
              <div className="input-item">
                <div className='label-class'>

                  <label htmlFor="cutAmountStart-input" title="가공 시작시의 절삭량">{isChecked?"최초 절삭량":"절삭량"}</label>
                </div>
                <CustomInput id="cutAmountStart-input" type="number" value={cutAmountStart} onChange={(event) => setCutAmountStart(event.target.value)} />
              </div>
              <div className="input-item">
                <div className='label-class'>

                  <label htmlFor="cutAmountEnd-input"  title="가공 종료시의 절삭량, 가공이 진행됨에 따라 [최초 절삭량]에서 [최종 절삭량]으로 변화함">최종 절삭량</label>
                </div>
                <CustomInput id="cutAmountEnd-input" type="number" value={cutAmountEnd} disabled={!isChecked} onChange={(event) => setCutAmountEnd(event.target.value)} />
              </div>
              <div className="input-item">
                <div className='label-class'>

                  <label htmlFor="cutAmountPoint-input"  title="가공 절삭량의 변화가 어디서 종결될지 결정, 예를 들어 0.3을 입력하면 가공이 시작된 후 30% 지점에서 [최종 절삭량]으로 도달 (1을 입력할 시, 절삭량은 가공이 종료될 때까지 변화함)">절삭량 변화 한계점</label>
                </div>
                <CustomInput id="cutAmountPoint-input" type="number" value={cutAmountPoint} disabled={!isChecked} onChange={(event) => setCutAmountPoint(event.target.value)} />
              </div>
            </div>
          </div>
          <div className='button-container'>
            <button type="submit" className='submit-button'>G코드 생성</button>
          </div>
        </div>
      </form>

      <ErrorConsole error={errorMessage}></ErrorConsole>
      </div>
      <CodeConsole code={gcode}/>
    </div>
  );
}

export default GcodePrinter;