import React, { FC, MutableRefObject } from 'react';
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

  return (
    <div className={styles.VarSelector}>
      {arrVarNames.map((el) => (
        <button className={'varButton'} key={uuidV4()} onClick={addVar}>
          {'{' + el + '}'}
        </button>
      ))}
    </div>
  );
};

export default VarSelector;