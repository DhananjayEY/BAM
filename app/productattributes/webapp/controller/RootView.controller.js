sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
	"use strict";
	var that;

	return Controller.extend("com.ey.productattributes.controller.RootView", {

		onInit: function () {
			
			that = this;
			var oBusy = new sap.m.BusyDialog({
				text: "Services are loading..."
			});
			
			//oBusy.open();
			
			this.Mockserver();
			this.createTempModel();
			
			$.when(
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/HT005LandSet",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'PACKAGETYPE'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'ZDSI'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'ZMASTERPLANNEDINDICATOR'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'ZPACKREGIONAL'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'ZFORMULATIONREGIONAL'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'FORMULATONID'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				/*$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'FORMULATIONDESC'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),*/
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'ZSUPPLYPORTFOLIOID'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				/*$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'ZSUPPLYPORTFOLIODESC'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),*/
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'ZSUPPLYPRODUCTCENTERID'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				/*$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'ZSUPPLYPRODUCTCENTERDESC'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),*/
				/*$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'ZAGGPRODUCT'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'ZAGGPRODDESC'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),*/
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'ZIBPSUPPLYRELEVANT'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'FCSTCONSMODE'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'ZPLANNINGSTRATEGY'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSET?$filter=ParamName eq 'FORMGROUP'",
					dataType: "json",
					async: true,
					contentType: "application/json;charset=utf-8"
				}),
				this.getOwnerComponent().getModel('security').loadData('/sap/opu/odata/sap/ZBAM_SUPPLY_PRODUCT_SRV/ZBAM_ATTR_SECURITYSET')
			).done((sellingCountry, packageType, dsi, masterPI, packageReg, formulation, formultationId, supplyPortfolio, supplyProductId, 
					supplRelevant, forecastconmode, planningstgy, formgroup) => {
					/* formulationDesc, supplyPortfolio, supplyPortDesc, supplyProductId, supplyProdDesc */
									  /* aggProd, aggProdDesc, */
				var global = sap.ui.getCore().getModel("global"),
					temp,
					oData;
				
				/*Location From F4 Data*/
				if(sellingCountry[1] === "success"){
					if(sellingCountry[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_LOC_FROM_SEARCHSet");
					}else{
						oData = sellingCountry[0].d.results;
						/*oData.unshift({
							"Locno_From": "",
							"Locfromdesc": "Please Select"
						});*/
						global.getData().root[0].SellingCountryF4 = oData;	
					}
				}else{
					MessageBox.error(sellingCountry[1]);
				}
				
				/*Package Type dropdown Data*/
				if(packageType[1] === "success"){
					if(packageType[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = packageType[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].PackageType = oData;
						global.getData().root[0].Packagetype = oData[0].ParamValue;
					}
				}else{
					MessageBox.error(packageType[1]);
				}
				
				/*DSI dropdown Data*/
				if(dsi[1] === "success"){
					if(dsi[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = dsi[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].DSI = oData;
						// global.getData().root[0].Zdsi = oData[1].ParamValue;
						global.getData().root[0].Zdsi = "";
					}
				}else{
					MessageBox.error(dsi[1]);
				}
				
				/*Master Planned Indicator dropdown Data*/
				if(masterPI[1] === "success"){
					if(masterPI[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = masterPI[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						;
						global.getData().root[0].MasterPlannedIndicator = oData;
						// global.getData().root[0].Zmasterplannedindicator = oData[2].ParamValue;
						global.getData().root[0].Zmasterplannedindicator = "";
					}
				}else{
					MessageBox.error(masterPI[1]);
				}
				
				/*Package Supply Region dropdown Data*/
				if(packageReg[1] === "success"){
					if(packageReg[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = packageReg[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].PackagingRegion = oData;
						global.getData().root[0].Zpackregional = oData[0].ParamValue;
					}
				}else{
					MessageBox.error(packageReg[1]);
				}
				
				/*Formulation Supply Region dropdown Data*/
				if(formulation[1] === "success"){
					if(formulation[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = formulation[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].FormulationRegion = oData;
						global.getData().root[0].Zformulationregional = oData[0].ParamValue;
					}
				}else{
					MessageBox.error(formulation[1]);
				}
				
				/*Supply Formulation ID dropdown Data*/
				if(formultationId[1] === "success"){
					if(formultationId[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = formultationId[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].FormulationID = oData;
						global.getData().root[0].Formulatonid = oData[0].ParamValue;
					}
				}else{
					MessageBox.error(formultationId[1]);
				}
				
				/*Supply Formulation Description dropdown Data*/
				/*if(formulationDesc[1] === "success"){
					if(formulationDesc[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = formulationDesc[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].FormulationDesc = oData;
						global.getData().root[0].Formulationdesc = oData[0].ParamValue;
					}
				}else{
					MessageBox.error(formulationDesc[1]);
				}*/
				
				/*Supply Portfolio ID dropdown Data*/
				if(supplyPortfolio[1] === "success"){
					if(supplyPortfolio[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = supplyPortfolio[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].PortfolioID = oData;
						global.getData().root[0].Zsupplyportfolioid = oData[0].ParamValue;
					}
				}else{
					MessageBox.error(supplyPortfolio[1]);
				}
				
				/*Supply Portfolio Description dropdown Data*/
				/*if(supplyPortDesc[1] === "success"){
					if(supplyPortDesc[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = supplyPortDesc[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].PortfolioDesc = oData;
						global.getData().root[0].Zsupplyportfoliodesc = oData[0].ParamValue;
					}
				}else{
					MessageBox.error(supplyPortDesc[1]);
				}*/
				
				/*Supply Product Center ID dropdown Data*/
				if(supplyProductId[1] === "success"){
					if(supplyProductId[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = supplyProductId[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].ProductID = oData;
						global.getData().root[0].Zsupplyproductcenterid = oData[0].ParamValue;
					}
				}else{
					MessageBox.error(supplyProductId[1]);
				}
				
				/*Supply Product Center Description dropdown Data*/
				/*if(supplyProdDesc[1] === "success"){
					if(supplyProdDesc[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = supplyProdDesc[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].ProductIDDesc = oData;
						global.getData().root[0].Zsupplyproductcenterdesc = oData[0].ParamValue;
					}
				}else{
					MessageBox.error(supplyProdDesc[1]);
				}*/
				
				/*IBP Supply Relevent dropdown Data*/
				if(supplRelevant[1] === "success"){
					if(supplRelevant[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = supplRelevant[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].IBPRelevant = oData;
						// global.getData().root[0].Zibpsupplyrelevant = oData[1].ParamValue;
						global.getData().root[0].Zibpsupplyrelevant = "";
					}
				}else{
					MessageBox.error(supplRelevant[1]);
				} 
				
				/*Forecast Consumption mode dropdown Data*/
				if(forecastconmode[1] === "success"){
					if(forecastconmode[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = forecastconmode[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].ZForecastConMode = oData;
					}
				}else{
					MessageBox.error(forecastconmode[1]);
				}
				
				/*Planning Strategy dropdown Data*/
				if(planningstgy[1] === "success"){
					if(planningstgy[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = planningstgy[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].ZPLANNINGSTRATEGY = oData;
						global.getData().root[0].Zplanningstrategy = "";
					}
				}else{
					MessageBox.error(planningstgy[1]);
				}
				// * Supply chain Group DropDown Data*/
			
				if(formgroup[1] === "success"){
					if(formgroup[0].d.results.length === 0){
						MessageBox.warning("No data present in ZBAM_SUPPLY_HCD_SEARCHSET");
					}else{
						oData = formgroup[0].d.results;
						oData.unshift({
							"ParamValue": "",
							"ParamText": "Please Select"
						});
						global.getData().root[0].FORMGROUP = oData;
						global.getData().root[0].Formgroup = "";
					}
				}else{
					MessageBox.error(formgroup[1]);
				}
				
				global.refresh();
				temp = $.extend(true, {}, global.getData()); // Changes by Ruthvik
				this.getOwnerComponent().getModel("temp").setData(temp);
					
				oBusy.close();
				
			}, this);
		},
		
		Mockserver: function () {
			var data = {
				"root": [{
					"PackagetypeT": "",
					"Msgtype": "",
					"Prdid": "",
					"PackagesizeT": "",
					"Packagetype": "",
					"ZdsiT": "",
					"Packagesize": "",
					"Zdsi": "",
					"ZmasterplannedindicatorT": "",
					"Zmasterplannedindicator": "",
					"ZsellingcountryT": "",
					"Zsellingcountry": "",
					"ZpackregionalT": "",
					"Zpackregional": "",
					"ZformulationregionalT": "",
					"Zformulationregional": "",
					"FormulatonidT": "",
					"Formulatonid": "",
					"FormulationdescT": "",
					"Formulationdesc": "",
					"ZsupplyportfolioidT": "",
					"Zsupplyportfolioid": "",
					"ZsupplyportfoliodescT": "",
					"Zsupplyportfoliodesc": "",
					"ZsupplyproductcenteridT": "",
					"ZsupplyproductcenterdescT": "",
					"Zsupplyproductcenterid": "",
					"FormgroupT": "",
					"Zsupplyproductcenterdesc": "",
					"Formgroup": "",
					"ZaggproductT": "",
					"ZaggproddescT": "",
					"Zaggproduct": "",
					"ZibpsupplyrelevantT": "",
					"Zaggproddesc": "",
					"Zibpsupplyrelevant": "",
					"Zplanningstrategy": "",
					"ZForConModeKey": "",
					"Zportfoliosupmanager": "",
					"Zmasterplanner": "",
					
					
					"disableOnSubmit": true, 
					"userSubmitted": false, 
					
					"SellingCountryF4": [],
					"PackageType": [],
					"DSI": [],
					"MasterPlannedIndicator": [],
					"PackagingRegion": [],
					"FormulationRegion": [],
					"FormulationID": [],
					"FormulationDesc": [],
					"PortfolioID": [],
					"PortfolioDesc": [],
					"ProductID": [],
					"ProductIDDesc": [],
					"AggragateID": [],
					"AggragateDesc": [],
					"IBPRelevant": [],
					"PlanningStrategy": [],
					
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
		createTempModel: function () {
			this.getOwnerComponent().setModel(new JSONModel(), "temp");
			this.getOwnerComponent().getModel("temp").setDefaultBindingMode("OneWay");

		}

	});

});