sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../helper/controlField"
], function (Controller, ControlField) {
	"use strict";

	return Controller.extend("com.ey.bamlocattr.controller.Display", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ey.bamlocattr.view.Display
		 */
		onInit: function () {
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRouteMatched(this._onObjectMatched, this);
		},
		onSelectionChange: function (evt) {
			var context = evt.getParameter('selectedItem').getBindingContext('DisplayModel');
			this.getView().byId('idSelectedObj').setBindingContext(context, 'DisplayModel');
		},
		onNavBack: function () {

			this.router.navTo("Mainlocation");
		},
		_onObjectMatched: function () {
			;
			var dmodel = sap.ui.getCore().getModel('DisModel');

			this.getView().setModel(dmodel, 'DisplayModel');
			var sContext = new sap.ui.model.Context(this.getView().getModel('DisplayModel'), '/results/0');
			this.getView().byId('idSelectedObj').setBindingContext(sContext, 'DisplayModel');

			ControlField.controlFieldsInDisplay(this);
			//this.checkFieldVisibilityForSelection();
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.ey.bamlocattr.view.Display
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.ey.bamlocattr.view.Display
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.ey.bamlocattr.view.Display
		 */
		//	onExit: function() {
		//
		//	}

	});

});