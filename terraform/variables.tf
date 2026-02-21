variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "registration-app"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# EC2
variable "ec2_instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "key_pair_name" {
  description = "AWS Key Pair name for SSH access to EC2"
  type        = string
}

# RDS
variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "appdb"
}

variable "db_username" {
  description = "PostgreSQL master username"
  type        = string
  default     = "dbadmin"
}

variable "db_password" {
  description = "PostgreSQL master password"
  type        = string
  sensitive   = true
}

# S3
variable "terraform_state_bucket" {
  description = "S3 bucket name for Terraform remote state"
  type        = string
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
  default     = "958421185668"
}

variable "github_token" {
  description = "GitHub personal access token"
  type        = string
  sensitive   = true
}