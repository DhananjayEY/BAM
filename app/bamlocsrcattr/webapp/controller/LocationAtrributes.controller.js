sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/TablePersoController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/ui/export/Spreadsheet",
	"../helper/productLevel",
	"../helper/material",
	"../helper/controlField"
], function (Controller, JSONModel, TablePersoController, Filter, FilterOperator, MessageBox, Spreadsheet, ProductValueHelp,
	MaterialValueHelp, ControlField) {
	"use strict";
	var that;
	return Controller.extend("com.ey.bamlocsrcattr.controller.LocationAtrributes", {

		onInit: function () {

			that = this;
			this.getOwnerComponent().setModel(new JSONModel({
				param: ""
			}), "check");
			this.getView().byId("idLocationSourceTable").setVisible(false);

			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._onObjectMatched, this);
			this.selectedItems = [];
			this.initializeFilterParams();
		},
		
		/*controlFields: function() {
			debugger;
			var oModel = this.getModel("security");
			var sContext = new sap.ui.model.Context(oModel, "/");
			this.getView().byId("idLocationSourceTable").setModel(oModel);
			this.getView().byId("idLocationSourceTable").setBindingContext(sContext, "security");
		},*/

		initializeFilterParams: function () {
			this.productParams = {
				"InputId": "multiPrdLvl",
				"Columns": "/columnsModel.json",
				"Fragment": "Product",
				"bindPath": "/Material",
				"aList": "",
				"SearchSet": "/ZBAM_MATERIAL_SEARCHSet",
				"label": "Product ID",
				"key": "Matnr"
			};
			
			this.LocationFromParams = {
				"InputId": "idShipFrom",
				"Columns": "/columnsFromLoc.json",
				"Fragment": "LocationFrom",
				"bindPath": "/LocationFrom",
				"aList": "",
				"SearchSet": "/ZBAM_LOC_FROM_SEARCHSet",
				// "additionFilter": "Zagloctype/OLD",
				"label": "Ship-From Loc. ID",
				"key": "Locno_From"
			};
			
			this.LocationToParams = {
				"InputId": "idLocationID",
				"Columns": "/columnsToLoc.json",
				"Fragment": "LocationTo",
				"bindPath": "/LocationTo",
				"aList": "",
				"SearchSet": "/ZBAM_LOC_SOURCE_SEARCHSet",
				// "additionFilter": "Zagloctype/OLD",
				"label": "Location ID",
				"key": "Locno_To"
			};

			this.oldLocationParams = {
				"InputId": "oldLocationLvl",
				"Columns": "/ColumnsOldLocModel.json",
				"Fragment": "OldLocation",
				"bindPath": "/OldLocation",
				"aList": "",
				"SearchSet": "/ZBAM_LOCATION_SEARCHSet",
				// "additionFilter": "Zagloctype/OLD",
				"label": "Old Location ID",
				"key": "Locno"
			};

			this.oldFromLocationParams = {
				"InputId": "oldLocationLvl",
				"Columns": "/ColumnsOldLocModel.json",
				"Fragment": "OldLocationFrom",
				"bindPath": "/OldLocationFrom",
				"aList": "",
				"SearchSet": "/ZBAM_LOCATION_SEARCHSet",
				// "additionFilter": "Zagloctype/OLD",
				"label": "Old Ship-From Loc. ID",
				"key": "Locno"
			};
			
			this.MotParams = {
				"InputId": "idTransportID",
				"Columns": "/columnsMot.json",
				"Fragment": "Mot",
				"bindPath": "/Mot",
				"aList": "",
				"SearchSet": "/ZBAM_MOT_SEARCHSet",
				// "additionFilter": "Zagloctype/OLD",
				"label": "Mode of Transportation ID",
				"key": "MoT"
			};
		},

		_onObjectMatched: function (oEvent) {
			var check = this.getOwnerComponent().getModel("check").param;
			if (check === "edit/submitted" || check === "create/submitted") {
				this.onSearch(check.split("/")[1]);
				this.getOwnerComponent().getModel("check").param = "edit/didNotSubmit";
			}
		},

		onLiveChange: function (oEvent) {
			oEvent.getSource().setValue("");
			sap.m.MessageToast.show("Please select from Value Help", {
				duration: 1300
			});
		},

		/*onLocationFromF4: function (oEvent) {
			var props = ["locationFrom", "Ship-From Loc. ID", "/ZBAM_LOC_FROM_SEARCHSet", "{Locno_From}", "{Locfromdesc}",
				"LocationFromF4", "idShipFrom"
			];
			this.genericF4(oEvent, props);
		},

		onLocationToF4: function (oEvent) {
			var props = ["locationTo", "Location ID", "/ZBAM_LOC_SOURCE_SEARCHSet", "{Locno_To}", "{Loctodesc}",
				"LocationToF4", "idLocationID"
			];
			this.genericF4(oEvent, props);
		},

		onModeOfTransportF4: function (oEvent) {
			var props = ["mot", "Mode of Transportation ID", "/ZBAM_MOT_SEARCHSet", "{MoT}", "{Bezei}",
				"ModeOfTransportF4", "idTransportID"
			];
			this.genericF4(oEvent, props);
		},*/

		/*genericF4: function (oEvent, props) {
			var global = $.extend(true, {}, this.getOwnerComponent().getModel("temp").getData().root[0]);
			if (!this.getView().getModel(props[0])) {
				var oModel = new JSONModel();
				this.getView().setModel(oModel, props[0]);
			} else {
				oModel = this.getView().getModel(props[0]);
			}

			this.oGenericDialog = new sap.m.SelectDialog({
				title: props[1],
				noDataText: "No Data Found",
				titleAlignment: "Center",
				multiSelect: true,
				liveChange: function (oEvent) {

					var sValue = oEvent.getParameter("value"),
						oFilter = [];

					oFilter = [
						new Filter(props[3].match(/\w+/)[0], FilterOperator.Contains, sValue),
						new Filter(props[4].match(/\w+/)[0], FilterOperator.Contains, sValue)
					];

					var combinedFilter = new sap.ui.model.Filter({
							filters: [new Filter(oFilter)],
							and: false
						}),
						oBinding = oEvent.getSource().getBinding("items");

					if (!sValue || sValue === "") {
						oBinding.filter([]);
						return;
					}
					oBinding.filter(combinedFilter);

				}.bind(this),
				confirm: function (evt) {

					var selectedItems = evt.getParameter("selectedItems"),
						tokens = [];
					if (selectedItems) {
						selectedItems.forEach((item) => {
							tokens.push(new sap.m.Token({
								text: item.getTitle(),
								key: item.getTitle()
							}))
						});
					}

					this.getView().byId(props[6]).setTokens(tokens);

				}.bind(this),
				cancel: function (oEvent) {

					oEvent.getSource().getBinding("items").filter([]);
					this.oGenericDialog.destroy();
				}.bind(this)
			});

			oModel.setProperty(props[2], global[props[5]]);
			this.oGenericDialog.setModel(oModel);

			var itemTemplate = new sap.m.ObjectListItem({
				title: props[3],
				attributes: [{
					text: props[4]
				}]
			});
			this.oGenericDialog.bindAggregation("items", props[2], itemTemplate);
			this.oGenericDialog.open();
		},*/

		/* Material Value Help Starts */
		
		onMatnrValueHelpRequested: function (oEvent) {
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
		/* Material Value Help Ends */

		/* Product Level Value help Starts */
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

		/* Location From Value help Starts */
		onLocationFromF4: function (oEvent) {
			this.params = this.LocationFromParams;
			MaterialValueHelp.ValueHelp(oEvent, this.params, this);
		},
		
		onLocFromOk: function (oEvent) {
			MaterialValueHelp.OnConfirm(oEvent, this);
		},
		
		onLocFromCancel: function () {
			MaterialValueHelp.OnCancel(this);
		},
		onLocFromAfterClose: function () {
			MaterialValueHelp.AfterClose(this);
		},
		onLocFromSearch: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* Location From Value help ends */
		
		/* Location To Value help Starts */
		onLocationToF4: function (oEvent) {
			this.params = this.LocationToParams;
			MaterialValueHelp.ValueHelp(oEvent, this.params, this);
		},
		
		onLocToOk: function (oEvent) {
			MaterialValueHelp.OnConfirm(oEvent, this);
		},
		
		onLocToCancel: function () {
			MaterialValueHelp.OnCancel(this);
		},
		
		onLocToAfterClose: function () {
			MaterialValueHelp.AfterClose(this);
		},
		onLocToSearch: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* Location To Value help ends */
		
		/* Mot Value help Starts */
		onModeOfTransportF4: function (oEvent) {
			this.params = this.MotParams;
			MaterialValueHelp.ValueHelp(oEvent, this.params, this);
		},
		
		onMotF4Ok: function (oEvent) {
			MaterialValueHelp.OnConfirm(oEvent, this);
		},
		onMotF4Cancel: function () {
			MaterialValueHelp.OnCancel(this);
		},
		
		onMotF4AfterClose: function () {
			MaterialValueHelp.AfterClose(this);
		},
		
		onMotSearch: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* Mot Value help ends */

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

		/* Old from loc Value help starts*/
		oldLocationFromValueHelp: function (oEvent) {
			this.params = this.oldFromLocationParams;
			MaterialValueHelp.ValueHelp(oEvent, this.params, this);
		},

		onOldFromLocF4Ok: function (oEvent) {
			MaterialValueHelp.OnConfirm(oEvent, this);
		},

		onOldFromLocF4Cancel: function () {
			MaterialValueHelp.OnCancel(this);
		},

		onOldFromLocF4AfterClose: function () {
			MaterialValueHelp.AfterClose(this);
		},

		onOldFromLocaF4FltSrch: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* Old from loc Value help ends*/

		onSearch: function (check) {
			if (check !== "submitted") {
				that = this;
			}
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();

			var fromLocation = that.getView().byId('idShipFrom').getTokens();
			var oldFromLocation = that.getView().byId('oldLocationFrom').getTokens();
			var toLocation = that.getView().byId('idLocationID').getTokens();
			var oldLocation = that.getView().byId('oldLocationLvl').getTokens();
			var mot = that.getView().byId('idTransportID').getTokens();
			var productId = that.getView().byId('idProductID').getTokens(),
				filters = [],
				tokenArray = [fromLocation, oldFromLocation, toLocation, oldLocation, mot, productId],
				keys = ["LocnoFrom", "Sort1", "LocnoTo", "Sort2", "MotId", "Matnr"];

			tokenArray.forEach((item, j) => {
				$.each(item, function (i, token) {
					filters.push(
						new sap.ui.model.Filter({
							path: keys[j], // path: "Locno",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: token.getKey().startsWith("range_0") ? token.getText() : token.getKey() // value1: token.data().row.Locno,
						}));
				});
			}, this);

			var sURI = "/sap/opu/odata/sap/ZBAM_SUPP_LOC_SOURCE_SRV/";
			var oModelP = new sap.ui.model.json.JSONModel();
			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);
			
			ControlField.controlFieldInSelection(this);

			oModelP.read("/ZBAM_SUPP_LOC_SOURCESet", {
				filters: filters,
				success: function (oData, response) {
					var data = that._oDataResponse(oData.results);

					var oModel = that.getView().getModel("locationSourceTable");
					var filterData = that.createFacetFilter(data);
					oModel.setProperty('/filters', filterData, null, true);
					that.handleFacetFilterReset(null, "locationSourceFilter");

					oBusy.close();
				},
				error: function fnError(e) {
					//MessageBox.warning(e.message);
					/*** Nov 20th: Changes by Ruthvik ***/
					oBusy.close();

					// MessageBox.warning(that.handlErrorResponse(e));
					MessageBox.warning(MaterialValueHelp.handlErrorResponse(e));

					/*** Nov 20th: Changes by Ruthvik ***/

					var f = that.getView().getModel("locationSourceTable");
					if (f !== undefined) {
						f.setData();
						f.updateBindings();
					}
				},
				async: true
			});

			this.getView().byId("idLocationSourceTable").setVisible(true);
		},

		_oDataResponse: function (data) {
			var oModel = new sap.ui.model.json.JSONModel(),
				j = 0,
				i,
				datarow = [],
				P = {};

			for (i = 0; i < data.length; i++) {
				P = {};

				//P.Maktx = data[i].Maktx;
				P.LocnoFrom = data[i].LocnoFrom;
				P.Trtyp = data[i].Trtyp;
				P.LocnoTo = data[i].LocnoTo;
				P.MotId = data[i].ZmotT === '' ? data[i].MotId : data[i].MotId + "-" + data[i].ZmotT;

				P.Sort1 = data[i].Sort1Desc === '' ? data[i].Sort1 : data[i].Sort1 + "-" + data[i].Sort1Desc;
				P.Sort2 = data[i].Sort2Desc === '' ? data[i].Sort2 : data[i].Sort2 + "-" + data[i].Sort2Desc;

				P.Matnr = !data[i].Matnr.match(/[A-za-z]\w/) && data[i].Matnr.match(/\w/) !== null ?
					data[i].Matnr.match(/[1-9]\d*/)[0] : data[i].Matnr;
				P.Matnr = data[i].Maktx !== "" ? P.Matnr + " - " + data[i].Maktx : P.Matnr;

				P.Ztransportationconst = data[i].ZtransportationconstT === '' ? data[i].Ztransportationconst :
					data[i].Ztransportationconst + "-" + data[i].ZtransportationconstT;
				
				P.ZtransportationconstAps = data[i].ZtransportationconstAps;
				
				P.Zfrozenhorizontreceipt = data[i].Zfrozenhorizontreceipt;

				P.Ztrounding = data[i].Ztrounding;
				P.Ztminlotsize = data[i].Ztminlotsize;
				P.Ztmaxlotsize = data[i].Ztmaxlotsize;
				P.Zapstlaneovrd = data[i].Zapstlaneovrd === "X" ? "X - YES" : "NO";
				P.Ztleadtime = data[i].Ztleadtime;

				datarow[j] = P;
				j++;
			}

			oModel.setSizeLimit(data.length);
			oModel.setData(datarow);
			this.getView().setModel(oModel, "locationSourceTable");
			oModel.updateBindings();

			return datarow;
		},

		createFacetFilter: function (data) {
			var filter = {},
				temp = {},
				entries = [];

			var LocnoFrom = data.reduce((acc, o) => (acc[o.LocnoFrom] = (acc[o.LocnoFrom] || 0) + 1, acc), {}),
				LocnoTo = data.reduce((acc, o) => (acc[o.LocnoTo] = (acc[o.LocnoTo] || 0) + 1, acc), {}),
				Matnr = data.reduce((acc, o) => (acc[o.Matnr] = (acc[o.Matnr] || 0) + 1, acc), {}),
				MotId = data.reduce((acc, o) => (acc[o.MotId] = (acc[o.MotId] || 0) + 1, acc), {}),
				Zapstlaneovrd = data.reduce((acc, o) => (acc[o.Zapstlaneovrd] = (acc[o.Zapstlaneovrd] || 0) + 1, acc), {}),
				Zfrozenhorizontreceipt = data.reduce((acc, o) => (acc[o.Zfrozenhorizontreceipt] = (acc[o.Zfrozenhorizontreceipt] || 0) + 1, acc), {}),
				Ztleadtime = data.reduce((acc, o) => (acc[o.Ztleadtime] = (acc[o.Ztleadtime] || 0) + 1, acc), {}),
				Ztmaxlotsize = data.reduce((acc, o) => (acc[o.Ztmaxlotsize] = (acc[o.Ztmaxlotsize] || 0) + 1, acc), {}),
				Ztminlotsize = data.reduce((acc, o) => (acc[o.Ztminlotsize] = (acc[o.Ztminlotsize] || 0) + 1, acc), {}),
				Ztransportationconst = data.reduce((acc, o) => (acc[o.Ztransportationconst] = (acc[o.Ztransportationconst] || 0) + 1, acc), {}),
				Ztrounding = data.reduce((acc, o) => (acc[o.Ztrounding] = (acc[o.Ztrounding] || 0) + 1, acc), {});

			filter["LocnoFrom"] = {
				"type": "Ship-From Loc. ID",
				"key": "LocnoFrom",
				"values": this.createFilterData(LocnoFrom)
			};
			filter["LocnoTo"] = {
				"type": "Location ID",
				"key": "LocnoTo",
				"values": this.createFilterData(LocnoTo)
			};
			filter["Matnr"] = {
				"type": "Product ID",
				"key": "Matnr",
				"values": this.createFilterData(Matnr)
			};
			filter["MotId"] = {
				"type": "Mode of Transportation ID",
				"key": "MotId",
				"values": this.createFilterData(MotId)
			};
			filter["Zapstlaneovrd"] = {
				"type": "APS T Lane Override",
				"key": "Zapstlaneovrd",
				"values": this.createFilterData(Zapstlaneovrd)
			};
			filter["Zfrozenhorizontreceipt"] = {
				"type": "Transportation Receipt Frozen Zone",
				"key": "Zfrozenhorizontreceipt",
				"values": this.createFilterData(Zfrozenhorizontreceipt)
			};
			filter["Ztleadtime"] = {
				"type": "Transportation Lead Time",
				"key": "Ztleadtime",
				"values": this.createFilterData(Ztleadtime)
			};
			filter["Ztmaxlotsize"] = {
				"type": "Maximum Transportation Lot Size",
				"key": "Ztmaxlotsize",
				"values": this.createFilterData(Ztmaxlotsize)
			};
			filter["Ztminlotsize"] = {
				"type": "Minimum Transportation Lot Size",
				"key": "Ztminlotsize",
				"values": this.createFilterData(Ztminlotsize)
			};
			filter["Ztransportationconst"] = {
				"type": "Transportation Constraint",
				"key": "Ztransportationconst",
				"values": this.createFilterData(Ztransportationconst)
			};
			filter["Ztrounding"] = {
				"type": "Lot Size Rounding Value for Transportation",
				"key": "Ztrounding",
				"values": this.createFilterData(Ztrounding)
			};

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
			this.byId("idLocationSourceTable").getBinding("rows").filter(oFilter);
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
		},

		handleSearch: function (oEvent) {
			var oQuery = oEvent.getParameter("query");
			var filter = new Array();

			var oFilter = [
				new sap.ui.model.Filter("LocnoFrom", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("MotId", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("LocnoTo", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Ztransportationconst", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zfrozenhorizontreceipt", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Ztmaxlotsize", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Ztminlotsize", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Ztleadtime", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zapstlaneovrd", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Ztrounding", sap.ui.model.FilterOperator.Contains, oQuery)
			];

			oFilter = new sap.ui.model.Filter(oFilter, false);
			filter.push(oFilter);
			this.oList = this.getView().byId("idLocationSourceTable");
			this.oList.getBinding("rows").filter(filter);
		},

		handleViewSettingsDialogButtonPressed: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.ey.bamlocsrcattr.fragment.ViewSettingsDialog", this);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},

		handleConfirmSelectDialog: function (oEvent) {
			var mParams = oEvent.getParameters();
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			this.aSorter = [];
			var oTable = this.getView().byId("idLocationSourceTable");
			var oBinding = oTable.getBinding('rows');
			this.aSorter.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(this.aSorter);
		},

		onPersoButtonPressed: function (oEvent) {

			if (!this._oTPC) {

				var DemoPersoService = {

					oData: this.getView().byId("idLocationSourceTable").getColumns(),

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
						var oInitialData = this.getView().byId("idLocationSourceTable").getColumns();

						//set personalization
						this._oBundle = oInitialData;

						//reset personalization, i.e. display table as defined
						//		this._oBundle = null;

						oDeferred.resolve();
						return oDeferred.promise();
					}

				};

				this._oTPC = new TablePersoController({
					table: this.getView().byId("idLocationSourceTable"),
					//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
					// componentName: "com.ey.bamlocsrcattr",
					persoService: DemoPersoService
				});
			}

			this._oTPC.openDialog();

		},

		onDataExport: function () {
			var oTable = this.getView().byId("idLocationSourceTable"),
				columns = [],
				temp = {},
				oSettings_table;

			oTable.getColumns().forEach((oItem, oIndex) => {
				temp = {};
				if(oItem.getVisible()) {
					temp["label"] = oItem.getLabel().getText();
					temp["property"] = oItem.getTemplate().getBindingInfo('text').parts[0].path;
					temp["type"] = "string";
					columns.push(temp);	
				}
			}, this);

			oSettings_table = {
				workbook: {
					columns: columns,
					context: {
						sheetName: "Location Source"
					}
				},
				showProgress: false,
				dataSource: oTable.getModel("locationSourceTable").getData(),
				fileName: "Location Source Attributes.xlsx"
			};
			new Spreadsheet(oSettings_table).build().then(function () {
				sap.m.MessageToast.show("Downloaded successfully");
			});

		},

		onSelectedItems: function (oEvent) {
			this.selectedItems.length = 0; /* Clear all array items*/

			oEvent.getSource().getSelectedIndices().forEach(index => {
				this.selectedItems.push(oEvent.getSource().getContextByIndex(index).getObject());
			}, this);

			var model = new JSONModel(this.selectedItems);
			sap.ui.getCore().setModel(model, "SelectedModel");
		},

		onCreate: function () {
			this.router.navTo("CreateLocation");
		},

		onDisplay: function () {

			if (this.selectedItems.length > 0) {
				var mdl = new JSONModel({
					results: this.selectedItems
				});
				sap.ui.getCore().setModel(mdl, "DisModel");
				this.router.navTo("DisplayLocation");
			} else {
				sap.m.MessageToast.show("Select A Line Item");
			}

		},

		onEdit: function (evt) {
			var aIndices = this.getView().byId("idLocationSourceTable").getSelectedIndices();
			if (aIndices.length === 0) {
				sap.m.MessageToast.show("Please Select a row to Edit Attributes");
			} else {
				this.router.navTo("EditLocationSource");
			}

		},

		onExit: function () {
			if (this._oTPC) {
				this._oTPC.destroy();
				this._oTPC = null;
			}
		}
	});

});