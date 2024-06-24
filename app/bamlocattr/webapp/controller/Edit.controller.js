sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"../helper/controlField"
], function (Controller, JSONModel, MessageBox, ControlField) {
	"use strict";

	return Controller.extend("com.ey.bamlocattr.controller.Edit", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ey.bamlocattr.view.Edit
		 */
		onInit: function () {
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRouteMatched(this._onObjectMatched, this);
		},
		
		onNavBack: function () {
			if (this.onDataSubmitted === true) {

				this.getOwnerComponent().getModel("check").param = "edit/submitted";
				this.router.navTo("Mainlocation", {}, true);
			} else {
				if (this.flag === false) {

					this.router.navTo("Mainlocation", {}, true);

				} else {
					sap.m.MessageBox.confirm(
						"Unsaved data will be lost. Are you sure you want to continue?", {
							icon: MessageBox.Icon.WARNING,
							title: "Message",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							initialFocus: "Custom Button",
							onClose: function (oAction) {
								if (oAction === "YES") {
									this.router.navTo("Mainlocation", {}, true);
								}
							}.bind(this)
						}
					);
				}

				event.stopPropagation(); //event from the native event trigger parameter
			}
		},

		onValueChange: function (oEvent) {
			this.flag = true;
		},

		onListItemChange: function (oEvent) {
			this.flag = true;
			var oItem = oEvent.getParameter("selectedItem").getProperty("text").split("-")[1].trim();
			if(oItem == "Please Select"){
				oItem =  oEvent.getParameter("selectedItem").getProperty("key")
			}
			this.getView().byId("sregionDesc").setValue(oItem);
		},

		_onObjectMatched: function (oEvent) {
			this.flag = false;
			$("#backBtn").unbind("click");

			if (oEvent.getParameter("name") === "Edit") {
				
				$("#backBtn").on("click", this.onNavBack.bind(this));
				var navModel = sap.ui.getCore().getModel("SelectedModel2"),
					temp = $.extend(true, {}, this.getOwnerComponent().getModel("oModel").getData());
				var a = navModel.getData();

				this.onDataSubmitted = false;

				var selItms = {
					itemCount: a.length
				};
				var oModelcell1 = new sap.ui.model.json.JSONModel();
				oModelcell1.setData(selItms);
				this.getView().setModel(oModelcell1, "aCount");

				/*a.forEach((oItem) => {
					oItem.map((key, value) => {
						
					}, this);
				}, this);*/

				if (a.length === undefined || a.length > 1) {
					//this.getView().byId("macroLocation").setValue("");
					this.getView().byId("ltype").setSelectedKey("");
					this.getView().byId("pform").setSelectedKey("");
					this.getView().byId("sactivity").setSelectedKey("");
					this.getView().byId("sregion").setSelectedKey("");
					this.getView().byId("sregionDesc").setValue("");
					this.getView().byId("Zlocdesc2").setValue("");

				} else {
					//this.getView().byId("macroLocation").setValue(a[0].ZmacroLocation);
					this.getView().byId("ltype").setSelectedKey(a[0].Zagloctype.split("-")[0].trim());
					this.getView().byId("pform").setSelectedKey(a[0].Zsupplylocplatform.split("-")[0].trim());
					this.getView().byId("sactivity").setSelectedKey(a[0].Zsupplyactivity.split("-")[0].trim());
					this.getView().byId("sregion").setSelectedKey(a[0].Zsupplyregionid);
					this.getView().byId("sregionDesc").setValue(a[0].Zsupplyregiondesc);
					this.getView().byId("Zlocdesc2").setValue(a[0].Zlocdesc2);
				}
				
				ControlField.controlFieldsInEdit(this);
			}
		},
		
		onsaveEdit: function () {
			var obj = {
				//SupplyMacroLocation: this.getView().byId("macroLocation").getValue(),
				SupplyAggrLocationType: this.getView().byId("ltype").getSelectedKey(),
				SupplyLocationPlatform: this.getView().byId("pform").getSelectedKey().split("-")[0],
				SupplyActivity: this.getView().byId("sactivity").getSelectedKey(),
				SupplyRegion: this.getView().byId("sregion").getSelectedKey(),
				SupplyRegionDescription: this.getView().byId("sregionDesc").getValue(),
				SupplyLocationDescription: this.getView().byId("Zlocdesc2").getValue()
			};
			//this.onValidateSelect(obj);
			this.submitoData(obj);
		},
		
		submitoData: function (obj) {
			var aModel = this.getView().getModel("oModel").getData();

			var navData = sap.ui.getCore().getModel("SelectedModel2").getData();

			var sURI = '/sap/opu/odata/sap/ZBAM_SUPP_LOCATION_SRV/';
			var oModelP = new sap.ui.model.json.JSONModel();
			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);

			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			var batchChanges = [];
			var i;
			for (i = 0; i < navData.length; i++) {
				var C = {};
				C.Trtyp = 'V';
				C.Locno = navData[i].Locno;
				C.Name1 = navData[i].Name1;
				//C.ZmacroLocation = obj.SupplyMacroLocation === "" ? navData[i].ZmacroLocation : obj.SupplyMacroLocation;
				C.Zagloctype = obj.SupplyAggrLocationType === "" ? navData[i].Zagloctype : obj.SupplyAggrLocationType;
				C.Zsupplylocplatform = obj.SupplyLocationPlatform === "" ? navData[i].Zsupplylocplatform : obj.SupplyLocationPlatform;
				C.Zsupplyactivity = obj.SupplyActivity === "" ? navData[i].Zsupplyactivity : obj.SupplyActivity;
				C.Zsupplyregionid = obj.SupplyRegion === "" ? navData[i].Zsupplyregionid : obj.SupplyRegion;
				C.Zsupplyregiondesc = obj.SupplyRegionDescription === "" ? navData[i].Zsupplyregiondesc : obj.SupplyRegionDescription;
				C.Zlocdesc2 = obj.SupplyLocationDescription === "" ? navData[i].Zlocdesc2 : obj.SupplyLocationDescription;

				batchChanges.push(oModelP.createBatchOperation("ZBAM_SUPP_LOCATIONSet", "POST", C));
			}
			oModelP.addBatchChangeOperations(batchChanges);
			var t = this;
			oModelP.submitBatch(
				function (oData, oResponse, aErrorResponses) {
					oModelP.refresh(true);
					if (aErrorResponses.length > 0) {
						MessageBox.error( t.handleErrorResponse(aErrorResponses[0]) );
					} else {

						t.onDataSubmitted = true;
						sap.m.MessageBox.success( "Records Updated Successfully" );
					}
					oBusy.close();
					t.setSubmitCheck();
				},
				function (oError) {
					MessageBox.error( t.handleErrorResponse(oError[0]));

					oBusy.close();
				}
			);
		},
		
		setSubmitCheck: function () {
			this.getOwnerComponent().getModel("check").param = "create/didNotSubmit";
			
			if (this.onDataSubmitted === true) {
				this.getOwnerComponent().getModel("check").param = "create/submitted";
			}
		},

		handleErrorResponse: function (oError) {
			var parser = new DOMParser(),
				xmlDoc = parser.parseFromString(oError.response.body, "text/xml"),
				errorMessage;

			if (oError.response.body.startsWith("<?xml")) {
				if (xmlDoc.querySelector('message') !== undefined || xmlDoc.querySelector('message') !== null) {
					errorMessage = xmlDoc.querySelector('message').firstChild.nodeValue;
				} else {
					errorMessage = xmlDoc.querySelector('h1').firstChild.nodeValue;
				}
			} else {
				errorMessage = oError.response.body !== "" ? oError.response.body : oError.message;
			}
		}
	});

});