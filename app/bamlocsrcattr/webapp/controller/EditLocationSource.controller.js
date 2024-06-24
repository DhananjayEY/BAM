sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"../helper/material",
	"../helper/controlField"
], function (Controller, JSONModel, MessageBox, MaterialValueHelp, ControlField) {
	"use strict";

	return Controller.extend("com.ey.bamlocsrcattr.controller.EditLocationSource", {

		onInit: function () {
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRouteMatched(this._onObjectMatched, this);
			//this.setModelData();
		},
		_onObjectMatched: function (oEvent) {
			this.flag = false;
			$("#backBtn").unbind("click");
			
			if(oEvent.getParameter("name") === "EditLocationSource"){
				$("#backBtn").on("click", this.onNavBack.bind(this));
				this.onDataSubmitted = false;
				
				var oModelData = sap.ui.getCore().getModel("SelectedModel").getData(),
					oData = $.extend(true, {}, this.getOwnerComponent().getModel('temp').getData().root[0]),
					item = oModelData[0];
					
					oData.count = oModelData.length;
				
				oModelData.map((item) => {
				    item.MotId = item.MotId.split("-")[0];
				    item.Ztransportationconst = item.Ztransportationconst.split("-")[0].trim();
				    item.ZtransportationconstAps = item.ZtransportationconstAps.split("-")[0].trim();
				}, this);
				
				if(oModelData.length === undefined || oModelData.length > 1){
					oData.TransportConstkey = "";
					oData.ApsTransportConstkey = "";
					oData.TransportReceipt = "";
					oData.Ztrounding = "";
					oData.Ztminlotsize = "";
					oData.Ztmaxlotsize = "";
					oData.Ztleadtime = "";
					oData.Zapstlaneovrd = "";
					
				}else{
					oData.TransportConstkey = item.Ztransportationconst;
					oData.ApsTransportConstkey = item.ZtransportationconstAps;
					oData.TransportReceipt = item.Zfrozenhorizontreceipt;
					oData.Ztrounding = item.Ztrounding;
					oData.Ztminlotsize = item.Ztminlotsize;
					oData.Ztmaxlotsize = item.Ztmaxlotsize;
					oData.Ztleadtime = item.Ztleadtime;
					oData.Zapstlaneovrd = item.Zapstlaneovrd.split("-")[0] === "X" ? "Y" : "X"
				}
				
				var oModel = new sap.ui.model.json.JSONModel(oData);
				this.getView().setModel(oModel, "oModel");
				
				//oModel.refresh(true);
				oModel.updateBindings(true);
				
				ControlField.controlFieldsInEdit(this);
			}

		},
		
		
		
		getModel: function(oModel) {
			return this.getOwnerComponent().getModel(oModel);	
		},
		
		onChange: function(oEvent){
			this.flag = true;
		},
		
		onLiveChange: function(oEvent){
			this.flag = true;
			var inputArr = oEvent.getParameter("newValue").split("");
			// var index = inputArr.findIndex((i,j) => j === 0 ? i.match(/[0A-Za-z\s\D]/) : i.match(/[A-Za-z\s\D]/));
			var index = inputArr.findIndex(i => i.match(/[A-Za-z\s\D]/));
			if(index !== -1) {
				inputArr.splice(index, 1);
				oEvent.getSource().setValue(inputArr.join(""));
			}
		},
		
		/*onChange: function(oEvent){
			this.flag = true;
			
			oEvent.getSource().setValue("");
			sap.m.MessageToast.show("Please select from user F4", {
				duration: 1500
			});
		},*/
		
		onNavBack: function () {
			this.getOwnerComponent().getModel("check").param = "edit/didNotSubmit";
			
			if(this.onDataSubmitted === true){
				this.getOwnerComponent().getModel("check").param = "edit/submitted";
				this.router.navTo("LocationAtrributes", {}, true);
			}else{
				if (this.flag === false) {
					
					this.router.navTo("LocationAtrributes", {}, true);
					
				} else {
					
					sap.m.MessageBox.confirm(
						"Unsaved data will be lost. Are you sure you want to continue?", {
							icon: MessageBox.Icon.WARNING,
							title: "Message",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							initialFocus: "Custom Button",
							onClose: function (oAction) {
								if (oAction === "YES") {
									this.router.navTo("LocationAtrributes", {}, true);
								}
							}.bind(this)
						}
					);
				}
				
				//this.router.navTo("LocationAtrributes", {}, true);
			}
			
			event.stopPropagation(); //event from the native event trigger parameter
		},
		
		onSubmit:function(){
			var e = {
				Ztransportationconst: this.getView().byId("inputTransport").getSelectedKey(),
				Zapstransportationconst: this.getView().byId("inputApsTransport").getSelectedKey(),
				Zfrozenhorizontreceipt: this.getView().byId("inputReceipt").getValue(),
				Ztmaxlotsize: this.getView().byId("inputmaxLotSize").getValue(),
				Ztminlotsize: this.getView().byId("inputMinLotSize").getValue(),
				Ztrounding: this.getView().byId("inputRounding").getValue(),
				ZleadTime: this.getView().byId("inputLeadTime").getValue(),
				ZtLaneOvrd: this.getView().byId("inputLaneOvrd").getSelectedKey()
			};
			this.submitoData(e);
		},
		
		//start Ghantavine
		submitoData: function (obj) {
			var a = sap.ui.getCore().getModel("SelectedModel").getData(),
			//var a = this.getView().getModel("oModel").getData(),
				that = this;

			var sURI = "/sap/opu/odata/sap/ZBAM_SUPP_LOC_SOURCE_SRV/";
			var oModelP = new sap.ui.model.json.JSONModel();
			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);

			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			var batchChanges = [];
			var i;
			for (i = 0; i < a.length; i++) {
				var C = {};
				C.Trtyp = "V";
				C.LocnoFrom = a[i].LocnoFrom;
				C.LocnoTo = a[i].LocnoTo;
				C.MotId = a[i].MotId;
				C.Matnr = a[i].Matnr.split("-")[0].trim();
				C.Sort1 = a[i].Sort1.split("-")[0].trim();
				C.Sort2 = a[i].Sort2.split("-")[0].trim();
				
				C.Ztransportationconst = a.length === 1 ? obj.Ztransportationconst : 
										 obj.Ztransportationconst === "" ? a[i].Ztransportationconst : 
										 obj.Ztransportationconst;
										
				C.ZtransportationconstAps = a.length === 1 ? obj.Zapstransportationconst : 
										 obj.Zapstransportationconst === "" ? a[i].ZtransportationconstAps : 
										 obj.Zapstransportationconst;
				
				a[i].Zfrozenhorizontreceipt = a[i].Zfrozenhorizontreceipt === "" ? "0" : 
											  a[i].Zfrozenhorizontreceipt;
											  
				C.Zfrozenhorizontreceipt = a.length === 1 ? obj.Zfrozenhorizontreceipt : 
										   obj.Zfrozenhorizontreceipt === "" ? a[i].Zfrozenhorizontreceipt : 
										   obj.Zfrozenhorizontreceipt;
				
				C.Ztmaxlotsize = a.length === 1 ? obj.Ztmaxlotsize : 
								 obj.Ztmaxlotsize === "" ? a[i].Ztmaxlotsize : 
								 obj.Ztmaxlotsize;
								 
				C.Ztminlotsize = a.length === 1 ? obj.Ztminlotsize : 
								 obj.Ztminlotsize === "" ? a[i].Ztminlotsize : 
								 obj.Ztminlotsize;
								 
				C.Ztrounding = a.length === 1 ? obj.Ztrounding : 
							   obj.Ztrounding === "" ? a[i].Ztrounding : 
							   obj.Ztrounding;
							   
				C.Ztleadtime = a.length === 1 ? obj.ZleadTime :  
							   obj.ZleadTime === "" ? a[i].Ztleadtime : 
							   obj.ZleadTime;
							   
				C.Zapstlaneovrd = a.length === 1 ? obj.ZtLaneOvrd : 
								  obj.ZtLaneOvrd === "" ? a[i].Zapstlaneovrd.split("-")[0].trim() : 
								  obj.ZtLaneOvrd === "X" ? "" : "X";
				
				batchChanges.push(oModelP.createBatchOperation("ZBAM_SUPP_LOC_SOURCESet", "POST", C));
			}
			oModelP.addBatchChangeOperations(batchChanges);
			//var t = this;
			oModelP.submitBatch(
				function (oData, oResponse, aErrorResponses) {
					oModelP.refresh(true);
					oBusy.close();
					if (aErrorResponses.length > 0) {
						sap.m.MessageBox.error( MaterialValueHelp.handlErrorResponse(aErrorResponses[0]) );
					} else {
						that.onDataSubmitted = true;
						sap.m.MessageBox.success("Records Updated Successfully");
					}
					
					that.setSubmitCheck();
				},
				function(oError){
					oBusy.close();	
					MessageBox.warning( MaterialValueHelp.handlErrorResponse(oError) );
				}
			);	
		},
		
		setSubmitCheck: function () {
			this.getOwnerComponent().getModel("check").param = "edit/didNotSubmit";
			
			if (this.onDataSubmitted === true) {
				this.getOwnerComponent().getModel("check").param = "edit/submitted";
			}
		},

	});

});