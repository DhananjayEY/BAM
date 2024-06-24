sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/type/String",
	"sap/m/SearchField",
	"sap/ui/table/TablePersoController",
	"sap/ui/export/Spreadsheet",
	"./Variant",
	"../helper/controlField"
], function (Controller, JSONModel, MessageBox, Filter, FilterOperator, typeString, SearchField, TablePersoController, Spreadsheet, 
	Variant, ControlField) {
	"use strict";
	var that;
	jQuery.sap.require("sap.ui.core.routing.Router");
	return Controller.extend("com.ey.bamlocattr.controller.Mainlocation", {
		onInit: function () {
			that = this;
			this.getOwnerComponent().setModel(new JSONModel({
				param: ""
			}), "check");

			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.getView().byId("LocalTable").setVisible(false);
			//this.getView().byId("TBar").setVisible(false);
			this.selectedItems = [];
			this.LocationLvl();
			this.oldLocation();

			this.router.attachRoutePatternMatched(this._onObjectMatched, this);
			
			Variant.onInitFilterVarient(this);
		},

		_onObjectMatched: function (oEvent) {
			var check = this.getOwnerComponent().getModel("check").param;
			if (check === "edit/submitted" || check === "create/submitted") {
				this.onSearch(check.split("/")[1]);
				this.getOwnerComponent().getModel("check").param = "edit/didNotSubmit";
			}
		},
		
		onSaveVariTab: function(oEvent) {
			Variant.onSaveVariTab(oEvent, this);
		},
		
		onSelVariTab: function(oEvent) {
			Variant.onSelVariTab(oEvent, this);
		},
		
		onManageVariTab: function(oEvent) {
			Variant.onManageVariTab(oEvent, this);
		},
		
		onSaveVariFT: function(oEvent) {
			Variant.onSaveVariFT(oEvent, this);
		},
		
		onSelVariFT: function(oEvent) {
			Variant.onSelVariFT(oEvent, this);
		},
		
		onManageVariFT: function(oEvent) {
			Variant.onManageVariFT(oEvent, this);
		},

		onPersoButtonPressed: function (oEvent) {

			if (!this._oTPC) {

				var DemoPersoService = {

					oData: this.getView().byId("LocalTable").getColumns(),

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
						var oInitialData = this.getView().byId("LocalTable").getColumns();

						//set personalization
						this._oBundle = oInitialData;

						//reset personalization, i.e. display table as defined
						//		this._oBundle = null;

						oDeferred.resolve();
						return oDeferred.promise();
					}

				};

				this._oTPC = new TablePersoController({
					table: this.getView().byId("LocalTable"),
					//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
					// componentName: "com.ey.bamlocattr",
					persoService: DemoPersoService
				});
			}

			this._oTPC.openDialog();

		},

		LocationLvl: function () {

			this._locationLvl = this.getView().byId("locationLvl");
			this.oColLocLvl = new JSONModel(sap.ui.require.toUrl("com/ey/bamlocattr/controller") + "/columnsLocModel.json");
			var jsonModelLocLvl = {
				LocID: null,
				Name1: null

			};
			var oModel = new sap.ui.model.json.JSONModel(jsonModelLocLvl);

			this.getView().setModel(oModel, "listJSONLocLvl");
		},

		LocationValueHelp: function () {
			var aColsLocLvl = this.oColLocLvl.getData().cols;
			this._oBasicSrcLocLvl = new SearchField({
				showSearchButton: false,
				visible: false
			});

			if (!this.Location) {
				this.Location = sap.ui.xmlfragment("com.ey.bamlocattr.fragment.Location", this);

				this.getView().addDependent(this.Location);
				this.Location.setRangeKeyFields([{
					label: "Location ID",
					key: "LocID",
					type: "string",
					typeInstance: new typeString({}, {
						maxLength: 7
					})
				}]);
				this.Location.getFilterBar().setBasicSearch(this._oBasicSrcLocLvl);

				this.Location.getTableAsync().then(function (oTable) {
					var oModel = this.getView().getModel("listJSONLocLvl");
					oModel.setProperty("/ZBAM_LOCID_SEARCHSET ", this.LocLvlList);
					oTable.setModel(oModel);
					oTable.setModel(this.oColLocLvl, "columns");
					if (oTable.bindRows) {
						oTable.bindAggregation("rows", "/ZBAM_LOCID_SEARCHSET");
					}
					if (oTable.bindItems) {
						oTable.bindAggregation("items", "/ZBAM_LOCID_SEARCHSET", function () {
							return new ColumnListItem({
								cells: aColsLocLvl.map(function (column) {
									return new Label({
										text: "{" + column.template + "}"
									});
								})
							});
						});
					}
					
					if(!this._locationLvl.getTokens().length) { 
						this.aggLocType = ""; 
						this.LocLvlList = ""; 
					}
					oTable.getModel().setProperty("/ZBAM_LOCID_SEARCHSET", this.LocLvlList);
					if(this.aggLocType) this.Location.getFilterBar().getFilterGroupItems()[2].getControl().setSelectedKey(this.aggLocType);
					this.Location.update();
					
				}.bind(this));

				if (!this._locationLvl) this._locationLvl = sap.ui.getCore().byId("locationLvl");
				this.Location.setTokens(this._locationLvl.getTokens());
			}
			
			this.Location.open();
			// this.ResetPrdLst();
		},
		
		onAggTypeSelection: function(oEvent) {
			this.aggLocType = oEvent.getParameter('selectedItem').getKey();
		},

		onLocaF4FltSrch: function (oEvent) {
			//ZBAM_LOCID_SEARCHset

			var sSearchQuery = this._oBasicSrcLocLvl.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");
			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {

				if (oControl.getName() === 'ZAGLOCTYPE') {
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
							operator: FilterOperator.EQ,
							value1: oControl.getValue().trim()
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
				}

				return aResult;
			}, []);

			/*this._filterPrdLvlTable(new Filter({
				filters: aFilters,
				and: true
			}));*/

			this._filterPrdLvlTable(aFilters);

		},

		_filterPrdLvlTable: function (oFilter) {

			this.Location.getTable().setBusyIndicatorDelay(0);
			this.Location.getTable().setBusy(true);
			var _Productlevel = this.Location;

			var sURI = '/sap/opu/odata/sap/ZBAM_SUPP_LOCATION_SRV/';
			var oModelP = new sap.ui.model.json.JSONModel();
			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);
			var that = this;
			oModelP.read("/ZBAM_LOCID_SEARCHset", {
				// filters: filters,
				filters: oFilter,
				success: function (oData, response) {

					that.setPrdLvlLst(response, that);
					var oJSONModel = new sap.ui.model.json.JSONModel();
					oJSONModel.setData(oData);
					sap.ui.getCore().setModel(oJSONModel);
					that.Location.getTable().setBusy(false);
				},
				error: function fnError(e) {

					MessageBox.warning(that.handleErrorResponse(e));
					that.Location.getTable().setBusy(false);
					// t.ResetPrdLvlLst();
				},
				async: true
			});
		},

		setPrdLvlLst: function (r, that) {
			that.LocLvlList = r.data.results;
			var _Productlevel = that.Location;
			that.Location.getTableAsync().then(function (oTable) {
				var oModel = that.getView().getModel("listJSONLocLvl");
				oModel.setProperty("/ZBAM_LOCID_SEARCHSET", that.LocLvlList);
				oTable.setModel(oModel);
				oTable.setModel(that.oColLocLvl, "columns");
				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/ZBAM_LOCID_SEARCHSET");
				}

				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/ZBAM_LOCID_SEARCHSET", function () {
						return new ColumnListItem({
							cells: aColsLocLvl.map(function (column) {
								return new Label({
									text: "{" + column.template + "}"
								});
							})
						});
					});
				}
				//that.Productlevel.update();
				that.Location.update();
			}.bind(that));

			_Productlevel.getTableAsync().then(function (oTable) {
				_Productlevel.update();
			});

		},

		onPrdLvlF4Ok: function (oEvent) {
			if (!this._locationLvl) {
				this._locationLvl = sap.ui.getCore().byId("name1ID");
			}
			var aTokens = oEvent.getParameter("tokens");
			this._locationLvl.setTokens(aTokens);
			//this.ResetPrdLst();
			this.Location.close();
		},

		ResetPrdLst: function (r) {
			this.PrdLvlList = "";
			this.Location.getTableAsync().then(function (oTable) {
				var oModel = this.getView().getModel("listJSONLocLvl");
				var aColsPrdLvl = this.oColLocLvl.getData().cols;
				oModel.setProperty("/ZBAM_LOCID_SEARCHSET", this.PrdLvlList);
				oTable.setModel(oModel);
				oTable.setModel(this.oColLocLvl, "columns");
				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/ZBAM_LOCID_SEARCHSET");
				}
				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/ZBAM_LOCID_SEARCHSET", function () {
						return new ColumnListItem({
							cells: aColsPrdLvl.map(function (column) {
								return new Label({
									text: "{" + column.template + "}"
								});
							})
						});
					});
				}
				this.Location.update();
			}.bind(this));

		},

		oldLocation: function () {

			this._oldLocationLvl = this.getView().byId("oldLocationLvl");
			this.oColOldLocLvl = new JSONModel(sap.ui.require.toUrl("com/ey/bamlocattr/controller") + "/ColumnsOldLocModel.json");
			var jsonModelLocLvl = {
				LocID: null,
				Name1: null

			};
			var oModel = new sap.ui.model.json.JSONModel(jsonModelLocLvl);

			this.getView().setModel(oModel, "listJSONOldLocLvl");
		},

		oldLocationValueHelp: function () {
			var aColsOldLoc = this.oColOldLocLvl.getData().cols;
			this._oBasicSrcOldLocLvl = new SearchField({
				showSearchButton: false,
				visible: false
			});

			if (!this.OldLocation) {
				this.OldLocation = sap.ui.xmlfragment("com.ey.bamlocattr.fragment.OldLocation", this);

				this.getView().addDependent(this.OldLocation);
				this.OldLocation.setRangeKeyFields([{
					label: "Old Location ID",
					key: "Locno",
					type: "string",
					typeInstance: new typeString({}, {
						maxLength: 7
					})
				}]);
				this.OldLocation.getFilterBar().setBasicSearch(this._oBasicSrcOldLocLvl);

				this.OldLocation.getTableAsync().then(function (oTable) {
					var oModel = this.getView().getModel("listJSONOldLocLvl");
					oModel.setProperty("/ZBAM_LOCID_SEARCHSET ", this.OldLocList);
					oTable.setModel(oModel);
					oTable.setModel(this.oColOldLocLvl, "columns");
					if (oTable.bindRows) {
						oTable.bindAggregation("rows", "/ZBAM_LOCID_SEARCHSET");
					}
					if (oTable.bindItems) {
						oTable.bindAggregation("items", "/ZBAM_LOCID_SEARCHSET", function () {
							return new ColumnListItem({
								cells: aColsOldLoc.map(function (column) {
									return new Label({
										text: "{" + column.template + "}"
									});
								})
							});
						});
					}
					
					if(!this._oldLocationLvl.getTokens().length) this.OldLocList = "";
					oTable.getModel().setProperty("/ZBAM_LOCID_SEARCHSET", this.OldLocList);
					this.OldLocation.update();
					
				}.bind(this));
				
				if (!this._oldLocationLvl) this._oldLocationLvl = sap.ui.getCore().byId("oldLocationLvl");
				this.OldLocation.setTokens(this._oldLocationLvl.getTokens());
			}
			this.OldLocation.open();
		},
		
		onOldLocF4Cancel: function (oEvent) {
			this.OldLocation.close();
		},
		
		onOldLocF4AfterClose: function (oEvent) {
			// this.ResetOldLocLst();
			this.OldLocation.destroy();
			this.OldLocation = undefined;
		},

		onOldLocaF4FltSrch: function (oEvent) {
			//ZBAM_LOCID_SEARCHset

			var sSearchQuery = this._oBasicSrcOldLocLvl.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");
			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {

				if (oControl.getValue()) {
					var oControlName = oControl.getName(),
						oControlValue = oControl.getValue().trim();
						
					aResult.push(new Filter({
						path: oControlName,
						operator: FilterOperator.EQ,
						value1: oControlName !== "Locno" ?  oControlValue :
								(oControlValue.length === 1 || oControlValue.length === 2) ? "*" + oControlValue + "*" : 
								// oControlValue.length === 2 ? "*" + oControlValue + "*" : 
								oControlValue.length === 3 ? oControlValue + "*" : oControlValue
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

			this._filterOldLocTable(aFilters);

		},

		_filterOldLocTable: function (oFilter) {

			this.OldLocation.getTable().setBusyIndicatorDelay(0);
			this.OldLocation.getTable().setBusy(true);

			var sURI = '/sap/opu/odata/sap/ZBAM_SUPP_LOCATION_SRV/';
			var oModelP = new sap.ui.model.json.JSONModel();
			var that = this;
			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);
			oModelP.read("/ZBAM_LOCATION_SEARCHSet", {
				filters: oFilter,
				success: function (oData, response) {
					that.setOldLocLst(response, that);
					var oJSONModel = new sap.ui.model.json.JSONModel();
					oJSONModel.setData(oData);
					sap.ui.getCore().setModel(oJSONModel);
					that.OldLocation.getTable().setBusy(false);
				},
				error: function fnError(e) {

					MessageBox.warning(that.handleErrorResponse(e));
					that.OldLocation.getTable().setBusy(false);
					// t.ResetPrdLvlLst();
				},
				async: true
			});
		},

		setOldLocLst: function (r, that) {
			that.OldLocList = r.data.results;
			var _OldLocation = that.OldLocation;
			that.OldLocation.getTableAsync().then(function (oTable) {
				var oModel = that.getView().getModel("listJSONOldLocLvl");
				oModel.setProperty("/ZBAM_LOCATION_SEARCHSet", that.OldLocList);
				oTable.setModel(oModel);
				oTable.setModel(that.oColOldLocLvl, "columns");
				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/ZBAM_LOCATION_SEARCHSet");
				}

				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/ZBAM_LOCATION_SEARCHSet", function () {
						return new ColumnListItem({
							cells: aColsLocLvl.map(function (column) {
								return new Label({
									text: "{" + column.template + "}"
								});
							})
						});
					});
				}
				//that.Productlevel.update();
				that.OldLocation.update();
			}.bind(that));

			_OldLocation.getTableAsync().then(function (oTable) {
				/*if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}

				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}*/

				_OldLocation.update();
			});

		},
		
		onOldLocF4Ok: function (oEvent) {
			if (!this._oldLocation) {
				this._oldLocation = this.getView().byId("oldLocationLvl");
			}
			var aTokens = oEvent.getParameter("tokens");
			this._oldLocation.setTokens(aTokens);
			//this.ResetPrdLst();
			this.OldLocation.close();
		},
		
		ResetOldLocLst: function (r) {
			this.OldLocList = "";
			this.OldLocation.getTableAsync().then(function (oTable) {
				var oModel = this.getView().getModel("listJSONLocLvl");
				var aColsPrdLvl = this.oColLocLvl.getData().cols;
				oModel.setProperty("/ZBAM_LOCATION_SEARCHSet", this.OldLocList);
				oTable.setModel(oModel);
				oTable.setModel(this.oColLocLvl, "columns");
				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/ZBAM_LOCATION_SEARCHSet");
				}
				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/ZBAM_LOCATION_SEARCHSet", function () {
						return new ColumnListItem({
							cells: aColsPrdLvl.map(function (column) {
								return new Label({
									text: "{" + column.template + "}"
								});
							})
						});
					});
				}
				//this.OldLocation.update();
			}.bind(this));

		},

		onSearch: function (check) {
			if (check !== "submitted") {
				that = this;
			}
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			
			ControlField.controlFieldInSelection(this);

			var filters = [];
			var sFilter;
			var OData;
			var locTokens = that.getView().byId("locationLvl").getTokens(),
				oldLocTokens = that.getView().byId("oldLocationLvl").getTokens(),
				ibpRelevant = that.getView().byId("idIBPRelevant").getSelectedKey();
				
			$.each(locTokens, function (i, token) {
				if (token.data().row) {
					filters.push(
						new sap.ui.model.Filter({
							path: "Locno",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: token.data().row.LocID,
						}));
				}
				if (token.data().range) {
					if (token.data().range.exclude === true) {
						filters.push(
							new sap.ui.model.Filter({
								path: "Locno",
								operator: sap.ui.model.FilterOperator.NE,
								value1: token.data().range.value1,
								value2: token.data().range.value2,
							}));
					} else {
						filters.push(
							new sap.ui.model.Filter({
								path: "Locno",
								operator: token.data().range.operation,
								value1: token.data().range.value1,
								value2: token.data().range.value2,
							}));
					}
				}
			});

			$.each(oldLocTokens, function (i, token) {
				if (token.data().row) {
					filters.push(
						new sap.ui.model.Filter({
							path: "Sort1",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: token.data().row.Locno,
						}));
				}
				if (token.data().range) {
					if (token.data().range.exclude === true) {
						filters.push(
							new sap.ui.model.Filter({
								path: "Sort1",
								operator: sap.ui.model.FilterOperator.NE,
								value1: token.data().range.value1,
								value2: token.data().range.value2,
							}));
					} else {
						filters.push(
							new sap.ui.model.Filter({
								path: "Sort1",
								operator: token.data().range.operation,
								value1: token.data().range.value1,
								value2: token.data().range.value2,
							}));
					}
				}
			});
			
			if(ibpRelevant) {
				filters.push(
					new sap.ui.model.Filter({
						path: "Zsupplylocplatform",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: ibpRelevant,
					}));
			}
			
			var self = this;
			var sURI = '/sap/opu/odata/sap/ZBAM_SUPP_LOCATION_SRV/';
			var oModelP = new sap.ui.model.json.JSONModel();
			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);

			oModelP.read("/ZBAM_SUPP_LOCATIONSet", {
				filters: filters,
				success: function (oData, response) {
					self._fltoDataResponce(oData.results);

					var oModel = self.getView().getModel("Locationmod");
					var filterData = self.createFacetFilter(oData.results);
					oModel.setProperty('/filters', filterData, null, true);
					self.handleFacetFilterReset(null, "locationFilter");

					oBusy.close();

				},
				error: function fnError(e) { /*** Nov 20th: Changes by Ruthvik ***/

					oBusy.close();

					MessageBox.warning(self.handleErrorResponse(e));
				},
				async: true
			});
			this.getView().byId("LocalTable").setVisible(true);
		},

		_fltoDataResponce: function (data) {
			var oModel2 = new sap.ui.model.json.JSONModel();
			var j = 0;
			var i;
			var datarow = [];

			data.map(item => {
				item.Name = item.Sort1 !== "" ? item.Sort1 + " - " + item.Name : item.Name;

				item.Zagloctype = item.ZagloctypeT !== "" ? item.Zagloctype + " - " + item.ZagloctypeT : item.Zagloctype;
				item.Zsupplylocplatform = item.ZsupplylocplatformT !== "" ? item.Zsupplylocplatform + " - " + item.ZsupplylocplatformT : item.Zsupplylocplatform;
				item.Zsupplyactivity = item.ZsupplyactivityT !== "" ? item.Zsupplyactivity + " - " + item.ZsupplyactivityT : item.Zsupplyactivity;
			}, this);

			oModel2.setSizeLimit(data.length);
			oModel2.setData(data);
			this.getView().setModel(oModel2, "Locationmod");
			oModel2.updateBindings();

		},

		createFacetFilter: function (data) {
			var filter = {},
				temp = {},
				entries = [];

			var Locno = data.reduce((acc, o) => (acc[o.Locno] = (acc[o.Locno] || 0) + 1, acc), {}),
				Name1 = data.reduce((acc, o) => (acc[o.Name1] = (acc[o.Name1] || 0) + 1, acc), {}),
				Name = data.reduce((acc, o) => (acc[o.Name] = (acc[o.Name] || 0) + 1, acc), {}),
				Zagloctype = data.reduce((acc, o) => (acc[o.Zagloctype] = (acc[o.Zagloctype] || 0) + 1, acc), {}),
				Zsupplyactivity = data.reduce((acc, o) => (acc[o.Zsupplyactivity] = (acc[o.Zsupplyactivity] || 0) + 1, acc), {}),
				Zsupplylocplatform = data.reduce((acc, o) => (acc[o.Zsupplylocplatform] = (acc[o.Zsupplylocplatform] || 0) + 1, acc), {}),
				Zsupplyregiondesc = data.reduce((acc, o) => (acc[o.Zsupplyregiondesc] = (acc[o.Zsupplyregiondesc] || 0) + 1, acc), {}),
				Zsupplyregionid = data.reduce((acc, o) => (acc[o.Zsupplyregionid] = (acc[o.Zsupplyregionid] || 0) + 1, acc), {}),
				Zlocdesc2 = data.reduce((acc, o) => (acc[o.Zlocdesc2] = (acc[o.Zlocdesc2] || 0) + 1, acc), {});

			filter["Locno"] = {
				"type": "Location ID",
				"key": "Locno",
				"values": this.createFilterData(Locno)
			};
			filter["Name1"] = {
				"type": "Supply Location Description",
				"key": "Name1",
				"values": this.createFilterData(Name1)
			};
			filter["Name"] = {
				"type": "Old Location & Description",
				"key": "Name",
				"values": this.createFilterData(Name)
			};
			filter["Zagloctype"] = {
				"type": "Supply Location Type",
				"key": "Zagloctype",
				"values": this.createFilterData(Zagloctype)
			};
			filter["Zsupplyactivity"] = {
				"type": "Supply Activity",
				"key": "Zsupplyactivity",
				"values": this.createFilterData(Zsupplyactivity)
			};
			filter["Zsupplylocplatform"] = {
				"type": "CP Supply  Relevancy flag",
				"key": "Zsupplylocplatform",
				"values": this.createFilterData(Zsupplylocplatform)
			};
			filter["Zsupplyregiondesc"] = {
				"type": "Supply Region Description",
				"key": "Zsupplyregiondesc",
				"values": this.createFilterData(Zsupplyregiondesc)
			};
			filter["Zsupplyregionid"] = {
				"type": "Supply Region ID",
				"key": "Zsupplyregionid",
				"values": this.createFilterData(Zsupplyregionid)
			};
			
			filter["Zlocdesc2"] = {
				"type": "Supply Location Description",
				"key": "Zlocdesc2",
				"values": this.createFilterData(Zlocdesc2)
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
			this.byId("LocalTable").getBinding("rows").filter(oFilter);
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

		handleViewSettingsDialogButtonPressed: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.ey.bamlocattr.fragment.ViewSettingsDialog", this);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		handleConfirm: function (oEvent) {
			var mParams = oEvent.getParameters();
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			this.aSorter = [];
			var oTable = this.getView().byId("LocalTable");
			var oBinding = oTable.getBinding('rows');
			this.aSorter.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(this.aSorter);
		},
		handleReset: function () {
			this.byId("search").setValue("");
		},
		onSelectedItems: function (oEvent) {

			this.selectedItems.length = 0; /* Clear all array items*/

			oEvent.getSource().getSelectedIndices().forEach(index => {
				this.selectedItems.push(oEvent.getSource().getContextByIndex(index).getObject());
			}, this);

			var sCMdl = new JSONModel(this.selectedItems);
			sap.ui.getCore().setModel(sCMdl, 'SelectedModel2');
		},

		handleFilter: function (oEvent) {
			var oQuery = oEvent.getParameter("query");
			var filter = new Array();

			var oFilter = [new sap.ui.model.Filter("Locno", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zagloctype", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zsupplyactivity", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zsupplyregionid", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zsupplyregiondesc", sap.ui.model.FilterOperator.Contains, oQuery),
				new sap.ui.model.Filter("Zsupplylocplatform", sap.ui.model.FilterOperator.Contains, oQuery)

			];

			oFilter = new sap.ui.model.Filter(oFilter, false);
			filter.push(oFilter);
			this.oList = this.getView().byId("LocalTable");
			this.oList.getBinding("rows").filter(filter);
		},
		onPrdLvlF4Cancel: function () {
			this.Location.close();
		},
		onPrdLvlF4AfterClose: function () {
			this.Location.destroy();
			this.Location = undefined;
		},
		onCreate: function () {
			this.router.navTo("Create");
		},
		onEdit: function () {

			var aIndices = this.getView().byId("LocalTable").getSelectedIndices();
			// if (aIndices[0]) {
			if (aIndices.length === 0) {
				sap.m.MessageToast.show("Please Select a row to Edit Attributes");
			} else {
				this.router.navTo("Edit");
			}

		},
		onDataExport: function () {
			var oTable = this.getView().byId("LocalTable"),
				columns = [],
				temp = {},
				oSettings_table;

			oTable.getColumns().forEach((oItem, oIndex) => {
				temp = {};
				if(oItem.getVisible()) {
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
						sheetName: "Location"
					}
				},
				showProgress: false,
				dataSource: oTable.getModel("Locationmod").getData(),
				fileName: "Location Attributes.xlsx"
			};
			new Spreadsheet(oSettings_table).build().then(function () {
				sap.m.MessageToast.show("Downloaded successfully");
			});

		},

		onDisplay: function () {

			if (this.selectedItems.length > 0) {
				var mdl = new JSONModel({
					results: this.selectedItems
				});
				sap.ui.getCore().setModel(mdl, 'DisModel');
				this.router.navTo("Display");
			} else {
				MessageBox.information("Select A Line Item.");
			}

		},

		handleErrorResponse: function (e) {
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

		onExit: function () {
			if (this._oTPC) {
				this._oTPC.destroy();
				this._oTPC = null;
			}
		}
	});
});