"use client"; // Ensure the component runs on the client side

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; // Assuming you create this CSS module

const Home = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for view status
    const hasViewed = localStorage.getItem('newQuestionsViewed');
    if (!hasViewed) {
      setShowBanner(true);
    }
  }, []);

  const handleRoute = (route) => {
    // Set view status in localStorage
    localStorage.setItem('newQuestionsViewed', 'true');
    setShowBanner(false);
    router.push(route);
  };

  const handleSelectMod4 = () => {
    setShowOptions(true);
  };

  return (
    <div className={styles.container}>
      {showBanner && (
        <div className={styles.banner}>
          New questions added!
        </div>
      )}
      <div onClick={handleSelectMod4} className={styles.modButton}>
        Mod 4
      </div>

      {showOptions && (
        <div className={styles.optionsContainer}>
          <div onClick={() => handleRoute('/systemic-path')} className={styles.option}>
            Systemic Path
          </div>
          <div onClick={() => handleRoute('/mmi')} className={styles.option}>
            MMI
          </div>
          <div onClick={() => handleRoute('/cs')} className={styles.option}>
            CS
          </div>
          {/* <div onClick={() => handleRoute('/pharm')} className={styles.option}>
            Pharm
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Home;
