Required: python3.11

## backend: 

sudo apt install ffmpeg

install req.txt in venv

place audio files in backend/local_audio -> might need to create the folder

## install node: 

sudo apt install curl -y

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

sudo apt install -y nodejs

## setup gpu inside venv (only if you have a gpu):

pip install torch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1 --index-url https://download.pytorch.org/whl/cu118
