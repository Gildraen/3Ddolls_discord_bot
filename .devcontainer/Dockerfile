FROM docker:23 AS base

RUN apk update && apk add git make
RUN apk add terraform --repository=http://dl-cdn.alpinelinux.org/alpine/v3.17/main
RUN apk add yarn