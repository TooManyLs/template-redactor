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

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: event.target.value,
    }));
  };
  //func to replace variables with their values, solve if-then-else logic 
  //and return string with message.
  const extractValues = (arr: any, val: Values) => {
    let result = '';
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      if (obj.type === 'tarea') {
        result += obj.value.replace(/\{(\w+)\}/g, (match: string, key: string) => //Replace any occurrences of {key} in the value property of the object
          key in val ? val[key] : match                                           //with the corresponding value from the val object, if such key exists
        );
      } else if (obj.type === 'ifelse') {
        let ifValue = obj.children.find((child: any) => child.name === 'If').value;
        ifValue = ifValue.replace(/\{(\w+)\}/g, (match: string, key: string) =>
          key in val ? val[key] : match
        );
        let elseIndex = obj.children.findIndex((child: any) => child.name === 'Else');
        if (ifValue !== '' && val[ifValue] !== '') {
          result += extractValues(obj.children.slice(1, elseIndex), val); // Extract values until object with name 'Else'
        } else {
          result += extractValues(obj.children.slice(elseIndex), val); // Extract values starting from object with name 'Else'
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