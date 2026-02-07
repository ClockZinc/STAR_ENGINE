#!/bin/bash
# 星光引擎服务器部署脚本 v2
# 适用于 Ubuntu 24.04 LTS

set -e
echo "========== 星光引擎服务器部署开始 =========="

# 1. 更换阿里云镜像源并更新
echo "[1/9] 更换镜像源并更新系统..."
sudo bash -c 'cat > /etc/apt/sources.list << EOF
deb http://mirrors.aliyun.com/ubuntu/ noble main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ noble-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ noble-backports main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ noble-security main restricted universe multiverse
EOF'
sudo apt clean
sudo apt update

# 2. 安装 Node.js 20
echo "[2/9] 安装 Node.js 20..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi
sudo npm install -g npm@latest

# 3. 安装 Python 3.11 + 创建虚拟环境
echo "[3/9] 安装 Python 环境..."
sudo apt install -y python3 python3-pip python3-venv python3-dev python3-full
# 创建全局虚拟环境
sudo mkdir -p /opt/python-env
sudo python3 -m venv /opt/python-env/global
sudo /opt/python-env/global/bin/pip install --upgrade pip
sudo /opt/python-env/global/bin/pip install fastapi uvicorn httpx asyncio
sudo ln -sf /opt/python-env/global/bin/python /usr/local/bin/pyapp
sudo ln -sf /opt/python-env/global/bin/uvicorn /usr/local/bin/uvicorn
sudo ln -sf /opt/python-env/global/bin/fastapi /usr/local/bin/fastapi

# 4. 安装 PostgreSQL 16
echo "[4/9] 安装 PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
# 创建数据库和用户
sudo -u postgres psql -c "CREATE USER starlight WITH PASSWORD 'starlight123' SUPERUSER;" || true
sudo -u postgres psql -c "CREATE DATABASE starlight_db OWNER starlight;" || true

# 5. 安装 Redis
echo "[5/9] 安装 Redis..."
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
sudo sed -i 's/^# requirepass .*/requirepass starlight123/' /etc/redis/redis.conf || true
sudo systemctl restart redis-server

# 6. 安装 Nginx
echo "[6/9] 安装 Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# 7. 安装全局npm包
echo "[7/9] 安装全局npm包 (PM2, NestJS, Prisma)..."
sudo npm install -g pm2 @nestjs/cli prisma

# 8. 安装构建工具
echo "[8/9] 安装构建工具..."
sudo apt install -y build-essential git curl vim net-tools htop certbot python3-certbot-nginx

# 9. 创建应用目录结构
echo "[9/9] 创建应用目录..."
sudo mkdir -p /opt/starlight-engine/{backend,frontend,python-api,logs}
sudo chown -R ubuntu:ubuntu /opt/starlight-engine

# 10. 创建PM2生态系统配置
cat > /opt/starlight-engine/ecosystem.config.js << 'EOFFILE'
module.exports = {
  apps: [
    {
      name: 'starlight-backend',
      cwd: '/opt/starlight-engine/backend',
      script: 'dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        DATABASE_URL: 'postgresql://starlight:starlight123@localhost:5432/starlight_db',
        REDIS_URL: 'redis://:starlight123@localhost:6379'
      },
      log_file: '/opt/starlight-engine/logs/backend.log'
    },
    {
      name: 'starlight-python-api',
      cwd: '/opt/starlight-engine/python-api',
      script: '/opt/python-env/global/bin/uvicorn',
      args: 'main:app --host 0.0.0.0 --port 8000',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        PYTHONPATH: '/opt/python-env/global/lib/python3.12/site-packages'
      },
      log_file: '/opt/starlight-engine/logs/python-api.log'
    }
  ]
};
EOFFILE

echo ""
echo "========== 部署完成！版本信息 =========="
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "NestJS CLI: $(nest --version 2>/dev/null || echo '未安装')"
echo "Python: $(python3 --version)"
echo "PostgreSQL: $(psql --version | head -1)"
echo "Redis: $(redis-cli --version 2>/dev/null || echo '未安装')"
echo "Nginx: $(nginx -v 2>&1 | head -1)"
echo "PM2: $(pm2 --version 2>/dev/null || echo '未安装')"
echo ""
echo "数据库: starlight_db"
echo "数据库用户: starlight / starlight123"
echo "Redis密码: starlight123"
echo "应用目录: /opt/starlight-engine"
echo ""
echo "========== 下一步 =========="
echo "1. 上传代码到 /opt/starlight-engine/"
echo "2. 配置 Nginx HTTPS (TLS 1.3)"
echo "3. 运行: pm2 start /opt/starlight-engine/ecosystem.config.js"
