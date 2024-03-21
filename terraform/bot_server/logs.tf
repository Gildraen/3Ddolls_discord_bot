resource "aws_cloudwatch_log_group" "bot_app" {
  name = "/aws/ecs/tasks/bot_app"
  retention_in_days = 7
}