(function (window, document) {
	'use strict';

	// IE forEach fix
	(function () {
		if ( typeof NodeList.prototype.forEach === 'function' ) return false;
		NodeList.prototype.forEach = Array.prototype.forEach;
	})();

	console.log("works");
})(window, document);
