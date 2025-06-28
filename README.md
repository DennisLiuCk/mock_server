# Mock API Server

一個輕量級、可配置的 Mock API 伺服器，專為日常開發使用而設計。使用 TDD (Test-Driven Development) 方法開發，確保代碼品質和可測試性。

## 🚀 特色功能

- ✅ **完整的 HTTP 方法支援** - GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
- ✅ **靈活的配置格式** - 支援 YAML 和 JSON 配置檔案
- ✅ **動態內容生成** - 支援模板變數和函數
- ✅ **路徑參數支援** - 如 `/api/users/:id`
- ✅ **CORS 支援** - 可配置的跨域資源共享
- ✅ **即時配置重載** - 支援熱重載配置檔案
- ✅ **詳細的錯誤驗證** - 完整的配置檔案驗證
- ✅ **TypeScript 支援** - 完整的型別安全

## 📦 安裝

```bash
# 克隆專案
git clone <repository-url>
cd mock-api-server

# 安裝依賴
npm install

# 建構專案
npm run build
```

## 🎯 快速開始

### 1. 建立配置檔案

建立一個 `config.yaml` 檔案：

```yaml
server:
  port: 3000
  host: localhost
  cors: true

apis:
  - path: /api/users
    method: GET
    response:
      status: 200
      body:
        - id: 1
          name: "John Doe"
          email: "john@example.com"
        - id: 2
          name: "Jane Smith"
          email: "jane@example.com"

  - path: /api/users/:id
    method: GET
    response:
      status: 200
      body:
        id: "{{params.id}}"
        name: "User {{params.id}}"
        email: "user{{params.id}}@example.com"
```

### 2. 啟動伺服器

```bash
# 使用預設配置
npm start

# 使用自訂配置檔案
npm start config.yaml

# 開發模式（自動重載）
npm run dev config.yaml
```

### 3. 測試 API

```bash
# 測試 GET 請求
curl http://localhost:3000/api/users

# 測試帶參數的 GET 請求
curl http://localhost:3000/api/users/123
```

## 📋 配置格式

### 伺服器配置

```yaml
server:
  port: 3000        # 伺服器埠號 (1-65535)
  host: localhost   # 伺服器主機
  cors: true        # 是否啟用 CORS
```

### API 端點配置

```yaml
apis:
  - path: /api/endpoint    # API 路徑
    method: GET            # HTTP 方法
    response:              # 回應配置
      status: 200          # HTTP 狀態碼
      headers:             # 自訂標頭 (可選)
        Content-Type: application/json
      body:                # 回應主體
        message: "Hello World"
      delay: 1000          # 回應延遲 (毫秒，可選)
```

## 🎨 動態內容模板

支援以下模板變數：

### 路徑參數
```yaml
# 路徑: /api/users/:id
body:
  id: "{{params.id}}"
  name: "User {{params.id}}"
```

### 查詢參數
```yaml
# 請求: /api/search?q=test&limit=10
body:
  query: "{{query.q}}"
  limit: "{{query.limit}}"
```

### 請求主體
```yaml
# POST 請求主體: {"name": "John"}
body:
  message: "Hello {{body.name}}"
  received: "{{body}}"
```

### 內建函數
```yaml
body:
  id: "{{random.number}}"      # 隨機數字
  timestamp: "{{now}}"         # 當前時間戳
```

### 巢狀物件存取
```yaml
# 請求主體: {"user": {"name": "John", "age": 25}}
body:
  userName: "{{body.user.name}}"
  userAge: "{{body.user.age}}"
```

## 🧪 測試

本專案使用 TDD 開發方法，包含完整的測試覆蓋：

```bash
# 執行所有測試
npm test

# 執行測試並監控變更
npm run test:watch

# 生成測試覆蓋率報告
npm run test:coverage

# 執行整合測試
node test-integration.js
```

## 🏗️ 專案結構

```
src/
├── config/                 # 配置管理模組
│   ├── config-loader.ts    # 配置檔案載入器
│   ├── config-validator.ts # 配置檔案驗證器
│   └── __tests__/          # 配置模組測試
├── server/                 # HTTP 伺服器模組
│   ├── mock-server.ts      # 核心伺服器類別
│   ├── route-manager.ts    # 路由管理器
│   └── __tests__/          # 伺服器模組測試
├── response/               # 回應處理模組
│   ├── template-engine.ts  # 模板引擎
│   └── __tests__/          # 回應模組測試
├── types/                  # TypeScript 型別定義
│   └── config.ts           # 配置型別
└── index.ts                # 主要入口點
```

## 🔧 開發

### TDD 開發流程

本專案嚴格遵循 TDD 開發流程：

1. **🔴 紅燈** - 先寫測試，確保測試失敗
2. **🟢 綠燈** - 實作最小代碼讓測試通過
3. **🔵 重構** - 改善代碼品質，保持測試通過

### 代碼品質

```bash
# 代碼檢查
npm run lint

# 自動修復代碼風格
npm run lint:fix

# 代碼格式化
npm run format
```

## 📚 範例

查看 `examples/` 目錄中的範例配置檔案：

- `basic-config.yaml` - 基本配置範例
- `basic-config.json` - JSON 格式配置範例

## 🤝 貢獻

歡迎貢獻！請遵循以下步驟：

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 遵循 TDD 流程開發
4. 確保所有測試通過 (`npm test`)
5. 提交變更 (`git commit -m 'Add amazing feature'`)
6. 推送到分支 (`git push origin feature/amazing-feature`)
7. 開啟 Pull Request

## 📄 授權

本專案使用 MIT 授權 - 查看 [LICENSE](LICENSE) 檔案了解詳情。

## 🎯 路線圖

查看 [PLANNING_LIST.md](PLANNING_LIST.md) 了解詳細的開發規劃和進度。

### 已完成功能 ✅
- 配置檔案載入和驗證
- 核心 HTTP 伺服器
- 動態路由管理
- 模板引擎
- 基本 HTTP 方法支援

### 進行中功能 🚧
- 進階回應控制（條件式、延遲、機率）
- Web UI 管理介面
- 監控和日誌功能

### 計劃功能 📋
- 認證模擬
- 插件系統
- Docker 支援
- OpenAPI 整合

---

**開發團隊** | **使用 TDD 方法開發** | **TypeScript + Express.js**