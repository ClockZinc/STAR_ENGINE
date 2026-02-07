# 🌟 星光引擎 Git 工作流指南

## 快速开始

```bash
# 查看当前状态
git status

# 查看提交历史
git log --oneline -10

# 查看修改内容
git diff
```

## 日常开发流程

### 1. 开始新功能
```bash
# 创建并切换到新分支
git checkout -b feature/wechat-pay

# 开发代码...
# ...

# 提交代码
git add .
git commit -m "feat: 接入微信支付 JSAPI"
```

### 2. 同步服务器最新代码
```bash
# 使用同步脚本
./sync-from-server.sh

# 查看同步下来的变化
git status
git diff

# 提交服务器同步的代码
git add .
git commit -m "sync: 同步服务器最新部署代码"
```

### 3. 完成开发，合并到主分支
```bash
# 切换回主分支
git checkout main

# 拉取最新代码
git pull origin main  # 如果有远程仓库

# 合并功能分支
git merge feature/wechat-pay

# 删除已合并的分支
git branch -d feature/wechat-pay
```

## 提交规范

### 提交类型
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建/工具相关
- `sync:` 同步服务器代码

### 示例
```bash
git commit -m "feat: 添加微信支付分账功能"
git commit -m "fix: 修复画廊图片加载失败问题"
git commit -m "style: 优化页面响应式布局"
git commit -m "sync: 同步服务器生产环境代码"
```

## 分支管理策略

```
main                    # 主分支，稳定版本
├── feature/wechat-pay  # 微信支付功能
├── feature/gemini-api  # AI 接入
├── fix/login-bug       # 修复登录问题
└── optimize/ui         # UI 优化
```

## 常用命令速查

| 命令 | 用途 |
|-----|------|
| `git status` | 查看文件状态 |
| `git add .` | 添加所有修改到暂存区 |
| `git commit -m "msg"` | 提交代码 |
| `git log --oneline` | 查看提交历史 |
| `git branch` | 查看分支列表 |
| `git checkout -b name` | 创建并切换分支 |
| `git checkout name` | 切换分支 |
| `git merge name` | 合并分支 |
| `git branch -d name` | 删除分支 |
| `git stash` | 临时保存修改 |
| `git stash pop` | 恢复保存的修改 |

## 连接到远程仓库（可选）

### GitHub
```bash
# 在 GitHub 创建仓库后
git remote add origin https://github.com/yourname/starlight-engine.git
git push -u origin main
```

### 查看远程仓库
```bash
git remote -v
```

## 备份代码

```bash
# 打包备份
tar -czvf starlight-backup-$(date +%Y%m%d).tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  .
```

## 常见问题

### Q: 误删了文件怎么恢复？
```bash
git checkout -- filename
```

### Q: 想撤销最后一次提交？
```bash
# 保留修改
git reset --soft HEAD~1

# 丢弃修改
git reset --hard HEAD~1
```

### Q: 查看某文件的修改历史？
```bash
git log -p filename
```
