#!/bin/bash
# 星光引擎 - 推送到 GitHub
# 双击运行此文件

cd "$(dirname "$0")"
echo "🌟 推送到 GitHub..."
echo "==================="
echo ""
echo "请输入 GitHub 用户名: mondelbiao-cell"
echo "请输入 GitHub 密码: mondelbiao111"
echo ""

git push -u origin main

echo ""
echo "==================="
read -p "按回车键关闭..."
