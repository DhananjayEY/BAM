sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"../helper/material",
	"../helper/controlField"
], function (Controller, JSONModel, MessageBox, Filter, FilterOperator, MessageToast, MaterialValueHelp, ControlField) {
	"use strict";

	return Controller.extend("com.ey.productattributes.controller.EditProduct", {

		onInit: function () {
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRouteMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function (oEvent) {
			this.flag = false;
			$("#backBtn").unbind("click");

			if (oEvent.getParameter("name") === "EditProduct") {
				
				$("#backBtn").on("click", this.onNavBack.bind(this));
				this.onDataSubmitted = false;

				var oModelData = sap.ui.getCore().getModel("SelectedModel").getData(),
					oData = $.extend(true, {}, this.getOwnerComponent().getModel('temp').getData().root[0]),
					item = oModelData[0];

				oData.count = oModelData.length;

				/*oModelData.map((item) => {
				    item.MotId = item.MotId.split("-")[0];
				    item.Ztransportationconst = item.Ztransportationconst.split("-")[0]
				}, this);*/

				if (oModelData.length === undefined || oModelData.length > 1) {
					/*oData.TransportConstkey = oData.TransportConstkey;
					oData.TransportReceipt = "";*/
					//oData.Zdsi = oData,
					// oData.ZForConModeKey = oData.ZForecastConMode[2].ParamValue;

				} else {
					/*oData.TransportConstkey = item.Ztransportationconst;
					oData.TransportReceipt = item.Zfrozenhorizontreceipt;*/
					/*oData.Packagetype = item.Packagetype.split("-")[0].trim();
					oData.Packagesize = item.Packagesize;*/
					oData.Zdsi = item.Zdsi.split("-")[0].trim() !== "" ? item.Zdsi.split("-")[0].trim() : oData.Zdsi;
					oData.Zmasterplannedindicator = item.Zmasterplannedindicator.split("-")[0].trim() !== "" ? 
						item.Zmasterplannedindicator.split("-")[0].trim() : oData.Zmasterplannedindicator;
					oData.Zsellingcountry = item.Zsellingcountry;
					oData.Formulationdesc = item.Formulationdesc;
					oData.Zsupplyportfoliodesc = item.Zsupplyportfoliodesc;
					oData.Zsupplyproductcenterdesc = item.Zsupplyproductcenterdesc;
					
					/*oData.Zpackregional = item.Zpackregional;
					oData.Zformulationregional = item.Zformulationregional;
					oData.Formulatonid = item.Formulatonid;
					oData.Zsupplyportfolioid = item.Zsupplyportfolioid;
					oData.Zsupplyproductcenterid = item.Zsupplyproductcenterid;/
					oData.Formgroup = item.Formgroup.split("-")[0].trim();
					/*oData.Zaggproduct = item.ZaggproductT;
					oData.Zaggproddesc = item.ZaggproddescT;*/
					
					oData.Zibpsupplyrelevant = item.Zibpsupplyrelevant.split("-")[0].trim() !== "" ? 
						item.Zibpsupplyrelevant.split("-")[0].trim() : oData.Zibpsupplyrelevant;
					// oData.Zplanningstrategy = item.Zplanningstrategy.split("-")[0].trim();
					oData.Zplanningstrategy = item.Zplanningstrategy.split("-")[0].trim() !== "" ? 
						item.Zplanningstrategy.split("-")[0].trim() : oData.Zplanningstrategy;
						
					oData.ZForConModeKey = item.Fcstconsmode.split("-")[0].trim() !== "" ? 
						item.Fcstconsmode.split("-")[0].trim() : oData.ZForConModeKey;
						
					//Supply Chain Group
					oData.Formgroup = item.Formgroup.split("-")[0].trim() !== "" ? 
						item.Formgroup.split("-")[0].trim() : oData.Formgroup;
					
					oData.Zportfoliosupmanager = item.Zportfoliosupmanager
					oData.Zmasterplanner = item.Zmasterplanner
				}

				var oModel = new sap.ui.model.json.JSONModel(oData);
				this.getView().setModel(oModel, "oModel");

				//oModel.refresh(true);
				oModel.updateBindings(true);
				
				ControlField.controlFieldsInEdit(this);
			}

		},
		
		clearPortfolioSupManager: function(oEvent) {
			this.getView().getModel("oModel").setProperty("/Zportfoliosupmanager", "");
		},
		
		clearMasterPlanner: function(oEvent) {
			this.getView().getModel("oModel").setProperty("/Zmasterplanner", "");
		},

		onCountryF4: function (oEvent) {
			var global = $.extend(true, {}, this.getOwnerComponent().getModel("temp").getData().root);
			if (!this.getView().getModel("country")) {
				var oModel = new JSONModel();
				this.getView().setModel(oModel, "country");
			} else {
				oModel = this.getView().getModel("country");
			}

			this.oCountryDialog = new sap.m.SelectDialog({
				title: "Selling Country",
				noDataText: "No Data Found",
				titleAlignment: "Center",
				liveChange: this.handleCountrySearch,
				confirm: function (evt) {

					var selectedItem = evt.getParameter("selectedItem");
					if (selectedItem) {
						this.getView().byId("idSellingCountry").setValue(selectedItem.getTitle());
					}

				}.bind(this),
				cancel: function (oEvent) {

					oEvent.getSource().getBinding("items").filter([]);
					this.oCountryDialog.destroy();
				}.bind(this)
			});

			oModel.setProperty("/Country", global[0].SellingCountryF4);
			this.oCountryDialog.setModel(oModel);

			var itemTemplate = new sap.m.ObjectListItem({
				title: "{Land1}",
				attributes: [{
					text: "{Landx}"
				}, {
					text: "{Natio}"
				}, ]
			});
			this.oCountryDialog.bindAggregation("items", "/Country", itemTemplate);

			this.oCountryDialog.open();
		},

		handleCountrySearch: function (oEvent) {
			var sValue = oEvent.getParameter("value"),
				oFilter = [];

			oFilter = [
				new Filter("Land1", FilterOperator.Contains, sValue),
				new Filter("Landx", FilterOperator.Contains, sValue),
				new Filter("Natio", FilterOperator.Contains, sValue)
			];

			var combinedFilter = new sap.ui.model.Filter({
				filters: [new Filter(oFilter)],
				and: false
			});
			var oBinding = oEvent.getSource().getBinding("items");
			if (!sValue || sValue === "") {
				oBinding.filter([]);
				return;
			}
			oBinding.filter(combinedFilter);
		},
		
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

		onValueChange: function (oEvent) {
			this.flag = true;
			var id = oEvent.getParameter("id").match(/id.*/)[0],
				oItem = oEvent.getParameter("selectedItem").getText().split("-")[1].trim();
				
				if(oItem == "Please Select"){
					oItem = "";
				}
			
			switch(id){
				case "idFormulationID": this.getView().byId("idFormulationDesc").setValue(oItem);
					break;
				case "idPortfolioId": this.getView().byId("idPortfolioDesc").setValue(oItem);
					break;
				case "idProductCenterID": this.getView().byId("idProductCenterDesc").setValue(oItem);
					break;
			}
		},
		
		onChange: function(oEvent){
			this.flag = true;
			oEvent.getSource().setValue("");
			sap.m.MessageToast.show("Please select from Country F4", {
				duration: 1200
			});
		},
		
		onLiveChange: function(oEvent) {
			this.flag = true;
			var sId = oEvent.getSource().getId();
			if(sId.includes("idPackageSize") || sId.includes("ZPLANNINGSTRATEGY")) {
				var inputArr = oEvent.getParameter("newValue").split("");
				var index = inputArr.findIndex((i,j) => j === 0 ? i.match(/[0A-Za-z\s\D]/) : i.match(/[A-Za-z\s\D]/));
				if(index !== -1) {
					inputArr.splice(index, 1);
					oEvent.getSource().setValue(inputArr.join(""));
				}
			}
		},

		onNavBack: function () {
			this.getOwnerComponent().getModel("check").param = "edit/didNotSubmit";

			if (this.onDataSubmitted === true) {
				
				this.getOwnerComponent().getModel("check").param = "edit/submitted";
				this.router.navTo("Product", {}, true);
				
			} else {
				
				if (this.flag === false) {
					
					this.router.navTo("Product", {}, true);
					
				} else {
					
					sap.m.MessageBox.confirm(
						"Unsaved data will be lost. Are you sure you want to continue?", {
							icon: MessageBox.Icon.WARNING,
							title: "Message",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							initialFocus: "Custom Button",
							onClose: function (oAction) {
								if (oAction === "YES") {
									this.router.navTo("Product", {}, true);
								}
							}.bind(this)
						}
					);
				}
				//this.router.navTo("Product", {}, true);
			}
			
			event.stopPropagation(); //event from the native event trigger parameter
		},

		onsaveEdit: function () {
			var e = {
				/*Packagetype: this.getView().byId("idPackageType").getSelectedKey(),
				Packagesize: this.getView().byId("idPackageSize").getValue(),*/
				Zdsi: this.getView().byId("idDsi").getSelectedKey(),
				Zmasterplannedindicator: this.getView().byId("idMasterPlanned").getSelectedKey(),
				Zsellingcountry: this.getView().byId("idSellingCountry").getValue(),
				Formulationdesc: this.getView().byId("idFormulationDesc").getValue(),
				Zsupplyportfoliodesc: this.getView().byId("idPortfolioDesc").getValue(),
				Zsupplyproductcenterdesc: this.getView().byId("idProductCenterDesc").getValue(),
				Formulationdesc: this.getView().byId("idFormulationDesc").getValue(),
				Zsupplyportfoliodesc: this.getView().byId("idPortfolioDesc").getValue(),
				Zsupplyproductcenterdesc: this.getView().byId("idProductCenterDesc").getValue(),
				
				/*Zpackregional: this.getView().byId("idPackageRgn").getSelectedKey(),
				Zformulationregional: this.getView().byId("idFormulationRegion").getSelectedKey(),
				Formulatonid: this.getView().byId("idFormulationID").getSelectedKey(),
				Zsupplyportfolioid: this.getView().byId("idPortfolioId").getSelectedKey(),
				Zsupplyproductcenterid: this.getView().byId("idProductCenterID").getSelectedKey(),*/
				
				/*Zaggproduct: this.getView().byId("idAggProduct").getValue(),
				Zaggproddesc: this.getView().byId("idAggProductDesc").getValue(),*/
				
				// Formgroup: this.getView().byId("idFormGroup").getValue(),
				Zibpsupplyrelevant: this.getView().byId("idIBPRelevant").getSelectedKey(),
				Zplanningstrategy: this.getView().byId("ZPLANNINGSTRATEGY").getSelectedKey(),
				//Supply Chain Group
				Formgroup: this.getView().byId("idFormGroup").getSelectedKey(),
				Fcstconsmode: this.getView().byId("FCSTCONSMODE").getSelectedKey(),
				Zportfoliosupmanager: this.getView().byId("ZPORTFOLIOSUPMANAGER").getValue().match(/[\w\s]+/g) !== null ? 
					this.getView().byId("ZPORTFOLIOSUPMANAGER").getValue().match(/[\w\s]+/g)[0].trim() : "",
				Zmasterplanner: this.getView().byId("ZMASTERPLANNER").getValue().match(/[\w\s]+/g) !== null ?
					this.getView().byId("ZMASTERPLANNER").getValue().match(/[\w\s]+/g)[0].trim() : ""
			};
			this.onSubmit(e);
		},

		//start Ghantavine
		onSubmit: function (obj) {
			var a = sap.ui.getCore().getModel("SelectedModel").getData(),
				//var a = this.getView().getModel("oModel").getData(),
				that = this;

			var sURI = "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/";
			var oModelP = new sap.ui.model.json.JSONModel();
			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);

			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			var batchChanges = [];
			var len = a.length;
			for (var i = 0; i < a.length; i++) {
				var C = {};
				C.Msgtype = "V";
				C.Prdid = a[i].Prdid.split("-")[0].trim();
				
			/*	C.Packagetype = len === 1 ? obj.Zdsi : obj.Packagetype === "" ?  a[i].Packagetype.split("-")[0].trim() : obj.Packagetype;
				C.Packagesize = len === 1 ? obj.Zdsi : obj.Packagesize === "" ?  a[i].Packagesize : obj.Packagesize;*/
				C.Zdsi = len === 1 ? obj.Zdsi : obj.Zdsi === "" ?  a[i].Zdsi.split("-")[0].trim() : obj.Zdsi ;
				C.Zmasterplannedindicator = len === 1 ? obj.Zmasterplannedindicator : obj.Zmasterplannedindicator.split("-")[0].trim() === "" ?  a[i].Zmasterplannedindicator.split("-")[0].trim() : obj.Zmasterplannedindicator.split("-")[0].trim() ;
				C.Zsellingcountry = len === 1 ? obj.Zsellingcountry : obj.Zsellingcountry === "" ?  a[i].Zsellingcountry : obj.Zsellingcountry ;
				C.Formulationdesc = len === 1 ? obj.Formulationdesc : obj.Formulationdesc === "" ?  a[i].Formulationdesc : obj.Formulationdesc ;
				C.Zsupplyportfoliodesc = len === 1 ? obj.Zsupplyportfoliodesc : obj.Zsupplyportfoliodesc === "" ?  a[i].Zsupplyportfoliodesc : obj.Zsupplyportfoliodesc;
				C.Zsupplyproductcenterdesc = len === 1 ? obj.Zsupplyproductcenterdesc : obj.Zsupplyproductcenterdesc === "" ?  a[i].Zsupplyproductcenterdesc : obj.Zsupplyproductcenterdesc;
				
				/*C.Zpackregional = len === 1 ? obj.Zdsi : obj.Zpackregional === "" ?  a[i].Zpackregional: obj.Zpackregional  ;
				C.Zformulationregional = len === 1 ? obj.Zdsi : obj.Zformulationregional === "" ?  a[i].Zformulationregional : obj.Zformulationregional ;
				C.Formulatonid = len === 1 ? obj.Zdsi : obj.Formulatonid === "" ?  a[i].Formulatonid : obj.Formulatonid ;
				C.Zsupplyportfolioid = len === 1 ? obj.Zdsi : obj.Zsupplyportfolioid === "" ?  a[i].Zsupplyportfolioid : obj.Zsupplyportfolioid;
				C.Zsupplyproductcenterid = len === 1 ? obj.Zdsi : obj.Zsupplyproductcenterid === "" ?  a[i].Zsupplyproductcenterid : obj.Zsupplyproductcenterid;
			/*	C.Zaggproduct = len === 1 ? obj.Zdsi : obj.Zaggproduct === "" ?  a[i].Zaggproduct : obj.Zaggproduct;
				C.Zaggproddesc = len === 1 ? obj.Zdsi : obj.Zaggproddesc === "" ?  a[i].Zaggproddesc : obj.Zaggproddesc;*/
				
				// C.Formgroup = len === 1 ? obj.Formgroup : obj.Formgroup === "" ?  a[i].Formgroup.split("-")[0].trim() : obj.Formgroup;
				C.Zibpsupplyrelevant = len === 1 ? obj.Zibpsupplyrelevant : obj.Zibpsupplyrelevant === "" ?  a[i].Zibpsupplyrelevant.split("-")[0].trim() : obj.Zibpsupplyrelevant;
				C.Zplanningstrategy = len === 1 ? obj.Zplanningstrategy : obj.Zplanningstrategy === "" ? a[i].Zplanningstrategy.split("-")[0].trim() : obj.Zplanningstrategy;
				C.Formgroup = len === 1 ? obj.Formgroup : obj.Formgroup === "" ? a[i].Formgroup.split("-")[0].trim() : obj.Formgroup;// new changes
				C.Fcstconsmode = len === 1 ? obj.Fcstconsmode : obj.Fcstconsmode === "" ? a[i].Fcstconsmode.split("-")[0].trim() : obj.Fcstconsmode;
				C.Zportfoliosupmanager = len === 1 ? obj.Zportfoliosupmanager : obj.Zportfoliosupmanager === "" ? a[i].Zportfoliosupmanager.split("-")[0].trim() : obj.Zportfoliosupmanager;
				C.Zmasterplanner = len === 1 ? obj.Zmasterplanner : obj.Zmasterplanner === "" ? a[i].Zmasterplanner.split("-")[0].trim() : obj.Zmasterplanner;
				batchChanges.push(oModelP.createBatchOperation("zbam_product_attributesSet", "POST", C));
			}
			oModelP.addBatchChangeOperations(batchChanges);
			oModelP.submitBatch(
				function (oData, oResponse, aErrorResponses) {
					oModelP.refresh(true);
					oBusy.close();
					if (aErrorResponses.length > 0) {
						sap.m.MessageBox.error( that.handlErrorResponse(aErrorResponses[0]) );
					} else {
						that.onDataSubmitted = true;
						sap.m.MessageBox.success("Records Updated Successfully");
					}
					
					that.setSubmitCheck();
				},
				function (oError) {
					oBusy.close();
					MessageBox.warning( that.handlErrorResponse(oError) );
				}
			);
		},
		
		setSubmitCheck: function () {
			this.getOwnerComponent().getModel("check").param = "edit/didNotSubmit";
			
			if (this.onDataSubmitted === true) {
				this.getOwnerComponent().getModel("check").param = "edit/submitted";
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
	});

});