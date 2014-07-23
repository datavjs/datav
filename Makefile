TESTS = $(shell ls -S `find test/unit -type f -name "*.js" -print`)
MOCHA = ./node_modules/.bin/mocha
install:
	@npm install .

release:
	echo Release datav

test:
	@$(MOCHA) -R list -r test/common/env.js $(TESTS)

.PHONY: install test