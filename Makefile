TESTS = $(shell find test/ -name '*.test.js')
OPTS = --timeout 3000

run-tests:
	@./node_modules/.bin/mocha $(OPTS) $(TESTS)

test:
	@$(MAKE) NODE_PATH=lib TESTS="$(ALL_TESTS)" run-tests

test-server:
	@$(MAKE) NODE_PATH=lib TESTS="test/redis-mock.server.test.js" run-tests

test-lists:
	@$(MAKE) NODE_PATH=lib TESTS="test/redis-mock.list.test.js" run-tests

#This is used to validate the tests work on redis_mock
check-tests:
	@$(MAKE) NODE_PATH=lib VALID_TESTS="TRUE" TESTS="$(ALL_TESTS)" run-tests

.PHONY: test
