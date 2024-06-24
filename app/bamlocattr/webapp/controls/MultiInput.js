sap.ui.define([
	"sap/m/MultiInput",
	"sap/ui/core/IconPool",
	"sap/m/MultiInputRenderer",
], function (MultiInput, IconPool, MultiInputRenderer) {
	"use strict";

	return MultiInput.extend("com.ey.bamlocattr_SEED.controls.MultiInput", {
		
		metadata: {
			events: {
				endButtonPress: {},
				handlePaste: {}
			},
			properties: {
				showClearAll: {
					type: "boolean",
					defaultValue: false
				}
			}
		},

		init: function () {
			MultiInput.prototype.init.apply(this);
			this.attachBrowserEvent("paste", this.handlePaste.bind(this));
			this.addEndIcon({
				id: this.getId() + "-deleteAll",
				src: "sap-icon://sys-cancel",
				noTabStop: true,
				tooltip: "Clear all",
				press: [this.onEndButtonPress, this],
			}); 
		},
		

		handlePaste: function (oEvent) {

			var keys = oEvent.originalEvent.clipboardData.getData('text').trim().split("\n");
			oEvent.preventDefault();
			oEvent.stopPropagation();

			if (keys.length > 1) {
				var tokens = keys.reduce(function (result, item) {
					result.push(new sap.m.Token({
						key: item,
						text: item
					}));
					return result;
				}, []);
				
				this.setTokens(tokens);
				// this.setShowClearAll(true);
			} else {
				this.setValue(keys);
			}
			
		},

		onEndButtonPress: function () {
			if (this.getEnabled() && this.getEditable()) {
				if (this.getTokens().length) {
					this.removeAllTokens();
				}
				
				event.preventDefault();
				event.stopPropagation();
			}
		},

		renderer: function (oRm, oControl) {
			if(oControl.getTokens().length > 1) {
			    oControl.setShowClearAll(true);
			} else {
				oControl.setShowClearAll(false);
			}
			
			oControl.getAggregation("_endIcon")[1].setVisible(oControl.getShowClearAll());
			MultiInputRenderer.render(oRm, oControl);
		}
	});
});