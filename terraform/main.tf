terraform {
  backend "s3" {
    bucket = "gildraen-administration"
    key    = "tfstates/discord/bot.tfstate"
  }
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

module "bot_module" {
  source        = "./bot_server"
  for_each      = var.bots
  bot_name      = each.key
  image_version = each.value.version
  cluster       = aws_ecs_cluster.bot_app
}
