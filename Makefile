-TESTS = $(shell ls -S `find test/unit -type f -name "*.js" -print`)
-MOCHA = ./node_modules/.bin/mocha
-mkdir = mkdir test

install:
	@npm install .
	@$(mkdir)
	@echo 1234

release:
	echo Release datav

test:
	@$(MOCHA) -R list -r test/common/env.js $(TESTS)

.PHONY: install test
