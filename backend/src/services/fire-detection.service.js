export class FireDetectionService {

    processSensorData(normalizedData) {
        const { temperature, flameDetected } = normalizedData;

        console.log(`🔍 Processing sensor data - Temp: ${temperature}°C, Flame: ${flameDetected}`);

        // Logic từ code Arduino được chuyển sang JavaScript
        const warningCondition = (temperature >= 50 && temperature < 70) || flameDetected;
        const dangerCondition = temperature >= 70 && flameDetected;

        let systemStatus = 'normal';
        let alertLevel = 0;

        if (dangerCondition) {
            systemStatus = 'danger';
            alertLevel = 2;
            console.log('🚨 DANGER Condition detected!');
        } else if (warningCondition) {
            systemStatus = 'warning';
            alertLevel = 1;
            console.log('⚠️ WARNING Condition detected!');
        } else {
            console.log('✅ NORMAL Condition');
        }

        // Xác định trạng thái thiết bị
        const deviceStatus = this.calculateDeviceStatus(systemStatus, alertLevel);

        const processedData = {
            ...normalizedData,
            systemStatus,
            alertLevel,
            deviceStatus,
            warningCondition,
            dangerCondition,
            processedAt: new Date().toISOString()
        };

        console.log('✅ Processed fire detection data:', processedData);
        return processedData;
    }

    calculateDeviceStatus(systemStatus, alertLevel) {
        // Logic điều khiển thiết bị dựa trên code Arduino
        let deviceStatus;

        switch (systemStatus) {
            case 'danger':
                deviceStatus = {
                    led: true,
                    buzzer: true,
                    pump: true,
                    message: 'CẢNH BÁO NGUY HIỂM: Cháy đang xảy ra!'
                };
                break;
            case 'warning':
                deviceStatus = {
                    led: true,
                    buzzer: true,
                    pump: false,
                    message: 'CẢNH BÁO: Nguy cơ cháy!'
                };
                break;
            default:
                deviceStatus = {
                    led: false,
                    buzzer: false,
                    pump: false,
                    message: 'Hệ thống hoạt động bình thường'
                };
        }

        console.log(`🎛️ Device status for ${systemStatus}:`, deviceStatus);
        return deviceStatus;
    }
}