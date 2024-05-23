"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import LeftSection from "@/components/LeftSection";
import RightSection from "@/components/RightSection";
import RightSections from "@/components/RightSections";
import Login from "@/components/Login";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className={styles.mainpage}>
          <div className={styles.leftOut}>
            <LeftSection />
          </div>
          <div className={styles.rightOut}>
            {/* <RightSection /> */}
            <RightSections />
          </div>
        </div>
      )}
    </div>
  );
}
