resource "aws_ecr_repository" "bot_app" {
  name = var.bot_name
}

data "aws_ecr_image" "bot_app" {
  repository_name = aws_ecr_repository.bot_app.name
  image_tag       = var.image_version
}
