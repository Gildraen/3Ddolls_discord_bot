variable "bot_name" {
  type = string
}

variable "image_version" {
  type = string
}

variable "cluster" {
  type = object({
    id = string
  })
}
