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

		ValueHelp: function (oEvent, params, oView) {

			params.InputId = oEvent.getSource().getId();

			oView.oColModel = new JSONModel(sap.ui.require.toUrl("com/ey/productattributes/model") + params.Columns);
			var oModel = new sap.ui.model.json.JSONModel();
			oView.getView().setModel(oModel, "ValueHelpModel");

			var aCols = oView.oColModel.getData().cols;
			oView._oBasicSearchField = new SearchField({
				showSearchButton: false,
				visible: false
			});

			oView._oValueHelpDialog = sap.ui.xmlfragment("com.ey.productattributes.fragment." + params.Fragment, oView);
			if (params.View === "Create" || params.View === "Edit") {
				oView._oValueHelpDialog.setSupportMultiselect(false)
			}

			oView._oValueHelpDialog.setRangeKeyFields([{
				label: params.label,
				key: params.key,
				type: "string",
				typeInstance: new typeString({}, {
					maxLength: 7
				})
			}]);
			oView.getView().addDependent(oView._oValueHelpDialog);

			oView._oValueHelpDialog.getFilterBar().setBasicSearch(oView._oBasicSearchField);

			oView._oValueHelpDialog.getTableAsync().then(function (oTable) {
				var oModel = oView.getView().getModel("ValueHelpModel");
				oModel.setProperty(params.bindPath, "");
				oTable.setModel(oModel);
				oTable.setModel(oView.oColModel, "columns");

				if (oTable.bindRows) {
					oTable.bindAggregation("rows", params.bindPath);
				}

				if (oTable.bindItems) {
					oTable.bindAggregation("items", params.bindPath, function () {
						return new ColumnListItem({
							cells: aCols.map(function (column) {
								return new Label({
									text: "{" + column.template + "}"
								});
							})
						});
					});
				}

				if (params.aList) {
					oTable.getModel().setProperty(params.bindPath, params.aList);
				}

				oView._oValueHelpDialog.update();
			}.bind(oView));

			oView._oValueHelpDialog.open();
			if(oView.getView().byId(params.InputId).getMetadata()._sClassName !== "sap.m.Input") {
				oView._oValueHelpDialog.setTokens(oView.getView().byId(params.InputId).getTokens());
			}
		},

		OnConfirm: function (oEvent, oView) {
			var aTokens = oEvent.getParameter("tokens"),
				sFieldId = oView.params.InputId,
				oField = oView.getView().byId(sFieldId),
				oValue;

			oValue = oView.params.Fragment === "ValueHelpDialogUser" ? aTokens[0].getText() : aTokens[0].getKey();
			if (!oValue) {
				oValue = oView.params.Fragment === "ValueHelpDialogUser" ? aTokens[1].getText() : aTokens[1].getKey();
			}

			if (oView.params.View === "Create" || oView.params.View === "Edit") {
				oField.setValue(oValue);
			} else {
				oField.setTokens(aTokens);
			}

			oView._oValueHelpDialog.close();
		},

		OnCancel: function (oView) {
			oView._oValueHelpDialog.close();
		},

		AfterClose: function (oView) {
			// this.ResetList(oView.params, null, oView);
			oView._oValueHelpDialog.destroy();
			oView._oValueHelpDialog = undefined;
		},

		OnSearch: function (oEvent, oView) {

			var sSearchQuery = oView._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");
			/*tokens = sap.ui.getCore().byId( oView.params.InputId ) !== undefined ? 
						sap.ui.getCore().byId( oView.params.InputId ).getTokens() : false;*/
			// tokens = oView.params.Fragment === "Product" ? sap.ui.getCore().byId("productLevelInput").getTokens() : false;
			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {

				if (oControl.getName() === 'Zagloctype') {
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

			if (oView.params.additionFilter !== undefined) {
				aFilters.push(
					new sap.ui.model.Filter({
						path: oView.params.additionFilter.split('/')[0],
						operator: sap.ui.model.FilterOperator.EQ,
						value1: oView.params.additionFilter.split('/')[1],
					}));
			}

			this._FilterTable(aFilters, oView);
		},

		_FilterTable: function (aFilters, oView) {
			oView._oValueHelpDialog.getTable().setBusyIndicatorDelay(0);
			oView._oValueHelpDialog.getTable().setBusy(true);
			var params = oView.params,
				sURI = '/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/',
				oModelP = new sap.ui.model.json.JSONModel(),
				_dialog = oView._oValueHelpDialog,
				that = this;

			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);
			oModelP.read(params.SearchSet, {
				filters: aFilters,
				success: function (oData, response) {

					that.HandleResponse(response, params);
					that.SetList(response, params, _dialog, oView);
					_dialog.getTable().setBusy(false);
				},
				error: function fnError(e) {
					that.ResetList(params, _dialog, oView);
					_dialog.getTable().setBusy(false);

					MessageBox.warning(that.handlErrorResponse(e));
				},
				async: true
			});
		},

		ResetList: function (params, dialog, oView) {
			oView.List = "";
			if (oView._oValueHelpDialog === undefined) {
				oView._oValueHelpDialog = dialog;
			}

			oView._oValueHelpDialog.getTableAsync().then(function (oTable) {
				oTable.getModel().setProperty(params.bindPath, oView.List);
			}.bind(oView));
		},

		SetList: function (response, params, dialog, oView) {
			oView.List = response.data.results;
			oView.params.aList = response.data.results;

			dialog.getTableAsync().then(function (oTable) {
				oTable.getModel().setProperty(params.bindPath, oView.List);
				dialog.update();
			}.bind(oView));
		},

		HandleResponse: function (response, params) {
			if (params.Fragment === "Product") {

				response.data.results.map((item) => {
					if (!item.Matnr.match(/[A-za-z]\w/) && item.Matnr.match(/\w/) !== null) {
						item.Matnr = item.Matnr.match(/[1-9]\d*/g)[0];
					}

					if (!item.Bismt.match(/[A-za-z]\w/) && item.Bismt.match(/\w/) !== null && item.Bismt.match(/[1-9]\d*/) !== null) {
						item.Bismt = item.Bismt.match(/[1-9]\d*/g)[0];
					}
				}, this);

				return;
			} else {
				return;
			}
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

	}
});