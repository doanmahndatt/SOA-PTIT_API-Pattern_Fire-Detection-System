import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div className={`notification ${type}`}>
            <div className="notification-content">
                <div className="notification-icon">
                    {type === 'success' && '✅'}
                    {type === 'warning' && '⚠️'}
                    {type === 'error' && '❌'}
                    {type === 'info' && 'ℹ️'}
                </div>
                <div className="notification-message">{message}</div>
                <button className="notification-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default Notification;