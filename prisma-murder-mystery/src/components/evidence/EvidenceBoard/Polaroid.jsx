import { memo } from 'react'
import styles from './EvidenceBoard.module.css'

const Polaroid = memo(({ sponsor, rotation = 0 }) => {
    return (
        <div
            className={styles.polaroid}
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            <div className={styles.pin} />

            <div className={styles.photoFrame}>
                {sponsor.logo ? (
                    <img src={sponsor.logo} alt={sponsor.name} className={styles.sponsorLogo} />
                ) : (
                    <div style={{ color: '#fff', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
                        NO IMAGE<br />FOUND
                    </div>
                )}
            </div>

            <div className={styles.handwrittenText}>
                <span className={styles.sponsorName}>{sponsor.name}</span>
                <span className={styles.codename}>{sponsor.codename}</span>
                <span className={styles.note}>“{sponsor.note}”</span>
            </div>
        </div>
    )
})

export default Polaroid
