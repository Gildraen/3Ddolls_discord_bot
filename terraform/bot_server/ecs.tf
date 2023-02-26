resource "aws_ecs_task_definition" "bot_app" {
  family                   = var.bot_name
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.task_role.arn
  execution_role_arn       = aws_iam_role.execution_role.arn

  container_definitions = jsonencode([
    {
      name   = var.bot_name
      image  = "${aws_ecr_repository.bot_app.repository_url}:${var.image_version}"
      memory = 128
    }
  ])
}

resource "aws_ecs_service" "bot_app" {
  name            = var.bot_name
  cluster         = var.cluster.id
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
