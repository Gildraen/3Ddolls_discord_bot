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
  region = var.REGION

  default_tags {
    tags = {
      Service = var.PRODUCT
      Stage = var.STAGE      
    }
  }
}

resource "aws_ecr_repository" "bot_app" {
  name = "discord_bot"
}

resource "aws_ecs_task_definition" "bot_app" {
  family                = "discord_bot"
  container_definitions = jsonencode([
    {
      name      = "discord_bot"
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