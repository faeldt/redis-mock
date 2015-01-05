if (process.env['VALID_TESTS']) {
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