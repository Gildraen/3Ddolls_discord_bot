resource "aws_ecs_cluster" "bot_app" {
  name = "discord-bot-cluster"
}

resource "aws_ecs_cluster_capacity_providers" "bot_app" {
  cluster_name       = aws_ecs_cluster.bot_app.name
  capacity_providers = ["FARGATE_SPOT"]
}
