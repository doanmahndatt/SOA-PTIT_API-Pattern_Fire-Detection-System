export class DataController {
    constructor(db) {
        this.db = db;
        this.initDatabase();
    }

    initDatabase() {
        // Tạo bảng sensor_data
        this.db.run(`
            CREATE TABLE IF NOT EXISTS sensor_data (
                                                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                       timestamp TEXT NOT NULL,
                                                       temperature REAL NOT NULL,
                                                       humidity REAL NOT NULL,
                                                       flame_detected BOOLEAN NOT NULL,
                                                       system_status TEXT NOT NULL,
                                                       alert_level INTEGER NOT NULL,
                                                       device_status TEXT NOT NULL,
                                                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('❌ Error creating sensor_data table:', err);
            } else {
                console.log('✅ sensor_data table ready');
            }
        });

        // Tạo bảng alarm_logs
        this.db.run(`
      CREATE TABLE IF NOT EXISTS alarm_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
            if (err) {
                console.error('❌ Error creating alarm_logs table:', err);
            } else {
                console.log('✅ alarm_logs table ready');
            }
        });

        // Tạo bảng control_logs
        this.db.run(`
      CREATE TABLE IF NOT EXISTS control_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device VARCHAR(50) NOT NULL,
        action VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
            if (err) {
                console.error('❌ Error creating control_logs table:', err);
            } else {
                console.log('✅ control_logs table ready');
            }
        });
    }

    saveSensorData(data) {
        const sql = `
            INSERT INTO sensor_data
            (timestamp, temperature, humidity, flame_detected, system_status, alert_level, device_status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        this.db.run(sql, [
            data.timestamp,
            data.temperature,
            data.humidity,
            data.flameDetected ? 1 : 0,
            data.systemStatus,
            data.alertLevel,
            JSON.stringify(data.deviceStatus)
        ], (err) => {
            if (err) {
                console.error('❌ Error saving sensor data:', err);
            } else {
                console.log('💾 Sensor data saved successfully');
            }
        });

        // Log alarm nếu có cảnh báo
        if (data.systemStatus !== 'normal') {
            this.logAlarm(data.systemStatus, data.deviceStatus.message);
        }
    }

    logAlarm(eventType, description) {
        const sql = `INSERT INTO alarm_logs (event_type, description) VALUES (?, ?)`;
        this.db.run(sql, [eventType, description], (err) => {
            if (err) {
                console.error('❌ Error logging alarm:', err);
            } else {
                console.log('📝 Alarm logged:', eventType);
            }
        });
    }

    logControl(device, action) {
        const sql = `INSERT INTO control_logs (device, action) VALUES (?, ?)`;
        this.db.run(sql, [device, action], (err) => {
            if (err) {
                console.error('❌ Error logging control:', err);
            } else {
                console.log('🎛️ Control logged:', device, action);
            }
        });
    }

    getLatestData(req, res) {
        const sql = `
      SELECT * FROM sensor_data 
      ORDER BY timestamp DESC 
      LIMIT 1
    `;

        this.db.get(sql, [], (err, row) => {
            if (err) {
                console.error('❌ Error fetching latest data:', err);
                return res.status(500).json({ error: err.message });
            }

            if (row) {
                const result = {
                    ...row,
                    deviceStatus: JSON.parse(row.device_status),
                    flameDetected: row.flame_detected === 1
                };
                res.json(result);
            } else {
                // Trả về dữ liệu mẫu nếu chưa có dữ liệu
                res.json({
                    timestamp: new Date().toISOString(),
                    temperature: 25.0,
                    humidity: 60.0,
                    flameDetected: false,
                    system_status: 'normal',
                    alert_level: 0,
                    deviceStatus: {
                        led: false,
                        buzzer: false,
                        pump: false,
                        message: 'Hệ thống hoạt động bình thường'
                    }
                });
            }
        });
    }

    getHistory(req, res) {
        const limit = req.query.limit || 50;
        const sql = `
      SELECT * FROM sensor_data 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;

        this.db.all(sql, [limit], (err, rows) => {
            if (err) {
                console.error('❌ Error fetching history:', err);
                return res.status(500).json({ error: err.message });
            }

            const results = rows.map(row => ({
                ...row,
                deviceStatus: JSON.parse(row.device_status),
                flameDetected: row.flame_detected === 1
            }));

            res.json(results);
        });
    }

    controlDevice(req, res, mqttClient) {
        const { device, action } = req.body;

        console.log(`🎛️ Control command received: ${device} - ${action}`);

        const message = {
            device,
            action,
            timestamp: new Date().toISOString()
        };

        // Log control action
        this.logControl(device, action);

        // Gửi lệnh điều khiển qua MQTT
        mqttClient.publish('fire_detection/control-device', JSON.stringify(message), (err) => {
            if (err) {
                console.error('❌ Error publishing control message:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to send control command'
                });
            }

            console.log('✅ Control command sent successfully');
            res.json({
                success: true,
                message: `Command sent: ${device} - ${action}`,
                timestamp: new Date().toISOString()
            });
        });
    }
}