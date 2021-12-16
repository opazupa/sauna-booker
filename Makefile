# Add the following 'help' target to your Makefile
# And add help text after each target name starting with '\#\#'

help:	## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

setup:  			## Setup environment
	npm install
	cp -n .env.dev .env.local

start-services:			## Start local dev services
	docker-compose --env-file ./.env.local up

stop-services:			## Stop local dev services
	docker-compose down

book:  				## Book sauna
	npm run invoke -- book-sauna --data '{"ignoreOpeningHour":true}'

log:  				## Log sauna usage
	npm run invoke -- log-sauna-usage

refresh-token:  		## Get new refresh token
	npm run generate-token