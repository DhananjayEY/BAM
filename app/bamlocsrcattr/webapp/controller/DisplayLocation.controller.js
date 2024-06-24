sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../helper/controlField"
], function (Controller, ControlField) {
	"use strict";

	return Controller.extend("com.ey.bamlocsrcattr.controller.DisplayLocation", {
		
		onInit: function () {
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRouteMatched(this._onObjectMatched, this);
		},
		onSelectionChange: function (evt) {
			var context = evt.getParameter("selectedItem").getBindingContext("DisplayModel");
			this.getView().byId("idSelectedObj").setBindingContext(context, "DisplayModel");
		},
		onNavBack: function () {
			this.getOwnerComponent().getModel("check").param = "display";
			this.router.navTo("LocationAtrributes", {}, true);
		},
		_onObjectMatched: function () {
			var dmodel = sap.ui.getCore().getModel("DisModel");
	
			this.getView().setModel(dmodel, "DisplayModel");
			var sContext = new sap.ui.model.Context(this.getView().getModel("DisplayModel"), "/results/0");
			this.getView().byId("idSelectedObj").setBindingContext(sContext, "DisplayModel");
			
			ControlField.controlFieldsInDisplay(this);
		},
		
		getModel: function(oModel) {
			return this.getOwnerComponent().getModel(oModel);	
		}
	});

});