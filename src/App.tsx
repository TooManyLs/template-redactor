import React, { useState } from 'react';
import './App.scss';
import MessageTemplateEditor from './components/MessageTemplateEditor/MessageTemplateEditor';
import StartScreen from './components/StartScreen/StartScreen';

function App() {

  const arrVarNames: string[] = ["firstname", "lastname", "company", "position"]
  const template: string = "buba"

  const [showEditor, setShowEditor] = useState(false)
 
  return (
  // <MessageTemplateEditor template={template} arrVarNames={arrVarNames} />
  !showEditor ? <StartScreen setShowEditor={setShowEditor} /> : <MessageTemplateEditor template={template} arrVarNames={arrVarNames} setShowEditor={setShowEditor} callbackSave={callbackSave} />
    // <StartScreen template={template} arrVarNames={arrVarNames} />
  );
}

export const callbackSave = async (t: any) => {
  localStorage.setItem('template', JSON.stringify(t));
  console.log('Data saved to localStorage');
};

export default App;