TESTS = $(shell find test/ -name '*.transactions.test.js')

run-tests:
	@./node_modules/.bin/mocha --timeout 3000 $(TESTS)

test:
	echo $(TESTS)
	@$(MAKE) NODE_PATH=lib TESTS="$(TESTS)" run-tests

#This is used to validate the tests work on redis_mock
check-tests:
	@$(MAKE) NODE_PATH=lib VALID_TESTS="TRUE" TESTS="$(ALL_TESTS)" run-tests

.PHONY: test
