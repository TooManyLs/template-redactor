import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./MessageTemplateEditor.module.scss";
import VarSelector from "../VarSelector/VarSelector";
import { v4 as uuidV4 } from "uuid";
import TextareaAutosize from "react-textarea-autosize";
import PreviewScreen from "../PreviewScreen/PreviewScreen";

interface MessageTemplateEditorProps {
  arrVarNames: string[];
  template?: string;
  callbackSave: (t: any) => Promise<void>;
  setShowEditor: any;
}

const MessageTemplateEditor: FC<MessageTemplateEditorProps> = ({
  arrVarNames,
  template,
  callbackSave,
  setShowEditor,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const body = document.querySelector("body") as HTMLBodyElement;
  if (showPreview) {
    body.style.overflow = "hidden";
  } else {
    body.style.overflow = "auto";
  }

  const cursorPositionRef = useRef(0);
  const lastTextareaRef = useRef(0);
  const handlePositionChange = (event: KeyboardEvent | MouseEvent) => {
    const textarea = event.target as HTMLTextAreaElement;
    cursorPositionRef.current = textarea.selectionStart;
    const textareas = Array.from(document.querySelectorAll("textarea"));
    lastTextareaRef.current = textareas.indexOf(textarea);
  };
  const handleCursorPositionChange = (newCursorPosition: number) => {
    cursorPositionRef.current = newCursorPosition;
  };
  const showContent = (array: object[]) => {
    return array.map((el: any) => {
      if (el.name === "If") {
        return (
          <div key={uuidV4()}>
            <p>{el.name ? el.name.toUpperCase() : ""}</p>
            <button type="button" onClick={handleDelete}>
              delete
            </button>
            <TextareaAutosize
              name={el.name}
              className={el.className}
              id={el.id}
              rows={el.rows}
              defaultValue={el.value}
            />
          </div>
        );
      } else if (el.type === "tarea") {
        return (
          <div key={uuidV4()}>
            {el.name ? <p>{el.name.toUpperCase()}</p> : ""}
            <TextareaAutosize
              name={el.name}
              className={el.className}
              id={el.id}
              rows={el.rows}
              defaultValue={el.value}
            />
          </div>
        );
      } else {
        return (
          <div key={uuidV4()} className={styles.if_then_else}>
            {showContent(el.children)}
          </div>
        );
      }
    });
  };

  const [elements, setElements] = useState(
    localStorage.template
      ? JSON.parse(localStorage.template)
      : [
          {
            type: "tarea",
            name: "",
            id: "splitable",
            className: styles.defaultTextarea,
            rows: 1,
            value: "",
          },
        ]
  );

  useEffect(() => {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((tarea) => {
      tarea.addEventListener("keyup", handlePositionChange);
      tarea.addEventListener("mouseup", handlePositionChange);
    });
  });
  // func to shorten newElems[index].children[index]...
  const getShrankArray = (array: any, indices: number[]): object[] => {
    if (indices.length === 0) {
      return array;
    } else {
      const [index, ...rest] = indices;
      return getShrankArray(array[index].children, rest);
    }
  };
  // func to remember values
  const changeValues = (arr: any, values: string[], counter: number) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].type === "tarea") {
        arr[i].value = values[counter];
        counter++;
      } else if (arr[i].children) {
        counter = changeValues(arr[i].children, values, counter);
      }
    }
    return counter;
  };
  // func for ascending up DOM tree
  const getParent = (elem: any, levels: number) => {
    while (levels > 0) {
      elem = elem.parentElement;
      levels--;
    }
    return elem;
  };
  // func to get position of textarea that is being modified
  const recursePos = (elem: any, arr: number[], position: number) => {
    let idx = Array.from(getParent(elem, 2).children).indexOf(
      elem.parentElement
    );
    if (elem.parentElement.className === `${styles.if_then_else}`) {
      idx = Array.from(elem.parentElement.children).indexOf(elem);
      arr.unshift(idx);
      elem = elem.parentElement;
      let result = recursePos(elem, arr, position);
      arr = result.arr;
      position = result.position;
    } else if (getParent(elem, 2).className === `${styles.if_then_else}`) {
      idx = Array.from(getParent(elem, 2).children).indexOf(elem.parentElement);
      arr.unshift(idx);
      elem = getParent(elem, 2);
      let result = recursePos(elem, arr, position);
      arr = result.arr;
      position = result.position;
    } else {
      if (elem.nodeName === "DIV") {
        idx = Array.from(elem.parentElement.children).indexOf(elem);
      }
      arr.unshift(idx);
      position = arr.pop() as number;
    }
    return { arr, position };
  };
  // add ifthenelse
  const handleSplit = () => {
    let textareas = Array.from(document.querySelectorAll("textarea"));
    if (
      textareas[lastTextareaRef.current] &&
      textareas[lastTextareaRef.current].id === "splitable"
    ) {
      let textarea = textareas[lastTextareaRef.current] as HTMLTextAreaElement;
      const value = textarea.value;
      const className = textarea.className;
      const nameProp = textarea.name;

      const beforeCursor = value.slice(0, cursorPositionRef.current);
      const afterCursor = value.slice(cursorPositionRef.current);

      let newElems: object[] = [...elements];
      let treeArr: number[] = [];
      let pos = 0;

      preserveChanges();

      let result = recursePos(textarea, treeArr, pos);
      treeArr = result.arr;
      pos = result.position;

      const arrayToSplice = getShrankArray(newElems, treeArr);

      arrayToSplice.splice(
        pos,
        1,
        {
          type: "tarea",
          name: nameProp,
          id: "splitable",
          className: className,
          rows: 1,
          value: beforeCursor,
        },
        {
          type: "ifelse",
          children: [
            {
              type: "tarea",
              name: "If",
              id: "",
              className: "",
              rows: 1,
              value: "",
            },
            {
              type: "tarea",
              name: "Then",
              id: "splitable",
              className: "",
              rows: 1,
              value: "",
            },
            {
              type: "tarea",
              name: "Else",
              id: "splitable",
              className: "",
              rows: 1,
              value: "",
            },
          ],
        },
        {
          type: "tarea",
          name: "",
          id: "splitable",
          className: className,
          rows: 1,
          value: afterCursor,
        }
      );
      setElements(newElems);
    }
  };
  // delete ifthenelse
  const handleDelete = () => {
    const activeElement = document.activeElement as HTMLButtonElement;
    const tarea1 = getParent(activeElement, 2).previousElementSibling
      ?.lastChild as HTMLTextAreaElement;
    const tarea2 = getParent(activeElement, 2).nextElementSibling
      ?.lastChild as HTMLTextAreaElement;
    const mergedValue = tarea1.value + tarea2.value;

    let newElems: object[] = [...elements];
    let treeArr: number[] = [];
    let pos = 0;

    preserveChanges();

    let result = recursePos(tarea1, treeArr, pos);
    treeArr = result.arr;
    pos = result.position;

    const arrayToSplice = getShrankArray(newElems, treeArr);

    arrayToSplice.splice(pos, 3, {
      type: "tarea",
      name: tarea1.name,
      id: "splitable",
      className: tarea1.className,
      rows: 1,
      value: mergedValue,
    });
    setElements(newElems);
  };
  // saving changes in textareas
  const preserveChanges = () => {
    let newElems: object[] = [...elements];
    const textareas = Array.from(document.querySelectorAll("textarea"));
    const tValues: string[] = [];
    textareas.forEach((t) => {
      tValues.push(t.value);
    });
    tValues.pop();
    let tCount = 0;
    changeValues(newElems, tValues, tCount);
    setElements(newElems);
  };

  return (
    <div
      className={
        styles.MessageTemplateEditor + " " + (showPreview ? styles.overlay : "")
      }
    >
      {showPreview ? (
        <div className={styles.darken}>
          <PreviewScreen
            setShowPreview={setShowPreview}
            arrVarNames={arrVarNames}
            elements={elements}
          />
        </div>
      ) : null}
      <h1>Message template editor</h1>
      <VarSelector
        arrVarNames={arrVarNames}
        cursorPositionRef={cursorPositionRef}
        lastTextareaRef={lastTextareaRef}
        onCursorPositionChange={handleCursorPositionChange}
      />
      <button className={styles.addIfelse} type="button" onClick={handleSplit}>
        <strong>Click to add:</strong>
        <span>IF</span>[{"{some_variable}"} or expression]
        <span>THEN</span>[{"{then_value}"}]<span>ELSE</span>[{"{else_value}"}]
      </button>
      <form>{showContent(elements)}</form>
      <div className={styles.templateSubmit}>
        <button
          type="button"
          onClick={() => {
            preserveChanges();
            setShowPreview(true);
          }}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => {
            preserveChanges();
            callbackSave(elements);
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to close editor?\nTemplate will be deleted!"
              )
            ) {
              localStorage.removeItem("template");
              setShowEditor(false);
            }
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageTemplateEditor;