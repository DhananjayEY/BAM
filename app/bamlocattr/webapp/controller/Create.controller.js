/*
	global XLSX 
	eslint > : "off"
*/

sap.ui.define([
	"sap/ui/core/mvc/Controller",

	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/SearchField"
], function (Controller, JSONModel, Export, ExportTypeCSV, Filter, FilterOperator, SearchField) {
	"use strict";

	return Controller.extend("com.ey.bamlocattr.controller.Create", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ey.bamlocattr.view.Create
		 */
		onInit: function () {
			this.indexErrorValidation = {};
			this.errorData = [];

			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.getRoute("Create").attachPatternMatched(this._onObjectMatched, this);
			this.LocationLvl1();
		},
		LocationLvl1: function () {

			this._locationLvl = this.getView().byId("locationLvl");
			this.oColLocLvl = new JSONModel(sap.ui.require.toUrl("com/ey/bamlocattr/controller") + "/columnsLocModel.json");
			var jsonModelLocLvl = {
				LocID: null,
				Name1: null

			};
			var oModel = new sap.ui.model.json.JSONModel(jsonModelLocLvl);

			this.getView().setModel(oModel, "listJSONLocLvl");
			(oModel);
		},

		onNavBack: function () {

			this.getOwnerComponent().getModel("check").param = "create/didNotSubmit";

			if (this.onDataSubmitted === true) {
				this.getOwnerComponent().getModel("check").param = "create/submitted";
			}

			this.router.navTo("Mainlocation");
		},
		_onObjectMatched: function () {
			this.onDataSubmitted = false;

			var rModel = this.getView().getModel("oModel"),
				temp = $.extend(true, {}, this.getOwnerComponent().getModel("oModel").getData());

			rModel.getData().oData.splice(1); /* Keep only one item and delete the rest */
			this.getView().byId("statusCol").setVisible(false);
			this.getView().byId("Submit").setEnabled(true);

			rModel.getData().oData.forEach(function (oItem) {
				//oItem.MacroLocation = "";
				oItem.Location = "";
				oItem.SupplyLocationDescriptionkey = "";
				oItem.SupplyAggrLocationTypekey = "";
				oItem.SupplyLocationPlatform = "";
				oItem.SupplyLocationPlatformkey = temp.SupplyLocationPlatform[2].ParamValue;
				oItem.SupplyActivity = "";
				oItem.SupplyActivitykey = temp.SupplyActivity[3].ParamValue;
				oItem.SupplyRegion = "";
				oItem.SupplyRegionDescription = "";

				oItem.disableOnSubmit = true;
				oItem.userSubmitted = false;
			});
			rModel.refresh();
			
			this.getView().byId("fileUploader").setValue("");

		},

		onAddCorp: function () {

			var cMdl = this.getOwnerComponent().getModel("oModel");
			var data = {
				"MacroLocation": "",
				"Location": "",
				"SupplyLocationDescriptionkey": "",
				"SupplyAggrLocationTypekey": "",
				"SupplyLocationPlatform": "",
				"SupplyLocationPlatformkey": cMdl.getData().SupplyLocationPlatform[1].ParamValue,
				"SupplyActivity": "",
				"SupplyActivitykey": cMdl.getData().SupplyActivity[2].ParamValue,
				"SupplyRegion": "",
				"SupplyRegionDescription": "",

				"disableOnSubmit": true,
				"userSubmitted": false,
				"icon": "sap-icon://error",
				"iconColor": "white"
			};

			cMdl.getData().oData.push(data);
			cMdl.refresh();

			this.getView().byId("Submit").setEnabled(true);
		},
		/*onChangeSupplyLoctype: function (oEvent) {

			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/SupplyAggrLocationType", oEvent.getSource().getValue());
		},
		onChangeSupplyLocform: function (oEvent) {

			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/SupplyLocationPlatform", oEvent.getSource().getValue());
		},
		onChangeSupplyact: function (oEvent) {

			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/SupplyActivity", oEvent.getSource().getValue());
		},*/
		onChangesupplyreg: function (oEvent) {

			/*var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/SupplyRegion", oEvent.getSource().getValue());*/

			var oItem = oEvent.getParameter("selectedItem").getProperty("text").split("-")[1].trim(),
				path = oEvent.getSource().getBindingContext('oModel').getPath();

			if (oItem == "Please Select") {
				oItem = oEvent.getParameter("selectedItem").getProperty("key")
			}
			this.getView().getModel("oModel").setProperty(path + "/SupplyRegionDescription", oItem, null, true);
		},

		onListItemChange: function (oEvent) {
			/*if (!oEvent.getParameter("itemPressed")) {
				oEvent.getSource().setValue("");
				sap.m.MessageToast.show("Please select from dropdown", {
					duration: 1100
				});
				return;
			}*/

			var path = oEvent.getSource().getBindingContext('oModel').getPath();
			this.getView().getModel("oModel").setProperty(path + "/SupplyRegion", oEvent.getSource().getValue());

			var oItem = oEvent.getParameter("selectedItem").getProperty("text").split("-")[1].trim(),
				index = parseInt(oEvent.getParameter('selectedItem').oPropagatedProperties.oBindingContexts.oModel.sPath.match(/\d/)[0], 10);
			this.getView().getModel("oModel").setProperty("/oData/" + index + "/SupplyRegionDescription", oItem, null, true);
		},

		onDelete: function (evt) {

			var index = Number(evt.getSource().getBindingContext("oModel").getPath().split('/')[2]),
				cMdl = this.getOwnerComponent().getModel("oModel");
			var crop = cMdl.getData().oData;
			crop.splice(index, 1);
			cMdl.refresh();

			var count = 0,
				flag = true;
			this.errorData.forEach((item) => {
				if (item.userSubmitted === true) {
					count++;
					//flag = false;
				}
			}, this);

			if (count !== 0) {
				if (count === this.errorData.length) {
					flag = false;
				}
			}

			this.getView().byId("Submit").setEnabled(flag);
		},

		handleUploadPress: function (oEvent) {
			var oFileUpload = this.getView().byId('fileUploader');
			var that = this;
			if (!oFileUpload.getValue()) {
				// sap.m.Message.show('Choose File First')
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
		onDownloadTemplate: function (oEvent) {

			window.open(sap.ui.require.toUrl("com/ey/bamlocattr/templates") +
				"/Location_BAM_Upload_template.zip", "_self");

		},

		checkFileValidity: function (workbook) {

			var sheets = Object.keys(workbook.Sheets),
				worksheet = workbook.Sheets[sheets[0]],
				columns = XLSX.utils.decode_range(worksheet['!ref']).e.c + 1,
				headers = [],
				defaultHeaders = [],
				count = 0;

			for (var i = 0; i < columns; ++i) {
				headers[i] = worksheet[`${XLSX.utils.encode_col(i)}1`].v;
			}

			defaultHeaders = ["Location ID", "Supply Location Description", "Supply Location Type",
					"Supply Location Platform", "Supply Activity", "Supply Region ID", "Supply Region Description"
				],
				count = 0;

			var items = headers.filter((item, index) => {
				defaultHeaders.forEach((oItem, oIndex) => {
					if (item.toLowerCase() === oItem.toLowerCase()) {
						count++;
					}
				}, this);
			}, this);

			return count === defaultHeaders.length
		},

		ExcelCSVJson: function (workbook, evt) {
			var result = this.checkFileValidity(workbook);
			if (!result) {
				sap.m.MessageBox.error("Column Headers not matching with template. Please download template and try again");
				this.getView().getModel("oModel").setProperty('/oData', [], null, true)
				return;
			}

			var oBusy = new sap.m.BusyDialog();
			oBusy.open();

			var xl_Row_Object,
				tMdl,
				obj = [];

			xl_Row_Object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);

			if (xl_Row_Object.length > 200) {
				sap.m.MessageBox.warning("Maximum number of line items is 200");
				xl_Row_Object.splice(200);
			}

			if (tMdl !== undefined) {
				tMdl = this.getView().getModel();
			} else {
				tMdl = this.getView().getModel("oModel");
			}

			var data = [],
				modelValues = tMdl.getData().oData[0];
			
			try{
				xl_Row_Object.forEach((oItem) => {
					obj.push(Object.fromEntries(Object.entries(oItem)
						.map(([key, value]) =>
							key.trim().toLowerCase() === "Location ID".toLowerCase() ? [key = "Location", value] :
							key.trim().toLowerCase() === "Supply Location Description".toLowerCase() ? [key = "SupplyLocationDescriptionkey", value] :
							key.trim().toLowerCase() === "Supply Location Type".toLowerCase() ? [key = "SupplyAggrLocationTypekey", value = value.split(
								"-")[0]] :
							key.trim().toLowerCase() === "Supply Location Platform".toLowerCase() ? [key = "SupplyLocationPlatformkey", value = value.split(
								"-")[0]] :
							key.trim().toLowerCase() === "Supply Activity".toLowerCase() ? [key = "SupplyActivitykey", value = value.split("-")[0]] :
							key.trim().toLowerCase() === "Supply Region Description".toLowerCase() ? [key = "SupplyRegionDescription", value = value.split(
								".")[1]] :
							key.trim().toLowerCase() === "Supply Region ID".toLowerCase() ? [key = "SupplyRegionkey", value = value.split("-")[0]] :
							null)));
				}, this);
			}
			catch(error) {
				MessageBox.error("Incorrect excel mapping");
			}

			/*this.getView().getModel("oModel").setData({
				oData: data
			});*/

			obj.forEach((oItem, oIndex) => {

				oItem.SupplyLocationPlatform = "";
				oItem.SupplyActivity = "";
				oItem.SupplyRegion = "";
				oItem.SupplyRegionDescription = "";

				oItem.disableOnSubmit = true
				oItem.userSubmitted = false
				oItem.icon = "sap-icon://error"
				oItem.iconColor = "white"

				data.push(oItem);

			}, this);

			var promise = new Promise((resolve, reject) => {
				resolve(this.getView().getModel("oModel").setProperty('/oData', data, null, true));
			}, this);

			promise.then(() => {
				oBusy.close();
			}, this);

		},
		onSubmit: function () {

			var a = this.getView().getModel("oModel").getData().oData;

			var sURI = '/sap/opu/odata/sap/ZBAM_SUPP_LOCATION_SRV/';
			var oModelP = new sap.ui.model.json.JSONModel();
			oModelP = new sap.ui.model.odata.ODataModel(sURI, false);
			sap.ui.getCore().setModel(oModelP);

			// var typeMatnr = this.getOwnerComponent().getModel("sParamUI").getData()._aTypeMatnr;

			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			var batchChanges = [];
			var i;
			for (i = 0; i < a.length; i++) {

				this.indexErrorValidation[i] = "Submitted";
				if (a[i].userSubmitted === false) {

					this.indexErrorValidation[i] = "NotSubmitted";

					var C = {};
					C.Trtyp = 'H';
					C.Locno = a[i].Location;
					C.Name1 = a[i].SupplyLocationDescriptionkey;
					//C.ZmacroLocation = a[i].MacroLocation;
					C.Zagloctype = a[i].SupplyAggrLocationTypekey;
					C.Zsupplylocplatform = a[i].SupplyLocationPlatformkey;
					C.Zsupplyactivity = a[i].SupplyActivitykey;
					C.Zsupplyregionid = a[i].SupplyRegionkey;
					C.Zsupplyregiondesc = a[i].SupplyRegionDescription;
					batchChanges.push(oModelP.createBatchOperation("ZBAM_SUPP_LOCATIONSet", "POST", C));
				}
			}
			oModelP.addBatchChangeOperations(batchChanges);
			var t = this;
			oModelP.submitBatch(
				function (oData, oResponse, aErrorResponses) {
					oModelP.refresh(true);
					if (aErrorResponses.length > 0) {
						t.dialogErrorMessage(aErrorResponses[0].response);
					} else {
						t.matnrAttrCreated(oData.__batchResponses[0].__changeResponses);
					}
					oBusy.close();
					t.setSubmitCheck();
				},
				function (oError) {
					var parser = new DOMParser(),
						xmlDoc = parser.parseFromString(oError.response.body, "text/xml"),
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
				this.ErrorDialog = sap.ui.xmlfragment("com.ey.bamlocattr.fragment.Error", this);
			}
			this.ErrorDialog.open();*/
		},
		matnrAttrCreated: function (response) {

			var i,
				j = 0,
				datarow = [],
				indices = [],
				oModel,
				flag = true,
				count = 0;

			this.index = 0;
			this.getView().byId("statusCol").setVisible(true);

			for (var key in this.indexErrorValidation) {
				if (this.indexErrorValidation[key] === "NotSubmitted") {
					indices.push(key);
				}
			}

			for (i = 0; i < response.length; i++) {
				;
				var pdata = this.getView().getModel("oModel").getData().oData[indices[i]],
					itms = {};

				itms.Locno = response[i].data.Locno;
				itms.Name1 = response[i].data.Name1;
				itms.Zagloctype = response[i].data.Zagloctype;
				itms.Msgtxt = response[i].data.Msgtxt;
				itms.Msgtype = response[i].data.Msgtype;
				datarow[j] = itms;
				j++;

				if (pdata.userSubmitted === false) {

					if (response[i].data.Msgtype === "E") {
						pdata.iconColor = "red";
						pdata.icon = "sap-icon://error";
						datarow[i].userSubmitted = false;
					} else {
						/*pdata.materialState = "None";
						pdata.countryState = "None";*/
						pdata.iconColor = "green";
						pdata.icon = "sap-icon://complete";
						pdata.disableOnSubmit = false;
						pdata.userSubmitted = true;
						datarow[i].userSubmitted = true;
						this.onDataSubmitted = true;
					}

				} else {
					continue;
				}

			}

			for (var i = 0; i < datarow.length; i++) {
				this.errorData[indices[i]] = datarow[i];
			}
			oModel = new JSONModel({
				results: this.errorData
			});

			this.errorData.forEach((item) => {
				if (item.userSubmitted === true) {
					count++;
					//flag = false;
				}
			}, this);

			if (count === this.errorData.length) {
				flag = false;
			}

			this.getView().byId("Submit").setEnabled(flag);

			this.getView().setModel(oModel, "errorModel");
			this.getView().getModel("oModel").refresh(true);
			this.getView().getModel("oModel").updateBindings(true);

			if (!datarow[0]) {
				//console.log(this.getView().getModel("oModel"));
				sap.m.MessageBox.success(
					"Records Submitted Successfully"
				);
			}

		},

		onIconPress: function (oEvent) {
			//this.errlogDialog.open();
			var err = this.getView().getModel("errorModel").getData().results,
				//index = Number(oEvent.getSource().getBindingContext().getPath().match(/\d[0-9]*/g)[0]);
				index = Number(oEvent.getSource().oPropagatedProperties.oBindingContexts.oModel.getPath().match(/\d[0-9]*/g)[0]);

			/*** Nov 19th Changes: Ruthvik***/

			if (err[index].Msgtxt) {
				sap.m.MessageBox.error(err[index].Msgtxt);
			} else {
				sap.m.MessageBox.success("Location  " + err[index].Locno + " Attributes have been created");
			}

			/*** Nov 19th Changes: Ruthvik***/
		},
	});

});