# EC2 Instance
resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.ec2_instance_type
  key_name               = var.key_pair_name
  subnet_id              = aws_subnet.public_1.id
  vpc_security_group_ids = [aws_security_group.ec2.id]

  # Give EC2 permission to pull from ECR later (for CI/CD)
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

 user_data = base64encode(templatefile("${path.module}/user_data.sh", {
  db_host        = aws_db_instance.postgres.address
  db_name        = var.db_name
  db_username    = var.db_username
  db_password    = var.db_password
  aws_region     = var.aws_region
  aws_account_id = var.aws_account_id
}))

  root_block_device {
    volume_size = 20    # 20GB disk
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name = "${var.project_name}-ec2"
  }
}

# IAM Role for EC2 (allows pulling from ECR, CloudWatch logs)
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

# Attach ECR read policy so EC2 can pull Docker images
resource "aws_iam_role_policy_attachment" "ecr_read" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# Attach CloudWatch policy for monitoring
resource "aws_iam_role_policy_attachment" "cloudwatch" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}


