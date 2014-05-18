/**
 * jQuery.iScroll
 * Copyright Â© 2012 - Appcropolis LLC
 * Author Raul Sanchez (support@appcropolis.com)
 *
 * Examples and documentation at: http://appcropolis.com/jquery-wrapper-for-iscroll/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($){
    $.fn.iscroll = function(options){
		if(this.data('iScrollReady') == null){
			var that = this;
            var options =  $.extend({}, options);
				options.onScrollEnd = function(){
					that.triggerHandler('onScrollEnd', [this]);
				};
			arguments.callee.object  = new iScroll(this.get(0), options);
			// NOTE: for some reason in a complex page the plugin does not register
			// the size of the element. This will fix that in the meantime.
			setTimeout(function(scroller){
				scroller.refresh();
			}, 1000, arguments.callee.object);
			this.data('iScrollReady', true);
		}else{
			arguments.callee.object.refresh();
		}
		return arguments.callee.object;
	};
})(jQuery);