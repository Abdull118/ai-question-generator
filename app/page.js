"use client"; // Ensure the component runs on the client side

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; // Assuming you create this CSS module

const Home = () => {
  const [showMod4Options, setShowMod4Options] = useState(false);
  const [showMod5Options, setShowMod5Options] = useState(false);
  const [showOMMOptions, setShowOMMOptions] = useState(false);
  const [showPMPHOptions, setShowPMPHOptions] = useState(false);
  const [showPopup, setShowPopup] = useState(true); // State to show/hide the popup

  const [activeButton, setActiveButton] = useState(null); // Track active button
  const router = useRouter();

  const handleRoute = (route) => {
    router.push(route);
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleSelectMod4 = () => {
    setShowMod4Options(!showMod4Options);
    setShowMod5Options(false);
    setShowOMMOptions(false);
    setShowPMPHOptions(false);
  };
  const handleSelectMod5 = () => {
    setShowMod5Options(!showMod5Options);
    setShowMod4Options(false);
    setShowOMMOptions(false);
    setShowPMPHOptions(false);
  };
  const handleSelectOMM = () => {
    setShowOMMOptions(!showOMMOptions);
    setShowMod4Options(false);
    setShowMod5Options(false);
    setShowPMPHOptions(false);
  };
  const handleSelectPMPH = () => {
    setShowPMPHOptions(!showPMPHOptions);
    setShowMod4Options(false);
    setShowMod5Options(false);
    setShowOMMOptions(false);
  };

  const handleClearIncorrect = () => {
    localStorage.removeItem('incorrectQuestions'); // Clear the stored incorrect questions
    alert('Incorrect questions have been cleared!');
  };
  useEffect(() => {
      const storeIpAddressAndLecture = async () => {
        try {
          const ip = await getIp();
          const response = await fetch('/api/storeIp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip, lecture: "home page"}), // Include lecture number
          });
  
          if (!response.ok) {
            throw new Error('Failed to store IP address and lecture');
          }
        } catch (error) {
          console.error('Error storing IP address and lecture:', error);
        }
      };
  
      storeIpAddressAndLecture();
    
  }, []);

  const getIp = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return 'Unknown IP';
    }
  };

  return (
    <>
      <div className={styles.title}>
        Exam Questions App
      </div>
      <div className={styles.container}>
        <div
          onClick={() => {handleButtonClick('Mod4'), handleSelectMod4()}}
          className={`${styles.modButton} ${activeButton === 'Mod4' ? styles.activeButton : ''}`}
        >
          Mod 4
        </div>

        <div
          onClick={() => {handleButtonClick('Mod5'), handleSelectMod5()}}
          className={`${styles.modButton} ${activeButton === 'Mod5' ? styles.activeButton : ''}`}
        >
          Mod 5
        </div>
        {showMod4Options && (
          <div className={`${styles.optionsContainer} ${showMod4Options ? styles.show : ''}`}>
            <div onClick={() => handleRoute('/mod4/systemic-path')} className={styles.option}>
              Systemic Path
            </div>
            <div onClick={() => handleRoute('/mod4/mmi')} className={styles.option}>
              MMI
            </div>
            <div onClick={() => handleRoute('/mod4/cs')} className={styles.option}>
              CS
            </div>
            <div onClick={() => handleRoute('/mod4/pharm')} className={styles.option}>
              Pharm
            </div>
          </div>
        )}
        {showMod5Options && (
          <div className={`${styles.optionsContainer} ${showMod5Options ? styles.show : ''}`}>
            <div onClick={() => handleRoute('/mod5/systemic-path')} className={styles.option}>
              Systemic Path
            </div>
            <div onClick={() => handleRoute('/mod5/mmi')} className={styles.option}>
              MMI
            </div>
            <div onClick={() => handleRoute('/mod5/cs')} className={styles.option}>
              CS
            </div>
            <div onClick={() => handleRoute('/mod5/pharm')} className={styles.option}>
              Pharm
            </div>
          </div>
        )}
        <div
          onClick={() => {handleButtonClick('OMM'), handleSelectOMM()}}
          className={`${styles.modButton} ${activeButton === 'OMM' ? styles.activeButton : ''}`}
        >
          OMM
        </div>

        <div
          onClick={() => {handleButtonClick('PMPH'), handleSelectPMPH()}}
          className={`${styles.modButton} ${activeButton === 'PMPH' ? styles.activeButton : ''}`}
        >
          PMPH
        </div>

        {showOMMOptions && (
          <div className={`${styles.optionsContainer} ${showOMMOptions ? styles.show : ''}`}>
            <div onClick={() => handleRoute('/omm')} className={styles.option}>
              Exam 2
            </div>
          </div>
        )}
        {showPMPHOptions && (
          <div className={`${styles.optionsContainer} ${showPMPHOptions ? styles.show : ''}`}>
            <div onClick={() => handleRoute('/pmph')} className={styles.option}>
              Final Exam
            </div>
          </div>
        )}

        {/* Clear Incorrect Questions Button */}
        <button 
          onClick={handleClearIncorrect}
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Clear Incorrect Questions
        </button>
      </div>
    </>
  );
};

export default Home;
