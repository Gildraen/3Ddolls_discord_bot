resource "aws_s3_bucket" "bot" {
  bucket = "gildraen-bot"
}

resource "aws_s3_bucket_acl" "bot" {
  bucket = aws_s3_bucket.bot.id
  acl    = "private"
}
