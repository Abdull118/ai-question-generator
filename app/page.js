"use client"; // Ensure the component runs on the client side

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css"; // Assuming you create this CSS module
import CongratulationsModal from './components/CongratulationsModal';
import './globals.css';


const Home = () => {
  const [showFallSemesterOptions, setShowFallSemesterOptions] = useState(false);
  const [showSpringSemesterOptions, setShowSpringSemesterOptions] = useState(false);
  const [showMod4Options, setShowMod4Options] = useState(false);
  const [showMod5Options, setShowMod5Options] = useState(false);
  const [showMod6Options, setShowMod6Options] = useState(false);
  const [showMod7Options, setShowMod7Options] = useState(false);
  const [showOMMOptions, setShowOMMOptions] = useState(false);
  const [showPMPHOptions, setShowPMPHOptions] = useState(false);
  const [activeButton, setActiveButton] = useState(null); // Track active button
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const handleRoute = (route) => {
    router.push(route);
  };

  const toggleFallSemesterOptions = () => {
    setShowFallSemesterOptions(!showFallSemesterOptions);
    setShowMod4Options(false);
    setShowMod5Options(false);
    setShowOMMOptions(false);
    setShowPMPHOptions(false);
  };

  const toggleSpringSemesterOptions = () => {
    setShowSpringSemesterOptions(!showSpringSemesterOptions);
    setShowMod4Options(false);
    setShowMod5Options(false);
    setShowOMMOptions(false);
    setShowPMPHOptions(false);
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
  const handleSelectMod6 = () => {
    setShowMod6Options(!showMod6Options);
    setShowMod7Options(false);
    setShowFallSemesterOptions(false);
  };
  const handleSelectMod7 = () => {
    setShowMod7Options(!showMod7Options);
    setShowMod6Options(false);
    setShowFallSemesterOptions(false);
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

  useEffect(() => {
    const storeIpAddressAndLecture = async () => {
      try {
        const ip = await getIp();
        const response = await fetch("/api/storeIp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ip, lecture: "home page" }),
        });

        if (!response.ok) {
          throw new Error("Failed to store IP address and lecture");
        }
      } catch (error) {
        console.error("Error storing IP address and lecture:", error);
      }
    };

    storeIpAddressAndLecture();
  }, []);

  const getIp = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return "Unknown IP";
    }
  };

  // useEffect(() => {
  //   const hasSeenModal = localStorage.getItem("hasSeenUpdateModal");
  //   if (!hasSeenModal) {
  //     setShowModal(true);
  //   }
  // }, []);

  // const closeModal = () => {
  //   setShowModal(false);
  //   localStorage.setItem("hasSeenUpdateModal", "true");
  // };

  const [showMedSchoolCongrats, setShowMedSchoolCongrats] = useState(false);

  // Auto-show the modal when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMedSchoolCongrats(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    {/* {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>New Updates</h2> 
            </div>
            <div className={styles.modalBody}>
              <ul>
                <li>You no longer have to wait for questions to be added for each lecture.</li>
                <li>Whenever you see the button below, you can tap it to have ChatGPT generate questions for you.</li>
                <img src="/images/chatGPTButton.png" />
                <li>If you finish a set of questions, you will also be able to generate additional ones.</li>
                <li>Most lectures have 5 questions added already as a head start.</li>
                <li>Fixed the issue with the homescreen version of the app where you couldn't answer questions and kept getting them wrong when they weren't.</li>
                <div className={styles.goodluck}>Goodluck & Happy Studying :{')'}</div>
              </ul>
              <button className={styles.modalCloseButton} onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )} */}

    

      <div className={styles.title}>Exam Questions App</div>

      <div className={styles.container}>
        <div
          onClick={toggleFallSemesterOptions}
          className={`${styles.modButton} ${
            showFallSemesterOptions ? styles.activeButton : ""
          }`}
        >
          Fall Semester
        </div>
       

        {showFallSemesterOptions && (
          <div className={styles.nestedContainer}>
            <div className={styles.row1}>
              <div
                onClick={handleSelectMod4}
                className={`${styles.modButton} ${
                  showMod4Options ? styles.activeButton : ""
                }`}
              >
                Mod 4
              </div>
              <div
                onClick={handleSelectMod5}
                className={`${styles.modButton} ${
                  showMod5Options ? styles.activeButton : ""
                }`}
              >
                Mod 5
              </div>
            </div>
            {showMod4Options && (
              <div className={styles.optionsContainer}>
                <div
                  onClick={() => handleRoute("fallSemester/mod4/systemic-path")}
                  className={styles.option}
                >
                  Systemic Path
                </div>
                <div
                  onClick={() => handleRoute("fallSemester/mod4/mmi")}
                  className={styles.option}
                >
                  MMI
                </div>
                <div
                  onClick={() => handleRoute("fallSemester/mod4/cs")}
                  className={styles.option}
                >
                  CS
                </div>
                <div
                  onClick={() => handleRoute("fallSemester/mod4/pharm")}
                  className={styles.option}
                >
                  Pharm
                </div>
              </div>
            )}

            {showMod5Options && (
              <div className={styles.optionsContainer}>
                <div
                  onClick={() => handleRoute("fallSemester/mod5/systemic-path")}
                  className={styles.option}
                >
                  Systemic Path
                </div>
                <div
                  onClick={() => handleRoute("fallSemester/mod5/mmi")}
                  className={styles.option}
                >
                  MMI
                </div>
                <div
                  onClick={() => handleRoute("fallSemester/mod5/cs")}
                  className={styles.option}
                >
                  CS
                </div>
                <div
                  onClick={() => handleRoute("fallSemester/mod5/pharm")}
                  className={styles.option}
                >
                  Pharm
                </div>
              </div>
            )}

            <div className={styles.row1}>
              <div
                onClick={handleSelectOMM}
                className={`${styles.modButton} ${
                  showOMMOptions ? styles.activeButton : ""
                }`}
              >
                OMM
              </div>
              <div
                onClick={handleSelectPMPH}
                className={`${styles.modButton} ${
                  showPMPHOptions ? styles.activeButton : ""
                }`}
              >
                PMPH
              </div>
            </div>
            {showOMMOptions && (
              <div className={styles.optionsContainer}>
                <div
                  onClick={() => handleRoute("fallSemester/omm")}
                  className={styles.option}
                >
                  Exam 2
                </div>
              </div>
            )}

            {showPMPHOptions && (
              <div className={styles.optionsContainer}>
                <div
                  onClick={() => handleRoute("fallSemester/pmph")}
                  className={styles.option}
                >
                  Final Exam
                </div>
              </div>
            )}
          </div>
        )}

<div
          onClick={toggleSpringSemesterOptions}
          className={`${styles.modButton} ${
            showSpringSemesterOptions ? styles.activeButton : ""
          }`}
        >
          Spring Semester
        </div>

        {showSpringSemesterOptions &&(
          <div className={styles.nestedContainer}>
              <div className={styles.row1}>
              <div
                onClick={handleSelectMod6}
                className={`${styles.modButton} ${
                  showMod6Options ? styles.activeButton : ""
                }`}
              >
                Mod 6
              </div>
              <div
                onClick={handleSelectMod7}
                className={`${styles.modButton} ${
                  showMod7Options ? styles.activeButton : ""
                }`}
              >
                Mod 7
              </div>

              
                </div>

                {showMod6Options && (
              <div className={styles.optionsContainer}>
                <div
                  onClick={() => handleRoute("springSemester/mod6/systemic-path")}
                  className={styles.option}
                >
                  Systemic Path
                </div>
                <div
                  onClick={() => handleRoute("springSemester/mod6/mmi")}
                  className={styles.option}
                >
                  MMI
                </div>
                <div
                  onClick={() => handleRoute("springSemester/mod6/cs")}
                  className={styles.option}
                >
                  CS
                </div>
                {/* <div
                  onClick={() => handleRoute("springSemester/mod6/pharm")}
                  className={styles.option}
                >
                  Pharm
                </div> */}
              </div>
            )}
                {showMod7Options && (
              <div className={styles.optionsContainer}>
                <div
                  onClick={() => handleRoute("springSemester/mod7/systemic-path")}
                  className={styles.option}
                >
                  Systemic Path
                </div>
                <div
                  onClick={() => handleRoute("springSemester/mod7/mmi")}
                  className={styles.option}
                >
                  MMI
                </div>
                <div
                  onClick={() => handleRoute("springSemester/mod7/cs")}
                  className={styles.option}
                >
                  CS
                </div>
                {/* <div
                  onClick={() => handleRoute("springSemester/mod7/pharm")}
                  className={styles.option}
                >
                  Pharm
                </div> */}
              </div>
            )}

            </div>
        )}

    {!showMedSchoolCongrats && (
        <button
        onClick={() => setShowMedSchoolCongrats(true)}
        className="show-modal-button"
      >
        Show Message
      </button>
      )}
      <CongratulationsModal isOpen={showMedSchoolCongrats} onClose={() => setShowMedSchoolCongrats(false)} />
      </div>
    </>
  );
};

export default Home;
