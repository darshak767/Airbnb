# 🤝 Contributing to WanderLust

> **Note**: GitHub automatically recognizes [`CONTRIBUTING.md`](./CONTRIBUTING.md) as the official repository contribution guideline file shown to contributors when opening Issues and Pull Requests.

For complete, detailed instructions on how to set up the project locally, seed MongoDB, configure Cloudinary, follow the MVC architecture, use Conventional Commits, and submit Pull Requests, please view:

👉 **[Read the Full Contributing Guide (CONTRIBUTING.md)](./CONTRIBUTING.md)**

---

## ⚡ Quick Contributor Cheat Sheet

### 1. Clone & Set Up
```bash
git clone https://github.com/<YOUR-USERNAME>/Airbnb.git
cd Airbnb
npm install
```

### 2. Configure Environment (`.env`)
```env
mongo_URL=mongodb://127.0.0.1:27017/wanderlust
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRATE=your_cloudinary_api_secret
SECRET=mysupersecretkey
PORT=8000
```

### 3. Seed Database
```bash
node init/index.js
```

### 4. Start Server
```bash
npm run dev
```

### 5. Create Feature Branch & Submit PR
```bash
git checkout -b feature/your-feature-name
git commit -m "feat(scope): your descriptive change"
git push origin feature/your-feature-name
```

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for the complete checklist and architectural conventions.
