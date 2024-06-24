/*
	global XLSX 
	eslint > : "off"
*/
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"../helper/productLevel",
	"../helper/material"
], function (Controller, JSONModel, Filter, FilterOperator, MessageBox, ProductValueHelp, MaterialValueHelp) {
	"use strict";
	var that;

	return Controller.extend("com.ey.bamlocprdattr.controller.Create", {

		onInit: function () {
			that = this;
			this.indexErrorValidation = {};
			this.errorData = [];
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.getRoute("Create").attachPatternMatched(this._onObjectMatched, this);
		},
		onNavBack: function () {
			this.getOwnerComponent().getModel("check").param = "create/didNotSubmit";

			if (this.onDataSubmitted === true) {
				this.getOwnerComponent().getModel("check").param = "create/submitted";
			}
			this.router.navTo("Main");
		},
		_onObjectMatched: function () {
			this.onDataSubmitted = false;
			var oData = $.extend(true, [], this.getOwnerComponent().getModel("root").getData());

			oData.oData[0].StockingNodeTypeIndicator = oData.StockingNodeTypeIndicator[2].ParamValue
			oData.oData[0].PeriodsBetweenReplenishment = 4
			oData.oData[0].Stockingstockpolicyindicator = ""
			oData.oData[0].ForecastRelevant = oData.ForecastRelevant[3].ParamValue
			oData.oData[0].MasterScheduler = ""
			oData.oData[0].DeploymentPlanner = ""
			oData.oData[0].InventoryHoldingPolicy = oData.InventoryHoldingPolicy[2].ParamValue
			oData.oData[0].ProductionFrozenZone = 8
				//oData.oData[0].ExternalRecieptFrozenZone = 8
			oData.oData[0].ConsumptionType = oData.ConsumptionType[0].ParamValue
			oData.oData[0].ForecastConsumptionMode = oData.ForecastConsumptionMode[2].ParamValue
			oData.oData[0].ForecastOffsetinMonths = 0
			oData.oData[0].MinOrderLeadTime = 0
			oData.oData[0].SafetyStockMethod = oData.SafetyStockMethod[3].ParamValue
			oData.oData[0].StaticSafetyStockQuantity = ""
			oData.oData[0].RelativePercentageStaticSafetyStock = ""
			oData.oData[0].WFCSupplyMethod = oData.WFCSupplyMethod[1].ParamValue
			oData.oData[0].StaticWFCQuantity = 0
			oData.oData[0].WFCDemandMethod = oData.WFCDemandMethod[1].ParamValue
			oData.oData[0].TargetStockLevelMethod = oData.TargetStockLevelMethod[3].ParamValue
			oData.oData[0].PurchaseConstraint = oData.PurchaseConstraint[1].ParamValue
			oData.oData[0].ProductionConstraint = oData.ProductionConstraint[1].ParamValue
			oData.oData[0].ForecastRelease = oData.ForecastRelease[2].ParamValue
			oData.oData[0].InventoryChannelStrategy = oData.InventoryChannelStrategy[2].ParamValue
			oData.oData[0].DemandReassignmentParentID = ""
			oData.oData[0].ProductPriority = ""
			oData.oData[0].PlanningStrategy = oData.PlanningStrategy[1].ParamValue;
			oData.oData[0].BOMRelevancy = oData.BOMRelevant[0].ParamValue
			oData.oData[0].MpsSubId = oData.ApsSubNetworkID[0].ParamValue
			oData.oData[0].ApsSubId = oData.MpsSubNetworkID[0].ParamValue

			this.getView().getModel("oModel").setData(oData);

			this.getView().getModel('oModel').refresh(true);
			this.getView().byId("statusCol").setVisible(false);
			this.getView().byId("Submit").setEnabled(true);
			this.getView().byId("fileUploader").setValue("");
		},

		onBomTexFormat: function (oEvent) {
			if (oEvent.getParameter("newValue").match(/^[Xx ]/g) === null) {
				oEvent.getSource().setValue();
			} else {
				oEvent.getSource().setValue(oEvent.getParameter("newValue").toUpperCase());
			}
		},

		onProductPriorityFormat: function (oEvent) {
			if (oEvent.getParameter("newValue").includes(0)) {
				oEvent.getSource().setValue("");
			}

			if (oEvent.getParameter("newValue").length > 1) {
				oEvent.getSource().setValue(oEvent.getParameter("newValue").slice(1, 2));

				if (oEvent.getParameter("newValue").match(/0/g) !== null) {
					oEvent.getSource().setValue(oEvent.getParameter("newValue").slice(0, 1));
				}
			}
		},

		/*periodsBetweenFormat: function(oEvent){
			var newValue = oEvent.getParameter("newValue");
			
			if(newValue.includes(0)){
				oEvent.getSource().setValue("");
			}
			
			if( oEvent.getParameter("newValue").length > 2 ){
				//oEvent.getSource().setValue( oEvent.getParameter("newValue").slice(0,2) );
				
				
				if( oEvent.getParameter("newValue").match(/0/g) !== null ){
					oEvent.getSource().setValue( oEvent.getParameter("newValue").slice(0, 2) );
				}
			}
		},*/

		onDelete: function (evt) {

			var index = Number(evt.getSource().getBindingContext("oModel").getPath().split('/')[2]),
				cMdl = this.getOwnerComponent().getModel("oModel");
			var crop = cMdl.getData().oData;
			crop.splice(index, 1);
			cMdl.refresh();

			var count = 0,
				flag = true;
			this.errorData.forEach((item) => {
				if (item.userSubmitted === true) {
					count++;
					//flag = false;
				}
			}, this);

			if (count !== 0) {
				if (count === this.errorData.length) {
					flag = false;
				}
			}

			this.getView().byId("Submit").setEnabled(flag);

		},

		onDownloadTemplate: function (oEvent) {

			window.open(sap.ui.require.toUrl("com/ey/bamlocprdattr/templates") +
				"/Location_Product_BAM_Upload_Template.zip", "_self");

		},

		handleUploadPress: function (oEvent) {
			var oFileUpload = this.getView().byId('fileUploader');
			var that = this;
			if (!oFileUpload.getValue()) {
				// sap.m.Message.show('Choose File First')
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Choose File First", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}

				);
			} else {
				var file = oFileUpload.getFocusDomRef().files[0];
				if (file && window.FileReader) {
					var reader = new FileReader(); // Create file Reader Object
					reader.onload = function (e) {
						var data = e.target.result;
						var workbook = XLSX.read(data, {
							type: 'binary'
						});
						that.ExcelCSVJson(workbook);

					};
					reader.readAsBinaryString(file);
				}
			}
		},
		
		checkFileValidity: function (workbook) {

			var sheets = Object.keys(workbook.Sheets),
				worksheet = workbook.Sheets[sheets[0]],
				columns = XLSX.utils.decode_range(worksheet['!ref']).e.c + 1,
				headers = [],
				defaultHeaders = [],
				count = 0;

			for (var i = 0; i < columns; ++i) {
				headers[i] = worksheet[`${XLSX.utils.encode_col(i)}1`].v;
				if(headers[i].toLowerCase() == "Agg ID Change Indicator".toLowerCase()) {
					headers.splice(i, 0);
				}
			}

			defaultHeaders = [
					"Product ID", "Location ID", "Aggregate Location", "Planning Plant", "Stocking Node Type Indicator",
					"Periods Between Replenishment", "Stocking stock policy indicator", "Forecast Relevant",
					"Master Scheduler", "Deployment Planner", "Inventory Holding Policy", "Production Frozen Zone",
					"Consumption Type", "Forecast Consumption Mode", "Forecast Offset in Months", "Min Order Lead Time", 
					"Safety Stock Method", "Static Safety Stock Quantity", "Relative Percentage Static Safety Stock", 
					"WFC Supply Method", "Static WFC Quantity", "WFC Demand Method", "Target Stock Level Method", 
					"Purchase Constraint", "Production Constraint", "Forecast Release", "Inventory Channel Strategy", 
					"Demand Reassignment Parent ID", "Product Priority", "BOM Relevancy", "Planning Strategy", 
					"MPS Subnetwork ID", "APS Subnetwork ID"
				],
				count = 0;

			var items = headers.filter((item, index) => {
				defaultHeaders.forEach((oItem, oIndex) => {
					if (item.trim().toLowerCase() === oItem.toLowerCase()) {
						count++;
					}
				}, this);
			}, this);

			return count === defaultHeaders.length
		},

		ExcelCSVJson: function (workbook, evt) {
			var result = this.checkFileValidity(workbook);
			if (!result) {
				MessageBox.error("Column Headers not matching with template. Please download template and try again");
				this.getView().getModel("oModel").setProperty('/oData', [], null, true)
				return;
			}

			var oBusy = new sap.m.BusyDialog();
			oBusy.open();

			var xl_Row_Object,
				tMdl,
				obj = [];

			xl_Row_Object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);

			if (xl_Row_Object.length > 200) {
				MessageBox.error("Maximum number of line items is 200");
				xl_Row_Object.splice(200);
			}
			
			xl_Row_Object.forEach(item => {
				if( item["Agg ID Change Indicator"] ){
					delete item["Agg ID Change Indicator"];
				}
			}, this);

			if (tMdl !== undefined) {
				tMdl = this.getView().getModel();
			} else {
				tMdl = this.getView().getModel("oModel");
			}

			var data = [],
				modelValues = tMdl.getData();

			try {
				xl_Row_Object.forEach((oItem) => {
					obj.push(Object.fromEntries(Object.entries(oItem)
						.map(([key, value]) =>
							key.trim().toLowerCase() === "Product ID".toLowerCase() ? [key = "ProductID", value] :
							key.trim().toLowerCase() === "Aggregate Location".toLowerCase() ? [key = "AggregateLocation", value] :
							key.trim().toLowerCase() === "Location ID".toLowerCase() ? [key = "LocationID", value] :
							key.trim().toLowerCase() === "Planning Plant".toLowerCase() ? [key = "PlanningPlantID", value] :
							key.trim().toLowerCase() === "Stocking Node Type Indicator".toLowerCase() ? [key = "StockingNodeTypeIndicator", value =
								value.split("-")[0].trim()
							] :
							key.trim().toLowerCase() === "Periods Between Replenishment".toLowerCase() ? [key = "PeriodsBetweenReplenishment", value] :
							key.trim().toLowerCase() === "Stocking stock policy indicator".toLowerCase() ? [key = "Stockingstockpolicyindicator", value =
								value.split("-")[0].trim()
							] :
							key.trim().toLowerCase() === "Forecast Relevant".toLowerCase() ? [key = "ForecastRelevant", value = value.split("-")[0].trim()] :
							key.trim().toLowerCase() === "Master Scheduler".toLowerCase() ? [key = "MasterScheduler", value] :
							key.trim().toLowerCase() === "Deployment Planner".toLowerCase() ? [key = "DeploymentPlanner", value] :
							key.trim().toLowerCase() === "Inventory Holding Policy".toLowerCase() ? [key = "InventoryHoldingPolicy", value = value.split(
								"-")[0].trim()] :
							key.trim().toLowerCase() === "Production Frozen Zone".toLowerCase() ? [key = "ProductionFrozenZone", value] :
							//key.trim().toLowerCase() === "External Reciept Frozen Zone".toLowerCase() ? [key = "ExternalRecieptFrozenZone", value] :
							key.trim().toLowerCase() === "Consumption Type".toLowerCase() ? [key = "ConsumptionType", value = value.split("-")[0].trim()] :
							key.trim().toLowerCase() === "Forecast Consumption Mode".toLowerCase() ? [key = "ForecastConsumptionMode", value = value] :
							key.trim().toLowerCase() === "Forecast Offset in Months".toLowerCase() ? [key = "ForecastOffsetinMonths", value] :
							key.trim().toLowerCase() === "Min Order Lead Time".toLowerCase() ? [key = "MinOrderLeadTime", value] :
							key.trim().toLowerCase() === "Safety Stock Method".toLowerCase() ? [key = "SafetyStockMethod", value = value.split("-")[0].trim()] :
							key.trim().toLowerCase() === "Static Safety Stock Quantity".toLowerCase() ? [key = "StaticSafetyStockQuantity", value] :
							key.trim().toLowerCase() === "Relative Percentage Static Safety Stock".toLowerCase() ? [key =
								"RelativePercentageStaticSafetyStock", value
							] :
							key.trim().toLowerCase() === "WFC Supply Method".toLowerCase() ? [key = "WFCSupplyMethod", value = value.split("-")[0].trim()] :
							key.trim().toLowerCase() === "Static WFC Quantity".toLowerCase() ? [key = "StaticWFCQuantity", value] :
							key.trim().toLowerCase() === "WFC Demand Method".toLowerCase() ? [key = "WFCDemandMethod", value = value.split("-")[0].trim()] :
							key.trim().toLowerCase() === "Target Stock Level Method".toLowerCase() ? [key = "TargetStockLevelMethod", value = value.split(
								"-")[0].trim()] :
							key.trim().toLowerCase() === "Purchase Constraint".toLowerCase() ? [key = "PurchaseConstraint", value = value.split("-")[0]
								.trim()
							] :
							key.trim().toLowerCase() === "Production Constraint".toLowerCase() ? [key = "ProductionConstraint", value = value.split("-")[
								0].trim()] :
							key.trim().toLowerCase() === "Forecast Release".toLowerCase() ? [key = "ForecastRelease", value = value.split("-")[0].trim()] :
							key.trim().toLowerCase() === "Inventory Channel Strategy".toLowerCase() ? [key = "InventoryChannelStrategy", value = value.split(
								"-")[0].trim()] :
							key.trim().toLowerCase() === "Demand Reassignment Parent ID".toLowerCase() ? [key = "DemandReassignmentParentID", value] :
							key.trim().toLowerCase() === "Product Priority".toLowerCase() ? [key = "ProductPriority", value] :
							//key.trim().toLowerCase() === "IBP Supply Relevant".toLowerCase() ? [key = "IBPSupplyRelevant", value] :
							key.trim().toLowerCase() === "BOM Relevancy".toLowerCase() ? [key = "BOMRelevancy", value] : 
							key.trim().toLowerCase() === "Planning Strategy".toLowerCase() ? [key = "PlanningStrategy", value] : 
							key.trim().toLowerCase() === "APS Subnetwork ID".toLowerCase() ? [key = "ApsSubId", value = value.split("-")[0].trim()] : 
							key.trim().toLowerCase() === "MPS Subnetwork ID".toLowerCase() ? [key = "MpsSubId", value = value.split("-")[0].trim()] : null)));
				}, this);
			} catch (ex) {
				MessageBox.error("Incorrect excel mapping");
			}

			obj.forEach((oItem, oIndex) => {
				
				oItem.BOMRelevancy = oItem.BOMRelevancy.split("-")[0].trim() === "X" ? "Y" : "X"

				oItem.disableOnSubmit = true
				oItem.userSubmitted = false
				oItem.icon = "sap-icon://error"
				oItem.iconColor = "white"

				data.push(oItem);

			}, this);

			var promise = new Promise((resolve, reject) => {
				resolve(this.getView().getModel("oModel").setProperty('/oData', data, null, true));
			}, this);

			promise.then(() => {
				oBusy.close();
			}, this);

		},
		
		onStockingNodeTypeIndicator: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath(),
				key = oEvent.getSource().getSelectedItem().getKey();
			
			this.getView().getModel("oModel").setProperty(path + "/InventoryHoldingPolicy", key === "N" ? "0" : key == "S" ? "1" : "");
		},

		/*onStockingNodeTypeIndicator: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/StockingNodeTypeIndicator", oEvent.getSource().getValue());
		},

		onStockingstockpolicyindicator: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/Stockingstockpolicyindicator", oEvent.getSource().getValue());
		},
		onForecastRelevant: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/ForecastRelevant", oEvent.getSource().getValue());
		},
		onInventoryHoldingPolicy: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/InventoryHoldingPolicy", oEvent.getSource().getValue());
		},
		onConsumptionType: function (oEvent) {
			if(!oEvent.getParameter('itemPressed')){
				oEvent.getSource().setValue();
				sap.m.MessageToast.show("Please Select from dropdown", {duration: 1200});
				return;
			}
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/ConsumptionType", oEvent.getSource().getValue());
		},
		onForecastConsumptionMode: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/ForecastConsumptionMode", oEvent.getSource().getValue());
		},
		onSafetyStockMethod: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/SafetyStockMethod", oEvent.getSource().getValue());
		},
		onWFCSupplyMethod: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/WFCSupplyMethod", oEvent.getSource().getValue());
		},
		onWFCDemandMethod: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/WFCDemandMethod", oEvent.getSource().getValue());
		},
		onTargetStockLevelMethod: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/TargetStockLevelMethod", oEvent.getSource().getValue());
		},
		onPurchaseConstraint: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/PurchaseConstraint", oEvent.getSource().getValue());
		},
		onProductionConstraint: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/ProductionConstraint", oEvent.getSource().getValue());
		},
		onForecastRelease: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/ForecastRelease", oEvent.getSource().getValue());
		},
		onDemandReassignmentParentID: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/DemandReassignmentParentID", oEvent.getSource().getValue());
		},
		onInventoryChannelStrategy: function (oEvent) {
			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/InventoryChannelStrategy", oEvent.getSource().getValue());
		},*/

		onAddCorp: function () {

			var cMdl = this.getOwnerComponent().getModel("oModel"),
				temp = $.extend(true, {}, this.getOwnerComponent().getModel("root").getData());
			var data = {
				"ProductID": "",
				"LocationID": "",
				"AggregateLocation": "",
				"PlanningPlantID": "",

				"StockingNodeTypeIndicator": temp.StockingNodeTypeIndicator[2].ParamValue,
				"PeriodsBetweenReplenishment": 4,
				"Stockingstockpolicyindicator": "",
				"ForecastRelevant": temp.ForecastRelevant[3].ParamValue,
				"MasterScheduler": "",
				"DeploymentPlanner": "",
				"InventoryHoldingPolicy": temp.InventoryHoldingPolicy[2].ParamValue,
				"ProductionFrozenZone": 8,
				//"ExternalRecieptFrozenZone": 8,
				"ConsumptionType": temp.ConsumptionType[0].ParamValue,
				"ForecastConsumptionMode": temp.ForecastConsumptionMode[2].ParamValue,
				"ForecastOffsetinMonths": 0,
				"MinOrderLeadTime": 0,
				"SafetyStockMethod": temp.SafetyStockMethod[3].ParamValue,
				"StaticSafetyStockQuantity": "",
				"RelativePercentageStaticSafetyStock": "",
				"WFCSupplyMethod": temp.WFCSupplyMethod[1].ParamValue,
				"StaticWFCQuantity": 0,
				"WFCDemandMethod": temp.WFCDemandMethod[1].ParamValue,
				"TargetStockLevelMethod": temp.TargetStockLevelMethod[3].ParamValue,
				"PurchaseConstraint": temp.PurchaseConstraint[1].ParamValue,
				"ProductionConstraint": temp.ProductionConstraint[1].ParamValue,
				"ForecastRelease": temp.ForecastRelease[2].ParamValue,
				"InventoryChannelStrategy": temp.InventoryChannelStrategy[2].ParamValue,
				"DemandReassignmentParentID": "",
				"ProductPriority": "",
				//"IBPSupplyRelevant": temp.IBPSupplyRelevant[1].ParamValue,
				"BOMRelevancy": "",
				"PlanningStrategy": temp.PlanningStrategy[1].ParamValue,
				"MpsSubId": temp.MpsSubNetworkID[0].ParamValue,
				"ApsSubId": temp.ApsSubNetworkID[0].ParamValue,
				"disableOnSubmit": true,
				"userSubmitted": false,
				"icon": "sap-icon://error",
				"iconColor": "white"
			};

			cMdl.getData().oData.push(data);
			cMdl.refresh();
			this.getView().byId("Submit").setEnabled(true);
		},

		/* Material Value help start */
		CreateProductValueHelp: function (oEvent) {
			this.params = {
				"InputId": "multiPrdLvl",
				"Columns": "/columnsProModel.json",
				"Fragment": "Product",
				"bindPath": "/Material",
				"SearchSet": "/ZBAM_MATERIAL_SEARCHSet",
				"View": "Create"
			};
			MaterialValueHelp.ValueHelp(oEvent, this.params, this);
		},

		onPrdF4Ok: function (oEvent) {
			MaterialValueHelp.OnConfirm(oEvent, this);
		},

		onPrdF4Cancel: function () {
			MaterialValueHelp.OnCancel(this);
		},

		onPrdF4AfterClose: function () {
			MaterialValueHelp.AfterClose(this);
		},

		onPrdF4FltSrch: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* Material Value help ends */

		/* Product Level Value help start */
		ProductValueHelp: function (oEvent) {
			ProductValueHelp.ValueHelp(oEvent, this);
		},
		onPrdLvlF4Ok: function (oEvent) {
			ProductValueHelp.onOk(oEvent, this);
		},
		onPrdLvlF4Cancel: function () {
			ProductValueHelp.onCancel(this);
		},
		onPrdLvlF4AfterClose: function () {
			ProductValueHelp.onAfterClose(this);
		},
		onPrdLvlF4FltSrch: function (oEvent) {
			ProductValueHelp.onFilterSearch(oEvent, this);
		},
		/* Product Level Value help ends */

		/* Loc Value help starts*/
		CreateLocationtValueHelp: function (oEvent) {
			this.params = {
				"InputId": "multiGeoLvl",
				"Columns": "/columnsLocModel.json",
				"Fragment": "Location",
				"bindPath": "/Location",
				"SearchSet": "/ZBAM_LOCATION_SEARCHSet",
				"View": "Create"
			};
			MaterialValueHelp.ValueHelp(oEvent, this.params, this);
		},

		onGeoLvlF4Ok: function (oEvent) {
			MaterialValueHelp.OnConfirm(oEvent, this);
		},

		onGeoLvlF4Cancel: function () {
			MaterialValueHelp.OnCancel(this);
		},

		onGeoLvlF4AfterClose: function () {
			MaterialValueHelp.AfterClose(this);
		},

		onGeoLvlF4FltSrch: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* Loc Value help ends*/

		/* Agg loc Value help starts*/
		CreateggregateValueHelp: function (oEvent) {
			this.params = {
				"InputId": "multiGeoLvl2",
				"Columns": "/columnsAggLocModel.json",
				"Fragment": "AggLocation",
				"bindPath": "/AggLocation",
				"SearchSet": "/ZBAM_LOCATION_SEARCHSet",
				"additionFilter": "Zagloctype/AGGR",
				"View": "Create"
			};
			MaterialValueHelp.ValueHelp(oEvent, this.params, this);
		},

		onGeoLvlF4Ok2: function (oEvent) {
			MaterialValueHelp.OnConfirm(oEvent, this);
		},

		onGeoLvlF4Cancel2: function () {
			MaterialValueHelp.OnCancel(this);
		},

		onGeoLvlF4AfterClose2: function () {
			MaterialValueHelp.AfterClose(this);
		},

		onGeoLvlF4FltSrch2: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* Agg loc Value help ends*/

		/* Planning plant value help start */
		CreatePlanningPlantValueHelp: function (oEvent) {
			this.params = {
				"InputId": "planningPlant",
				"Columns": "/columnsPlant.json",
				"Fragment": "PlanningPlant",
				"bindPath": "/PlanningPlant",
				"SearchSet": "/ZBAM_LOCATION_SEARCHSet",
				"additionFilter": "Zagloctype/T001W",
				"View": "Create"
			};
			MaterialValueHelp.ValueHelp(oEvent, this.params, this);
		},

		onPlantF4Ok: function (oEvent) {
			MaterialValueHelp.OnConfirm(oEvent, this);
		},

		onPlantF4Cancel: function () {
			MaterialValueHelp.OnCancel(this);
		},

		onPlantF4AfterClose: function () {
			MaterialValueHelp.AfterClose(this);
		},

		onPlantF4FltSrch: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* Planning plant value help ends */

		/* User Value help starts*/
		onValueHelpUser: function (oEvent) {
			this.params = {
				"InputId": "",
				"Columns": "/UserModel.json",
				"Fragment": "ValueHelpDialogUser",
				"bindPath": "/zbam_supply_searchSET",
				"SearchSet": "/zbam_supply_userid_searchSET",
				"View": "Create"
			};
			MaterialValueHelp.ValueHelp(oEvent, this.params, this);
		},

		onValueHelpOkUser: function (oEvent) {
			MaterialValueHelp.OnConfirm(oEvent, this);
		},

		onValueHelpCancelUser: function () {
			MaterialValueHelp.OnCancel(this);
		},

		onValueHelpAfterCloseUser: function () {
			MaterialValueHelp.AfterClose(this);
		},

		onFilterSearchUser: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* User Value help ends*/

		dialogErrorMessage: function (response) {

			var errorbackend;
			if (response) {
				var sBody = response.body;
				if (sBody) {
					var indexValue = sBody.indexOf("message");
					var indexValueEnd = sBody.substring(indexValue).indexOf("}");
					if (indexValueEnd > -1) {
						errorbackend = sBody.substring(indexValue + 8, indexValue + indexValueEnd - 1);
					} else {
						var oBody = jQuery.parseXML(sBody);
						errorbackend = oBody.getElementsByTagName("message")[0].childNodes[0].nodeValue;
					}
				}
			}

			MessageBox.error(errorbackend);

			/*if (!this.ErrorDialog) {
				this.ErrorDialog = sap.ui.xmlfragment("Location.ZBAM_LOC_ATTR.fragment.Error", this);
			}
			this.ErrorDialog.open();*/
		},

		onIconPress: function (oEvent) {

			var err = this.getView().getModel("errorModel").getData().results,
				//index = Number(oEvent.getSource().getBindingContext().getPath().match(/\d[0-9]*/g)[0]);
				index = Number(oEvent.getSource().oPropagatedProperties.oBindingContexts.oModel.getPath().match(/\d[0-9]*/g)[0]),
				message = "";

			if (err[index].Msgtxt) {
				MessageBox.error(err[index].Msgtxt);
			} else {
				if (err[index].Matnr !== "") {
					message += "Product ID " + err[index].Matnr + "\n";
				}

				if (err[index].Locno !== "") {
					message += " Location ID " + err[index].Locno + "\n";
				}

				if (err[index].Zaggloc !== "") {
					message += " Agg Location ID " + err[index].Zaggloc + "\n";
				}

				if (err[index].Zplanningplant !== "") {
					message += " Planning Plant ID " + err[index].Zplanningplant + "\n";
				}

				message += " Attributes have been created";
				MessageBox.success(message);
			}

			/*** Nov 19th Changes: Ruthvik***/
		},

		matnrAttrCreated: function (response) {

			var i,
				j = 0,
				datarow = [],
				indices = [],
				oModel,
				flag = true,
				count = 0;

			this.index = 0;
			this.getView().byId("statusCol").setVisible(true);

			for (var key in this.indexErrorValidation) {
				if (this.indexErrorValidation[key] === "NotSubmitted") {
					indices.push(key);
				}
			}

			for (i = 0; i < response.length; i++) {

				var pdata = this.getView().getModel("oModel").getData().oData[indices[i]],
					itms = {};

				itms.Matnr = response[i].data.Matnr;
				itms.Locno = response[i].data.Locno;
				itms.Zaggloc = response[i].data.Zaggloc;
				itms.Zplanningplant = response[i].data.Zplanningplant;
				itms.Msgtxt = response[i].data.Msgtxt;
				itms.Msgtype = response[i].data.Msgtype;
				datarow[j] = itms;
				j++;

				/*for(var key in pdata){
					if(pdata[key] !== true && pdata[key] !== false){
					    if(pdata[key].includes("-")){
					        pdata[key] = pdata[key].split("-")[0].trim()
					    }
					}
				}*/

				if (pdata.userSubmitted === false) {

					if (response[i].data.Msgtype === "E") {
						pdata.iconColor = "red";
						pdata.icon = "sap-icon://error";
						datarow[i].userSubmitted = false;
					} else {
						pdata.iconColor = "green";
						pdata.icon = "sap-icon://complete";
						pdata.disableOnSubmit = false;
						pdata.userSubmitted = true;
						datarow[i].userSubmitted = true;
						this.onDataSubmitted = true;
					}

				} else {
					continue;
				}

			}

			for (var i = 0; i < datarow.length; i++) {
				this.errorData[indices[i]] = datarow[i];
			}
			oModel = new JSONModel({
				results: this.errorData
			});

			this.errorData.forEach((item) => {
				if (item.userSubmitted === true) {
					count++;
					//flag = false;
				}
			}, this);

			if (count === this.errorData.length) {
				flag = false;
			}

			this.getView().byId("Submit").setEnabled(flag);

			this.getView().setModel(oModel, "errorModel");
			this.getView().getModel("oModel").updateBindings(true);

			if (!datarow[0]) {
				//console.log(this.getView().getModel("oModel"));
				MessageBox.success(
					"Records Submitted Successfully"
				);
			}

		},

		onSubmit: function () {

			var a = this.getView().getModel("oModel").getData().oData;
			var sURI = '/sap/opu/odata/sap/ZBAM_LOC_PRODUCT_SRV/';
			var oModelP = new sap.ui.model.json.JSONModel();
			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);

			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			var batchChanges = [];
			var i;
			for (i = 0; i < a.length; i++) {
				this.indexErrorValidation[i] = "Submitted";
				if (a[i].userSubmitted === false) {

					this.indexErrorValidation[i] = "NotSubmitted";
					var C = {};
					C.Trtyp = 'H';
					C.Matnr = a[i].ProductID;
					C.Locno = a[i].LocationID;
					C.Zaggloc = a[i].AggregateLocation;
					C.Zplanningplant = a[i].PlanningPlantID;
					if (a[i].StockingNodeTypeIndicator) {
						C.Zstockingnodetype = a[i].StockingNodeTypeIndicator.split("-")[0].trim();
					}

					C.Zpbr = a[i].PeriodsBetweenReplenishment;
					if (a[i].Stockingstockpolicyindicator) {
						C.Zsafetystockpolicy = a[i].Stockingstockpolicyindicator.split("-")[0].trim();
					}
					if (a[i].ForecastRelevant) {
						C.Zforecastrelevant = a[i].ForecastRelevant.split("-")[0].trim();
					}

					if (a[i].MasterScheduler) {
						C.Zmastscheduler = a[i].MasterScheduler.split("-")[0].trim();
					}
					if (a[i].DeploymentPlanner) {
						C.Zdeploymentplanner = a[i].DeploymentPlanner.split("-")[0].trim();
					}

					if (a[i].InventoryHoldingPolicy) {
						C.Zinvholdingpolicy = a[i].InventoryHoldingPolicy.split("-")[0].trim();
					}

					C.Zfrozenhorizon = a[i].ProductionFrozenZone;
					//C.Zfrozenhorizonextreceipt = a[i].ExternalRecieptFrozenZone;
					if (a[i].ConsumptionType) {
						C.Zconsumptiontype = a[i].ConsumptionType.split("-")[0].trim();
					}
					if (a[i].ForecastConsumptionMode) {
						C.Zfcstconsmode = a[i].ForecastConsumptionMode.split("-")[0].trim();
					}

					C.Zmonthoffset = a[i].ForecastOffsetinMonths;
					C.Zminorderleadtime = a[i].MinOrderLeadTime;
					if (a[i].SafetyStockMethod) {
						C.Zsafetystocktype = a[i].SafetyStockMethod.split("-")[0].trim();
					}

					C.Zsafetystockquantity = a[i].StaticSafetyStockQuantity;
					C.Zrelativepercentage = a[i].RelativePercentageStaticSafetyStock;
					if (a[i].WFCSupplyMethod) {
						C.Zweeksofforwardcoverage = a[i].WFCSupplyMethod.split("-")[0].trim();
					}

					C.Zwfcquantity = a[i].StaticWFCQuantity;
					if (a[i].WFCDemandMethod) {
						C.Zwfcdemand = a[i].WFCDemandMethod.split("-")[0].trim();
					}
					if (a[i].TargetStockLevelMethod) {
						C.Ztargetstocktype = a[i].TargetStockLevelMethod.split("-")[0].trim();
					}
					if (a[i].PurchaseConstraint) {
						C.Ztechallocation = a[i].PurchaseConstraint.split("-")[0].trim();
					}
					if (a[i].ProductionConstraint) {
						C.Zformallocation = a[i].ProductionConstraint.split("-")[0].trim();
					}
					if (a[i].ForecastRelease) {
						C.Zdemandplacementwk = a[i].ForecastRelease.split("-")[0].trim();
					}
					if (a[i].InventoryChannelStrategy) {
						C.Ziochannelstrategy = a[i].InventoryChannelStrategy.split("-")[0].trim();
					}

					C.Zdemreassignparentid = a[i].DemandReassignmentParentID;
					C.Zprodpriorityweightage = a[i].ProductPriority;
					//C.Zibpsupplyrelevant = a[i].IBPSupplyRelevant;
					
					C.Zbomerel = a[i].BOMRelevancy === "" || a[i].BOMRelevancy === "X" ? " " : a[i].BOMRelevancy;
					C.Zplanningstrategy = a[i].PlanningStrategy.split("-")[0].trim();
					
					C.Zplunitid = a[i].MpsSubId.split("-")[0].trim();
					C.Zapssubnetwork = a[i].ApsSubId.split("-")[0].trim();

					batchChanges.push(oModelP.createBatchOperation("ZBAM_LOC_PROD_DISPLAYSet", "POST", C));
				}
			}
			oModelP.addBatchChangeOperations(batchChanges);
			var t = this;
			oModelP.submitBatch(
				function (oData, oResponse, aErrorResponses) {
					oModelP.refresh(true);
					if (aErrorResponses.length > 0) {
						t.dialogErrorMessage(aErrorResponses[0].response);
					} else {
						t.matnrAttrCreated(oData.__batchResponses[0].__changeResponses);
					}
					oBusy.close();
					t.setSubmitCheck();
				},
				function (oError) {
					oBusy.close();
					MessageBox.warning(MaterialValueHelp.handlErrorResponse(oError));
				}
			);
		},
		
		setSubmitCheck: function () {
			this.getOwnerComponent().getModel("check").param = "create/didNotSubmit";
			
			if (this.onDataSubmitted === true) {
				this.getOwnerComponent().getModel("check").param = "create/submitted";
			}
		},

	});

});