;
(function($, undefined) {
	"use strict";

	var dataName = 'checkboxTreeConfig';
	var _config_ = {
		indeterminateState: false,
	};

	function state(cb) {
		if ($(cb).prop('checked')) return 1;
		if ($(cb).prop('indeterminate')) return 0.5;
		return 0;
	}

	function indeterminateStateFunc(cnt, len, indeterminateState) {
		if (indeterminateState)
			return ((cnt == 0) ? false : true);
		else
			return ((cnt == len) ? true : false);
	}

	function updateStateUpperSide(selfCB) {
		var selfUL = $(selfCB).parent().parent();
		var config = $(selfCB).data(dataName);
		var classname = config.className;
		var indeterminateState = config.indeterminateState;
		var parentINPUT = $('>input.' + classname + '[type="checkbox"]', selfUL.parent());
		if (parentINPUT.length == 0) return null;
		var bros = $('>li>input.' + classname + '[type="checkbox"]', selfUL);
		var len = bros.length
		var cnt = 0;
		for (var i = 0; i < len; i++)
			if (state(bros[i]) > 0) cnt++;
		$(parentINPUT)
			.prop('indeterminate', ((cnt == 0 || cnt == len) ? false : true))
			.prop('checked', indeterminateStateFunc(cnt, len, indeterminateState));
		return parentINPUT;
	}

	function updateStateLowerSide(selfCB) {
		var val = state(selfCB);
		var selfLI = $(selfCB).parent();
		var config = $(selfCB).data(dataName);
		var classname = config.className;
		var childrenINPUT = $('ul>li>input.' + classname + '[type="checkbox"]', selfLI);
		if (childrenINPUT.length == 0) return null;
		$(childrenINPUT).prop('indeterminate', false);
		$(childrenINPUT).prop('checked', val);
		return childrenINPUT;
	}

	function updateStatus() {
		var config = $(this).data(dataName);
		if (!config) return;
		var cb, lim;
		cb = $(this);
		lim = 0;
		while (cb != null) {
			cb = updateStateUpperSide(cb);
		}
		cb = $(this);
		lim = 0;
		while (cb != null) {
			cb = updateStateLowerSide(cb);
		}
		if (!$.isFunction(config.afterChange)) return;
		config.afterChange(cb);
	}

	$.fn.checkboxTree = function(options) {
		if (options && typeof options !== 'object') return;
		var config = {};
		$.extend(true, config, _config_);
		config.className = 'checkboxTree' + ((new Date()).getTime());
		$.extend(true, config, options);
		this.each(function() {
			$(this)
				.data(dataName, config)
				.addClass(config.className)
				.on('change', updateStatus);
		});
	}
})(jQuery);
