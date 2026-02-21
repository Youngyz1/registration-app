terraform {
  required_version = ">= 1.5.0"

  required_providers {
  aws = {
    source  = "hashicorp/aws"
    version = "~> 5.0"
  }
  github = {      # ✅ CORRECT — inside required_providers block
    source  = "integrations/github"
    version = "~> 6.0"
  }
}

  # Remote state in S3
  # NOTE: Run `terraform init` AFTER creating the S3 bucket first
  backend "s3" {
    bucket         = "youngyz-registration-app-958421185668"   # replace with var.terraform_state_bucket value
    key            = "registration-app/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "registration-app-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Get latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
