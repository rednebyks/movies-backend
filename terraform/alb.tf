
# Create Application Load Balancer (ALB)
resource "aws_lb" "my_alb" {
  name               = "myalb"
  subnets            = [aws_subnet.alb_subnet.id, aws_subnet.alb_subnet2.id]
  security_groups    = [aws_security_group.alb_sg.id]
  load_balancer_type = "application"

  tags = {
    Name = "myalb"
  }
}

# Create ALB target group
resource "aws_lb_target_group" "my_target_group" {
  name        = "MyTargetGroup"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.my_vpc.id
  target_type = "ip"

  health_check {
    path                = "/"
    protocol            = "HTTP"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 10
    interval            = 30
  }
}

# Create ALB listener
resource "aws_lb_listener" "my_listener" {
  load_balancer_arn = aws_lb.my_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Service unavailable"
      status_code  = "503"
    }
  }
}

# Create ALB listener rule
resource "aws_lb_listener_rule" "my_listener_rule" {
  listener_arn = aws_lb_listener.my_listener.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.my_target_group.arn
  }

  condition {
    host_header {
      values = [aws_lb.my_alb.dns_name]
    }
  }
}

output "alb_dns" {
  value = aws_lb.my_alb.dns_name
}
