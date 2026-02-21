#!/bin/bash
set -e

# ── System Update ──────────────────────────────────────────
yum update -y

# ── Install Docker ─────────────────────────────────────────
yum install -y docker git curl unzip
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# ── Install Docker Compose v2 ──────────────────────────────
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# ── Install AWS CLI v2 ─────────────────────────────────────
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
rm -rf awscliv2.zip aws/

# ── Install CloudWatch Agent ───────────────────────────────
yum install -y amazon-cloudwatch-agent

# ── Get EC2 public IP ──────────────────────────────────────
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# ── Clone your app from GitHub ─────────────────────────────
git clone https://github.com/Youngyz1/registration-app.git /app
cd /app

# ── Create .env for production ─────────────────────────────
cat > /app/.env <<EOF
DATABASE_URL=postgresql://${db_username}:${db_password}@${db_host}:5432/${db_name}
DB_HOST=${db_host}
DB_PORT=5432
DB_NAME=${db_name}
DB_USER=${db_username}
DB_PASSWORD=${db_password}
JWT_SECRET_KEY=0f5f81461c6bc257ebb6caebafbbb58d28e6f7c1f4e2b28456ad9c59487c6b4b359b028b068d5ee4d06155b1ad4ef46a74f0b78a8dc63c394e568ec02ccf8ec6
AWS_REGION=${aws_region}
REACT_APP_API_URL=http://$PUBLIC_IP:8000/api
ECR_BACKEND=${aws_account_id}.dkr.ecr.${aws_region}.amazonaws.com/registration-app-backend
ECR_FRONTEND=${aws_account_id}.dkr.ecr.${aws_region}.amazonaws.com/registration-app-frontend
EOF

# ── Login to ECR ───────────────────────────────────────────
aws ecr get-login-password --region ${aws_region} | \
  docker login --username AWS --password-stdin ${aws_account_id}.dkr.ecr.${aws_region}.amazonaws.com

# ── Pull images from ECR and start app ────────────────────
docker compose -f /app/docker-compose.prod.yml --env-file /app/.env pull
docker compose -f /app/docker-compose.prod.yml --env-file /app/.env up -d

# ── Create deploy script for CI/CD to use ─────────────────
cat > /app/deploy.sh <<'DEPLOY'
#!/bin/bash
set -e
cd /app

echo "🔄 Pulling latest code..."
git pull origin main

echo "🐳 Restarting containers with latest images..."
docker compose -f /app/docker-compose.prod.yml --env-file /app/.env pull
docker compose -f /app/docker-compose.prod.yml --env-file /app/.env up -d

echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete!"
DEPLOY

chmod +x /app/deploy.sh
chown -R ec2-user:ec2-user /app

# ── Log completion ─────────────────────────────────────────
echo "✅ EC2 user_data setup complete at $(date)" >> /var/log/user-data.log