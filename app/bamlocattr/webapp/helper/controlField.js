sap.ui.define([], function () {
	
	return {
		view: {
			selection: {
				"ZAGLOCTYPE" :"SupplyAggrLocationType" ,
				"ZSUPPLYLOCPLATFORM" :"SupplyLocationPlatform" ,
				"ZSUPPLYACTIVITY" :"SupplyActivity" ,
				"ZSUPPLYREGIONID" :"SupplyRegionID" ,
				"ZSUPPLYREGIONDESC" :"SupplyRegionDescription"
			},

			edit: {
				visibility: {
					"ZAGLOCTYPE" : "idSupplyAggrLocationType",
					"ZSUPPLYLOCPLATFORM" : "idSupplyLocationPlatform",
					"ZSUPPLYACTIVITY" : "idSupplyActivity",
					"ZSUPPLYREGIONID" : "idSupplyRegionID",
					"ZSUPPLYREGIONDESC" : "idSupplyRegionDescription"
				},
				
				enable: {
					"ZAGLOCTYPE" :"ltype" ,
					"ZSUPPLYLOCPLATFORM" :"pform" ,
					"ZSUPPLYACTIVITY" :"sactivity" ,
					"ZSUPPLYREGIONID" :"sregion" ,
					"ZSUPPLYREGIONDESC" :"sregionDesc"
				},
			},
			display: {
				"ZAGLOCTYPE" :"idSupAgZAGLOCTYPE" ,
				"ZSUPPLYLOCPLATFORM" :"idSupLocPlt" ,
				"ZSUPPLYACTIVITY" :"idSupActivity" ,
				"ZSUPPLYREGIONID" :"idSupRgn" ,
				"ZSUPPLYREGIONDESC" :"idSupRgnDesc"
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