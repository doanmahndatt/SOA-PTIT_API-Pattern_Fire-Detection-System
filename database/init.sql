-- Bảng lưu dữ liệu cảm biến
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
);

-- Bảng lưu nhật ký cảnh báo
CREATE TABLE IF NOT EXISTS alarm_logs (
                                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                                          event_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- Bảng lưu nhật ký điều khiển
CREATE TABLE IF NOT EXISTS control_logs (
                                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            device VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- Dữ liệu mẫu
INSERT INTO sensor_data (timestamp, temperature, humidity, flame_detected, system_status, alert_level, device_status)
VALUES
    ('2025-01-20T10:00:00.000Z', 25.5, 65.2, 0, 'normal', 0, '{"led":false,"buzzer":false,"pump":false,"message":"Hệ thống hoạt động bình thường"}'),
    ('2025-01-20T10:05:00.000Z', 28.3, 62.8, 0, 'normal', 0, '{"led":false,"buzzer":false,"pump":false,"message":"Hệ thống hoạt động bình thường"}'),
    ('2025-01-20T10:10:00.000Z', 55.7, 58.4, 1, 'warning', 1, '{"led":true,"buzzer":true,"pump":false,"message":"CẢNH BÁO: Nguy cơ cháy!"}'),
    ('2025-01-20T10:15:00.000Z', 72.1, 52.3, 1, 'danger', 2, '{"led":true,"buzzer":true,"pump":true,"message":"CẢNH BÁO NGUY HIỂM: Cháy đang xảy ra!"}');

INSERT INTO alarm_logs (event_type, description)
VALUES
    ('warning', 'Phát hiện lửa trong khu vực'),
    ('danger', 'Nhiệt độ cao, phát hiện lửa'),
    ('normal', 'Hệ thống hoạt động bình thường');

INSERT INTO control_logs (device, action)
VALUES
    ('buzzer', 'off'),
    ('pump', 'off'),
    ('system', 'reboot');

-- Index để tối ưu hiệu suất truy vấn
CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_sensor_data_status ON sensor_data(system_status);
CREATE INDEX IF NOT EXISTS idx_alarm_logs_created_at ON alarm_logs(created_at);