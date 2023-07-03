data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "execution_role" {
  name               = "ecsExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role" {
  role       = aws_iam_role.execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_cluster" "my_ecs_cluster" {

  name = "my_ecs_cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  depends_on = [ aws_lb.my_alb ]
}

# Create ECS task definition for Nginx container
resource "aws_ecs_task_definition" "my_task_definition" {
  family                   = "MyTaskDefinition"
  execution_role_arn       = aws_iam_role.execution_role.arn
  cpu                      = 512
  memory                   = 1024
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  container_definitions = <<DEFINITION
  [
    {
      "name": "nginx-container",
      "image": "nginx:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${aws_cloudwatch_log_group.app.name}",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "nginx"
        }
      }
    }
  ]
  DEFINITION
}

resource "aws_cloudwatch_log_group" "app" {
  name              = format("ecs-task-group/app-%s-%s", var.app, var.env)
  retention_in_days = "1"
}

# Create ECS service with Nginx container task
resource "aws_ecs_service" "my_service" {
  name            = "MyService"
  cluster         = aws_ecs_cluster.my_ecs_cluster.id
  task_definition = aws_ecs_task_definition.my_task_definition.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    security_groups = [aws_security_group.ecs_sg.id]
    subnets         = [aws_subnet.ecs_subnet.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.my_target_group.arn
    container_name   = "nginx-container"
    container_port   = 80
  }
}
