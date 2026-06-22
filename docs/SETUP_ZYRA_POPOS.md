# Setup Zyra under Pop!_OS

This guide installs and runs the 3615 Gateways MVP server on Zyra.

## 1. Install Node.js

Recommended: Node.js 20+.

```bash
node -v
npm -v
```

If Node is missing, install it with your preferred method. Example with NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 2. Clone the repo

```bash
cd ~
git clone https://github.com/Sterenna-studio/3615-gateways.git
cd 3615-gateways
```

## 3. Configure environment

```bash
cp .env.example .env
nano .env
```

For local testing, defaults are enough:

```txt
HTTP_PORT=8080
TELNET_PORT=3615
WS_PATH=/minitel/ws
GATEWAY_NODE=ZYRA
```

## 4. Install and run

```bash
npm install
npm run dev
```

Test HTTP:

```bash
curl http://localhost:8080/
```

Test Telnet from Zyra:

```bash
telnet localhost 3615
```

Test Telnet from another LAN device:

```bash
telnet <ZYRA_LOCAL_IP> 3615
```

## 5. Optional systemd service

Create a service file:

```bash
sudo nano /etc/systemd/system/3615-gateways.service
```

Content:

```ini
[Unit]
Description=3615 Gateways Minitel Server
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/$USER/3615-gateways
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Replace `/home/$USER/3615-gateways` with the real absolute path.

Enable it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable 3615-gateways
sudo systemctl start 3615-gateways
sudo systemctl status 3615-gateways
```

## 6. Firewall

For LAN tests only:

```bash
sudo ufw allow 3615/tcp
sudo ufw allow 8080/tcp
```

For public exposure, prefer a reverse proxy or tunnel and keep direct ports closed when possible.
