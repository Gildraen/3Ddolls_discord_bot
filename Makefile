DOCKER          = docker
DOCKER_COMPOSE  = docker-compose

EXEC_NODE       = $(DOCKER_COMPOSE) run --rm --service-ports node

YARN			= $(EXEC_NODE) yarn
NG				= $(EXEC_NODE) ng

##
##Project
##-------

build:
	@$(DOCKER_COMPOSE) pull --parallel --quiet --ignore-pull-failures 2> /dev/null
	$(DOCKER_COMPOSE) build --pull

kill:
	$(DOCKER_COMPOSE) kill
	$(DOCKER_COMPOSE) down --volumes --remove-orphans

install: ## Install and start the project
install: build start node_modules yarn-start

clean: ## Stop the project and remove generated files
clean: kill
	rm -rf ./app/node_modules

reset: ## Stop and start a fresh install of the project
reset: clean install

start: ## Start the project
	$(DOCKER_COMPOSE) up -d --remove-orphans --no-recreate

stop: ## Stop the project
	$(DOCKER_COMPOSE) stop

restart: ## Restart the project
restart: stop start

##
##DOCKER
##-------

##
##YARN
##-------

package-lock.json: ./app/package.json
	$(YARN) update

node_modules: ./app/yarn.lock
	$(YARN) install --network-timeout 600000

yarn-start: ## Start webserver for developpement
yarn-start:
	$(YARN) start

##
##NG
##-------

ng: ## Execute a ng command
ng:
	$(NG) $(command)

##
##Tests
##-------

##
##QA
##-------

##
##CI
##-------

##
##Shell
##-----

shell-node: ## Access sh node container
shell-node:
	$(EXEC_NODE) sh

##
##Logs
##-----

logs-node: ## Access logs node container
logs-node:
	$(DOCKER_COMPOSE) logs node

##
##Documentation
##-----

.DEFAULT_GOAL := doc
doc: ## List commands available in Makefile
doc:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: doc
