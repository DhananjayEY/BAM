sap.ui.define([], function () {
	
	return {
		view: {
			selection: {
				"LOCFR": "idColumnFromLocation",
				"OLDFROM": "idColumnFromOldLocation",
				"LOCID": "idColumnToLocation",
				"OLDLOCATION": "idColumnToOldLocation",
				"MOTID": "idColumnMotid",
				"PRDID": "idColumnProductId",
				"ZTRANSPORTATIONCONST": "idColumnTransport",
				"ZTRANSPORTATIONCONSTAPS": "idColumnApsTransport",
				"TMAXLOTSIZE": "idColumnMaxLotSize",
				"TMINLOTSIZE": "idColumnMinLotSize",
				"TROUNDING": "idColumnRounding",
				"TLEADTIME": "idColumnLeadTime",
				"ZAPSTLANEOVRD": "idApsTLaneOvrd",
				"ZFROZENHORIZONTRECEIPT": "idColumnHorizonReceipt"
			},
			edit: {
				visibility: {
					"ZTRANSPORTATIONCONST": "transportCost",
					"ZTRANSPORTATIONCONSTAPS": "apstransportCost",
					"TMAXLOTSIZE": "maxlotSize",
					"TMINLOTSIZE": "minlotSize",
					"TROUNDING": "rounding",
					"TLEADTIME": "leadTime",
					"ZAPSTLANEOVRD": "tLaneOvrd",
					"ZFROZENHORIZONTRECEIPT": "transportReceipt"
				},
				
				enable: {
					"ZTRANSPORTATIONCONST": "inputTransport",
					"ZTRANSPORTATIONCONSTAPS": "inputApsTransport",
					"TMAXLOTSIZE": "inputmaxLotSize",
					"TMINLOTSIZE": "inputMinLotSize",
					"TROUNDING": "inputRounding",
					"TLEADTIME": "inputLeadTime",
					"ZAPSTLANEOVRD": "inputLaneOvrd",
					"ZFROZENHORIZONTRECEIPT": "inputReceipt"	
				},
			},
			display: {
				"LOCFR": "idLocfr",
				"OLDFROM": "idOldfrom",
				"LOCID": "idLocid",
				"OLDLOCATION": "idOldlocation",
				"MOTID": "idMotid",
				"PRDID": "idPrdid",
				"ZTRANSPORTATIONCONST": "idTranportConst",
				"ZTRANSPORTATIONCONSTAPS": "idApsTranportConst",
				"TMAXLOTSIZE": "idMaxlotsize",
				"TMINLOTSIZE": "idTminlotsize",
				"TROUNDING": "idTrounding",
				"TLEADTIME": "idLeadtime",
				"ZAPSTLANEOVRD": "idApsoveride",
				"ZFROZENHORIZONTRECEIPT": "idFrozenreceipt",
			}
		},
		
		controlFieldInSelection: function(_this) {
			var data = this.getModel("security", _this).getData();
			if(data === undefined || data === null) return;
			
			var oData = data.d.results;
			if(!oData.length) return;
			
			oData.forEach(function({Trtyp, Hide, Attributes: attr}){
				if(Trtyp === "DISPLAY")	{
					_this.getView().byId(this.view.selection[attr]).setVisible(Hide === "X" ? false : true);
				}
				
				if(Trtyp === "EDIT" && attr === "") {
					_this.getView().byId("editButton").setVisible(Hide === "X" ? false : true);
				}
			}, this);
		},
		
		controlFieldsInEdit: function(_this) {
			var data = this.getModel("security", _this).getData();
			if(data === undefined || data === null) return;
			
			var oData = data.d.results;
			if(!oData.length) return;
			
			oData.forEach(function({Trtyp, Hide, Attributes: attr, Mandatory, ReadOnly}){
				var _object = this.view.edit;
				if(Object.keys(_object.visibility).indexOf(attr) === -1) return;
				
				/* X - false, "" - true */
				if(Trtyp === "EDIT" && Hide) {
					this.getView().byId(_object.visibility[attr]).setVisible(Hide === "X" ? false : true);
				}
				
				if(Trtyp === "EDIT" && Mandatory) {
					_this.getView().byId(_object.visibility[attr]).setVisible(true);
				}
				
				if(Trtyp === "EDIT" && ReadOnly) {
					_this.getView().byId(_object.enable[attr]).setEnabled(ReadOnly === "X" ? false : true);
				}
			}, this);
		},
		
		controlFieldsInDisplay: function(_this) {
			var data = this.getModel("security", _this).getData();
			if(data === undefined || data === null) return;
			
			var oData = data.d.results;
			if(!oData.length) return;
			
			oData.forEach(function({Trtyp, Hide, Attributes: attr}){
				
				if(Trtyp === "DISPLAY")	{
					_this.getView().byId(this.view.display[attr]).setVisible(Hide === "X" ? false : true);
				}
			}, this);
		},
		
		getModel: function(oModel, _this) {
			return _this.getOwnerComponent().getModel(oModel);	
		}
	}	
});