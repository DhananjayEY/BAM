/*
	global XLSX 
	eslint > : "off"
*/

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"../helper/productLevel",
	"../helper/material"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast, MessageBox, ProductValueHelp, MaterialValueHelp) {
	"use strict";
	var that;

	return Controller.extend("com.ey.bamlocsrcattr.controller.CreateLocation", {
		
		onInit: function () {
			this.indexErrorValidation = {};
			this.errorData = [];
			
			that = this;
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.getRoute("CreateLocation").attachPatternMatched(this._onObjectMatched, this);
			//this._oInput();
		},

		_onObjectMatched: function () {
			this.onDataSubmitted = false;
			//this.tableCoulmnhide();
			this.getView().byId("fileUploader").setValue("");
			this.getView().byId("Submit").setEnabled(true);
			
			var rModel = this.getView().getModel(),
				temp = $.extend(true, {}, this.getOwnerComponent().getModel("temp").getData().root[0]);
				//_aTypeMatnr = this.getOwnerComponent().getModel("sParamUI").getData()._aTypeMatnr;

			rModel.getData().root.splice(1); /* Keep only one item and delete the rest */
			this.getView().byId("statusCol").setVisible(false);
			//this.getView().byId("matnrDesc").setVisible(false);

			rModel.getData().root.forEach(function (oItem) {
				oItem.LocationFrom = "";
				oItem.LocationTo = "";
				oItem.ModeOfTransport = "";
				oItem.Product= "";
				oItem.TransportConstkey= temp.TransportConstkey;
				oItem.TransportReceipt= "";
				oItem.MaxLotSize = "";
				oItem.MinLotSize = "";
				oItem.Rounding = "";
				oItem.LeadTime = "";
				oItem.TlaneOvrd = oData.TLaneOverRide[2].ParamValue;
				
				oItem.disableOnSubmit = true;	
				oItem.userSubmitted = false;	
			/*	oItem.materialState = "None"; 
				oItem.countryState = "None"; */
			});
			rModel.refresh();
			
			if( rModel.getData().root.length === 0 ){
			 	this.onAddCorp();
			 }
		},
		
		onNavBack: function () {
			this.getOwnerComponent().getModel("check").param = "create/didNotSubmit";
			
			if(this.onDataSubmitted === true){
				this.getOwnerComponent().getModel("check").param = "create/submitted";
			}
			this.router.navTo("LocationAtrributes", {}, true);
			
		},
		
		onAddCorp: function () {
			
			var data = $.extend(true, {}, this.getOwnerComponent().getModel("temp").getData().root[0]);

			var bRow = {
				LocationFrom: "",
				LocationTo: "",
				ModeOfTransport: "",
				Product: "",
				TransportConstkey: data.TransportConstkey,
				TransportReceipt: "",
				MaxLotSize: "",
				MinLotSize: "",
				Rounding: "",
				LeadTime: "",
				TlaneOvrd: oData.TLaneOverRide[2].ParamValue,
				
				LocationFromF4: data.LocationFromF4,
				LocationToF4: data.LocationToF4,
				ModeOfTransportF4: data.ModeOfTransportF4,
				ProductF4: data.ProductF4,
				TransportConst: data.TransportConst,
				
				disableOnSubmit: true,
				userSubmitted: false,
			};

			this.getView().getModel().getData()["root"].push(bRow);
			this.getView().getModel().refresh(true);
			
			this.getView().byId("Submit").setEnabled(true);
		},
		
		onDelete: function (evt) {
			var index = Number(evt.getSource().getBindingContext().getPath().split('/')[2]),
				cMdl = this.getView().getModel();
			var root = cMdl.getData().root;
			root.splice(index, 1);
			cMdl.refresh();
			
			if(this.errorData !== undefined && this.errorData.length !== 0){
				this.errorData.splice(index, 1);
				this.getView().getModel("errorModel").setData({results: this.errorData});
				this.getView().getModel("errorModel").refresh(true);
				this.getView().getModel("errorModel").updateBindings(true);
			}else{
				this.getView().byId("statusCol").setVisible(false);
			}
			
			var count = 0,
				flag = true;
			this.errorData.forEach((item) => {
				if(item.userSubmitted === true){
					count++;
					//flag = false;
				}
			}, this);
			
			if(count !== 0){
				if(count === this.errorData.length){
					flag = false;
				}	
			}
			
			this.getView().byId("Submit").setEnabled(flag);
		},
		
		handleUploadPress: function (oEvent) {
			var oFileUpload = this.getView().byId('fileUploader');
			that = this;
			if (!oFileUpload.getValue()) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				sap.m.MessageBox.information(
					"Choose File First", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}

				);
			} else {
				var file = oFileUpload.getFocusDomRef().files[0];
				if (file && window.FileReader) {
					var reader = new FileReader(); // Create file Reader Object
					reader.onload = function (e) {
						var data = e.target.result;
						var workbook = XLSX.read(data, {
							type: 'binary'
						});
						that.ExcelCSVJson(workbook);

					};
					reader.readAsBinaryString(file);
				}
			}
		},
		
		checkFileValidity: function(workbook){
			
			var sheets = Object.keys(workbook.Sheets),
				worksheet = workbook.Sheets[sheets[0]],
				columns = XLSX.utils.decode_range(worksheet['!ref']).e.c + 1,
				headers = [],
				defaultHeaders = [], 
				count = 0;
				
			for(var i=0; i < columns; ++i){
			    headers[i] = worksheet[`${XLSX.utils.encode_col(i)}1`].v;
			}
			
			defaultHeaders = [
					"Ship-From Loc. ID", "Location ID", "Mode of Transportation ID", "Product ID", "Transportation Constraint", 
					"Transportation Receipt Frozen Zone", "Maximum Transportation Lot Size", "Minimum Transportation Lot Size", 
					"Lot Size Rounding Value for Transportation", "Transportation Lead Time", "APS T Lane Override" 
				],
			count = 0;
					
			var items = headers.filter((item, index) => {
				defaultHeaders.forEach((oItem, oIndex) => {
					if(item.trim().toLowerCase() === oItem.toLowerCase() ){
						count++;
					}
				}, this);
			}, this);
			
			return count === defaultHeaders.length;
			
			
		},
		
		ExcelCSVJson: function (workbook, evt) {
			var result = this.checkFileValidity(workbook);
			if(!result){
				sap.m.MessageBox.error("Column Headers not matching with template. Please download template and try again");
				this.getView().getModel().setProperty('/root', [], null, true);
				return;
			}
			
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			//this._source = "onExcelUpload";
			
			var xl_Row_Object,
				tMdl,
				obj = [];

			xl_Row_Object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);

			if (xl_Row_Object.length > 200) {
				sap.m.MessageBox.warning("Maximum number of line items is 200");
				xl_Row_Object.splice(200);
			}
			
			if(this.errorData === undefined || this.errorData.length === 0){
				this.getView().byId("statusCol").setVisible(false);
			}
			
			tMdl = this.getOwnerComponent().getModel("temp");
			
			/*xl_Row_Object.map((oItem, oIndex) => {
				oItem["Mode of Transportation ID"] = oItem["Mode of Transportation ID"].split("-")[0];
				oItem["Transportation Constraint"] = oItem["Transportation Constraint"].split("-")[0];
			}, this);*/
			
			try{
				xl_Row_Object.forEach((oItem) => {
					obj.push(Object.fromEntries(Object.entries(oItem)
						.map(([key, value]) =>
							key.trim().toLowerCase() === "Ship-From Loc. ID".toLowerCase() ? [key = "LocationFrom", value]:
							key.trim().toLowerCase() === "Location ID".toLowerCase() ? [key = "LocationTo", value]:
							key.trim().toLowerCase() === "Product ID".toLowerCase() ? [key = "Product", value]:
							key.trim().toLowerCase() === "Mode of Transportation ID".toLowerCase() ? [key = "ModeOfTransport" , value = value.split("-")[0]]:
							key.trim().toLowerCase() === "Transportation Constraint".toLowerCase() ? [key = "TransportConstkey", value = value.split("-")[0]]:
							key.trim().toLowerCase() === "Transportation Receipt Frozen Zone".toLowerCase() ? [key = "TransportReceipt", value] :
							key.trim().toLowerCase() === "Maximum Transportation Lot Size".toLowerCase() ? [key = "MaxLotSize", value] : 
							key.trim().toLowerCase() === "Minimum Transportation Lot Size".toLowerCase() ? [key = "MinLotSize", value] : 
							key.trim().toLowerCase() === "Lot Size Rounding Value for Transportation".toLowerCase() ? [key = "Rounding", value] : 
							key.trim().toLowerCase() === "Transportation Lead Time".toLowerCase() ? [key = "LeadTime", value] : 
							key.trim().toLowerCase() === "APS T Lane Override".toLowerCase() ? [key = "TlaneOvrd", value] : null )));
				}, this);
			}
			catch(error){
				MessageBox.error("Incorrect excel mapping");
			}

			var data = [],
				modelValues = tMdl.getData().root[0];
				
			obj.forEach(function (oItem, index) {
				
				oItem.TlaneOvrd = oItem.TlaneOvrd.split("-")[0].trim() === "X" ? "Y" : "X"
				
				oItem.LocationFromF4 = modelValues.LocationFromF4;
				oItem.LocationToF4 = modelValues.LocationToF4;
				oItem.ModeOfTransportF4 = modelValues.ModeOfTransportF4;
				oItem.TransportConst = modelValues.TransportConst;
				oItem.TLaneOverRide = modelValues.TLaneOverRide;
				
				/*** Dec 3rd: Changes by Ruthvik  ***/
				
				oItem.countryState = modelValues.countryState;
				oItem.disableOnSubmit = modelValues.disableOnSubmit;
				oItem.icon = modelValues.icon;
				oItem.iconColor = modelValues.iconColor;
				oItem.materialState = modelValues.materialState;
				oItem.userSubmitted = modelValues.userSubmitted;
				
				/*** Dec 3rd: Changes by Ruthvik  ***/
				
				data.push(oItem);

			}, this);
			
			var promise = new Promise((resolve, reject) => {
				resolve( this.getView().getModel().setProperty('/root', data, null, true) );
			}, this);
			
			promise.then(() => {
				oBusy.close();
			}, this);
			
		},
		
		/*handleFileChange: function(oEvent){
			switch( oEvent.getParameter("newValue") ){
				case "Location_Source_BAM_Upload_template.xlsx":
					break;
				default: 
					sap.m.MessageBox.error("File name doesn't match with the template. Please download template and try again");
					oEvent.getSource().setValue("");
			}	
		},*/
		
		onLiveChange: function(oEvent){
			if(oEvent.getSource().getValue().length === 1){
				oEvent.getSource().setValue("");
			}else{
				var temp = oEvent.getSource().getValue().split("");
				temp.splice(temp.length - 1);
				oEvent.getSource().setValue(temp.join(""));
			}
			
			MessageToast.show("Please select value from value help", {
				duration: 1500
			});
		},
		
		onTransportReceiptChange: function(oEvent){
			var value = Number(oEvent.getSource().getValue());
			if(value > 52){
				oEvent.getSource().setValue("");
			}
		},
		
		onDownloadTemplate: function(oEvent){
			
			window.open(sap.ui.require.toUrl("com/ey/bamlocsrcattr/templates") + 
								"/Location_Source_BAM_Upload_template.zip", "_self");
		},
		
		onSubmit: function () {
			var a = this.getView().getModel().getData().root,
				that = this,
				sURI = '/sap/opu/odata/sap/ZBAM_SUPP_LOC_SOURCE_SRV/',
				oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
				
			sap.ui.getCore().setModel(oModelP);

			var temp = $.extend(true, {}, this.getOwnerComponent().getModel("temp").getData().root[0]),
				oBusy = new sap.m.BusyDialog();
				
			oBusy.open();
			
			var batchChanges = [],
				i;
			for (i = 0; i < a.length; i++) {
				
				if(a[i].TransportConstkey === ""){					/*Populate default IBPRelevancykey in case value gets lost*/
					a[i].TransportConstkey = temp.TransportConstkey;
				}
				
				this.indexErrorValidation[i] = "Submitted";
				if(a[i].userSubmitted === false){
					
					this.indexErrorValidation[i] = "NotSubmitted";
					var C = {};
					C.Trtyp = 'H';
					C.LocnoFrom = a[i].LocationFrom;
					// C.Sort1 = a[i].Sort1;
					C.LocnoTo = a[i].LocationTo;
					C.MotId = a[i].ModeOfTransport;
					C.Matnr = a[i].Product;
					C.Ztransportationconst = a[i].TransportConstkey;
					C.Zfrozenhorizontreceipt = a[i].TransportReceipt === "" ? "0" : a[i].TransportReceipt;
					C.Ztmaxlotsize = a[i].MaxLotSize;
					C.Ztminlotsize = a[i].MinLotSize;
					C.Ztrounding = a[i].Rounding;
					C.Ztleadtime = a[i].LeadTime;
					C.Zapstlaneovrd = a[i].TlaneOvrd === "X" ? "" : "X";
					
					jQuery.sap.log.info(C);
					batchChanges.push(oModelP.createBatchOperation("ZBAM_SUPP_LOC_SOURCESet", "POST", C));
				}
			}
			oModelP.addBatchChangeOperations(batchChanges);
			oModelP.submitBatch(
				function (oData, oResponse, aErrorResponses) {
					oModelP.refresh(true);
					if (aErrorResponses.length > 0) {
						that.dialogErrorMessage(aErrorResponses[0].response);
					} else {
						that.locationSourceCreated(oData.__batchResponses[0].__changeResponses);
					}
					oBusy.close();
					that.setSubmitCheck();
				},
				function(oError){
					var parser = new DOMParser(),
						xmlDoc = parser.parseFromString(oError.response.body, "text/xml"),
						errorMessage = xmlDoc.querySelector("message").firstChild.nodeValue;
					
					oBusy.close();	
					MessageBox.warning(errorMessage);
				}
			);
			
		},
		
		setSubmitCheck: function () {
			this.getOwnerComponent().getModel("check").param = "create/didNotSubmit";
			
			if (this.onDataSubmitted === true) {
				this.getOwnerComponent().getModel("check").param = "create/submitted";
			}
		},
		
		dialogErrorMessage: function (response) {

			var errorbackend;
			if (response) {
				var sBody = response.body;
				if (sBody) {
					var indexValue = sBody.indexOf("message");
					var indexValueEnd = sBody.substring(indexValue).indexOf("}");
					if (indexValueEnd > -1) {
						errorbackend = sBody.substring(indexValue + 8, indexValue + indexValueEnd - 1);
					} else {
						var oBody = jQuery.parseXML(sBody);
						errorbackend = oBody.getElementsByTagName("message")[0].childNodes[0].nodeValue;
					}
				}
			}
			
			sap.m.MessageBox.error(errorbackend);

			/*if (!this.ErrorDialog) {
				this.ErrorDialog = sap.ui.xmlfragment("APP.ZBAM_ATTR_MANG.fragment.Error", this);
			}
			this.ErrorDialog.open();*/
		},
		
		locationSourceCreated: function (response) {
			var i,
				j = 0,
				datarow = [],
				indices = [],
				oModel,
				flag = true,
				count = 0;
			
			this.getView().byId("statusCol").setVisible(true);
			
			for( var key in this.indexErrorValidation ){
				if(this.indexErrorValidation[key] === "NotSubmitted"){
					indices.push(key);
				}
			}
			
			for (i = 0; i < response.length; i++) {
				;
				var pdata = this.getView().getModel().getData().root[indices[i]],
					itms = {};
				
				itms.LocationFrom = response[i].data.LocnoFrom;
				itms.LocationTo = response[i].data.LocnoTo;
				itms.ModeOfTransport = response[i].data.MotId;
				itms.Product = response[i].data.Matnr;
				itms.TransportConstkey = response[i].data.Ztransportationconst;
				itms.TransportReceipt = response[i].data.Zfrozenhorizontreceipt;
				
				itms.Msgtxt = response[i].data.Msgtxt;
				itms.Msgtype = response[i].data.Msgtype;
				datarow[j] = itms;
				j++;
				
				if(pdata.userSubmitted === false){
					
					if (response[i].data.Msgtype === "E") {
						pdata.iconColor = "red";
						pdata.icon = "sap-icon://error";
						datarow[i].userSubmitted = false;
					}else {
						/*pdata.materialState = "None";
						pdata.countryState = "None";*/
						pdata.iconColor = "green";
						pdata.icon = "sap-icon://complete";
						pdata.disableOnSubmit = false;
						pdata.userSubmitted = true;
						datarow[i].userSubmitted = true;
						this.onDataSubmitted = true;
					}
					
					// if (response[i].data.Matnr === "") {
					// 	//pdata.materialState = "Error";
					// 	pdata.iconColor = "red";
					// 	pdata.icon = "sap-icon://error";
					// }else {
					// 	//pdata.materialState = "None";
					// }
					
					// if (response[i].data.Country === "") {
					// 	//pdata.countryState = "Error";
					// 	pdata.iconColor = "red";
					// 	pdata.icon = "sap-icon://error";
					// } else {
					// 	//pdata.countryState = "None";
					// }
					
				}else{
					continue;
				}
						
			}
			
			for(var i=0; i<datarow.length; i++){
				this.errorData[indices[i]] = datarow[i];
			}
			oModel = new JSONModel({results: this.errorData});
			
			this.errorData.forEach((item) => {
				if(item.userSubmitted === true){
					count++;
					//flag = false;
				}
			}, this);
			
			if(count === this.errorData.length){
				flag = false;
			}
			
			this.getView().byId("Submit").setEnabled(flag);
			
			this.getView().setModel(oModel, "errorModel");
			this.getView().getModel().refresh(true);
			this.getView().getModel().updateBindings(true);

			if (!datarow[0]) {
				sap.m.MessageBox.success(
					"Records Submitted Successfully"
				);
			}

		},
		
		onIconPress: function (oEvent) {
			var err = this.getView().getModel("errorModel").getData().results,
				index = Number(oEvent.getSource().getBindingContext().getPath().match(/\d[0-9]*/g)[0]);
			
			if(err[index].Msgtxt){
				sap.m.MessageBox.error(err[index].Msgtxt);
			}else{
				sap.m.MessageBox.success("Product "+ err[index].Product + " Location Source Attributes have been created");
			}
			
			/*** Nov 19th Changes: Ruthvik***/
		},
		
		onLocationFromF4: function(oEvent){
			var props = ["locationFrom", "Ship-From Loc. ID", "/ZBAM_LOC_FROM_SEARCHSet", "{Locno_From}", "{Locfromdesc}", 
						"LocationFrom", "LocationFromF4"],
				index = Number(oEvent.getSource().getBindingContext().getPath().match(/\d/)[0]);
			this.genericF4(oEvent, props, index);
		},
		
		onLocationToF4: function(oEvent){
			var props = ["locationTo", "Location ID", "/ZBAM_LOC_SOURCE_SEARCHSet", "{Locno_To}", "{Loctodesc}", "LocationTo", 
						"LocationToF4"],
				index = Number(oEvent.getSource().getBindingContext().getPath().match(/\d/)[0]);
			this.genericF4(oEvent, props, index);
		},
		
		onMotF4: function(oEvent){
			var props = ["mot", "Mode of Transportation ID", "/ZBAM_MOT_SEARCHSet", "{MoT}", "{Bezei}", "ModeOfTransport", 
						"ModeOfTransportF4"],
				index = Number(oEvent.getSource().getBindingContext().getPath().match(/\d/)[0]);
			this.genericF4(oEvent, props, index);
		},
		
		/*onProductIDF4: function(oEvent){
			var props = ["productID", "Product ID", "/ZBAM_MATERIAL_SEARCHSet", "{Matnr}", "{Maktx}", "Product", "ProductF4"],
				index = Number(oEvent.getSource().getBindingContext().getPath().match(/\d/)[0]);
			this.genericF4(oEvent, props, index);
		},*/
		
		genericF4: function(oEvent, props, index){
			var global = $.extend(true, {}, this.getOwnerComponent().getModel("temp").getData().root[0]);
			if(!this.getView().getModel(props[0])){
				var oModel = new JSONModel();
				this.getView().setModel(oModel, props[0]);
			}else{
				oModel = this.getView().getModel(props[0]);
			}
			
			this.oGenericDialog = new sap.m.SelectDialog({
					title: props[1],
					noDataText: "No Data Found",
					titleAlignment: "Center",
					// search: this.genericSearch(evt),
					liveChange: function(oEvent){
						
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
					confirm: function(evt){
						//aEvent.getSource().setValue(evt.getParameter("selectedItem").getTitle());
						this.getView().getModel().getData().root[index][props[5]] = evt.getParameter("selectedItem").getTitle();
						this.getView().getModel().updateBindings(true);
					}.bind(this),
					cancel: function(oEvent){
						
						oEvent.getSource().getBinding("items").filter([]);
						this.oGenericDialog.destroy();
					}.bind(this)
				});
			
			oModel.setProperty(props[2], global[props[6]]);
			this.oGenericDialog.setModel(oModel);
			
			var itemTemplate = new sap.m.ObjectListItem({
				title: props[3],
				attributes: [{
					text: props[4]
				}]
			});
			this.oGenericDialog.bindAggregation("items", props[2], itemTemplate);
			
			this.oGenericDialog.open();
		},
		
		genericSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("Locno_From", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter2 = new sap.ui.model.Filter("Locfromdesc", sap.ui.model.FilterOperator.Contains, sValue);
			var combinedFilter = new sap.ui.model.Filter({
				filters: [oFilter, oFilter2],
				and: false
			});
			var oBinding = oEvent.getSource().getBinding("items");
			if (!sValue || sValue === "") {
				oBinding.filter([]);
				return;
			}
			oBinding.filter(combinedFilter);
		},
		
		onMatnrF4: function (oEvent) {
			MaterialValueHelp.ValueHelp(oEvent, this);
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

	});

});