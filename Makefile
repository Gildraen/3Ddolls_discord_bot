## Development

start:
	docker compose run app yarn build
	docker compose run app yarn start

## Deployment
push: 
	docker compose run aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin 061542561368.dkr.ecr.eu-west-3.amazonaws.com
	docker tag test-bot 061542561368.dkr.ecr.eu-west-3.amazonaws.com/test-bot
	docker push 061542561368.dkr.ecr.eu-west-3.amazonaws.com/test-bot

start-task:
	docker compose run aws run-task --task-definition arn:aws:ecs:eu-west-3:061542561368:task-definition/test-bot:1

create-service:
	docker compose run aws ecs create-service --desired-count 1 --cluster arn:aws:ecs:eu-west-3:061542561368:cluster/3ddols-bot --service-name test-bot --task-definition arn:aws:ecs:eu-west-3:061542561368:task-definition/test-bot:1