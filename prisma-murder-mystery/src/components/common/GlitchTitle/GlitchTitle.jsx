import React from 'react';
import styles from './GlitchTitle.module.css';

const GlitchTitle = ({ text = "PRISMA" }) => {
    return (
        <div className={styles.glitchContainer}>
            <div className={styles.noiseOverlay} />
            <div className={styles.scanlines} />

            <div className={styles.titleWrapper}>

                <span className={styles.baseLayer}>
                    {text}
                </span>
            </div>
        </div>
    );
};

export default GlitchTitle;
