sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
	"use strict";
	var that;

	return Controller.extend("com.ey.bamlocsrcattr.controller.RootView", {

		onInit: function () {
			/*this.oBusy = new sap.m.BusyDialog({
				text: "Services are loading..."
			});
			oBusy.open();*/
			that = this;
			var oBusy = new sap.m.BusyDialog({
				text: "Services are loading..."
			});
			
			oBusy.open();
			
			this.Mockserver();
			// this.createTempModel();
			
			$.when(
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPP_LOC_SOURCE_SRV/ZBAM_LOC_FROM_SEARCHSet",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8",
					error: function(error){
						oBusy.close();
						MessageBox.error(error.responseText);
					}
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPP_LOC_SOURCE_SRV/ZBAM_LOC_SOURCE_SEARCHSet",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8",
					error: function(error){
						oBusy.close();
						MessageBox.error(error.responseText);
					}
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPP_LOC_SOURCE_SRV/ZBAM_MOT_SEARCHSet",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8",
					error: function(error){
						oBusy.close();
						MessageBox.error(error.responseText);
					}
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPP_LOC_SOURCE_SRV/ZBAM_MATERIAL_SEARCHSet",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8",
					error: function(error){
						oBusy.close();
						MessageBox.error(error.responseText);
					}
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPP_LOC_SOURCE_SRV/ZBAM_SUPPLY_HCD_SEARCHSet?$filter=ParamName eq 'ZTRANSPORTATIONCONST'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8",
					error: function(error){
						oBusy.close();
						MessageBox.error(error.responseText);
					}
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPP_LOC_SOURCE_SRV/ZBAM_SUPPLY_HCD_SEARCHSet?$filter=ParamName eq 'ZAPSTLANEOVRD'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8",
					error: function(error){
						oBusy.close();
						MessageBox.error(error.responseText);
					}
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPP_LOC_SOURCE_SRV/ZBAM_ATTR_SECURITYSet",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8",
					error: function(error){
						oBusy.close();
						MessageBox.error(error.responseText);
					}
				})
			).done((locationFrom, locationTo, modeOfTransport, product, hcd, tlane, security) => {
				var global = sap.ui.getCore().getModel("global"),
					temp,
					oData;
				
				/*Location From F4 Data*/
				if(locationFrom[1] === "success"){
					if(locationFrom[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_LOC_FROM_SEARCHSet");
					}else{
						oData = locationFrom[0].d.results;
						/*oData.unshift({
							"Locno_From": "",
							"Locfromdesc": "Please Select"
						});*/
						global.getData().root[0].LocationFromF4 = oData;	
					}
				}else{
					MessageBox.error(locationFrom[1]);
				}
				
				/*Location To F4 Data*/
				if(locationTo[1] === "success"){
					if(locationTo[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_LOC_SOURCE_SEARCHSet");
					}else{
						oData = locationTo[0].d.results;
						/*oData.unshift({
							"Locno_To": "",
							"Loctodesc": "Please Select"
						});*/
						global.getData().root[0].LocationToF4 = oData;	
					}
				}else{
					MessageBox.error(locationTo[1]);
				}
				
				/*Mode of Transport Data*/
				if(modeOfTransport[1] === "success"){
					if(modeOfTransport[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_MOT_SEARCHSet");
					}else{
						oData = modeOfTransport[0].d.results;
						// oData.map((item) => {
						// 	if(!item.MoT.match(/[A-za-z]\w/) && item.MoT.match(/\w/) !== null){
						// 		item.MoT = item.MoT.match(/[1-9]\d*/g)[0];
						// 	}
						// }, this);
							
						global.getData().root[0].ModeOfTransportF4 = oData;
					}
				}else{
					MessageBox.error(modeOfTransport[1]);
				}
				
				/*Product F4 Data*/
				if(product[1] === "success"){
					if(product[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_MATERIAL_SEARCHSet");
					}else{
						oData = product[0].d.results;
						oData.map((item) => {
							if(!item.Matnr.match(/[A-za-z]\w/) && item.Matnr.match(/\w/) !== null){
								item.Matnr = item.Matnr.match(/[1-9]\d*/g)[0];
							}
						}, this);
							/*oData.unshift({
								"Matnr": "",
								"Maktx": "Please Select"
							});*/
						global.getData().root[0].ProductF4 = oData;
					}
				}else{
					sap.m.MessageBox.error(product[1]);
				}
				
				/*HCD dropdown Data*/
				if(hcd[1] === "success"){
					if(hcd[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSet");
					}else{
						oData = hcd[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].TransportConst = oData;
						global.getData().root[0].TransportConstkey = oData[1].ParamValue;
						global.getData().root[0].ApsTransportConstkey = oData[1].ParamValue;
					}
				}else{
					MessageBox.error(hcd[1]);
				}
				
				if(tlane[1] === "success"){
					if(tlane[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSet");
					}else{
						oData = tlane[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].TLaneOverRide = oData;
						//global.getData().root[0].TransportConstkey = oData[1].ParamValue;
					}
				}else{
					MessageBox.error(tlane[1]);
				}
				
				if(security[1] === "success"){
					if(security[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_ATTR_SECURITYSet");
					}else{
						oData = security[0];
						this.getModel("security").setProperty("/", oData, null, false);
					}
				}else{
					MessageBox.error(security[1]);
				}
				
				global.refresh();
				temp = $.extend(true, {}, global.getData()); // Changes by Ruthvik
				this.getModel("temp").setProperty("/", temp, null, false);
					
				oBusy.close();
				
			}, this);
		},
		
		Mockserver: function () {
			var data = {
				"root": [{
					"LocationFrom": "",
					"OldLocationFrom": "",
					"LocationTo": "",
					"OldLocationTo": "",
					"ModeOfTransport": "",
					"Product": "",
					"TransportConstkey": "",
					"ApsTransportConstkey": "",
					"TransportReceipt": "",
					"MaxLotSize" : "",
					"MinLotSize" : "",
					"Rounding" : "",
					"LeadTime" : "",
					"TlaneOvrd" : "",
					
					"disableOnSubmit": true, 
					"userSubmitted": false, 

					"LocationFromF4": [],
					"LocationToF4": [],
					"ModeOfTransportF4": [],
					"ProductF4": [],
					"TransportConst": [],
					"TLaneOverRide": [
						// { "ParamText": "Please Select", "ParamValue": "" },
						// { "ParamText": "YES", "ParamValue": "Y" },
						// { "ParamText": "NO", "ParamValue": "X" }
					],
					
					//changes by Ruthvik
					icon: "sap-icon://error",
					iconColor: "white",
					materialState: "None",
					countryState: "None"

				}]
			};
			var model = new JSONModel(data);
			model.setSizeLimit(1000);
			
			this.getView().setModel(model);
			sap.ui.getCore().setModel(model, "global");
		},
		
		getModel: function(oModel) {
			return this.getOwnerComponent().getModel(oModel);
		}

	});

});