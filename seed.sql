-- 星光引擎示例数据
-- users 表已有管理员，插入其他用户
INSERT INTO users (id, email, nickname, password, role, status, organization, "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440002', 'volunteer@starlight.engine', '张志愿者', '$2b$10$YourHashedPasswordHere', 'VOLUNTEER', 'ACTIVE', '上海义工联', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'lawyer@starlight.engine', '李律师', '$2b$10$YourHashedPasswordHere', 'LAWYER', 'ACTIVE', '星瀚律师事务所', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'merchant@starlight.engine', '王商会', '$2b$10$YourHashedPasswordHere', 'MERCHANT', 'ACTIVE', '温州瓷器协会', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ip_assets 示例资产
INSERT INTO "ip_assets" (id, title, description, type, status, "originalUrl", "creatorId", "copyrightOwner", "emotionTags", "artStory", "royaltySplit", "createdAt", "updatedAt") VALUES
('660e8400-e29b-41d4-a716-446655440001', '深夜的呼吸', '这是一幅充满了深蓝色调的作品，画中有一个巨大的发光球体', 'IMAGE', 'RAW', 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80', '550e8400-e29b-41d4-a716-446655440001', 'CREATOR', ARRAY['蓝色', '宇宙', '孤独'], '孩子用画笔描绘内心宇宙的宁静与深邃', '{"creator": 70, "platform": 30}', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', '彩虹森林', '树木被涂抹成了七种颜色，线条极其流畅和坚定', 'IMAGE', 'ENHANCED', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', '550e8400-e29b-41d4-a716-446655440001', 'CREATOR', ARRAY['彩虹', '森林', '生命力'], '每一种颜色都是生命的独特表达', '{"creator": 70, "platform": 30}', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', '不说话的朋友', '画面中是一个模糊的轮廓和一只清晰的猫咪', 'IMAGE', 'LEGAL_LOCKED', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80', '550e8400-e29b-41d4-a716-446655440001', 'CREATOR', ARRAY['陪伴', '动物', '温柔'], '猫咪是沉默世界中最忠实的朋友', '{"creator": 70, "platform": 30}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- licenses 授权合同
INSERT INTO licenses (id, "licenseCode", "licensorId", "licenseeName", "assetId", "licenseType", status, "entryFee", "royaltyRate", "effectiveDate", "expiryDate", "createdAt", "updatedAt") VALUES
('770e8400-e29b-41d4-a716-446655440001', 'LIC-2024-001', '550e8400-e29b-41d4-a716-446655440004', '温州瓷器协会', '660e8400-e29b-41d4-a716-446655440003', 'IMAGE', 'ACTIVE', 15000.00, 8.50, '2024-01-01', '2025-01-01', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440002', 'LIC-2024-002', '550e8400-e29b-41d4-a716-446655440004', '上海丝绸贸易', '660e8400-e29b-41d4-a716-446655440002', 'STYLE', 'ACTIVE', 8000.00, 5.00, '2024-02-01', '2025-02-01', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- transactions 交易记录
INSERT INTO transactions (id, "txnCode", "payeeType", type, amount, currency, status, description, "createdAt", "updatedAt") VALUES
('880e8400-e29b-41d4-a716-446655440001', 'TXN-2024-001', 'USER', 'LICENSE_FEE', 15000.00, 'CNY', 'COMPLETED', '温州瓷器协会授权费', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440002', 'TXN-2024-002', 'USER', 'ROYALTY', 1275.00, 'CNY', 'COMPLETED', 'Q1版税分成', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- partner_subscriptions 商会订阅
INSERT INTO "partner_subscriptions" (id, "partnerId", "companyName", "companyType", "planType", status, "monthlyFee", mrr, "startedAt", "nextBillingDate", "createdAt", "updatedAt") VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '温州瓷器协会', '制造业', 'ENTERPRISE', 'ACTIVE', 15000.00, 15000.00, '2024-01-01', '2024-07-01', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- system_configs 系统配置
INSERT INTO system_configs (id, key, value, description, "updatedAt") VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'CRISIS_FUND_BALANCE', '50000', '危机公关响应金余额', NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', 'PLATFORM_FEE_RATE', '30', '平台服务费比例(%)', NOW()),
('aa0e8400-e29b-41d4-a716-446655440003', 'MIN_ROYALTY_PAYOUT', '100', '最低提现金额', NOW())
ON CONFLICT (key) DO NOTHING;
