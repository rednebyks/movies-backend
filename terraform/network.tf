# Create VPC
resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16" # Replace with your desired CIDR block

  tags = {
    Name = "MyVPC"
  }
}

# Create internet gateway (IGW)
resource "aws_internet_gateway" "my_igw" {
  vpc_id = aws_vpc.my_vpc.id
}

# Create subnets
resource "aws_subnet" "alb_subnet" {
  vpc_id            = aws_vpc.my_vpc.id
  cidr_block        = "10.0.1.0/24" # Replace with your desired CIDR block
  availability_zone = "us-east-1a"  # Replace with your desired AZ

  tags = {
    Name = "ALB Subnet 1"
  }
}

resource "aws_subnet" "alb_subnet2" {
  vpc_id            = aws_vpc.my_vpc.id
  cidr_block        = "10.0.10.0/24" # Replace with your desired CIDR block
  availability_zone = "us-east-1b"   # Replace with your desired AZ

  tags = {
    Name = "ALB Subnet 2"
  }
}

resource "aws_subnet" "ecs_subnet2" {
  vpc_id            = aws_vpc.my_vpc.id
  cidr_block        = "10.0.2.0/24" # Replace with your desired CIDR block
  availability_zone = "us-east-1a"  # Replace with your desired AZ

  tags = {
    Name = "ECS Subnet 1"
  }
}

resource "aws_subnet" "ecs_subnet" {
  vpc_id            = aws_vpc.my_vpc.id
  cidr_block        = "10.0.20.0/24" # Replace with your desired CIDR block
  availability_zone = "us-east-1b"   # Replace with your desired AZ

  tags = {
    Name = "ECS Subnet 2"
  }
}


# Create route tables
resource "aws_route_table" "alb_route_table" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_igw.id
  }

  tags = {
    Name = "ALB Route Table"
  }
}

resource "aws_route_table_association" "alb_subnet_association" {
  subnet_id      = aws_subnet.alb_subnet.id
  route_table_id = aws_route_table.alb_route_table.id
}

# Create security groups
resource "aws_security_group" "alb_sg" {
  vpc_id = aws_vpc.my_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ALB Security Group"
  }
}

resource "aws_security_group" "ecs_sg" {
  vpc_id = aws_vpc.my_vpc.id

  tags = {
    Name = "ECS Security Group"
  }
}

resource "aws_security_group_rule" "alb-ecs-ingress" {
  protocol                 = "-1"
  from_port                = 0
  to_port                  = 0
  type                     = "ingress"
  source_security_group_id = aws_security_group.alb_sg.id
  security_group_id        = aws_security_group.ecs_sg.id
}

resource "aws_security_group_rule" "ecs-egress" {
  protocol          = "-1"
  from_port         = 0
  to_port           = 0
  type              = "egress"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ecs_sg.id
}

# Elastic IP for NAT (Netword Address Translation) 
resource "aws_eip" "nat_eip" {
  vpc = true
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = element(aws_subnet.alb_subnet.*.id, 0)
  depends_on    = [aws_internet_gateway.my_igw]

  tags = {
    Name = join("-", [var.app, "nat", "gateway", var.env])
  }
}

resource "aws_route_table" "ecs" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

}
resource "aws_route_table_association" "ecs" {
  count = var.ecs_subnet_number

  subnet_id      = element(aws_subnet.ecs_subnet.*.id, count.index)
  route_table_id = aws_route_table.ecs.id
}
