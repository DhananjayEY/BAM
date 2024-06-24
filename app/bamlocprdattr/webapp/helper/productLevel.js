sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/type/String",
	"sap/m/ColumnListItem",
	"sap/m/Label",
	"sap/m/SearchField",
	"sap/m/Token",
	"sap/m/MessageBox"
], function (JSONModel, Filter, FilterOperator, typeString, ColumnListItem, Label, SearchField, Token, MessageBox) {
	"use strict";
	var that;
	return {
		ValueHelp: function (oEvent, oView) {  /* oView is 'this' passed from the controller */
			oView.oProductColModel = new JSONModel(sap.ui.require.toUrl("com/ey/bamlocprdattr/model") + "/columnsPrdLvl.json");
			var oModel = new sap.ui.model.json.JSONModel();
			oView.getView().setModel(oModel, "productValueHelpModel");

			var aCols = oView.oProductColModel.getData().cols;
			oView._oProductBasicSearchField = new SearchField({
				showSearchButton: false,
				visible: false
			});

			oView._oProductValueHelpDialog = sap.ui.xmlfragment("com.ey.bamlocprdattr.fragment.DialogProductLevel", oView);
			oView.getView().addDependent(oView._oProductValueHelpDialog);

			oView._oProductValueHelpDialog.getFilterBar().setBasicSearch(oView._oProductBasicSearchField);

			oView._oProductValueHelpDialog.getTableAsync().then(function (oTable) {
				oModel = oView.getView().getModel("productValueHelpModel");
				oModel.setProperty("/ProductLevel", "");
				oTable.setModel(oModel);
				oTable.setModel(oView.oProductColModel, "columns");

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

				oView._oProductValueHelpDialog.update();
			}.bind(oView));

			oView._oProductValueHelpDialog.open();
		},
		onOk: function (oEvent, oView) {
			var aTokens = oEvent.getParameter("tokens"),
				// oField = sap.ui.getCore().byId("productLevelInput");
				oField = oView._oValueHelpDialog.getFilterBar().getFilterGroupItems()[3].getControl();

			oField.setTokens(aTokens);
			oView._oProductValueHelpDialog.close();
		},
		onCancel: function (oView ) {
			oView._oProductValueHelpDialog.close();
		},
		onAfterClose: function (oView) {
			// this.onRestList(null, oView);
			oView._oProductValueHelpDialog.destroy();
			oView._oProductValueHelpDialog = undefined;
		},
		onFilterSearch: function (oEvent, oView) {
			if (sap.ui.getCore().byId("idPrdLvl").getSelectedItem().getProperty("text") === "Please Select") {
				sap.m.MessageBox.error("Please select product level");
				return;
			}

			var sSearchQuery = oView._oBasicSearchField.getValue(),
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

			oView._oProductValueHelpDialog.getTable().setBusyIndicatorDelay(0);
			oView._oProductValueHelpDialog.getTable().setBusy(true);
			var sURI = '/sap/opu/odata/sap/ZBAM_LOC_PRODUCT_SRV/',
				oModelP = new sap.ui.model.json.JSONModel(),
				_dialog = oView._oProductValueHelpDialog,
				that = this;

			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);
			oModelP.read("/ZBAM_PROD_LVL_SEARCHSet", {
				filters: aFilters,
				success: function (oData, response) {

					that.onSetList(response, _dialog, oView);
					_dialog.getTable().setBusy(false);
				},
				error: function fnError(e) {
					that.onRestList(_dialog, oView);
					_dialog.getTable().setBusy(false);

					MessageBox.warning(that.handlErrorResponse(e));
				},
				async: true
			});
		},
		onRestList: function (dialog, oView) {
			oView.prdLvlList = "";
			if (oView._oProductValueHelpDialog === undefined) {
				oView._oProductValueHelpDialog = dialog;
			}

			oView._oProductValueHelpDialog.getTableAsync().then(function (oTable) {
				oTable.getModel().setProperty("/ProductLevel", oView.prdLvlList);
			}.bind(oView));
		},
		onSetList: function (response, dialog, oView) {
			oView.prdLvlList = response.data.results;

			dialog.getTableAsync().then(function (oTable) {
				//var oModel = oView.getView().getModel("productValueHelpModel");
				oTable.getModel().setProperty("/ProductLevel", oView.prdLvlList);
				dialog.update();
			}.bind(oView));
		},
		
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
		}
	};
});