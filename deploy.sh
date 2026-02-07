#!/bin/bash
# 星光引擎服务器部署脚本
# 适用于 Ubuntu 24.04 LTS

set -e
echo "========== 星光引擎服务器部署开始 =========="

# 1. 系统更新
echo "[1/9] 更新系统..."
sudo apt update && sudo apt upgrade -y

# 2. 安装 Node.js 20 + npm
echo "[2/9] 安装 Node.js 20..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi
sudo npm install -g npm@latest

# 3. 安装 Python 3.11 + FastAPI依赖
echo "[3/9] 安装 Python 环境..."
sudo apt install -y python3 python3-pip python3-venv python3-dev python3-full
sudo pip3 install --upgrade pip --break-system-packages || sudo pip3 install --upgrade pip
sudo pip3 install fastapi uvicorn httpx asyncio --break-system-packages || pip3 install --user fastapi uvicorn httpx asyncio

# 4. 安装 PostgreSQL 16
echo "[4/9] 安装 PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql

# 5. 安装 Redis
echo "[5/9] 安装 Redis..."
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# 6. 安装 Nginx (支持TLS 1.3)
echo "[6/9] 安装 Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# 7. 安装全局npm包
echo "[7/9] 安装全局npm包 (PM2, NestJS, Prisma)..."
sudo npm install -g pm2 @nestjs/cli prisma

# 8. 安装构建工具
echo "[8/9] 安装构建工具..."
sudo apt install -y build-essential git curl vim net-tools htop

# 9. 创建应用目录
echo "[9/9] 创建应用目录..."
sudo mkdir -p /opt/starlight-engine
sudo chown ubuntu:ubuntu /opt/starlight-engine

echo ""
echo "========== 部署完成！版本信息 =========="
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "NestJS CLI: $(nest --version 2>/dev/null || echo '未安装')"
echo "Python: $(python3 --version)"
echo "pip: $(pip3 --version)"
echo "PostgreSQL: $(psql --version | head -1)"
echo "Redis: $(redis-cli --version 2>/dev/null || echo '未安装')"
echo "Nginx: $(nginx -v 2>&1 | head -1)"
echo "PM2: $(pm2 --version 2>/dev/null || echo '未安装')"
echo ""
echo "应用目录: /opt/starlight-engine"
echo ""
echo "========== 下一步 =========="
echo "1. 配置 PostgreSQL 数据库"
echo "2. 配置 Nginx HTTPS (TLS 1.3)"
echo "3. 部署后端服务 (NestJS + FastAPI)"
