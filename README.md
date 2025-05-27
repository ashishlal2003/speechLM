# Project Setup Guide

This guide provides steps to set up the backend and frontend environments with Python 3.11, Node.js, and GPU support (optional).

---

## 📦 Prerequisites

- Python 3.11 (Make sure it's installed on your system)
- `venv` for virtual environment
- Ubuntu-based OS with `apt` package manager

---

## 🛠 Backend Setup

### 1. Install System Dependencies

```bash
sudo apt update
sudo apt install -y ffmpeg
```

### 2. Create & Activate Virtual Environment

```bash
python3.11 -m venv venv
source venv/bin/activate
```

### 3. Install Python Requirements

```bash
pip install -r requirements.txt
```

### 4. Run the Backend (Default Port: `8000`)

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

> Replace `main:app` with your actual FastAPI/Flask app entrypoint if different.

---

## ⚡ GPU Setup (Optional)

If you have a GPU and want to enable CUDA acceleration:

```bash
pip install torch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1 --index-url https://download.pytorch.org/whl/cu118
```

---

## 🌐 Frontend Setup

### 1. Install Node.js

```bash
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

> You can verify installation using:
> ```bash
> node -v
> npm -v
> ```

### 2. Install Requirements and Run the Frontend
```bash
npm install
npm run dev
```

---

## ✅ Final Checklist

- [ ] Python 3.11 Installed
- [ ] Backend virtual environment set up with required packages
- [ ] `ffmpeg` installed
- [ ] Node.js installed for frontend
- [ ] Torch with CUDA installed (if using GPU)

---

## 🧠 Notes

- Always activate the virtual environment before running the backend.
- Ensure no other process is using port `8000`.
- Modify `uvicorn` command or use `gunicorn`/`hypercorn` for production deployments.
