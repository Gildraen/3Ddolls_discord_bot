## Development
# install:
# 	docker compose run app yarn install
	
# start:
# 	docker compose run app yarn build
# 	docker compose run app yarn start

# ## Deployment
# push:
# 	docker build -t ${repo} .
# 	docker compose run aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin 061542561368.dkr.ecr.eu-west-3.amazonaws.com
# 	docker tag ${repo} 061542561368.dkr.ecr.eu-west-3.amazonaws.com/${repo}
# 	docker push 061542561368.dkr.ecr.eu-west-3.amazonaws.com/${repo}

# start-task:
# 	docker compose run aws run-task --task-definition arn:aws:ecs:eu-west-3:061542561368:task-definition/test-bot:1

# create-service:
# 	docker compose run aws ecs create-service --desired-count 1 --cluster arn:aws:ecs:eu-west-3:061542561368:cluster/3ddols-bot --service-name test-bot --task-definition arn:aws:ecs:eu-west-3:061542561368:task-definition/test-bot:1

DOCKER_IMAGE=test_bot

build:
	docker build -t $(DOCKER_IMAGE) .

push: build
	docker tag $(DOCKER_IMAGE) 061542561368.dkr.ecr.eu-west-3.amazonaws.com/$(DOCKER_IMAGE):latest
	docker compose run aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin 061542561368.dkr.ecr.eu-west-3.amazonaws.com
	docker push 061542561368.dkr.ecr.eu-west-3.amazonaws.com/$(DOCKER_IMAGE):latest

deploy:push
	terraform -chdir=terraform init 
	terraform -chdir=terraform apply -auto-approve

clean:
	# docker rmi $(DOCKER_IMAGE)
	terraform -chdir=terraform destroy -auto-approve

test:
	docker compose run app yarn build_and_start