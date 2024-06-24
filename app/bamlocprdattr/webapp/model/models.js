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
		
		createJSONModel: function(OData) {
			var oModel = new JSONModel(OData);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createModel: function () {
			var data = {
				oData: [
					{
						"ProductID": "",
						"LocationID": "",
						"AggregateLocation": "",
						"PlanningPlantID": "",
						"StockingNodeTypeIndicator": "",
						"PeriodsBetweenReplenishment": "",
						"Stockingstockpolicyindicator": "",
						"ForecastRelevant": "",
						"MasterScheduler": "",
						"DeploymentPlanner": "",
						"MpsSubId": "",
						"ApsSubId": "",
						"InventoryHoldingPolicy": "",
						"SubnetworkID": "",
						"ProductionFrozenZone": "",
						"ExternalRecieptFrozenZone": "",
						"ConsumptionType": "",
						"ForecastConsumptionMode": "",
						"ForecastOffsetinMonths": "",
						"MinOrderLeadTime": "",
						"SafetyStockMethod": "",
						"StaticSafetyStockQuantity": "",
						"RelativePercentageStaticSafetyStock ": "",
						"WFCSupplyMethod": "",
						"StaticWFCQuantity": "",
						"WFCDemandMethod": "",
						"TargetStockLevelMethod": "",
						"PurchaseConstraint": "",
						"ProductionConstraint": "",
						"ForecastRelease": "",
						"InventoryChannelStrategy":"",
						"DemandReassignmentParentID": "",
						"ProductPriority": "",
						"BOMRelevancy": "",
						"PlanningStrategy": "",
						"Zupsiderel": "",
				    	"Zubuss1": "",
				    	"Zubuss2": "",
				    	"Zubuss3": "",
						"disableOnSubmit": true, 
						"userSubmitted": false,
						"icon": "sap-icon://error",
						"iconColor": "white"
					}
				]
			};
			var model = new JSONModel(data);
			return model;
		}

	};
});