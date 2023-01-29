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
