TESTS = $(shell ls -S `find test/unit -type f -name "*.js" -print`)
MOCHA = ./node_modules/.bin/mocha
DOCV = ./node_modules/.bin/docv
mkdir = mkdir test
PWD = $(shell pwd)

install:
	@npm install .
	@cd demos; tnpm install .
	@ln -s $(PWD)/src $(PWD)/demos/node_modules/datav

release:
	@echo Release datav

test:
	@$(MOCHA) -R list -r test/common/env.js $(TESTS)

doc:
	@$(DOCV) -s src -T docs

.PHONY: \
	install release test
