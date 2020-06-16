install:
	npm install

lint:
	npx eslint .

build:
	rm -rf dist
	npm run build

start DevServer:
	npm run devserver
