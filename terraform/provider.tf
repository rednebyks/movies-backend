# Apply the Terraform configuration
provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Environment = "test"
      Project     = "test_project"
      Terraform   = true
    }
  }
}
