# GitHub 推送设置指南

## 方法1：使用 GitHub Token（推荐）

由于 GitHub 已禁用密码认证，请使用 Personal Access Token：

### 步骤1：创建 Token
1. 访问 https://github.com/settings/tokens/new
2. 填写 Note: `Starlight Engine Deploy`
3. 勾选 `repo`（完整仓库访问权限）
4. 点击 **Generate token**
5. **复制生成的 token**（类似 `ghp_xxxxxxxxxxxx`）

### 步骤2：使用 Token 推送
在终端运行：
```bash
cd "/Users/hb/Downloads/starlight-engine-ecosystem-matrix (3)"
git push -u origin main
```

输入时：
- **用户名**: `ClockZinc`
- **密码**: 粘贴刚才复制的 Token（不是 GitHub 密码）

---

## 方法2：使用 GitHub Desktop（最简单）

1. 下载安装 https://desktop.github.com
2. 登录你的 GitHub 账号
3. 点击 **File → Add local repository**
4. 选择文件夹：`/Users/hb/Downloads/starlight-engine-ecosystem-matrix (3)`
5. 点击 **Publish repository**

---

## 方法3：命令行手动输入

在 **Mac 终端**（不是这里）运行：
```bash
cd "/Users/hb/Downloads/starlight-engine-ecosystem-matrix (3)"
git push -u origin main
```

然后会提示：
```
Username for 'https://github.com': ClockZinc
Password for 'https://github.com': [输入 Token]
```

---

## 常见问题

### Q: 提示 "Support for password authentication was removed"
**解决**: 必须使用 Personal Access Token，不能用 GitHub 密码

### Q: 提示 "Repository not found"
**解决**: 先在 https://github.com/new 创建 `STAR_ENGINE` 仓库

### Q: 提示 "Permission denied"
**解决**: Token 权限不足，重新创建 Token 时勾选所有 `repo` 权限
