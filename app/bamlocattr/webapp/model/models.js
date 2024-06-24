sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createModel: function () {
			var data = {
				SupplyAggrLocationType: [],
				SupplyLocationPlatform: [],
				SupplyActivity: [],
				SupplyRegion: [],
				
				oData: [{
					"MacroLocation": "",
					"Location": "",
					"SupplyLocationDescriptionkey": "",
					"SupplyAggrLocationTypekey": "",
					"SupplyLocationPlatform": "",
					"SupplyActivity": "",
					"SupplyRegion": "",
					"SupplyRegionDescription": "",
					"Zlocdesc2": "",
					
					"disableOnSubmit": true, 
					"userSubmitted": false,
					"icon": "sap-icon://error",
					"iconColor": "white"
				}]
			};
			var model = new JSONModel(data);
			return model;
			
		}

	};
});