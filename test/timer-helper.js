if (process.env['VALID_TESTS']) {
  // Sinon will not work against actual redis so replace instead just return an noop interface
  module.exports = {
	useFakeTimers: function() {
		return {
			tick: function() {},
			restore: function() {}
		}
	}
  };    
} else {
  module.exports = require('sinon');
}