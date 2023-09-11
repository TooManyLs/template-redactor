import React, { useState } from "react";
import "./App.css";
import MessageTemplateEditor from "./components/MessageTemplateEditor/MessageTemplateEditor";
import StartScreen from "./components/StartScreen/StartScreen";

function App() {


  const arrVarNames: string[] = localStorage.arrVarNames
  ? JSON.parse(localStorage.arrVarNames)
  : [
    "firstname",
    "lastname",
    "company",
    "position",
  ];
  const template: object[] = localStorage.template
    ? JSON.parse(localStorage.template)
    : null;

  const [showEditor, setShowEditor] = useState(false);

  return !showEditor ? (
    <StartScreen setShowEditor={setShowEditor} />
  ) : (
    <MessageTemplateEditor
      template={template}
      arrVarNames={arrVarNames}
      setShowEditor={setShowEditor}
      callbackSave={callbackSave}
    />
  );
}

export const callbackSave = async (t: object[]) => {
  localStorage.setItem("template", JSON.stringify(t));
};
export default App;
