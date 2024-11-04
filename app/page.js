"use client"; // Ensure the component runs on the client side

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; // Assuming you create this CSS module

const Home = () => {
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();

  const handleSelectMod4 = () => {
    setShowOptions(true);
  };

  const handleRoute = (route) => {
    router.push(route);
  };

  return (
    <div className={styles.container}>
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
