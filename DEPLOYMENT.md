# 部署指南 - Mock API Server

## 🚀 推送到 GitHub

### 方法 1: 使用提供的腳本

#### Windows 用戶：
```bash
# 執行 Windows 批次檔
setup-git.bat
```

#### Linux/macOS 用戶：
```bash
# 給予執行權限
chmod +x setup-git.sh

# 執行腳本
./setup-git.sh
```

### 方法 2: 手動設置

```bash
# 1. 初始化 Git 倉庫
git init

# 2. 添加遠端倉庫
git remote add origin https://github.com/DennisLiuCk/mock_server.git

# 3. 添加所有檔案
git add .

# 4. 建立初始提交
git commit -m "Initial commit: Mock API Server with TDD implementation

Features:
- ✅ ConfigLoader with YAML/JSON support
- ✅ ConfigValidator with comprehensive validation
- ✅ MockServer with Express integration
- ✅ RouteManager for dynamic route registration
- ✅ TemplateEngine for dynamic content generation
- ✅ Complete test coverage for all modules
- ✅ TypeScript configuration and build setup
- ✅ TDD development methodology"

# 5. 設置主分支並推送
git branch -M main
git push -u origin main
```

## 📦 專案結構概覽

推送到 GitHub 的檔案包括：

```
mock_server/
├── src/                          # 原始碼
│   ├── config/                   # 配置管理模組
│   │   ├── config-loader.ts      # 配置檔案載入器
│   │   ├── config-validator.ts   # 配置檔案驗證器
│   │   └── __tests__/            # 配置模組測試
│   ├── server/                   # HTTP 伺服器模組
│   │   ├── mock-server.ts        # 核心伺服器類別
│   │   ├── route-manager.ts      # 路由管理器
│   │   └── __tests__/            # 伺服器模組測試
│   ├── response/                 # 回應處理模組
│   │   ├── template-engine.ts    # 模板引擎
│   │   └── __tests__/            # 回應模組測試
│   ├── types/                    # TypeScript 型別定義
│   │   └── config.ts             # 配置型別
│   ├── test-setup.ts             # Jest 測試設置
│   └── index.ts                  # 主要入口點
├── examples/                     # 範例配置檔案
│   ├── basic-config.yaml         # YAML 格式範例
│   └── basic-config.json         # JSON 格式範例
├── docs/                         # 文件
│   ├── README.md                 # 專案說明
│   ├── PRD_Mock_API_Server.md    # 產品需求文件
│   ├── PLANNING_LIST.md          # 開發規劃清單
│   └── DEPLOYMENT.md             # 部署指南
├── scripts/                      # 部署腳本
│   ├── setup-git.sh              # Linux/macOS Git 設置
│   └── setup-git.bat             # Windows Git 設置
├── tests/                        # 測試相關檔案
│   ├── test-integration.js       # 整合測試
│   └── test-runner.js            # 測試執行器
├── package.json                  # Node.js 專案配置
├── tsconfig.json                 # TypeScript 配置
├── jest.config.js                # Jest 測試配置
├── .eslintrc.js                  # ESLint 配置
├── .prettierrc                   # Prettier 配置
├── .gitignore                    # Git 忽略檔案
└── LICENSE                       # 授權檔案
```

## 🔧 本地開發設置

克隆倉庫後的設置步驟：

```bash
# 1. 克隆倉庫
git clone https://github.com/DennisLiuCk/mock_server.git
cd mock_server

# 2. 安裝依賴
npm install

# 3. 建構專案
npm run build

# 4. 執行測試
npm test

# 5. 啟動開發伺服器
npm run dev examples/basic-config.yaml
```

## 🌐 部署到生產環境

### Docker 部署 (未來功能)

```bash
# 建構 Docker 映像
docker build -t mock-api-server .

# 執行容器
docker run -p 3000:3000 -v $(pwd)/config.yaml:/app/config.yaml mock-api-server
```

### 雲端部署選項

1. **Heroku**
2. **Vercel**
3. **AWS Lambda**
4. **Google Cloud Run**
5. **Azure Container Instances**

## 📊 CI/CD 設置 (建議)

### GitHub Actions 工作流程

建立 `.github/workflows/ci.yml`：

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - run: npm ci
    - run: npm run build
    - run: npm test
    - run: npm run lint
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
```

## 🏷️ 版本管理

### 語義化版本控制

- **主版本** (Major): 不相容的 API 變更
- **次版本** (Minor): 向後相容的功能新增
- **修訂版本** (Patch): 向後相容的錯誤修復

### 發布流程

```bash
# 1. 更新版本號
npm version patch  # 或 minor, major

# 2. 推送標籤
git push origin main --tags

# 3. 建立 GitHub Release
# 在 GitHub 網頁介面建立 Release
```

## 📈 監控和分析

### 建議的監控工具

1. **應用程式監控**: New Relic, DataDog
2. **錯誤追蹤**: Sentry
3. **日誌管理**: ELK Stack, Splunk
4. **效能監控**: Prometheus + Grafana

## 🔒 安全性考量

### 生產環境安全檢查清單

- [ ] 移除開發用的 console.log
- [ ] 設置適當的 CORS 政策
- [ ] 實作速率限制
- [ ] 添加請求驗證
- [ ] 設置 HTTPS
- [ ] 環境變數管理
- [ ] 安全標頭設置

## 📞 支援和貢獻

### 問題回報

1. 檢查現有的 [Issues](https://github.com/DennisLiuCk/mock_server/issues)
2. 建立新的 Issue 並提供詳細資訊
3. 使用適當的標籤分類

### 貢獻指南

1. Fork 專案
2. 建立功能分支
3. 遵循 TDD 開發流程
4. 確保測試通過
5. 提交 Pull Request

---

**部署完成後，您的 Mock API Server 將在以下位置可用：**
- 🌐 **GitHub**: https://github.com/DennisLiuCk/mock_server
- 📚 **文件**: README.md 和相關文件
- 🧪 **測試**: 完整的測試套件
- 🚀 **生產就緒**: 可立即用於開發和測試環境