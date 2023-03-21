resource "aws_iam_role" "task_role" {
  name = "${var.bot_name}-task-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = "production"
  }
}

# data "aws_iam_policy_document" "task_role_policy" {
#   statement {
#     effect = "Allow"
#     actions = [
#       "s3:Get*",
#       "s3:List*",
#     ]
#     resources = [
#       "arn:aws:s3:::gildraen-bot/*",
#     ]
#   }
# }

data "aws_iam_policy_document" "task_role_policy" {
  statement {
    effect = "Allow"
    actions = [
      "s3:Get*",
      "s3:List*",
    ]
    resources = [
      "*",
    ]
  }
}

resource "aws_iam_policy" "task_role_policy" {
  name   = "${var.bot_name}-task-role-policy"
  policy = data.aws_iam_policy_document.task_role_policy.json
}

resource "aws_iam_role_policy_attachment" "task_role_policy" {
  policy_arn = aws_iam_policy.task_role_policy.arn
  role       = aws_iam_role.task_role.name
}

resource "aws_iam_role" "execution_role" {
  name = "${var.bot_name}-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = "production"
  }
}

data "aws_iam_policy_document" "execution_role_policy" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = [
      "arn:aws:logs:*:*:*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken",
    ]
    resources = ["*"]
  }
  statement {
    effect = "Allow"
    actions = [
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer"
    ]
    resources = [aws_ecr_repository.bot_app.arn]
  }
}

resource "aws_iam_role_policy_attachment" "execution_role_policy" {
  policy_arn = aws_iam_policy.execution_role_policy.arn
  role       = aws_iam_role.execution_role.name
}

resource "aws_iam_policy" "execution_role_policy" {
  name   = "${var.bot_name}-execution-role-policy"
  policy = data.aws_iam_policy_document.execution_role_policy.json
}
