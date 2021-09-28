# Add the following 'help' target to your Makefile
# And add help text after each target name starting with '\#\#'

help:	## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

setup:  			## Setup environment
	npm install
	cp .env.dev .env
	make start-services

start-services:			## Start local dev services
	docker-compose up

stop-services:			## Stop local dev services
	docker-compose down

book:  				## Book sauna
	npm run invoke -- book-sauna --data '{"ignoreMidnight":true}'
