# In a new file: terraform/github.tf

resource "github_actions_secret" "ec2_host" {
  repository      = "registration-app"
  secret_name     = "EC2_HOST"
  plaintext_value = aws_instance.app.public_ip
}

resource "github_actions_secret" "db_host" {
  repository      = "registration-app"
  secret_name     = "DB_HOST"
  plaintext_value = aws_db_instance.postgres.address
}

resource "github_actions_secret" "react_app_api_url" {
  repository      = "registration-app"
  secret_name     = "REACT_APP_API_URL"
  plaintext_value = "http://${aws_instance.app.public_ip}:8000/api"
}