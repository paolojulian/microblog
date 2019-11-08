import React from 'react';
import styles from './loading-mocks.module.css';

export const TextInputMock = (props) => (
    <input
        style={{
            height: '0.9rem',
            marginBottom: '0.5rem',
            borderRadius: '5px',
            padding: '0.75rem',
            width: '100%',
            border: '1px solid rgba(0, 0, 0, 0.25)'
        }}
        className={styles.mock}
        type="text"
        disabled
        {...props}
    />
)

export const TextMock = () => {
    let width = Math.random() * 50 + 50 + '%';
    return (
        <div style={{
            backgroundColor: 'var(--grey-dark)',
            height: '1rem',
            marginBottom: '0.5rem',
            borderRadius: '10px',
            width
        }}
        className={styles.mock}></div>
    )
}

export const RoundedMock = ({ size }) => (
    <div style={{
        backgroundColor: 'var(--black-disabled)',
        width: size,
        height: size,
        marginRight: '0.5rem',
        borderRadius: '50%',
    }}
    className={styles.mockRounded}></div>
)

export const CardMock = ({ height, children, ...props }) => (
    <div style={{
        backgroundColor: 'var(--grey)',
        borderRadius: '5px',
        height,
        width: '100%',
    }}
        className={styles.mock}
        {...props}>
        {children}
    </div>
)