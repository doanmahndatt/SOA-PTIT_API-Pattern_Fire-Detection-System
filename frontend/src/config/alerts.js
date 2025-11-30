export const ALERT_MESSAGES = {
    // Trạng thái hệ thống
    NORMAL: {
        title: 'BÌNH THƯỜNG',
        message: 'Hệ thống hoạt động bình thường',
        type: 'success'
    },
    WARNING: {
        title: 'CẢNH BÁO',
        message: 'Phát hiện lửa trong khu vực',
        type: 'warning'
    },
    DANGER: {
        title: 'BÁO ĐỘNG',
        message: 'Nhiệt độ cao, phát hiện lửa',
        type: 'error'
    },

    // Điều khiển thiết bị
    BUZZER_OFF: {
        message: 'Đã tắt còi báo động',
        type: 'success'
    },
    PUMP_OFF: {
        message: 'Đã tắt bơm nước',
        type: 'success'
    },
    SYSTEM_REBOOT: {
        message: 'Đã khởi động lại hệ thống',
        type: 'info'
    },

    // Lỗi hệ thống
    CONNECTION_ERROR: {
        message: 'Mất kết nối đến server',
        type: 'error'
    },
    SENSOR_ERROR: {
        message: 'Lỗi kết nối cảm biến',
        type: 'error'
    }
};

export const getAlertMessage = (status, flameDetected) => {
    switch (status) {
        case 'danger':
            return ALERT_MESSAGES.DANGER;
        case 'warning':
            return flameDetected
                ? ALERT_MESSAGES.WARNING
                : { ...ALERT_MESSAGES.WARNING, message: 'Nhiệt độ cao' };
        default:
            return ALERT_MESSAGES.NORMAL;
    }
};