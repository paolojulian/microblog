import React, { useEffect, useState } from 'react';
import { TextMock, RoundedMock } from '../widgets/wireframes';
import styles from './loader.module.css';

export const NotificationMock = () => (
    <div className={styles.notification}>
        <div className={styles.header}>
            <RoundedMock size="36px"/>
            <div className={styles.notificationTitle}>
                <TextMock/>
                <TextMock/>
            </div>
        </div>
    </div>
)

const NotificationLoading = () => {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let cancel = false;
        let timeout = setTimeout(() => {
            if ( ! cancel) {
                setMounted(true);
            }
        }, 0);
        return () => {
            clearTimeout(timeout);
            cancel = true;
        };
    }, [])

    return (
        <div style={{ visibility: mounted ? 'visible': 'hidden' }}>
            <div style={{ padding: '1rem' }}>
                <NotificationMock/>
                <NotificationMock/>
                <NotificationMock/>
            </div>
        </div>
    )
}

export default NotificationLoading;