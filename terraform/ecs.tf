resource "aws_ecs_cluster" "bot_app" {
  name = var.BOT_NAME
}

resource "aws_ecs_cluster_capacity_providers" "bot_app" {
  cluster_name       = aws_ecs_cluster.bot_app.name
  capacity_providers = ["FARGATE_SPOT"]
}


resource "aws_ecs_task_definition" "bot_app" {
  family                   = var.BOT_NAME
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name   = var.BOT_NAME
      image  = "${aws_ecr_repository.bot_app.repository_url}:latest@${data.aws_ecr_image.bot_app.id}"
      memory = 128
    }
  ])
}

resource "aws_ecs_service" "bot_app" {
  name            = var.BOT_NAME
  cluster         = aws_ecs_cluster.bot_app.id
  task_definition = aws_ecs_task_definition.bot_app.arn
  desired_count   = 1
  network_configuration {
    subnets          = ["subnet-04d1574e231237b4b", "subnet-0951c2b0f2dc8d2c3", "subnet-0f01cbbe5df93f0a2"]
    assign_public_ip = true
  }

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }
}