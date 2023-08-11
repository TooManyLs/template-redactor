import React, { FC } from 'react';
import styles from './StartScreen.module.scss';

interface StartScreenProps {
  setShowEditor: any
}

const StartScreen: FC<StartScreenProps> = ({setShowEditor}) => {

  return(
  <div className={styles.StartScreen}>
    <button onClick={() => setShowEditor(true)}>Message Editor</button>
  </div>
  )
};

export default StartScreen;
