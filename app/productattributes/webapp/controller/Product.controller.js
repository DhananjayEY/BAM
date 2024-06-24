sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/TablePersoController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/m/SearchField",
	"sap/ui/model/type/String",
	"sap/ui/export/Spreadsheet",
	"../helper/controlField",
	"../helper/material"
], function (Controller, JSONModel, TablePersoController, Filter, FilterOperator, MessageBox, SearchField, typeString,
	Spreadsheet, ControlField, MaterialValueHelp) {
	"use strict";
	var that;

	return Controller.extend("com.ey.productattributes.controller.Product", {

		onInit: function () {

			that = this;
			this.getOwnerComponent().setModel(new JSONModel({
				param: ""
			}), "check");
			this.countrySelected = "";
			this.getView().byId("idProductTable").setVisible(false);
			// this.getView().byId("TBar").setVisible(false);

			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._onObjectMatched, this);
			this.selectedItems = [];
		},

		_onObjectMatched: function (oEvent) {
			var check = this.getOwnerComponent().getModel("check").param;
			if (check === "edit/submitted" || check === "create/submitted") {
				this.onSearch(check.split("/")[1]);
				this.getOwnerComponent().getModel("check").param = "edit/didNotSubmit";
			}
		},
		
		clearMasterPlanner: function() {
			this.getView().getModel("filterBar").setProperty("/ZMASTERPLANNER", "");
		},

		onMatnrValueHelpRequested: function () {
			this._oMultiInput = this.getView().byId("idMatnr");
			this.oColModel = new JSONModel(sap.ui.require.toUrl("com/ey/productattributes/model") + "/columnsModel.json");
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "listJSONMatnr");

			var aCols = this.oColModel.getData().cols;
			this._oBasicSearchField = new SearchField({
				showSearchButton: false,
				visible: false
			});
			this._oValueHelpDialog = sap.ui.xmlfragment("com.ey.productattributes.fragment.Product", this);
			this.getView().addDependent(this._oValueHelpDialog);
			this._oValueHelpDialog.setRangeKeyFields([{
				label: "Product ID",
				key: "Matnr",
				type: "string",
				typeInstance: new typeString({}, {
					maxLength: 7
				})
			}]);
			this._oValueHelpDialog.getFilterBar().setBasicSearch(this._oBasicSearchField);
			this._oValueHelpDialog.getTableAsync().then(function (oTable) {
				var oModel = this.getView().getModel("listJSONMatnr");
				oModel.setProperty("/ZBAM_MATERIAL_SEARCHSet", this.matnrList);
				oTable.setModel(oModel);
				oTable.setModel(this.oColModel, "columns");
				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/ZBAM_MATERIAL_SEARCHSet");
				}
				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/ZBAM_MATERIAL_SEARCHSet", function () {
						return new ColumnListItem({
							cells: aCols.map(function (column) {
								return new Label({
									text: "{" + column.template + "}"
								});
							})
						});
					});
				}

				if (this.matnrList) {
					oTable.getModel().setProperty("/ZBAM_MATERIAL_SEARCHSet", this.matnrList);
				}
				this._oValueHelpDialog.update();

			}.bind(this));
			this._oValueHelpDialog.open();
			this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
		},

		onPrdF4Ok: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._oMultiInput.setTokens(aTokens);
			this._oValueHelpDialog.close();
		},

		onPrdF4Cancel: function () {
			this._oValueHelpDialog.close();
		},

		onPrdF4AfterClose: function () {
			// this.ResetMatnrLst();
			this._oValueHelpDialog.destroy();
			this._oValueHelpDialog = undefined;
		},

		onPrdF4FltSrch: function (oEvent) {
			var sSearchQuery = this._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");
			// tokens = sap.ui.getCore().byId("productLevelInput").getTokens();

			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				} else if (oControl.getTokens().length) {
					$.each(oControl.getTokens(), function (i, token) {
						aResult.push(
							new sap.ui.model.Filter({
								path: oControl.getName(),
								operator: sap.ui.model.FilterOperator.EQ,
								value1: token.getProperty("key").trim(),
							}));
					});
				}
				return aResult;
			}, []);

			/*if (tokens) {
				$.each(tokens, function (i, token) {
					if (token.data().row) {
						aFilters.push(
							new sap.ui.model.Filter({
								path: "Prctr",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: token.data().row.Prctr,
							}));
					}
				});
			}*/

			this._filterTable(aFilters);
		},

		_filterTable: function (aFilters) {
			this._oValueHelpDialog.getTable().setBusyIndicatorDelay(0);
			this._oValueHelpDialog.getTable().setBusy(true);

			var sURI = '/sap/opu/odata/sap/ZBAM_SUPP_LOC_SOURCE_SRV/',
				oModelP = new sap.ui.model.json.JSONModel(),
				_dialog = this._oValueHelpDialog;

			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);
			oModelP.read("/ZBAM_MATERIAL_SEARCHSet", {
				filters: aFilters,
				success: function (oData, response) {
					_dialog.getTable().setBusy(false);
					that.setMatnrLst(response, _dialog);
				},
				//response.data.results;
				error: function fnError(e) {
					/*** Nov 20th: Changes by Ruthvik ***/
					that.ResetMatnrLst(_dialog);
					_dialog.getTable().setBusy(false);

					MessageBox.warning(that.handlErrorResponse(e));

					/*** Nov 20th: Changes by Ruthvik ***/
				},
				async: true
			});
		},

		ResetMatnrLst: function (dialog) {
			this.matnrList = "";
			if (this._oValueHelpDialog === undefined) {
				this._oValueHelpDialog = dialog;
			}

			this._oValueHelpDialog.getTableAsync().then(function (oTable) {
				oTable.getModel().setProperty("/ZBAM_MATERIAL_SEARCHSet", this.matnrList);
			}.bind(this));
		},

		setMatnrLst: function (response, dialog) {
			response.data.results.map((item) => {
				if (!item.Matnr.match(/[A-za-z]\w/) && item.Matnr.match(/\w/) !== null) {
					item.Matnr = item.Matnr.match(/[1-9]\d*/g)[0];
				}

				if (!item.Bismt.match(/[A-za-z]\w/) && item.Bismt.match(/\w/) !== null && item.Bismt.match(/[1-9]\d*/) !== null) {
					item.Bismt = item.Bismt.match(/[1-9]\d*/g)[0];
				}
			}, this);

			this.matnrList = response.data.results;

			dialog.getTableAsync().then(function (oTable) {
				oTable.getModel().setProperty("/ZBAM_MATERIAL_SEARCHSet", this.matnrList);
			}.bind(this));
		},

		/* Product Level Value help ends */
		ProductValueHelp: function (oEvent) {
			this.oProductColModel = new JSONModel(sap.ui.require.toUrl("com/ey/productattributes/model") + "/columnsPrdLvl.json");
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "productValueHelpModel");

			var aCols = this.oProductColModel.getData().cols;
			this._oProductBasicSearchField = new SearchField({
				showSearchButton: false,
				visible: false
			});

			this._oProductValueHelpDialog = sap.ui.xmlfragment("com.ey.productattributes.fragment.DialogProductLevel", this);
			this.getView().addDependent(this._oProductValueHelpDialog);

			this._oProductValueHelpDialog.getFilterBar().setBasicSearch(this._oProductBasicSearchField);

			this._oProductValueHelpDialog.getTableAsync().then(function (oTable) {
				var oModel = this.getView().getModel("productValueHelpModel");
				oModel.setProperty("/ProductLevel", "");
				oTable.setModel(oModel);
				oTable.setModel(this.oProductColModel, "columns");

				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/ProductLevel");
				}

				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/ProductLevel", function () {
						return new ColumnListItem({
							cells: aCols.map(function (column) {
								return new Label({
									text: "{" + column.template + "}"
								});
							})
						});
					});
				}

				this._oProductValueHelpDialog.update();
			}.bind(this));

			this._oProductValueHelpDialog.open();
		},

		onPrdLvlF4Ok: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens"),
				// oField = sap.ui.getCore().byId("productLevelInput");
				oField = this._oValueHelpDialog.getFilterBar().getFilterGroupItems()[3].getControl();

			oField.setTokens(aTokens);
			this._oProductValueHelpDialog.close();
		},

		onPrdLvlF4Cancel: function () {
			this._oProductValueHelpDialog.close();
		},

		onPrdLvlF4AfterClose: function () {
			this.onPrdLvlRestList();
			this._oProductValueHelpDialog.destroy();
			this._oProductValueHelpDialog = undefined;
		},

		onPrdLvlF4FltSrch: function (oEvent) {
			if (sap.ui.getCore().byId("idPrdLvl").getSelectedItem().getProperty("text") === "Please Select") {
				sap.m.MessageBox.error("Please select product level");
				return;
			}

			var sSearchQuery = this._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");
			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {

				if (oControl.getName() === 'ProdLvl') {
					if (oControl.getSelectedKey()) {
						aResult.push(new Filter({
							path: oControl.getName(),
							operator: FilterOperator.EQ,
							value1: oControl.getSelectedKey()
						}));
					}
				} else {
					if (oControl.getValue()) {
						aResult.push(new Filter({
							path: oControl.getName(),
							operator: FilterOperator.Contains,
							value1: oControl.getValue()
						}));
					}
				}

				return aResult;
			}, []);

			this._oProductValueHelpDialog.getTable().setBusyIndicatorDelay(0);
			this._oProductValueHelpDialog.getTable().setBusy(true);
			var sURI = '/sap/opu/odata/sap/ZBAM_LOC_PRODUCT_SRV/',
				oModelP = new sap.ui.model.json.JSONModel(),
				_dialog = this._oProductValueHelpDialog;

			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);
			oModelP.read("/ZBAM_PROD_LVL_SEARCHSet", {
				filters: aFilters,
				success: function (oData, response) {

					that.onPrdLvlSetList(response, _dialog);
					_dialog.getTable().setBusy(false);
				},
				error: function fnError(e) {
					that.onPrdLvlRestList(_dialog);
					_dialog.getTable().setBusy(false);

					MessageBox.warning(that.handlErrorResponse(e));
				},
				async: true
			});
		},

		onPrdLvlRestList: function (dialog) {
			this.prdLvlList = "";
			if (this._oProductValueHelpDialog === undefined) {
				this._oProductValueHelpDialog = dialog;
			}

			this._oProductValueHelpDialog.getTableAsync().then(function (oTable) {
				oTable.getModel().setProperty("/ProductLevel", this.prdLvlList);
			}.bind(this));
		},

		onPrdLvlSetList: function (response, dialog) {
			this.prdLvlList = response.data.results;

			dialog.getTableAsync().then(function (oTable) {
				oTable.getModel().setProperty("/ProductLevel", this.prdLvlList);
				dialog.update();
			}.bind(this));
		},
		/* Product Level Value help ends */

		/* User Value help starts*/
		onValueHelpUser: function (oEvent) {
			this.params = {
				"InputId": "",
				"Columns": "/UserModel.json",
				"Fragment": "ValueHelpDialogUser",
				"bindPath": "/ZBAM_SUPPLY_USERID_SEARCHSET",
				"SearchSet": "/ZBAM_SUPPLY_USERID_SEARCHSET",
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
		},

		onFilterSearchUser: function (oEvent) {
			MaterialValueHelp.OnSearch(oEvent, this);
		},
		/* User Value help ends*/

		handlErrorResponse: function (e) {
			var parser = new DOMParser(),
				xmlDoc = parser.parseFromString(e.response.body, "text/xml"),
				errorMessage;

			if (e.response.body.startsWith("<?xml")) {
				if (xmlDoc.querySelector('message') !== undefined || xmlDoc.querySelector('message') !== null) {
					errorMessage = xmlDoc.querySelector('message').firstChild.nodeValue;
				} else {
					errorMessage = xmlDoc.querySelector('h1').firstChild.nodeValue;
				}
			} else {
				errorMessage = e.response.body !== "" ? e.response.body : e.message;
			}

			return errorMessage;
		},

		onSearch: function (check) {
			if (check !== "submitted") {
				that = this;
			}
			/*if (this.getView().byId("idMatnr").getTokens().length === 0) {
				sap.m.MessageBox.warning("Select Atleast One Product");
				return;
			} else {*/

			ControlField.controlFieldInSelection(this);

			var matnr = that.getView().byId("idMatnr").getTokens(),
				ibp = that.getView().byId("idIBPRelevant").getSelectedKey(),
				name = that.getView().byId("idMASTERPLANNER").getValue().split('(')[0].trim().toUpperCase(),
				//maktx = this.getView().byId("idProductDesc").getValue(),
				filters = [];
				
			if(!matnr.length && ibp == '' && !name) {
				MessageBox.warning("Please Select atleast One Filter Criteria");
				return;
			}
			
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();

			$.each(matnr, function (i, token) {
				if (token.data().row) {
					filters.push(
						new sap.ui.model.Filter({
							path: "Prdid",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: token.data().row.Matnr,
						}));
				}
				if (token.data().range) {
					if (token.data().range.exclude === true) {
						filters.push(
							new sap.ui.model.Filter({
								path: "Prdid",
								operator: sap.ui.model.FilterOperator.NE,
								value1: token.data().range.value1,
								value2: token.data().range.value2,
							}));
					} else {
						filters.push(
							new sap.ui.model.Filter({
								path: "Prdid",
								operator: token.data().range.operation,
								value1: token.data().range.value1,
								value2: token.data().range.value2,
							}));
					}
				}
			});

			if(ibp) {
				filters.push(
				new sap.ui.model.Filter({
					path: "Zibpsupplyrelevant",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: ibp,
				}));	
			}
			
			if(name) {
				filters.push(
				new sap.ui.model.Filter({
					path: "Zmasterplanner",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: name,
				}));
			}
			

			/*if (maktx) {
				filters.push(
					new sap.ui.model.Filter({
						path: "Maktx",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: maktx,
					}));
			}*/

			var sURI = "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/";
			var oModelP = new sap.ui.model.json.JSONModel();
			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);

			oModelP.read("/zbam_product_attributesSet", {
				filters: filters,
				success: function (oData, response) {
					that._oDataResponse(oData.results);

					var oModel = that.getView().getModel("productTable");
					var filterData = that.createFacetFilter(oData.results);
					oModel.setProperty('/filters', filterData, null, true);
					that.handleFacetFilterReset(null, "productFilter");

					that.getView().byId("idProductTable").setVisible(true);

					oBusy.close();
				},
				error: function fnError(e) {
					//MessageBox.warning(e.message);
					/*** Nov 20th: Changes by Ruthvik ***/
					oBusy.close();
					MessageBox.warning(that.handlErrorResponse(e));

					/*** Nov 20th: Changes by Ruthvik ***/

					var f = that.getView().getModel("productTable");
					if (f !== undefined) {
						f.setData();
						f.updateBindings();
					}
				},
				async: true
			});

			// }
		},

		_oDataResponse: function (data) {
			var oModel = new sap.ui.model.json.JSONModel(),
				j = 0,
				i,
				datarow = [],
				P = {};

			data.map(item => {
				//item.Maktx = item.Maktx;
				//item.PackagetypeT = item.PackagetypeT;

				item.Prdid = !item.Prdid.match(/[A-za-z]\w/) && item.Prdid.match(/\w/) !== null ?
					item.Prdid.match(/[1-9]\d*/)[0] : item.Prdid;
				item.Prdid = item.Maktx !== "" ? item.Prdid + " - " + item.Maktx : item.Prdid;

				//item.PackagesizeT = item.PackagesizeT;
				item.Packagetype = item.Packagetype !== "" ? item.PackagetypeT + " - " + item.Packagetype : item.PackagetypeT;
				//item.ZdsiT = item.ZdsiT;
				item.Packagesize = item.Packagesize;
				item.Zdsi = item.ZdsiT !== "" ? item.ZdsiT + " - " + item.Zdsi : item.ZdsiT;
				//item.ZmasterplannedindicatorT = item.ZmasterplannedindicatorT;
				item.Zmasterplannedindicator = item.Zmasterplannedindicator !== "" ? item.ZmasterplannedindicatorT + " - " + item.Zmasterplannedindicator :
					item.ZmasterplannedindicatorT;
				//item.ZsellingcountryT = item.ZsellingcountryT;
				item.Zsellingcountry = item.Zsellingcountry;
				//item.ZpackregionalT = item.ZpackregionalT;
				item.Zpackregional = item.Zpackregional;
				//item.ZformulationregionalT = item.ZformulationregionalT;
				item.Zformulationregional = item.Zformulationregional;
				//item.FormulatonidT = item.FormulatonidT;
				item.Formulatonid = item.Formulatonid;
				//item.FormulationdescT = item.FormulationdescT;
				item.Formulationdesc = item.Formulationdesc;
				//item.ZsupplyportfolioidT = item.ZsupplyportfolioidT;
				item.Zsupplyportfolioid = item.Zsupplyportfolioid;
				//item.ZsupplyportfoliodescT = item.ZsupplyportfoliodescT;
				item.Zsupplyportfoliodesc = item.Zsupplyportfoliodesc;
				//item.ZsupplyproductcenteridT = item.ZsupplyproductcenteridT;
				//item.ZsupplyproductcenterdescT = item.ZsupplyproductcenterdescT;
				item.Zsupplyproductcenterid = item.Zsupplyproductcenterid;
				//item.FormgroupT = item.FormgroupT;
				item.Zsupplyproductcenterdesc = item.Zsupplyproductcenterdesc;
				item.Formgroup = item.Formgroup !== "" ? item.FormgroupT + " - " + item.Formgroup : item.FormgroupT;
				//item.ZaggproductT = item.ZaggproductT;
				//item.ZaggproddescT = item.ZaggproddescT;
				item.Zaggproduct = item.Zaggproduct;
				//item.ZibpsupplyrelevantT = item.ZibpsupplyrelevantT;
				item.Zaggproddesc = item.Zaggproddesc;
				item.Zibpsupplyrelevant = item.Zibpsupplyrelevant !== "" ? item.ZibpsupplyrelevantT + " - " + item.Zibpsupplyrelevant :
					item.ZibpsupplyrelevantT;
				item.Zplanningstrategy = item.ZplanningstrategyT !== "" ? item.ZplanningstrategyT + " - " + item.Zplanningstrategy : 
					item.Zplanningstrategy;
				item.Fcstconsmode = item.FcstconsmodeT !== "" ? item.FcstconsmodeT + " - " + item.Fcstconsmode : item.Fcstconsmode;
				/*item.Zportfoliosupmanager = item.ZportfoliosupmanagerT !== "" ? item.ZportfoliosupmanagerT + " - " + item.Zportfoliosupmanager :
					item.Zportfoliosupmanager;
				item.Zmasterplanner = item.Zmasterplanner !== "" ? item.ZmasterplannerT + " - " + item.Zmasterplanner : item.Zmasterplanner;*/
			}, this);

			oModel.setSizeLimit(data.length);
			oModel.setData(data);
			this.getView().setModel(oModel, "productTable");
			oModel.updateBindings();
		},

		handleSearch: function (oEvent) {
			var oQuery = oEvent.getParameter("query");
			var filter = new Array();

			var oFilter = [
				new sap.ui.model.Filter("Prdid", sap.ui.model.FilterOperator.Contains, oQuery),
				/*new sap.ui.model.Filter("Packagetype", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Packagesize", sap.ui.model.FilterOperator.Contains, oQuery),*/
				new sap.ui.model.Filter("Zdsi", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zmasterplannedindicator", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zsellingcountry", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zsupplyproductcenterdesc", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zsupplyportfoliodesc", sap.ui.model.FilterOperator.Contains, oQuery),
				/*	new sap.ui.model.Filter("Zpackregional", sap.ui.model.FilterOperator.Contains, oQuery),
					new sap.ui.model.Filter("Formulatonid", sap.ui.model.FilterOperator.Contains, oQuery),
					new sap.ui.model.Filter("Zformulationregional", sap.ui.model.FilterOperator.Contains, oQuery),
					new sap.ui.model.Filter("Zsupplyportfolioid", sap.ui.model.FilterOperator.Contains, oQuery),
					new sap.ui.model.Filter("Zsupplyproductcenterid", sap.ui.model.FilterOperator.Contains, oQuery),
				
				/*new sap.ui.model.Filter("Zaggproduct", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zaggproddesc", sap.ui.model.FilterOperator.Contains, oQuery),*/
				new sap.ui.model.Filter("Formgroup", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zibpsupplyrelevant", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zportfoliosupmanager", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zmasterplanner", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Fcstconsmode", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zplanningstrategy", sap.ui.model.FilterOperator.Contains, oQuery)
			];

			oFilter = new sap.ui.model.Filter(oFilter, false);
			filter.push(oFilter);
			this.oList = this.getView().byId("idProductTable");
			this.oList.getBinding("rows").filter(filter);
		},

		handleViewSettingsDialogButtonPressed: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.ey.productattributes.fragment.ViewSettingsDialog", this);
				this.getView().addDependent(this._oDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},

		handleConfirm: function (oEvent) {
			var mParams = oEvent.getParameters();
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			this.aSorter = [];
			var oTable = this.getView().byId("idProductTable");
			var oBinding = oTable.getBinding('items');
			this.aSorter.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(this.aSorter);
		},

		onPersoButtonPressed: function (oEvent) {

			if (!this._oTPC) {

				var DemoPersoService = {

					oData: this.getView().byId("idProductTable").getColumns(),

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
						var oInitialData = this.getView().byId("idProductTable").getColumns();

						//set personalization
						this._oBundle = oInitialData;

						//reset personalization, i.e. display table as defined
						//		this._oBundle = null;

						oDeferred.resolve();
						return oDeferred.promise();
					}
				};

				this._oTPC = new TablePersoController({
					table: this.getView().byId("idProductTable"),
					//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
					//componentName: "com.ey.productattributes",
					persoService: DemoPersoService

				});
			}

			this._oTPC.openDialog();

		},

		onDataExport: function () {
			var oTable = this.getView().byId("idProductTable"),
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
						sheetName: "Product"
					}
				},
				dataSource: oTable.getModel("productTable").getData(),
				showProgress: false,
				fileName: "Product Attributes.xlsx"
			};
			new Spreadsheet(oSettings_table).build().then(function () {
				sap.m.MessageToast.show("Downloaded successfully");
			});
		},

		onSelectedItems: function (oEvent) {

			//var selectedObject;
			//data = oEvent.getSource().getModel().getData().root;
			this.selectedItems.length = 0; /* Clear all array items*/

			oEvent.getSource().getSelectedIndices().forEach(index => {
				this.selectedItems.push(oEvent.getSource().getContextByIndex(index).getObject());
			}, this);

			/*oEvent.getParameter("rowContext").getModel().getData().forEach((oItem) => {
				selectedObject = oItem;
				
				this.selectedItems.push( selectedObject );
			}, this);*/

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
				this.router.navTo("DisplayProduct");
			} else {
				sap.m.MessageToast.show("Select A Line Item");
			}

		},

		onEdit: function (evt) {
			//var aContexts = this.getView().byId("idLocationSourceTable").getSelectedContexts();
			var aIndices = this.getView().byId("idProductTable").getSelectedIndices();
			// if (aIndices[0]) {
			if (aIndices.length === 0) {
				sap.m.MessageToast.show("Please Select a row to Edit Attributes");
			} else {
				this.router.navTo("EditProduct");
			}

		},

		createFacetFilter: function (data) {
			var filter = {},
				temp = {},
				entries = [];

			var Prdid = data.reduce((acc, o) => (acc[o.Prdid] = (acc[o.Prdid] || 0) + 1, acc), {}),
				/*Packagetype = data.reduce((acc, o) => (acc[o.Packagetype] = (acc[o.Packagetype] || 0) + 1, acc), {}),
				Packagesize = data.reduce((acc, o) => (acc[o.Packagesize] = (acc[o.Packagesize] || 0) + 1, acc), {}),*/
				Zdsi = data.reduce((acc, o) => (acc[o.Zdsi] = (acc[o.Zdsi] || 0) + 1, acc), {}),
				Zmasterplannedindicator = data.reduce((acc, o) => (acc[o.Zmasterplannedindicator] = (acc[o.Zmasterplannedindicator] || 0) + 1, acc), {}),
				Zsellingcountry = data.reduce((acc, o) => (acc[o.Zsellingcountry] = (acc[o.Zsellingcountry] || 0) + 1, acc), {}),
				Formulationdesc = data.reduce((acc, o) => (acc[o.Formulationdesc] = (acc[o.Formulationdesc] || 0) + 1, acc), {}),
				Zsupplyportfoliodesc = data.reduce((acc, o) => (acc[o.Zsupplyportfoliodesc] = (acc[o.Zsupplyportfoliodesc] || 0) + 1, acc), {}),
				Zsupplyproductcenterdesc = data.reduce((acc, o) => (acc[o.Zsupplyproductcenterdesc] = (acc[o.Zsupplyproductcenterdesc] || 0) + 1,
					acc), {}),
				
				/*Zpackregional = data.reduce((acc, o) => (acc[o.Zpackregional] = (acc[o.Zpackregional] || 0) + 1, acc), {}),
				Zformulationregional = data.reduce((acc, o) => (acc[o.Zformulationregional] = (acc[o.Zformulationregional] || 0) + 1, acc), {}),
				Formulatonid = data.reduce((acc, o) => (acc[o.Formulatonid] = (acc[o.Formulatonid] || 0) + 1, acc), {}),
				Zsupplyportfolioid = data.reduce((acc, o) => (acc[o.Zsupplyportfolioid] = (acc[o.Zsupplyportfolioid] || 0) + 1, acc), {}),
				Zsupplyproductcenterid = data.reduce((acc, o) => (acc[o.Zsupplyproductcenterid] = (acc[o.Zsupplyproductcenterid] || 0) + 1, acc), {}),
				*/
				Formgroup = data.reduce((acc, o) => (acc[o.Formgroup] = (acc[o.Formgroup] || 0) + 1, acc), {}),
				/*Zaggproduct = data.reduce((acc, o) => (acc[o.Zaggproduct] = (acc[o.Zaggproduct] || 0) + 1, acc), {}),
				Zaggproddesc = data.reduce((acc, o) => (acc[o.Zaggproddesc] = (acc[o.Zaggproddesc] || 0) + 1, acc), {}),*/
				Zibpsupplyrelevant = data.reduce((acc, o) => (acc[o.Zibpsupplyrelevant] = (acc[o.Zibpsupplyrelevant] || 0) + 1, acc), {}),
				Zportfoliosupmanager = data.reduce((acc, o) => (acc[o.Zportfoliosupmanager] = (acc[o.Zportfoliosupmanager] || 0) + 1, acc), {}),
				Zmasterplanner = data.reduce((acc, o) => (acc[o.Zmasterplanner] = (acc[o.Zmasterplanner] || 0) + 1, acc), {}),
				Fcstconsmode = data.reduce((acc, o) => (acc[o.Fcstconsmode] = (acc[o.Fcstconsmode] || 0) + 1, acc), {}),
				Zplanningstrategy = data.reduce((acc, o) => (acc[o.Zplanningstrategy] = (acc[o.Zplanningstrategy] || 0) + 1, acc), {});

			filter["Prdid"] = {
				"type": "Product ID",
				"key": "Prdid",
				"values": this.createFilterData(Prdid)
			};
			/*filter["Packagetype"] = {
				"type": "Package Type",
				"key": "Packagetype",
				"values": this.createFilterData(Packagetype)
			};
			filter["Packagesize"] = {
				"type": "Package Size",
				"key": "Packagesize",
				"values": this.createFilterData(Packagesize)
			};*/
			filter["Zdsi"] = {
				"type": "DSI indicator",
				"key": "Zdsi",
				"values": this.createFilterData(Zdsi)
			};
			filter["Zmasterplannedindicator"] = {
				"type": "Master Planned Indicator",
				"key": "Zmasterplannedindicator",
				"values": this.createFilterData(Zmasterplannedindicator)
			};
			filter["Zsellingcountry"] = {
				"type": "Selling country",
				"key": "Zsellingcountry",
				"values": this.createFilterData(Zsellingcountry)
			};
			filter["Formulationdesc"] = {
				"type": "Supply Formulation Description",
				"key": "Formulationdesc",
				"values": this.createFilterData(Formulationdesc)
			};
			filter["Zsupplyportfoliodesc"] = {
				"type": "Supply Portfolio Description",
				"key": "Zsupplyportfoliodesc",
				"values": this.createFilterData(Zsupplyportfoliodesc)
			};
			filter["Zsupplyproductcenterdesc"] = {
				"type": "Supply Product Center Description",
				"key": "Zsupplyproductcenterdesc",
				"values": this.createFilterData(Zsupplyproductcenterdesc)
			};
			
			/*filter["Zpackregional"] = {
				"type": "Packaging Supply Region",
				"key": "Zpackregional",
				"values": this.createFilterData(Zpackregional)
			};
			filter["Zformulationregional"] = {
				"type": "Formulation Supply Region",
				"key": "Zformulationregional",
				"values": this.createFilterData(Zformulationregional)
			};
			filter["Formulatonid"] = {
				"type": "Supply Formulaton ID",
				"key": "Formulatonid",
				"values": this.createFilterData(Formulatonid)
			};
			
			filter["Zsupplyportfolioid"] = {
				"type": "Supply Portfolio ID",
				"key": "Zsupplyportfolioid",
				"values": this.createFilterData(Zsupplyportfolioid)
			};
			
			filter["Zsupplyproductcenterid"] = {
				"type": "Supply Product Center ID",
				"key": "Zsupplyproductcenterid",
				"values": this.createFilterData(Zsupplyproductcenterid)
			};
			*/
			filter["Formgroup"] = {
				"type": "Supply Chain Group",
				"key": "Formgroup",
				"values": this.createFilterData(Formgroup)
			};
			/*filter["Zaggproduct"] = {
				"type": "Aggregate Product ID",
				"key": "Zaggproduct",
				"values": this.createFilterData(Zaggproduct)
			};
			filter["Zaggproddesc"] = {
				"type": "Aggregate Product Description",
				"key": "Zaggproddesc",
				"values": this.createFilterData(Zaggproddesc)
			};*/
			filter["Zibpsupplyrelevant"] = {
				"type": "IBP Supply Product Relevancy",
				"key": "Zibpsupplyrelevant",
				"values": this.createFilterData(Zibpsupplyrelevant)
			};
			filter["Zportfoliosupmanager"] = {
				"type": "Portfolio Supply Chain Manager",
				"key": "Zportfoliosupmanager",
				"values": this.createFilterData(Zportfoliosupmanager)
			};
			filter["Zmasterplanner"] = {
				"type": "Master Planner",
				"key": "Zmasterplanner",
				"values": this.createFilterData(Zmasterplanner)
			};
			filter["Fcstconsmode"] = {
				"type": "Forecast Consumption Mode",
				"key": "Fcstconsmode",
				"values": this.createFilterData(Fcstconsmode)
			};
			filter["Zplanningstrategy"] = {
				"type": "Planning Strategy",
				"key": "Zplanningstrategy",
				"values": this.createFilterData(Zplanningstrategy)
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
			this.byId("idProductTable").getBinding("rows").filter(oFilter);
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

		onExit: function () {
			if (this._oTPC) {
				this._oTPC.destroy();
				this._oTPC = null;
			}
		}

	});

});