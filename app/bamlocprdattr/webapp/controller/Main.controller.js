sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/table/TablePersoController",
	"sap/ui/export/Spreadsheet",
	"../helper/productLevel",
	"../helper/material",
	"../helper/controlField"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast, MessageBox, TablePersoController, Spreadsheet,
	ProductValueHelp, MaterialValueHelp, ControlField) {
	"use strict";
	var that;
	jQuery.sap.require("sap.ui.core.routing.Router");
	return Controller.extend("com.ey.bamlocprdattr.controller.Main", {

		onInit: function () {
			that = this;
			this.getOwnerComponent().setModel(new JSONModel({
				param: ""
			}), "check");

			this.getView().byId("LocalprodTable").setVisible(false);
			//this.getView().byId("TBar").setVisible(false);

			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._onObjectMatched, this);

			this.selectedItems = [];
			this.initializeFilterParams();
			//this.InputPrdLvl();
			//this.InputLocation();
			//this.InputAggLocation();
		},

		_onObjectMatched: function (oEvent) {
			var check = this.getOwnerComponent().getModel("check").param;
			if (check === "edit/submitted" || check === "create/submitted") {
				this.onSearch(check.split("/")[1]);
				this.getOwnerComponent().getModel("check").param = "edit/didNotSubmit";
			}
		},

		initializeFilterParams: function () {
			this.productParams = {
				"InputId": "multiPrdLvl",
				"Columns": "/columnsProModel.json",
				"Fragment": "Product",
				"bindPath": "/Material",
				"aList": "",
				"SearchSet": "/ZBAM_MATERIAL_SEARCHSet",
				"label": "Product ID",
				"key": "Matnr"
			};

			this.locationParams = {
				"InputId": "multiGeoLvl",
				"Columns": "/columnsLocModel.json",
				"Fragment": "Location",
				"aList": "",
				"bindPath": "/Location",
				"SearchSet": "/ZBAM_LOCATION_SEARCHSet",
				"label": "Location ID",
				"key": "Locno"
			};

			this.aggLocationParams = {
				"InputId": "multiGeoLvl2",
				"Columns": "/columnsAggLocModel.json",
				"Fragment": "AggLocation",
				"bindPath": "/AggLocation",
				"aList": "",
				"SearchSet": "/ZBAM_LOCATION_SEARCHSet",
				// "additionFilter": "Zagloctype/AGGR",
				"label": "Aggregate Location ID",
				"key": "Locno"
			};

			this.oldLocationParams = {
				"InputId": "oldLocationLvl",
				"Columns": "/ColumnsOldLocModel.json",
				"Fragment": "OldLocation",
				"bindPath": "/OldLocation",
				"aList": "",
				"SearchSet": "/ZBAM_LOCATION_SEARCHSet",
				"additionFilter": "Zagloctype/OLD",
				"label": "Old Location ID",
				"key": "Locno"
			};
			// this.maxInventoryParams = {
			// 	"InputId": "maxInventoryLvl",
			// 	"bindPath": "/ZMAXINVENTORYRELEVANT",
			// 	"aList": "",
			// 	"SearchSet": "/ZBAM_LOCATION_SEARCHSet",
			// 	"label": "Max Inventory Relevant",
			// 	"key": "ParamValue"
			// };
		},

		/* Product Value help ends */
		CreateProductValueHelp: function (oEvent) {
			this.params = this.productParams;
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
		/* Product Value help ends */

		/* Product Level Value help ends */
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
		GeographyValueHelp: function (oEvent) {
			this.params = this.locationParams;
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
		GeographyValueHelp2: function (oEvent) {
			this.params = this.aggLocationParams;
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
		oldLocationValueHelp: function (oEvent) {
			this.params = this.oldLocationParams;
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
		},

		onOldLocaF4FltSrch: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* Old loc Value help ends*/

		/* Planning plant value help start */
		/*planningPlantValueHelp: function (oEvent) {
			this.params = {
				"InputId": "planningPlantFilter",
				"Columns": "/columnsPlant.json",
				"Fragment": "PlanningPlant",
				"bindPath": "/PlanningPlant",
				"SearchSet": "/ZBAM_LOCATION_SEARCHSet",
				"additionFilter": "Zagloctype/T001W"
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
		},*/
		/* Planning plant value help ends */

		onSelectedItems: function (oEvent) {

			this.selectedItems.length = 0; /* Clear all array items*/

			oEvent.getSource().getSelectedIndices().forEach(index => {
				this.selectedItems.push(oEvent.getSource().getContextByIndex(index).getObject());
			}, this);

			var model = new JSONModel(this.selectedItems);
			sap.ui.getCore().setModel(model, 'SelectedModel2');
		},

		onEdit: function () {

			var aIndices = this.getView().byId("LocalprodTable").getSelectedIndices();
			if (aIndices.length === 0) {
				MessageToast.show("Please Select a row to Edit Attributes");
			} else {
				/*var model = new JSONModel(this.selectedItems);
				sap.ui.getCore().setModel(model, "SelectedModel2");*/
				this.router.navTo("Edit");
			}

		},

		onDisplay: function () {
			if (this.selectedItems.length > 0) {
				var mdl = new JSONModel({
					results: this.selectedItems
				});
				sap.ui.getCore().setModel(mdl, 'DisModel');
				this.router.navTo("Display");
			} else {
				MessageBox.information(
					"Select A Line Item.",

				);
			}
		},

		handleViewSettingsDialogButtonPressed: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.ey.bamlocprdattr.fragment.ViewSettingsDialog", this);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},

		handleViewSettingsDialogConfirm: function (oEvent) {
			var mParams = oEvent.getParameters();
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			//	if(!this.aSorter)
			this.aSorter = [];
			var oTable = this.getView().byId("LocalprodTable");
			var oBinding = oTable.getBinding("rows");
			this.aSorter.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(this.aSorter);
		},

		handleReset: function () {
			this.byId("search").setValue("");
		},

		onCreate: function () {
			this.router.navTo("Create");

		},

		handleFilter: function (oEvent) {
			var oQuery = oEvent.getParameter("query");
			var filter = new Array();

			var oFilter = [
				new Filter("Matnr", FilterOperator.Contains, oQuery),
				new Filter("Locno", FilterOperator.Contains, oQuery),
				new Filter("Zaggloc", FilterOperator.Contains, oQuery),
				new Filter("Zplanningplant", FilterOperator.Contains, oQuery),
				new Filter("Zstockingnodetype", FilterOperator.Contains, oQuery),
				new Filter("Zpbr", FilterOperator.Contains, oQuery),
				new Filter("Zsafetystockpolicy", FilterOperator.Contains, oQuery),
				new Filter("Zforecastrelevant", FilterOperator.Contains, oQuery),
				new Filter("Zmastscheduler", FilterOperator.Contains, oQuery),
				new Filter("Zdeploymentplanner", FilterOperator.Contains, oQuery),
				new Filter("Zinvholdingpolicy", FilterOperator.Contains, oQuery),
				new Filter("Zfrozenhorizon", FilterOperator.Contains, oQuery),
				new Filter("Zfrozenhorizonextreceipt", FilterOperator.Contains, oQuery),
				new Filter("Zconsumptiontype", FilterOperator.Contains, oQuery),
				new Filter("Zfcstconsmode", FilterOperator.Contains, oQuery),
				new Filter("Zmonthoffset", FilterOperator.Contains, oQuery),
				new Filter("Zminorderleadtime", FilterOperator.Contains, oQuery),
				new Filter("Zsafetystocktype", FilterOperator.Contains, oQuery),
				new Filter("Zsafetystockquantity", FilterOperator.Contains, oQuery),
				new Filter("Zrelativepercentage", FilterOperator.Contains, oQuery),
				new Filter("Zweeksofforwardcoverage", FilterOperator.Contains, oQuery),
				new Filter("Zwfcquantity", FilterOperator.Contains, oQuery),
				new Filter("Zwfcdemand", FilterOperator.Contains, oQuery),
				new Filter("Ztargetstocktype", FilterOperator.Contains, oQuery),
				new Filter("Ztechallocation", FilterOperator.Contains, oQuery),
				new Filter("Zformallocation", FilterOperator.Contains, oQuery),
				new Filter("Zdemandplacementwk", FilterOperator.Contains, oQuery),
				new Filter("Ziochannelstrategy", FilterOperator.Contains, oQuery),
				new Filter("Zdemreassignparentid", FilterOperator.Contains, oQuery),
				new Filter("Zprodpriorityweightage", FilterOperator.Contains, oQuery),
				new Filter("Zplanningstrategy", FilterOperator.Contains, oQuery),
				new Filter("Zupsiderel", FilterOperator.Contains, oQuery),
				new Filter("Zubuss1", FilterOperator.Contains, oQuery),
				new Filter("Zubuss2", FilterOperator.Contains, oQuery),
				new Filter("Zubuss3", FilterOperator.Contains, oQuery),
				new Filter("Zleadtimepushmethod", FilterOperator.Contains, oQuery),
				//New Code added for 2 new filed Lot Sizing procedure and Target Sub period-By Mannu -5/5/2021
				new Filter("ZLOT_SIZE_PROCEDURE", FilterOperator.Contains, oQuery),
				new Filter("ZTECH_WEEKS", FilterOperator.Contains, oQuery),
				new Filter("ZSAFETY_STOCK", FilterOperator.Contains, oQuery),
				new Filter("Zmaxinventoryrelevant", FilterOperator.Contains, oQuery)// Add New Code Max Inventory Relevant-By Mannu- 29/03/2022
				// end code
				//new Filter("Zibpsupplyrelevant", FilterOperator.Contains, oQuery)
			];

			oFilter = new sap.ui.model.Filter(oFilter, false);
			filter.push(oFilter);
			this.oList = this.getView().byId("LocalprodTable");
			this.oList.getBinding("rows").filter(filter);
		},

		onExit: function (oEvent) {
			if (this._oTPC) {
				this._oTPC.destroy();
				this._oTPC = null;
			}
		},

		onPersoButtonPressed: function (oEvent) {

			if (!this._oTPC) {

				var DemoPersoService = {

					oData: this.getView().byId("LocalprodTable").getColumns(),

					getPersData: function () {
						var oDeferred = new jQuery.Deferred();
						if (!this._oBundle) {
							this._oBundle = this.oData;
						}
						var oBundle = this._oBundle;
						oDeferred.resolve(oBundle);
						return oDeferred.promise();
					},

					setPersData: function (oBundle) {
						var oDeferred = new jQuery.Deferred();
						this._oBundle = oBundle;
						oDeferred.resolve();
						return oDeferred.promise();
					},

					delPersData: function () {
						var oDeferred = new jQuery.Deferred();
						var oInitialData = this.getView().byId("LocalprodTable").getColumns();

						//set personalization
						this._oBundle = oInitialData;

						//reset personalization, i.e. display table as defined
						//		this._oBundle = null;

						oDeferred.resolve();
						return oDeferred.promise();
					}

				};

				this._oTPC = new TablePersoController({
					table: this.getView().byId("LocalprodTable"),
					//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
					//componentName: "APP.ZBAMLOCSRCATTR",
					persoService: DemoPersoService
				});
			}

			this._oTPC.openDialog();

		},

		onDataExport: function () {
			var oTable = this.getView().byId("LocalprodTable"),
				columns = [],
				temp = {},
				oSettings_table;

			oTable.getColumns().forEach(oItem => {
				temp = {};
				if (oItem.getVisible()) {
					temp["label"] = oItem.getLabel().getText();
					temp["property"] = oItem.getTemplate().getBindingInfo('text').parts[0].path;
					temp["type"] = "string";
					columns.push(temp)
				}
			}, this);

			oSettings_table = {
				workbook: {
					columns: columns,
					context: {
						sheetName: "Location Product Attributes"
					}
				},
				dataSource: oTable.getModel("Locationprod").getData().results,
				showProgress: false,
				fileName: "Location Product Attributes.xlsx"
			};
			new Spreadsheet(oSettings_table).build().then(function () {
				MessageToast.show("Downloaded successfully");
			});
		},

		onSearch: function (check) {
			if (check !== "submitted") {
				that = this;
			}
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();

			ControlField.controlFieldInSelection(this);

			/*var aTokens = that.getView().byId("multiPrdLvl").getTokens();
			var sData = aTokens.map(function (oToken) {
				return oToken.getKey();
			}).join(",");
			var GTokens = that.getView().byId("multiGeoLvl").getTokens();
			var GData = GTokens.map(function (oToken) {
				return oToken.getKey();
			}).join(",");
			var GTokens2 = that.getView().byId("multiGeoLvl2").getTokens();
			var GData2 = GTokens2.map(function (oToken) {
				return oToken.getKey();
			}).join(",");*/
			var filters = [];
			var sFilter;
			var tokens = that.getView().byId("multiPrdLvl").getTokens(),
				Geotokens = that.getView().byId("multiGeoLvl").getTokens(),
				Geotokens2 = that.getView().byId("multiGeoLvl2").getTokens(),
				oldLocTokens = that.getView().byId("oldLocationLvl").getTokens();
				// maxInvTokens = that.getView().byId("maxInventoryLvl").getSelectedKey();//New Code added for MaxInventory Filed-28/03/2022
			// planningPlant = this.getView().byId("planningPlantFilter").getTokens();

			$.each(tokens, function (i, token) {
				if (token.data().row) {
					filters.push(
						new sap.ui.model.Filter({
							path: "Matnr",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: token.data().row.Matnr,
						}));
				}

				if (token.data().range) {
					if (token.data().range.exclude === true) {
						filters.push(
							new sap.ui.model.Filter({
								path: "Matnr",
								operator: sap.ui.model.FilterOperator.NE,
								value1: token.data().range.value1,
								value2: token.data().range.value2,
							}));
					} else {
						filters.push(
							new sap.ui.model.Filter({
								path: "Matnr",
								operator: token.data().range.operation,
								value1: token.data().range.value1,
								value2: token.data().range.value2,
							}));
					}
				}
			});

			$.each(Geotokens, function (i, gtoken) {
				if (gtoken.data().row) {
					filters.push(
						new sap.ui.model.Filter({
							path: "Locno",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: gtoken.data().row.Locno,
						}));
				}
				if (gtoken.data().range) {
					if (gtoken.data().range.exclude === true) {
						filters.push(
							new sap.ui.model.Filter({
								path: "Locno",
								operator: sap.ui.model.FilterOperator.NE,
								value1: gtoken.data().range.value1,
								value2: gtoken.data().range.value2,
							}));
					} else {
						filters.push(
							new sap.ui.model.Filter({
								path: "Locno",
								operator: gtoken.data().range.operation,
								value1: gtoken.data().range.value1,
								value2: gtoken.data().range.value2,
							}));
					}
				}
			});

			$.each(Geotokens2, function (i, gtoken2) {
				if (gtoken2.data().row) {
					filters.push(
						new sap.ui.model.Filter({
							path: "Zaggloc",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: gtoken2.data().row.Locno,
						}));
				}
				if (gtoken2.data().range) {
					if (gtoken2.data().range.exclude === true) {
						filters.push(
							new sap.ui.model.Filter({
								path: "Zaggloc",
								operator: sap.ui.model.FilterOperator.NE,
								value1: gtoken2.data().range.value1,
								value2: gtoken2.data().range.value2,
							}));
					} else {
						filters.push(
							new sap.ui.model.Filter({
								path: "Zaggloc",
								operator: gtoken2.data().range.operation,
								value1: gtoken2.data().range.value1,
								value2: gtoken2.data().range.value2,
							}));
					}
				}
			});

			$.each(oldLocTokens, function (i, gtoken3) {
				if (gtoken3.data().row) {
					filters.push(
						new sap.ui.model.Filter({
							path: "Sort1",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: gtoken3.data().row.Locno,
						}));
				}
				if (gtoken3.data().range) {
					if (gtoken3.data().range.exclude === true) {
						filters.push(
							new sap.ui.model.Filter({
								path: "Sort1",
								operator: sap.ui.model.FilterOperator.NE,
								value1: gtoken3.data().range.value1,
								value2: gtoken3.data().range.value2,
							}));
					} else {
						filters.push(
							new sap.ui.model.Filter({
								path: "Sort1",
								operator: gtoken3.data().range.operation,
								value1: gtoken3.data().range.value1,
								value2: gtoken3.data().range.value2,
							}));
					}
				}
			});
			
			
		 //   var maxInv = new sap.ui.model.Filter({
			// 	path: "Zmaxinventoryrelevant",
			// 	operator: sap.ui.model.FilterOperator.EQ,
			// 	value1: maxInvTokens
			// });
			// filters.push(maxInv);
			
// End of code
			/*$.each(planningPlant, function (i, plant) {
				if (plant.data().row) {
					filters.push(
						new sap.ui.model.Filter({
							path: "Zplanningplant",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: plant.data().row.Locno
						}));
				}
			});*/

			var self = this,
				sURI = "/sap/opu/odata/sap/ZBAM_LOC_PRODUCT_SRV/",
				oModelP = new sap.ui.model.json.JSONModel();
			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);

			oModelP.read("/ZBAM_LOC_PROD_DISPLAYSet", {
				filters: filters,
				success: function (oData, response) {
					//self._fltoDataResponce(oData.results);
					oData.results.map((item) => {
						//item.Zbomerel = item.Zbomerel === '' ? item.Zbomerel : item.Zbomerel + " - " + item.ZbomerelT;

						item.Sort1 = item.Sort1Desc === '' ? item.Sort1 : item.Sort1 + " - " + item.Sort1Desc;
                        // BOM RELEVANCY-New Code Added Mannu-29/12/2020
                        	// item.Zbomerel = item.Zbomerel === 'X' ? item.Zbomerel + " - YES" : "NO"
					    item.Zbomerel = item.ZforecastrelevantT === '' ? item.Zbomerel :
							item.Zbomerel + "-" + item.ZbomerelT;

						item.Zstockingnodetype = item.ZstockingnodetypeT === '' ? item.Zstockingnodetype :
							item.Zstockingnodetype + "-" + item.ZstockingnodetypeT;

						item.Locno = item.LocT === '' ? item.Locno :
							item.Locno + " - " + item.LocT;

						item.Zforecastrelevant = item.ZforecastrelevantT === '' ? item.Zforecastrelevant :
							item.Zforecastrelevant + "-" + item.ZforecastrelevantT;

						item.Zsafetystockpolicy = item.ZsafetystockpolicyT === '' ? item.Zsafetystockpolicy :
							item.Zsafetystockpolicy + "-" + item.ZsafetystockpolicyT;

						item.Zmastscheduler = item.ZmastschedulerT === '' ? item.Zmastscheduler :
							item.Zmastscheduler + "-" + item.ZmastschedulerT;

						item.Zinvholdingpolicy = item.ZinvholdingpolicyT === '' ? item.Zinvholdingpolicy :
							item.Zinvholdingpolicy + "-" + item.ZinvholdingpolicyT;

						item.Zdeploymentplanner = item.ZdeploymentplannerT === '' ? item.Zdeploymentplanner :
							item.Zdeploymentplanner + "-" + item.ZdeploymentplannerT;

						item.Zconsumptiontype = item.ZconsumptiontypeT === '' ? item.Zconsumptiontype :
							item.Zconsumptiontype + "-" + item.ZconsumptiontypeT;

						item.Zfcstconsmode = item.ZfcstconsmodeT === '' ? item.Zfcstconsmode :
							item.Zfcstconsmode + "-" + item.ZfcstconsmodeT;

						item.Zweeksofforwardcoverage = item.ZweeksofforwardcoverageT === '' ? item.Zweeksofforwardcoverage :
							item.Zweeksofforwardcoverage + "-" + item.ZweeksofforwardcoverageT;

						item.Zsafetystocktype = item.ZsafetystocktypeT === '' ? item.Zsafetystocktype :
							item.Zsafetystocktype + "-" + item.ZsafetystocktypeT;

						item.Ztargetstocktype = item.ZtargetstocktypeT === '' ? item.Ztargetstocktype :
							item.Ztargetstocktype + "-" + item.ZtargetstocktypeT;

						item.Zwfcdemand = item.ZwfcdemandT === '' ? item.Zwfcdemand :
							item.Zwfcdemand + "-" + item.ZwfcdemandT;

						item.Ztechallocation = item.ZtechallocationT === '' ? item.Ztechallocation :
							item.Ztechallocation + "-" + item.ZtechallocationT;
						
						item.ZtechallocationAps = item.ZtechallocationApsT === '' ? item.ZtechallocationAps :
							item.ZtechallocationAps + "-" + item.ZtechallocationApsT;	
							
						item.Zformallocation = item.ZformallocationT === '' ? item.Zformallocation :
							item.Zformallocation + "-" + item.ZformallocationT;
					// New changes added for APS Production Constraints filed-By Mannu(23/12/2020)		
						item.ZformallocationAps = item.ZformallocationAPST === '' ? item.Zformallocation :
							item.ZformallocationAps + "-" + item.ZformallocationAPST;
					// Changes for Planning Strategy Filed-Mannu-29/12/2020	
						item.Zplanningstrategy = item.ZplanningstrategyT === '' ? item.Zplanningstrategy :
							item.Zplanningstrategy + "-" + item.ZplanningstrategyT;	
					//New Changes for Filed Max Delivery Override-12/02/2021-Mannu
						item.zmaxdeliveryoverride = item.zmaxdeliveryoverride_t === '' ? item.zmaxdeliveryoverride :
							item.zmaxdeliveryoverride + "-" + item.zmaxdeliveryoverride_t;	
						item.ZforecastRollRel = item.ZforecastRollRel_T === '' ? item.ZforecastRollRel :
							item.ZforecastRollRel + "-" + item.ZforecastRollRel_T;		
					//End of changes
					//New Changes for New filed Lot Sizing Procedure -By Mannu-5/5/2021
					item.ZLOT_SIZE_PROCEDURE = item.ZLOT_SIZE_PROCEDURE_T === '' ? item.ZLOT_SIZE_PROCEDURE :
						item.ZLOT_SIZE_PROCEDURE + "-" + item.ZLOT_SIZE_PROCEDURE_T;	
					//End of changes

                      //New Changes for New filed Safety Stock Diagg -By Mannu-27/7/2021
						item.ZSAFETY_STOCK = item.ZSAFETY_STOCK_TEXT === '' ? item.ZSAFETY_STOCK :
							item.ZSAFETY_STOCK + "-" + item.ZSAFETY_STOCK_TEXT;
						//End of changes
						
						 //New Changes for New filed Max Inventory Relevant -By Mannu-29/3/2022
						item.Zmaxinventoryrelevant = item.ZmaxinventoryrelevantT === '' ? item.Zmaxinventoryrelevant :
							item.Zmaxinventoryrelevant + "-" + item.ZmaxinventoryrelevantT;
						//End of changes
						item.Zdemandplacementwk = item.ZdemandplacementwkT === '' ? item.Zdemandplacementwk :
							item.Zdemandplacementwk + "-" + item.ZdemandplacementwkT;

						item.Ziochannelstrategy = item.ZiochannelstrategyT === '' ? item.Ziochannelstrategy :
							item.Ziochannelstrategy + "-" + item.ZiochannelstrategyT;

						if (!item.Matnr.match(/[A-za-z]\w/) && item.Matnr.match(/\w/) !== null) {
							item.Matnr = item.Matnr.match(/[1-9]\d*/)[0];
						}

						item.Matnr = item.Maktx === '' ? item.Matnr : item.Matnr + " - " + item.Maktx;

						item.Zaggloc = item.AlocT === '' ? item.Zaggloc : item.Zaggloc + " - " + item.AlocT;

						/*item.Zibpsupplyrelevant = item.Zibpsupplyrelevant !== '' ? item.Zibpsupplyrelevant === "1" ? item.Zibpsupplyrelevant + " - YES" :
													item.Zibpsupplyrelevant + " - NO" : null;*/

						/*	item.Zplanningstrategy = item.Zplanningstrategy;
							
							item.ZaggIdChg = item.ZaggIdChg;*/
						item.Zprodscheduler = item.ZprodschedulerT === '' ? item.Zprodscheduler : item.Zprodscheduler + " - " + item.ZprodschedulerT;
						item.Zmaterialplanner = item.ZmaterialplannerT === '' ? item.Zmaterialplanner : item.Zmaterialplanner + " - " + item.ZmaterialplannerT;
						item.Zmfctrgdisagg = item.ZmfctrgdisaggT === '' ? item.Zmfctrgdisagg : item.Zmfctrgdisagg + " - " + item.ZmfctrgdisaggT;
						item.Zprodpriorityweightage = item.ZprodpriorityweightageT === '' ? item.Zprodpriorityweightage : item.Zprodpriorityweightage + " - " + item.ZprodpriorityweightageT;
						item.Zleadtimepushmethod = item.ZleadtimepushmethodT === '' ? item.Zleadtimepushmethod : item.Zleadtimepushmethod + " - " + item.ZleadtimepushmethodT;
						
						// item.Zupsiderel = item.Zupsiderel === "Y" ? 

					});

					var oModel = new sap.ui.model.json.JSONModel(oData);
					oModel.setSizeLimit(oData.results.length);
					that.getView().setModel(oModel, "Locationprod");
					oModel.updateBindings(true);

					var filterData = that.createFacetFilter(oData.results);
					oModel.setProperty('/filters', filterData, null, true);
					that.handleFacetFilterReset(null, "locationProdFilter");

					that.getView().byId("LocalprodTable").setVisible(true);
					oModel.updateBindings(true);

					oBusy.close();
				},
				error: function fnError(e) {
					oBusy.close();
					MessageBox.warning(MaterialValueHelp.handlErrorResponse(e));

					var f = self.getView().getModel('oModel');
					if (f !== undefined) {
						f.setData();
						f.updateBindings(true);
					}
				},
				async: true
			});

			this.getView().byId("LocalprodTable").setVisible(true);
			//this.getView().byId("TBar").setVisible(true);
		},

		createFacetFilter: function (data) {
			var filter = {},
				mapped = {},
				temp;

			// Contains all the entity names
			var constants = [
				"Locno", "Matnr", "Zmastscheduler", "Zdeploymentplanner", "Ztechallocation", "Zformallocation", 
				"Zprodpriorityweightage", "Zforecastrelevant", "Zplanningstrategy", "Ziochannelstrategy", "Ztargetstocktype",
				"Zsafetystocktype", "Zsafetystockquantity", "Zrelativepercentage", "Zweeksofforwardcoverage", "Zwfcquantity", 
				"Zwfcdemand", "Zfcstconsmode", "Zmonthoffset", "Zminorderleadtime", "Zdemreassignparentid", "Zaggloc", 
				"Zstockingnodetype", "Zinvholdingpolicy", "Zpbr", "Zsafetystockpolicy", "Zplunitid", "Zapssubnetwork", 
				"Zplanningplant", "Zfrozenhorizon", "Zconsumptiontype", "Zbomerel", "ZaggIdChg", "Zupsiderel", "Zubuss1",
    			"Zubuss2", "Zubuss3", "Zleadtimepushmethod","ZLOT_SIZE_PROCEDURE","ZTargetSubPeriodofSupply","ZSAFETY_STOCK","Zmaxinventoryrelevant"
			]

			// Contains all the i18n texts for the entities respectively for the above constants
			var translations = [
				"Location ID", "Product ID", "Master Scheduler", "Deployment Planner", "Purchase Constraint", "Production Constraint",
				"Product Priority", "Forecast Relevant", "Planning Strategy", "Inventory Channel Strategy",
				"Target Stock Level Method", "Safety Stock Method", "Static Safety Stock Quantity",
				"Relative Percentage Static Safety Stock", "WFC Supply Method", "Static WFC Quantity", "WFC Demand Method",
				"Forecast Consumption Mode", "Forecast Offset in Months", "Min Order Lead Time",
				"Demand Reassignment Parent ID", "Aggregate Location", "Stocking Node Type Indicator", "Inventory Holding Policy",
				"Periods Between Replenishment", "Stocking stock policy indicator", "MPS Subnetwork ID", "APS Subnetwork ID",
				"Planning Plant", "Production Frozen Zone", "Consumption Type", "BOM Relevancy", "Agg ID Change Indicator",
				"Upside Relevant", "User Field 1", "User Field 2", "User Field 3", "Lead Time Push Method","Lot Sizing Procedure","Target Sub Period of Supply(Tech Weeks)","Safety Stock Disagg","Max Inventory Relevant"
			]

			constants.forEach(c => {
				mapped[c] = data.reduce((acc, o) => (acc[o[c]] = (acc[o[c]] || 0) + 1, acc), {});
			}, this);

			constants.forEach((c, i) => {
				filter[c] = {
					"type": translations[i],
					"key": c,
					"values": this.createFilterData(mapped[c])
				}
			}, this);

			return filter;
		},

		createFilterData: function (oSelectionField) {
			return Object.entries(oSelectionField)
				.filter(item => item[0] !== "")
				.map(([key, value]) => {
					return {
						"text": key,
						"data": value
					};
				});
		},

		_applyFilter: function (oFilter) {
			this.byId("LocalprodTable").getBinding("rows").filter(oFilter);
		},

		handleFacetFilterReset: function (oEvent, id) {
			if (oEvent !== null) {
				var oFacetFilter = this.getView().byId(oEvent.getParameter("id")),
					aFacetFilterLists = oFacetFilter.getLists();

				for (var i = 0; i < aFacetFilterLists.length; i++) {
					aFacetFilterLists[i].setSelectedKeys();
				}
			} else {
				oFacetFilter = this.getView().byId(id);
				aFacetFilterLists = oFacetFilter.getLists();

				for (i = 0; i < aFacetFilterLists.length; i++) {
					aFacetFilterLists[i].setSelectedKeys();
				}
			}

			this._applyFilter([]);
		},

		handleListClose: function (oEvent) {
			// Get the Facet Filter lists and construct a (nested) filter for the binding
			var oFacetFilter = oEvent.getSource().getParent();

			this._filterModel(oFacetFilter);
		},

		handleConfirm: function (oEvent) {
			// Get the Facet Filter lists and construct a (nested) filter for the binding
			var oFacetFilter = oEvent.getSource();
			this._filterModel(oFacetFilter);
		},

		_filterModel: function (oFacetFilter) {
			var mFacetFilterLists = oFacetFilter.getLists().filter(function (oList) {
				return oList.getSelectedItems().length;
			});

			if (mFacetFilterLists.length) {
				// Build the nested filter with ORs between the values of each group and
				// ANDs between each group
				var oFilter = new Filter(mFacetFilterLists.map(function (oList) {
					return new Filter(oList.getSelectedItems().map(function (oItem) {
						//return new Filter(oList.getTitle(), "EQ", oItem.getText());
						return new Filter(oList.getKey(), "EQ", oItem.getText());
					}), false);
				}), true);
				this._applyFilter(oFilter);
			} else {
				this._applyFilter([]);
			}
		}
	});
});