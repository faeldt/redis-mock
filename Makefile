TESTS = $(shell find test/ -name '*.test.js')

run-tests:
	@./node_modules/.bin/mocha --timeout 3000 $(TESTS)

test:
	@$(MAKE) NODE_PATH=lib TESTS="$(ALL_TESTS)" run-tests

.PHONY: test
