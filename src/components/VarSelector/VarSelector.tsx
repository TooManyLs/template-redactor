import React, { FC, MutableRefObject, useState } from 'react';
import styles from './VarSelector.module.css';
import { v4 as uuidV4 } from 'uuid';

interface VarSelectorProps {
  arrVarNames: string[];
  cursorPositionRef: MutableRefObject<number>;
  lastTextareaRef: MutableRefObject<number>;
  onCursorPositionChange: (newCursorPosition: number) => void;
}

const VarSelector: FC<VarSelectorProps> = ({
  arrVarNames,
  cursorPositionRef,
  lastTextareaRef,
  onCursorPositionChange,
}) => {
  const [addNewVar, setaddNewVar] = useState(false)
  //func to insert variable into textarea at current position
  const addVar = (event: any) => {
    let lastArea = lastTextareaRef.current; 
    let currPos = cursorPositionRef.current;
    const insertVar = event.target.textContent;
    const textareas = Array.from(document.querySelectorAll('textarea'));
    //dividing value on cursor position and inserting value between
    const BeforeCursor = textareas[lastArea].value.substring(0, currPos);
    const AfterCursor = textareas[lastArea].value.substring(currPos);
    textareas[lastArea].value = BeforeCursor + insertVar + AfterCursor;
    //setting new cursor positon
    const newPos = currPos + insertVar.length;
    textareas[lastArea].focus();
    textareas[lastArea].setSelectionRange(newPos, newPos);
    onCursorPositionChange(newPos);
  };

  const addVarName = (event:any) => {
    let inputText
    if(event.target.localName === 'button') {
      inputText = event.target.previousSibling.value;
    } else {
      inputText = event.target.value;
    }
    const newNames = inputText.split(' ')
    if (newNames) {
      newNames.filter((str: any, index: number) => str !== "" && !arrVarNames.includes(str) && newNames.indexOf(str) === index).forEach((el: string) => arrVarNames.push(el))
    }
  }

  const remVarName = (event: any) => {
    const toRemove = event.target.textContent.replace(/{|}/g, "")
    const idx = arrVarNames.indexOf(toRemove)
    arrVarNames.splice(idx, 1)
    setaddNewVar(false)
    setTimeout(() => {
      setaddNewVar(true) 
    }, 1);
  }

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={styles.VarSelector}>
      {arrVarNames.map((el) => (
        <button className={/*'varButton' + ' ' + */(addNewVar ? styles.removeMode : '')} key={uuidV4()} onClick={addNewVar ? remVarName : addVar}>
          {'{' + el + '}'}
        </button>
      ))}
      <div className={styles.addVar}>
        {addNewVar ? 
        <input 
          ref={inputRef}
          type="text" 
          className={styles.newVarInput}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              addVarName(event);
              setaddNewVar(false);
            }
          }}
        />
        : null}
        <button 
          className={styles.addButton + ' ' + (addNewVar ? styles.buttonDisplace : '')} 
          onClick={(e) => !addNewVar ? 
          (setaddNewVar(true),
          setTimeout(() => {
            return inputRef.current ? inputRef.current.focus() : null
          }, 1)) 
          : (addVarName(e), setaddNewVar(false))}
        >
          +
        </button>
      </div>
      
    </div>
  );
};

export default VarSelector;