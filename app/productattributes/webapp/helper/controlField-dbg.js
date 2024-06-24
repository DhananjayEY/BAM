sap.ui.define([], function () {
	
	return {
		view: {
			selection: {
				"ZPORTFOLIOSUPMANAGER": "ZPORTFOLIOSUPMANAGER",
				"ZMASTERPLANNER": "ZMASTERPLANNER",
				"ZMASTERPLANNEDINDICATOR": "masterPlnInd",
				"FORMGROUP": "formGrp",
				"ZSELLINGCOUNTRY": "sellingCountry",
				"ZIBPSUPPLYRELEVANT": "supplyRelevant",
				"ZDSI": "zdsi",
				"ZPLANNINGSTRATEGY": "ZPLANNINGSTRATEGY",
				"FCSTCONSMODE": "FCSTCONSMODE",
				"FORMULATIONDESC": "formDesc",
				"ZSUPPLYPORTFOLIODESC": "suppPortDesc",
				"ZSUPPLYPRODUCTCENTERDESC": "suppProdCenterDesc",
			},
			edit: {
				visibility: {
					"ZPORTFOLIOSUPMANAGER": "idPortFolioManager" ,
					"ZMASTERPLANNER": "idMasterPlanner" ,
					"ZMASTERPLANNEDINDICATOR": "idMasterPlnInd" ,
					"FORMGROUP": "idFormGrp",
					"ZSELLINGCOUNTRY": "idSellingCntry" ,
					"ZIBPSUPPLYRELEVANT": "idIBPSupRel" ,
					"ZDSI": "idDSI" ,
					"ZPLANNINGSTRATEGY": "idPlanStrtgy" ,
					"FCSTCONSMODE": "idFcstMode",
					"FORMULATIONDESC": "idFormDesc",
					"ZSUPPLYPORTFOLIODESC": "idSupplyPFDesc",
					"ZSUPPLYPRODUCTCENTERDESC": "idProdCDesc",
				},
				
				enable: {
					"ZPORTFOLIOSUPMANAGER": "ZPORTFOLIOSUPMANAGER" ,
					"ZMASTERPLANNER": "ZMASTERPLANNER" ,
					"ZMASTERPLANNEDINDICATOR": "idMasterPlanned" ,
					"FORMGROUP": "idFormGroup",
					"ZSELLINGCOUNTRY": "idSellingCountry" ,
					"ZIBPSUPPLYRELEVANT": "idIBPRelevant" ,
					"ZDSI": "idDsi" ,
					"ZPLANNINGSTRATEGY": "ZPLANNINGSTRATEGY" ,
					"FCSTCONSMODE": "FCSTCONSMODE",
					"FORMULATIONDESC": "idFormulationDesc",
					"ZSUPPLYPORTFOLIODESC": "idPortfolioDesc",
					"ZSUPPLYPRODUCTCENTERDESC": "idProductCenterDesc",
				},
			},
			display: {
				"ZDSI": "idZDSI",
				"ZMASTERPLANNEDINDICATOR": "idZMASTERPLANNEDINDICATOR",
				"ZSELLINGCOUNTRY": "idZSELLINGCOUNTRY",
				"FORMGROUP": "idFORMGROUP",
				"ZIBPSUPPLYRELEVANT": "idZIBPSUPPLYRELEVANT",
				"ZPLANNINGSTRATEGY": "idZPLANNINGSTRATEGY",
				"FCSTCONSMODE": "idFCSTCONSMODE",
				"ZPORTFOLIOSUPMANAGER": "idZPORTFOLIOSUPMANAGER",
				"ZMASTERPLANNER": "idZMASTERPLANNER",
				"FORMULATIONDESC": "FORMULATIONDESC",
				"ZSUPPLYPORTFOLIODESC": "ZSUPPLYPORTFOLIODESC",
				"ZSUPPLYPRODUCTCENTERDESC": "ZSUPPLYPRODUCTCENTERDESC",
			}
		},
		
		controlFieldInSelection: function(_this) {
			var data = this.getModel("security", _this).getData();
			if(data === undefined || data === null) return;
			
			var oData = data.d.results;
			var view = this.view.selection;
			if(!oData.length) return;
			
			oData.forEach(function({Trtyp, Hide, Attributes: attr}){
				if(Trtyp === "DISPLAY" && view[attr] !== undefined)	{
					_this.getView().byId(view[attr]).setVisible(Hide === "X" ? false : true);
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
			var view = this.view.edit;
			if(!oData.length) return;
			
			oData.forEach(function({Trtyp, Hide, Attributes: attr, Mandatory, ReadOnly}){
				
				if(view.visibility[attr] === undefined) return;
				
				/* X - false, "" - true */
				if(Trtyp === "EDIT" && Hide) {
					_this.getView().byId(view.visibility[attr]).setVisible(Hide === "X" ? false : true);
				}
				
				if(Trtyp === "EDIT" && Mandatory) {
					_this.getView().byId(view.visibility[attr]).setVisible(true);
				}
				
				if(Trtyp === "EDIT" && ReadOnly) {
					_this.getView().byId(view.enable[attr]).setEnabled(ReadOnly === "X" ? false : true);
				}
			}, this);
		},
		
		controlFieldsInDisplay: function(_this) {
			var data = this.getModel("security", _this).getData();
			if(data === undefined || data === null) return;
			
			var oData = data.d.results;
			var view = this.view.display;
			if(!oData.length) return;
			
			oData.forEach(function({Trtyp, Hide, Attributes: attr}){
				
				if(Trtyp === "DISPLAY" && view[attr] !== undefined)	{
					_this.getView().byId(this.view.display[attr]).setVisible(Hide === "X" ? false : true);
				}
			}, this);
		},
		
		getModel: function(oModel, _this) {
			return _this.getOwnerComponent().getModel(oModel);
		}
	}	
});