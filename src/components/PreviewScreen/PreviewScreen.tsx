import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import styles from './PreviewScreen.module.scss';
import TextareaAutosize from 'react-textarea-autosize';

interface PreviewScreenProps {
  setShowPreview: Dispatch<SetStateAction<boolean>>;
  arrVarNames: string[];
  elements: object[];
}

interface Values {
  [key: string]: string;
}

const PreviewScreen: FC<PreviewScreenProps> = ({ setShowPreview, arrVarNames, elements }) => {
  const [values, setValues] = useState<Values>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initialValues: Values = {};
    arrVarNames.forEach((name: string) => {
      initialValues[name] = '';
    });
    setValues(initialValues);
  }, [arrVarNames]);

  useEffect(() => {
    setMessage(extractValues(elements, values));
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>, keys: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [keys]: event.target.value,
    }));
  };

  const extractValues = (arr: any, val: Values) => {
    let result = '';
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      if (obj.type === 'tarea') {
        result += obj.value.replace(/\{(\w+)\}/g, (match: string, key: string) =>
          key in val ? val[key] : match
        );
      } else if (obj.type === 'ifelse') {
        let ifValue = obj.children.find((child: any) => child.name === 'If').value;
        ifValue = ifValue.replace(/\{(\w+)\}/g, (match: string, key: string) =>
          key in val ? val[key] : match
        );
        if (ifValue !== '' && val[ifValue] !== '') {
          let thenIndex = obj.children.findIndex((child: any) => child.name === 'Then');
          let elseIndex = obj.children.findIndex((child: any) => child.name === 'Else');
          result += extractValues(obj.children.slice(thenIndex, elseIndex), val);
        } else {
          let elseIndex = obj.children.findIndex((child: any) => child.name === 'Else');
          result += extractValues(obj.children.slice(elseIndex), val);
        }
      }
    }
    return result;
  };

  const Variables = (array: string[]) => (
    <div className={styles.var_container}>
      {array.map((el) => (
        <div key={el + 'key'}>
          <label htmlFor={el}>{el}</label>
          <TextareaAutosize
            id={el}
            placeholder={el}
            className={styles.var}
            rows={1}
            onChange={(event) => handleInputChange(event, el)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.PreviewScreen}>
      <h1 className={styles.Header}>Message Preview</h1>
      <TextareaAutosize
        id="message_preview"
        className={styles.message_preview}
        minRows={1}
        readOnly
        value={message}
      />
      {Variables(arrVarNames)}
      <button onClick={() => setShowPreview(false)}>Close</button>
    </div>
  );
};

export default PreviewScreen;