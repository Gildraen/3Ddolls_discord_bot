resource "aws_ecr_repository" "bot_app" {
  name = var.BOT_NAME
}

data "aws_ecr_image" "bot_app" {
  repository_name = aws_ecr_repository.bot_app.name
  image_tag       = "latest"
}