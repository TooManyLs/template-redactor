import React, { FC, MutableRefObject } from 'react';
import styles from './VarSelector.module.scss';
import { v4 as uuidV4 } from 'uuid';

interface VarSelectorProps {
  arrVarNames: string[]
  cursorPositionRef: MutableRefObject<number>
  lastTextareaRef: MutableRefObject<number>
  onCursorPositionChange: (newCursorPosition: number) => void
}

const VarSelector: FC<VarSelectorProps> = ({arrVarNames, cursorPositionRef, lastTextareaRef, onCursorPositionChange}) => {

  const addVar = (event: any) => {
    const insertVar = event.target.textContent;
    const textareas = Array.from(document.querySelectorAll('textarea'));
    const BeforeCursor = textareas[lastTextareaRef.current].value.substring(0, cursorPositionRef.current);
    const AfterCursor = textareas[lastTextareaRef.current].value.substring(cursorPositionRef.current);
    textareas[lastTextareaRef.current].value = BeforeCursor + insertVar + AfterCursor;
    const newCursorPosition = (cursorPositionRef.current + insertVar.length)
    textareas[lastTextareaRef.current].focus()
    textareas[lastTextareaRef.current].setSelectionRange(cursorPositionRef.current + insertVar.length, cursorPositionRef.current + insertVar.length)
    onCursorPositionChange(newCursorPosition);
  }

  return(
  <div className={styles.VarSelector}>
   {arrVarNames.map(el => <button className={'varButton'} key={uuidV4()} onClick={addVar}>{"{"+ el + "}"}</button>)}
  </div>
)}

export default VarSelector;
