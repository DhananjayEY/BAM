sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"../helper/productLevel",
	"../helper/material",
	"../helper/controlField"
], function (Controller, MessageBox, JSONModel, ProductValueHelp, MaterialValueHelp, ControlField) {
	"use strict";
	var that;

	return Controller.extend("com.ey.bamlocprdattr.controller.Edit", {

		onInit: function () {
			that = this;
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.flag = false;
			$("#backBtn").unbind("click");

			if (oEvent.getParameter("name") === "Edit") {

				$("#backBtn").on("click", this.onNavBack.bind(this));
				var navModel = sap.ui.getCore().getModel("SelectedModel2");
				var a = navModel.getData(),
					temp = $.extend(true, {}, this.getOwnerComponent().getModel("root").getData());
				this.onDataSubmitted = false;

				var selItms = {
					itemCount: a.length
				};
				var oModelcell1 = new sap.ui.model.json.JSONModel();
				oModelcell1.setData(selItms);
				this.getView().setModel(oModelcell1, "aCount");

				if (a.length === 1) {
					this.getView().getModel("oModel").setProperty("/Zaggloc", a[0].Zaggloc.split("-")[0].trim());
					this.getView().getModel("oModel").setProperty("/Zplanningplant", a[0].Zplanningplant.split("-")[0].trim());

					// this.getView().byId("oldLocation").setValue(a[0].Sort1.split("-")[0].trim());
					this.getView().byId("Indicatortype").setSelectedKey(a[0].Zstockingnodetype.split("-")[0].trim());

					this.getView().byId("Replenishment").setValue(a[0].Zpbr);

					this.getView().byId("policy").setSelectedKey(a[0].Zsafetystockpolicy.split("-")[0].trim());
					this.getView().byId("Forecast").setSelectedKey(a[0].Zforecastrelevant.split("-")[0].trim());

					this.getView().getModel("oModel").setProperty("/Zmastscheduler", a[0].Zmastscheduler.split("-")[0].trim());
					this.getView().getModel("oModel").setProperty("/Zdeploymentplanner", a[0].Zdeploymentplanner.split("-")[0].trim());

					this.getView().byId("Inventory").setSelectedKey(a[0].Zinvholdingpolicy.split("-")[0].trim());
					this.getView().byId("Frozen").setValue(a[0].Zfrozenhorizon);
					//this.getView().byId("Reciept").setValue(a[0].Zfrozenhorizonextreceipt);

					this.getView().byId("Consumption").setSelectedKey(a[0].Zconsumptiontype.split("-")[0].trim());
					this.getView().byId("ConsumptionMode").setSelectedKey(a[0].Zfcstconsmode.split("-")[0].trim());
					this.getView().byId("ForecastsOffset").setValue(a[0].Zmonthoffset.split("-")[0].trim());

					this.getView().byId("MinOrder").setValue(a[0].Zminorderleadtime);
					this.getView().byId("Safety").setSelectedKey(a[0].Zsafetystocktype.split("-")[0].trim());
					//this.getView().byId("Safety").setSelectedKey(a[0].Zsafetystocktype);

					this.getView().byId("StaticSafety").setValue(a[0].Zsafetystockquantity.split("-")[0].trim());

					this.getView().byId("RelativePercentage").setValue(a[0].Zrelativepercentage);
					this.getView().byId("WFCSupply").setSelectedKey(a[0].Zweeksofforwardcoverage.split("-")[0].trim());
					this.getView().byId("StaticWFC").setValue(a[0].Zwfcquantity.split("-")[0].trim());
					this.getView().byId("DemandMethod").setSelectedKey(a[0].Zwfcdemand.split("-")[0].trim());
					this.getView().byId("Target").setSelectedKey(a[0].Ztargetstocktype.split("-")[0].trim());
					this.getView().byId("PurchaseConstraint").setSelectedKey(a[0].Ztechallocation.split("-")[0].trim());
					this.getView().byId("ApsPurchaseConstraint").setSelectedKey(a[0].ZtechallocationAps.split("-")[0].trim());
					//New Code Added-Mannu
					this.getView().byId("MaxDeliveryOverride").setSelectedKey(a[0].zmaxdeliveryoverride.split("-")[0].trim());
					this.getView().byId("ProductionConstraint").setSelectedKey(a[0].Zformallocation.split("-")[0].trim());
					this.getView().byId("ApsProductionConstraint").setSelectedKey(a[0].ZformallocationAps.split("-")[0].trim());
					// New Code added for new Filed-By Mannu-5/5/2021
					this.getView().byId("LotSizingProcedure").setSelectedKey(a[0].ZLOT_SIZE_PROCEDURE.split("-")[0].trim());
					//Fix Filed mapping is wrong for Ztech Week-By Mannu-04/06/2021
					this.getView().byId("TargetSubPeriodofSupply").setValue(a[0].ZTECH_WEEKS);
					//End of code
					//New Code Added Max Inventory Relevant-29/03/2022
					this.getView().byId("MaxInventoryRelevant").setSelectedKey(a[0].Zmaxinventoryrelevant.split("-")[0].trim());
					//End Of Code
					this.getView().byId("ForecastRelease").setSelectedKey(a[0].Zdemandplacementwk.split("-")[0].trim());
					this.getView().byId("ForecastRolRel").setSelectedKey(a[0].ZforecastRollRel.split("-")[0].trim());

					this.getView().byId("InventoryChannelStrategy").setSelectedKey(a[0].Ziochannelstrategy.split("-")[0].trim());

					this.getView().getModel("oModel").setProperty("/Zdemreassignparentid", a[0].Zdemreassignparentid);
					// To Fix Wrong Code Defect-By Mannu-04/06/2021
					// this.getView().byId("ProductPriority").setValue(a[0].Zprodpriorityweightage.split("-")[0].trim());
					this.getView().byId("ProductPriority").setSelectedKey(a[0].Zprodpriorityweightage.split("-")[0].trim());
					//End Of code

					//this.getView().byId("IBPSupplyRelevant").setSelectedKey(a[0].Zibpsupplyrelevant.split("-")[0].trim());
					/*this.getView().byId("BomRelevancy").setValue( a[0].Zbomerel === "NO" ? "" : 
																	a[0].Zbomerel.split("-")[0].trim() );*/
					// New Changes in code to fix defect-By Mannu -4/6/2021												
					// this.getView().byId("BomRelevancy").setSelectedKey(a[0].Zbomerel.split("-")[0].trim() === "X" ? "Y" :
					// 	a[0].Zbomerel.split("-")[0].trim() === "Y" ? "" : "X");
					this.getView().byId("BomRelevancy").setSelectedKey(a[0].Zbomerel.split("-")[0].trim());
					//	this.getView().byId("planningStrategy").setSelectedKey(a[0].Zplanningstrategy);// Wrong Code
					this.getView().byId("planningStrategy").setSelectedKey(a[0].Zplanningstrategy.split("-")[0].trim()); // New Code added to fix filed issue
					// End Of Code
					this.getView().byId("MpsSubId").setSelectedKey(a[0].Zplunitid);
					this.getView().byId("ApsSubId").setSelectedKey(a[0].Zapssubnetwork);
					this.getView().byId("ZFORCASTCONGROUP").setValue(a[0].Zforcastcongroup);

					this.getView().getModel("oModel").setProperty("/Zprodscheduler", a[0].Zprodscheduler);
					this.getView().getModel("oModel").setProperty("/Zmaterialplanner", a[0].Zmaterialplanner);

					this.getView().byId("ZMFCTRGDISAGG").setSelectedKey(a[0].Zmfctrgdisagg.split("-")[0].trim());
					this.getView().byId("ZMFCRELMODE").setValue(a[0].Zmfcrelmode);

					// Fix Issue of Upside Relevant Filed-By Mannu 4/6/2021
					//	this.getView().byId("ZUPSIDEREL").setValue(a[0].Zupsiderel);// wrong Code
					this.getView().byId("ZUPSIDEREL").setSelectedKey(a[0].Zupsiderel.split("-")[0].trim());
					// End of code
					this.getView().byId("ZUBUSS1").setValue(a[0].Zubuss1);
					this.getView().byId("ZUBUSS2").setValue(a[0].Zubuss2);
					this.getView().byId("ZUBUSS3").setValue(a[0].Zubuss3);
					// To Fix Wrong Code- By Mannu-04/062021
					// this.getView().byId("ZLEADTIMEPUSHMETHOD").setValue(a[0].Zleadtimepushmethod.split("-")[0].trim());
					this.getView().byId("ZLEADTIMEPUSHMETHOD").setSelectedKey(a[0].Zleadtimepushmethod.split("-")[0].trim());
					// End Code-04/04/2021
					// New Code added for new Filed-By Mannu-27/7/2021
					this.getView().byId("SafetyStockDisag").setSelectedKey(a[0].ZSAFETY_STOCK.split("-")[0].trim());

				} else {
					this.getView().getModel("oModel").setProperty("/Zaggloc", "");
					this.getView().getModel("oModel").setProperty("/Zplanningplant", "");

					this.getView().byId("Indicatortype").setSelectedKey("");
					this.getView().byId("Replenishment").setValue(""); /*default values*/
					this.getView().byId("policy").setSelectedKey("");
					this.getView().byId("Forecast").setSelectedKey("");

					this.getView().getModel("oModel").setProperty("/Zmastscheduler", "");
					this.getView().getModel("oModel").setProperty("/Zdeploymentplanner", "");

					this.getView().byId("Inventory").setSelectedKey("");
					this.getView().byId("Frozen").setValue("");
					this.getView().byId("Consumption").setSelectedKey("");
					this.getView().byId("ConsumptionMode").setSelectedKey("");
					this.getView().byId("ForecastsOffset").setValue("");
					this.getView().byId("MinOrder").setValue("");
					this.getView().byId("Safety").setSelectedKey("");
					this.getView().byId("StaticSafety").setValue("");
					this.getView().byId("RelativePercentage").setValue("");
					this.getView().byId("WFCSupply").setSelectedKey("");
					this.getView().byId("StaticWFC").setValue("");
					this.getView().byId("DemandMethod").setSelectedKey("");
					this.getView().byId("Target").setSelectedKey("");
					this.getView().byId("PurchaseConstraint").setSelectedKey("");
					this.getView().byId("ApsPurchaseConstraint").setSelectedKey("");
					this.getView().byId("MaxDeliveryOverride").setSelectedKey(""); // New Code added
					this.getView().byId("ProductionConstraint").setSelectedKey("");
					this.getView().byId("ApsProductionConstraint").setSelectedKey("");
					this.getView().byId("ForecastRelease").setSelectedKey("");
					this.getView().byId("ForecastRolRel").setSelectedKey("");
					this.getView().byId("InventoryChannelStrategy").setSelectedKey("");
					// New Code added for new Filed-By Mannu-5/5/2021
					this.getView().byId("LotSizingProcedure").setSelectedKey("");
					this.getView().byId("TargetSubPeriodofSupply").setValue("");
					//End of code
					// New Code Added for Max Inventory Relevant-29/03/2022
					this.getView().byId("MaxInventoryRelevant").setSelectedKey("");
					//End of Code
					this.getView().getModel("oModel").setProperty("/Zdemreassignparentid", "");

					this.getView().byId("ProductPriority").setSelectedKey("");
					this.getView().byId("BomRelevancy").setSelectedKey("");
					this.getView().byId("planningStrategy").setSelectedKey("");
					this.getView().byId("MpsSubId").setSelectedKey("");
					this.getView().byId("ApsSubId").setSelectedKey("");
					this.getView().byId("ZFORCASTCONGROUP").setValue("");

					this.getView().getModel("oModel").setProperty("/Zprodscheduler", "");
					this.getView().getModel("oModel").setProperty("/Zmaterialplanner", "");

					this.getView().byId("ZMFCTRGDISAGG").setSelectedKey("");
					this.getView().byId("ZMFCRELMODE").setValue("");
					this.getView().byId("ZFORCASTCONGROUP").setValue("");
					this.getView().byId("ZMATERIALPLANNER").setValue("");
					this.getView().byId("ZMFCTRGDISAGG").setSelectedKey("");
					this.getView().byId("ZMFCRELMODE").setValue("");
					this.getView().byId("ZUPSIDEREL").setValue();
					this.getView().byId("ZUBUSS1").setValue();
					this.getView().byId("ZUBUSS2").setValue();
					this.getView().byId("ZUBUSS3").setValue();
					this.getView().byId("ZLEADTIMEPUSHMETHOD").setSelectedKey();
					// New Code added for new Filed-By Mannu-27/7/2021
					this.getView().byId("SafetyStockDisag").setSelectedKey();
				}

				ControlField.controlFieldsInEdit(this);
			}
		},

		onChange: function (oEvent) {
			this.flag = true;
		},

		clearMasterScheduler: function () {
			this.getView().getModel("oModel").setProperty("/Zmastscheduler", "");
		},

		clearDeploymentPlanner: function () {
			this.getView().getModel("oModel").setProperty("/Zdeploymentplanner", "");
		},

		clearProdScheduler: function () {
			this.getView().getModel("oModel").setProperty("/Zprodscheduler", "");
		},

		clearMaterialPlanner: function () {
			this.getView().getModel("oModel").setProperty("/Zmaterialplanner", "");
		},

		onPeriodsBtwRep: function (oEvent) {
			var inputArr = oEvent.getParameter("newValue").split("");
			var index = inputArr.findIndex((i, j) => j === 0 ? i.match(/[0A-Za-z\s\D]/) :
				(i.includes(1) ? i.match(/[3456789A-Za-z\s\D]/) : i.match(/[A-Za-z\d\s\D]/)));
			if (index !== -1) {
				inputArr.splice(index, 1);
				oEvent.getSource().setValue(inputArr.join(""));
			}
		},

		onStockingNodeTypeIndicator: function (oEvent) {
			this.flag = true;
			var key = oEvent.getSource().getSelectedItem().getKey();

			this.getView().byId("Inventory").setSelectedKey(key === "N" ? "0" : key == "S" ? "1" : "");
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

		onNavBack: function () {
			this.getOwnerComponent().getModel("check").param = "edit/didNotSubmit";
			if (this.onDataSubmitted === true) {
				this.getOwnerComponent().getModel("check").param = "edit/submitted";
				this.router.navTo("Main", {}, true);
			} else {
				// this.router.navTo("Main", {}, true);

				if (this.flag === false) {
					this.router.navTo("Main", {}, true);
				} else {
					sap.m.MessageBox.confirm(
						"Unsaved data will be lost. Are you sure you want to continue?", {
							icon: MessageBox.Icon.WARNING,
							title: "Message",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							initialFocus: "Custom Button",
							onClose: function (oAction) {
								if (oAction === "YES") {
									this.router.navTo("Main", {}, true);
								}
							}.bind(this)
						}
					);
				}
			}

			event.stopPropagation(); //event from the native event trigger parameter
		},
		onsaveEdit: function () {
			var obj = {

				AggLocation: this.getView().byId("aggregateLocation").getValue(),
				// OldLocation: this.getView().byId("oldLocation").getValue(),
				PlanningPlant: this.getView().byId("planningPlant").getValue(),
				StockingNodeTypeIndicator: this.getView().byId("Indicatortype").getSelectedKey(),
				PeriodsBetweenReplenishment: this.getView().byId("Replenishment").getValue(),
				Stockingstockpolicyindicator: this.getView().byId("policy").getSelectedKey(),
				ForecastRelevant: this.getView().byId("Forecast").getSelectedKey(),
				MasterScheduler: this.getView().byId("Master").getValue(),
				DeploymentPlanner: this.getView().byId("Deployment").getValue(),
				InventoryHoldingPolicy: this.getView().byId("Inventory").getSelectedKey(),
				// SubnetworkID: this.getView().byId("ltype").getValue(),
				ProductionFrozenZone: this.getView().byId("Frozen").getValue(),
				//ExternalRecieptFrozenZone: this.getView().byId("Reciept").getValue(),
				ConsumptionType: this.getView().byId("Consumption").getSelectedKey(),
				ForecastConsumptionMode: this.getView().byId("ConsumptionMode").getSelectedKey(),
				ForecastOffsetinMonths: this.getView().byId("ForecastsOffset").getValue(),
				MinOrderLeadTime: this.getView().byId("MinOrder").getValue(),
				SafetyStockMethod: this.getView().byId("Safety").getSelectedKey(),
				StaticSafetyStockQuantity: this.getView().byId("StaticSafety").getValue(),
				RelativePercentageStaticSafetyStock: this.getView().byId("RelativePercentage").getValue(),
				WFCSupplyMethod: this.getView().byId("WFCSupply").getSelectedKey(),
				StaticWFCQuantity: this.getView().byId("StaticWFC").getValue(),
				WFCDemandMethod: this.getView().byId("DemandMethod").getSelectedKey(),
				TargetStockLevelMethod: this.getView().byId("Target").getSelectedKey(),
				// new changes
				PurchaseConstraint: this.getView().byId("PurchaseConstraint").getSelectedKey(),
				PurchaseConstraintAps: this.getView().byId("ApsPurchaseConstraint").getSelectedKey(),
				//end of changes
				MaxDeliveryOverride: this.getView().byId("MaxDeliveryOverride").getSelectedKey(), // New Code added
				// New Code added for new Filed-By Mannu-5/5/2021
				LotSizingProcedure: this.getView().byId("LotSizingProcedure").getSelectedKey(),
				TargetSubPeriodofSupply: this.getView().byId("TargetSubPeriodofSupply").getValue(),
				//End of code
				ProductionConstraint: this.getView().byId("ProductionConstraint").getSelectedKey(),
				ProductionConstraintAps: this.getView().byId("ApsProductionConstraint").getSelectedKey(),
				ForecastRelease: this.getView().byId("ForecastRelease").getSelectedKey(),
				ForecastRolRel: this.getView().byId("ForecastRolRel").getSelectedKey(),
				InventoryChannelStrategy: this.getView().byId("InventoryChannelStrategy").getSelectedKey(),
				// DemandReassignmentParentID: this.getView().byId("ReassignmentParent").getValue(),
				ProductPriority: this.getView().byId("ProductPriority").getSelectedKey(),
				//IBPSupplyRelevant: this.getView().byId("IBPSupplyRelevant").getSelectedKey(),
				BOMRelevancy: this.getView().byId("BomRelevancy").getSelectedKey(),
				PlanningStrategy: this.getView().byId("planningStrategy").getSelectedKey(),
				ApsSubNetworkID: this.getView().byId("ApsSubId").getSelectedKey(),
				MpsSubNetworkID: this.getView().byId("MpsSubId").getSelectedKey(),
				ZFORCASTCONGROUP: this.getView().byId("ZFORCASTCONGROUP").getValue(),
				ZPRODSCHEDULER: this.getView().byId("ZPRODSCHEDULER").getValue(),
				ZMATERIALPLANNER: this.getView().byId("ZMATERIALPLANNER").getValue(),
				ZMFCTRGDISAGG: this.getView().byId("ZMFCTRGDISAGG").getSelectedKey(),
				ZMFCRELMODE: this.getView().byId("ZMFCRELMODE").getValue(),
				ZUPSIDEREL: this.getView().byId("ZUPSIDEREL").getSelectedKey(),
				ZUBUSS1: this.getView().byId("ZUBUSS1").getValue(),
				ZUBUSS2: this.getView().byId("ZUBUSS2").getValue(),
				ZUBUSS3: this.getView().byId("ZUBUSS3").getValue(),
				ZLEADTIMEPUSHMETHOD: this.getView().byId("ZLEADTIMEPUSHMETHOD").getSelectedKey(),
				SafetySupplyDisagg: this.getView().byId("SafetyStockDisag").getSelectedKey(), // new Filed Added-27/7/2021
				Maxinventoryrelevant: this.getView().byId("MaxInventoryRelevant").getSelectedKey() // New Code added-29/03/2022-By Mannu
			};

			this.submitoData(obj);
		},
		submitoData: function (obj) {
			var aModel = this.getView().getModel("oModel").getData();

			var navData = sap.ui.getCore().getModel("SelectedModel2").getData();
			var sURI = '/sap/opu/odata/sap/ZBAM_LOC_PRODUCT_SRV/'; //'/sap/opu/odata/sap/ZBAM_SUPP_LOCATION_SRV/';
			var oModelP = new sap.ui.model.json.JSONModel();
			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);

			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			var batchChanges = [];
			var len = navData.length;

			for (var i = 0; i < navData.length; i++) {
				var C = {};
				C.Trtyp = 'V';
				C.Matnr = navData[i].Matnr.split("-")[0].trim();
				C.Locno = navData[i].Locno.split("-")[0].trim();

				var {
					Zaggloc,
					Zplanningplant,
					Zstockingnodetype,
					Zpbr,
					Zsafetystockpolicy,
					Zforecastrelevant,
					Zmastscheduler,
					Zdeploymentplanner,
					Zinvholdingpolicy,
					Zfrozenhorizon,
					Zconsumptiontype,
					Zfcstconsmode,
					Zmonthoffset,
					Zminorderleadtime,
					Zsafetystocktype,
					Zsafetystockquantity,
					Zrelativepercentage,
					Zweeksofforwardcoverage,
					Zwfcquantity,
					Zwfcdemand,
					Ztargetstocktype,
					Ztechallocation,
					ZtechallocationAps,
					Zformallocation,
					ZformallocationAps,
					Zdemandplacementwk,
					ZforecastRollRel,
					zmaxdeliveryoverride,
					Ziochannelstrategy,
					Zprodpriorityweightage,
					Zbomerel,
					Zplanningstrategy,
					Zapssubnetwork,
					Zplunitid,
					Zforcastcongroup,
					Zprodscheduler,
					Zmaterialplanner,
					Zmfctrgdisagg,
					//New Code
					ZLOT_SIZE_PROCEDURE,
					ZTECH_WEEKS,
					ZSAFETY_STOCK,
					Zmaxinventoryrelevant,
					// End of code
					Zmfcrelmode,
					Zupsiderel,
					Zubuss1,
					Zubuss2,
					Zubuss3,
					Zleadtimepushmethod,
					ZaggIdChg
				} = navData[i];

				var {
					AggLocation,
					PlanningPlant,
					StockingNodeTypeIndicator,
					PeriodsBetweenReplenishment,
					Stockingstockpolicyindicator,
					ForecastRelevant,
					MasterScheduler,
					DeploymentPlanner,
					InventoryHoldingPolicy,
					ProductionFrozenZone,
					ConsumptionType,
					ForecastConsumptionMode,
					ForecastOffsetinMonths,
					MinOrderLeadTime,
					SafetyStockMethod,
					StaticSafetyStockQuantity,
					RelativePercentageStaticSafetyStock,
					WFCSupplyMethod,
					StaticWFCQuantity,
					WFCDemandMethod,
					TargetStockLevelMethod,
					PurchaseConstraint,
					PurchaseConstraintAps,
					MaxDeliveryOverride,
					ProductionConstraint,
					ProductionConstraintAps,
					ForecastRelease,
					ForecastRolRel,
					// New Code
					LotSizingProcedure,
					TargetSubPeriodofSupply,
					SafetySupplyDisagg,
					Maxinventoryrelevant,
					//End code
					InventoryChannelStrategy,
					ProductPriority,
					BOMRelevancy,
					PlanningStrategy,
					ApsSubNetworkID,
					MpsSubNetworkID,
					ZFORCASTCONGROUP,
					ZPRODSCHEDULER,
					ZMATERIALPLANNER,
					ZMFCTRGDISAGG,
					ZMFCRELMODE,
					ZUPSIDEREL,
					ZUBUSS1,
					ZUBUSS2,
					ZUBUSS3,
					ZLEADTIMEPUSHMETHOD
				} = obj;

				C.Zaggloc = len === 1 ? AggLocation : (AggLocation === "") ? Zaggloc.split("-")[0].trim() : AggLocation;
				C.Zplanningplant = len === 1 ? PlanningPlant : (PlanningPlant === "") ? Zplanningplant.split("-")[0].trim() : PlanningPlant;
				C.Zstockingnodetype = len === 1 ? StockingNodeTypeIndicator : (StockingNodeTypeIndicator === "") ? Zstockingnodetype.split("-")[0]
					.trim() : StockingNodeTypeIndicator;
				C.Zpbr = len === 1 ? PeriodsBetweenReplenishment : (PeriodsBetweenReplenishment === "") ? Zpbr.split("-")[0].trim() :
					PeriodsBetweenReplenishment;
				C.Zsafetystockpolicy = len === 1 ? Stockingstockpolicyindicator : (Stockingstockpolicyindicator === "") ? Zsafetystockpolicy.split(
					"-")[0].trim() : Stockingstockpolicyindicator;
				C.Zforecastrelevant = len === 1 ? ForecastRelevant : (ForecastRelevant === "") ? Zforecastrelevant.split("-")[0].trim() :
					ForecastRelevant;
				C.Zmastscheduler = len === 1 ? MasterScheduler : (MasterScheduler === "") ? Zmastscheduler.split("-")[0].trim() : MasterScheduler;
				C.Zdeploymentplanner = len === 1 ? DeploymentPlanner : (DeploymentPlanner === "") ? Zdeploymentplanner.split("-")[0].trim() :
					DeploymentPlanner;
				C.Zinvholdingpolicy = len === 1 ? InventoryHoldingPolicy : (InventoryHoldingPolicy === "") ? Zinvholdingpolicy.split("-")[0].trim() :
					InventoryHoldingPolicy;
				C.Zfrozenhorizon = len === 1 ? ProductionFrozenZone : (ProductionFrozenZone === "") ? Zfrozenhorizon.split("-")[0].trim() :
					ProductionFrozenZone;
				C.Zconsumptiontype = len === 1 ? ConsumptionType : (ConsumptionType === "") ? Zconsumptiontype.split("-")[0].trim() :
					ConsumptionType;
				C.Zfcstconsmode = len === 1 ? ForecastConsumptionMode : (ForecastConsumptionMode === "") ? Zfcstconsmode.split("-")[0].trim() :
					ForecastConsumptionMode;
				C.Zmonthoffset = len === 1 ? ForecastOffsetinMonths : (ForecastOffsetinMonths === "") ? Zmonthoffset.split("-")[0].trim() :
					ForecastOffsetinMonths;
				C.Zminorderleadtime = len === 1 ? MinOrderLeadTime : (MinOrderLeadTime === "") ? Zminorderleadtime.split("-")[0].trim() :
					MinOrderLeadTime;
				C.Zsafetystocktype = len === 1 ? SafetyStockMethod : (SafetyStockMethod === "") ? Zsafetystocktype.split("-")[0].trim() :
					SafetyStockMethod;
				C.Zsafetystockquantity = len === 1 ? StaticSafetyStockQuantity : (StaticSafetyStockQuantity === "") ? Zsafetystockquantity.split(
					"-")[0].trim() : StaticSafetyStockQuantity;
				C.Zrelativepercentage = len === 1 ? RelativePercentageStaticSafetyStock : (RelativePercentageStaticSafetyStock === "") ?
					Zrelativepercentage.split("-")[0].trim() : RelativePercentageStaticSafetyStock;
				C.Zweeksofforwardcoverage = len === 1 ? WFCSupplyMethod : (WFCSupplyMethod === "") ? Zweeksofforwardcoverage.split("-")[0].trim() :
					WFCSupplyMethod;
				C.Zwfcquantity = len === 1 ? StaticWFCQuantity : (StaticWFCQuantity === "") ? Zwfcquantity.split("-")[0].trim() :
					StaticWFCQuantity;
				C.Zwfcdemand = len === 1 ? WFCDemandMethod : (WFCDemandMethod === "") ? Zwfcdemand.split("-")[0].trim() : WFCDemandMethod;
				C.Ztargetstocktype = len === 1 ? TargetStockLevelMethod : (TargetStockLevelMethod === "") ? Ztargetstocktype.split("-")[0].trim() :
					TargetStockLevelMethod;
				C.Ztechallocation = len === 1 ? PurchaseConstraint : (PurchaseConstraint === "") ? Ztechallocation.split("-")[0].trim() :
					PurchaseConstraint;
				// New Code added
				C.zmaxdeliveryoverride = len === 1 ? MaxDeliveryOverride : (MaxDeliveryOverride === "") ? zmaxdeliveryoverride.split("-")[0].trim() :
					MaxDeliveryOverride; // New Coded
				//End Code
				// New Code Added
				C.ZLOT_SIZE_PROCEDURE = len === 1 ? LotSizingProcedure : (LotSizingProcedure === "") ? ZLOT_SIZE_PROCEDURE.split("-")[0].trim() :
					LotSizingProcedure;
				C.ZTECH_WEEKS = len === 1 ? TargetSubPeriodofSupply : (TargetSubPeriodofSupply === "") ? ZTECH_WEEKS.split("-")[0].trim() :
					TargetSubPeriodofSupply;
				//End of Code-5/5/2021	
				// NewCode Added For Safety Stock Filed-27/7/2021-By Mannu
				C.ZSAFETY_STOCK = len === 1 ? SafetySupplyDisagg : (SafetySupplyDisagg === "") ? ZSAFETY_STOCK.split("-")[0].trim() :
					SafetySupplyDisagg;
				// End Code
				// New Code Added-29/03/2022-By Mannu
				C.Zmaxinventoryrelevant = len === 1 ? Maxinventoryrelevant : (Maxinventoryrelevant === "") ? Zmaxinventoryrelevant.split("-")[0].trim() :
					Maxinventoryrelevant;
				//End Of Code
				C.ZtechallocationAps = len === 1 ? PurchaseConstraintAps : (PurchaseConstraintAps === "") ? ZtechallocationAps.split("-")[0].trim() :
					PurchaseConstraintAps;
				C.Zformallocation = len === 1 ? ProductionConstraint : (ProductionConstraint === "") ? Zformallocation.split("-")[0].trim() :
					ProductionConstraint;
				C.ZformallocationAps = len === 1 ? ProductionConstraintAps : (ProductionConstraintAps === "") ? ZformallocationAps.split("-")[0].trim() :
					ProductionConstraintAps;
				C.Zdemandplacementwk = len === 1 ? ForecastRelease : (ForecastRelease === "") ? Zdemandplacementwk.split("-")[0].trim() :
					ForecastRelease;
				C.ZforecastRollRel = len === 1 ? ForecastRolRel : (ForecastRolRel === "") ? ZforecastRollRel.split("-")[0].trim() : ForecastRolRel;
				C.Ziochannelstrategy = len === 1 ? InventoryChannelStrategy : (InventoryChannelStrategy === "") ? Ziochannelstrategy.split("-")[0]
					.trim() : InventoryChannelStrategy;
				// C.Zdemreassignparentid = len === 1 ? DemandReassignmentParentID :  (DemandReassignmentParentID === "") ? Zdemreassignparentid.split("-")[0].trim() : DemandReassignmentParentID;
				C.Zprodpriorityweightage = len === 1 ? ProductPriority : (ProductPriority === "") ? Zprodpriorityweightage.split("-")[0].trim() :
					ProductPriority;
				C.Zforcastcongroup = len === 1 ? ZFORCASTCONGROUP : (ZFORCASTCONGROUP === "") ? Zforcastcongroup.split("-")[0].trim() :
					ZFORCASTCONGROUP;
				C.Zprodscheduler = len === 1 ? ZPRODSCHEDULER : (ZPRODSCHEDULER === "") ? Zprodscheduler.split("-")[0].trim() : ZPRODSCHEDULER;
				C.Zmaterialplanner = len === 1 ? ZMATERIALPLANNER : (ZMATERIALPLANNER === "") ? Zmaterialplanner.split("-")[0].trim() :
					ZMATERIALPLANNER;
				C.Zmfctrgdisagg = len === 1 ? ZMFCTRGDISAGG : (ZMFCTRGDISAGG === "") ? Zmfctrgdisagg.split("-")[0].trim() : ZMFCTRGDISAGG;
				C.Zmfcrelmode = len === 1 ? ZMFCRELMODE : (ZMFCRELMODE === "") ? Zmfcrelmode.split("-")[0].trim() : ZMFCRELMODE;
				C.Zupsiderel = len === 1 ? ZUPSIDEREL : (ZUPSIDEREL === "") ? Zupsiderel.split("-")[0].trim() : ZUPSIDEREL;
				C.Zubuss1 = len === 1 ? ZUBUSS1 : (ZUBUSS1 === "") ? Zubuss1.split("-")[0].trim() : ZUBUSS1;
				C.Zubuss2 = len === 1 ? ZUBUSS2 : (ZUBUSS2 === "") ? Zubuss2.split("-")[0].trim() : ZUBUSS2;
				C.Zubuss3 = len === 1 ? ZUBUSS3 : (ZUBUSS3 === "") ? Zubuss3.split("-")[0].trim() : ZUBUSS3;
				C.Zleadtimepushmethod = len === 1 ? ZLEADTIMEPUSHMETHOD : (ZLEADTIMEPUSHMETHOD === "") ? Zleadtimepushmethod.split("-")[0].trim() :
					ZLEADTIMEPUSHMETHOD;

				// Zbomerel = Zbomerel.split("-")[0].trim() === "NO" ? " " : "X"
				// BOMRelevancy =  BOMRelevancy === "X" ? " " : "X"
				// BOMRelevancy === "Y" ? "X" : BOMRelevancy;
				C.Zbomerel = len === 1 ? BOMRelevancy : (BOMRelevancy === "") ? Zbomerel.split("-")[0].trim() : BOMRelevancy;

				C.Zplanningstrategy = len === 1 ? PlanningStrategy : (PlanningStrategy === "") ? Zplanningstrategy.split("-")[0].trim() :
					PlanningStrategy;

				C.Zapssubnetwork = len === 1 ? ApsSubNetworkID : (ApsSubNetworkID === "") ? Zapssubnetwork.split("-")[0].trim() : ApsSubNetworkID;
				C.Zplunitid = len === 1 ? MpsSubNetworkID : (MpsSubNetworkID === "") ? Zplunitid.split("-")[0].trim() : MpsSubNetworkID;
				C.ZaggIdChg = ZaggIdChg ; // ZaggIdChg soh437

				batchChanges.push(oModelP.createBatchOperation("ZBAM_LOC_PROD_DISPLAYSet", "POST", C));
			}
			oModelP.addBatchChangeOperations(batchChanges);
			var t = this;
			oModelP.submitBatch(
				function (oData, oResponse, aErrorResponses) {
					oModelP.refresh(true);
					if (aErrorResponses.length > 0) {
						oBusy.close();
						MessageBox.warning(MaterialValueHelp.handlErrorResponse(aErrorResponses[0]));
					} else {
						t.onDataSubmitted = true;
						sap.m.MessageBox.success(
							"Records Updated Successfully"
						);
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
			this.getOwnerComponent().getModel("check").param = "edit/didNotSubmit";

			if (this.onDataSubmitted === true) {
				this.getOwnerComponent().getModel("check").param = "edit/submitted";
			}
		},

		/*validateGroup: function (oEvent) {
			if (oEvent.getParameter("newValue").length > 1) {
				oEvent.getSource().setValue(oEvent.getParameter("newValue").slice(1));
			}
		},*/

		/* Material Value help ends */
		CreateProductValueHelp: function (oEvent) {
			this.params = {
				"InputId": "multiPrdLvl",
				"Columns": "/columnsProModel.json",
				"Fragment": "Product",
				"bindPath": "/Material",
				"SearchSet": "/ZBAM_MATERIAL_SEARCHSet",
				"View": "Edit"
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
			this.onChange();
		},

		onPrdF4FltSrch: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* Material Value help ends */

		/* Product Level Value help starts */
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
			this.onChange();
		},
		onPrdLvlF4FltSrch: function (oEvent) {
			ProductValueHelp.onFilterSearch(oEvent, this);
		},
		/* Product Level Value help ends */

		/* Planning plant value help start */
		onPlanningPlant: function (oEvent) {
			this.params = {
				"InputId": "planningPlant",
				"Columns": "/columnsPlant.json",
				"Fragment": "PlanningPlant",
				"bindPath": "/PlanningPlant",
				"SearchSet": "/ZBAM_LOCATION_SEARCHSet",
				// "additionFilter": "Zagloctype/T001W",
				"View": "Edit"
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
			this.onChange();
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
				"View": "Edit"
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
			this.onChange();
		},

		onFilterSearchUser: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* User Value help ends*/

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

		/* Old loc Value help starts*/
		CreateOldLocationValueHelp: function (oEvent) {
			this.params = {
				"InputId": "oldLocationLvl",
				"Columns": "/ColumnsOldLocModel.json",
				"Fragment": "OldLocation",
				"bindPath": "/OldLocation",
				"SearchSet": "/ZBAM_LOCATION_SEARCHSet",
				"additionFilter": "Zagloctype/OLD",
				"View": "Create"

			};
			MaterialValueHelp.ValueHelp(oEvent, this.params, this);
		},

		onOldLocF4Ok: function (oEvent) {
			MaterialValueHelp.OnConfirm(oEvent, this);
		},

		onOldLocF4Cancel: function () {
			MaterialValueHelp.OnCancel(this);
		},

		onOldLocF4AfterClose: function () {
			MaterialValueHelp.AfterClose(this);
			this.onChange();
		},

		onOldLocaF4FltSrch: function (oEvent) {
				MaterialValueHelp.OnSearch(oEvent, this);
			}
			/* Old loc Value help ends*/

	});

});