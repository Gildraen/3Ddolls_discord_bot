terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.51"
    }
  }
  
  required_version = "~> 1.3.2"
}

provider "aws" {
}

resource "aws_ecr_repository" "bot_app" {
  name = var.bot_name
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecsTaskExecutionRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "ecs_task_execution_policy" {
  name        = "ecsTaskExecutionPolicy"
  description = "Policy that allows ECS Tasks to access AWS Resources"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy_attachment" {
  policy_arn = aws_iam_policy.ecs_task_execution_policy.arn
  role       = aws_iam_role.ecs_task_execution_role.name
}

resource "aws_ecs_task_definition" "bot_app" {
  family                = var.bot_name
  requires_compatibilities  = ["FARGATE"]
  network_mode          = "awsvpc"
  cpu    = 256 
  memory    = 512
  task_role_arn         = aws_iam_role.ecs_task_execution_role.arn
  execution_role_arn    = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = var.bot_name
      image     = "${aws_ecr_repository.bot_app.repository_url}:latest"
      cpu       = 256
      memory    = 512
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        },
        {
          containerPort = 80
          hostPort      = 80
        },
        {
          containerPort = 8080
          hostPort      = 8080
        },
      ]
    }
  ])
}

resource "aws_ecs_cluster" "bot_app" {
  name = var.bot_name
}

resource "aws_vpc" "bot_app_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "bot_app_subnet" {
  vpc_id     = aws_vpc.bot_app_vpc.id
  cidr_block = "10.0.0.0/24"
  map_public_ip_on_launch = true
}

resource "aws_security_group" "bot_app_security_group" {
  vpc_id = aws_vpc.bot_app_vpc.id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "bot_app" {
  name            = var.bot_name
  cluster         = aws_ecs_cluster.bot_app.id
  task_definition = aws_ecs_task_definition.bot_app.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration  {
    subnets         = aws_subnet.bot_app_subnet.*.id
    security_groups = aws_security_group.bot_app_security_group.*.id
    assign_public_ip = true
  }
}