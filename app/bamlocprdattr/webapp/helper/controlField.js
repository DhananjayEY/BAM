sap.ui.define([], function () {
	
	return {
		view: {
			selection: {
				"ZMASTSCHEDULER": "MasterScheduler",
				"ZDEPLOYMENTPLANNER": "DeploymentPlanner",
				"ZPRODSCHEDULER": "ZPRODSCHEDULER",
				"ZMATERIALPLANNER": "ZMATERIALPLANNER",
				"ZFROZENHORIZON": "ProductionFrozenZone",
				"ZTECHALLOCATION": "PurchaseConstraint",
				"ZTECHALLOCATIONAPS": "ApsPurchaseConstraint",
				"ZFORMALLOCATION": "ProductionConstraint",
				"ZFORMALLOCATIONAPS": "ApsProductionConstraint",
				"ZFORECASTROLLREL": "ForecastRolRelevant",
				"ZPRODPRIORITYWEIGHTAGE": "ProductPriority",
				"ZFORECASTRELEVANT": "ForecastRelevant",
				"ZPLANNINGSTRATEGY": "planningStrategy",
				"ZBOMEREL": "BomRelevancy",
				"ZIOCHANNELSTRATEGY": "InventoryChannelStrategy",
				"ZTARGETSTOCKTYPE": "TargetStockLevelMethod",
				"ZSAFETYSTOCKTYPE": "SafetyStockMethod",
				"ZSAFETYSTOCKQUANTITY": "StaticSafetyStockQuantity",
				"ZRELATIVEPERCENTAGE": "RelativePercentageStaticSafetyStock",
				"ZWEEKSOFFORWARDCOVERAGE": "WFCSupplyMethod",
				"ZWFCQUANTITY": "StaticWFCQuantity",
				"ZWFCDEMAND": "WFCDemandMethod",
				"ZMFCRELMODE": "ZMFCRELMODE",
				"ZMFCTRGDISAGG": "ZMFCTRGDISAGG",
				"ZDEMANDPLACEMENTWK": "ForecastRelease",
				"ZCONSUMPTIONTYPE": "ConsumptionType",
				"ZFCSTCONSMODE": "ForecastConsumptionMode",
				"ZMONTHOFFSET": "ForecastOffsetInMonths",
				"ZMINORDERLEADTIME": "MinOrderLeadTime",
				"ZDEMREASSIGNPARENTID": "DemandReassignmentParentID",
				"ZAGGLOC": "AggregateLocation",
				"ZFORCASTCONGROUP": "ZFORCASTCONGROUP",
				"ZSTOCKINGNODETYPE": "StockingNodeTypeIndicator",
				"ZINVHOLDINGPOLICY": "InventoryHoldingPolicy",
				"ZPBR": "PeriodsBetweenReplenishment",
				"ZSAFETYSTOCKPOLICY": "StockingStockPolicyIndicator",
				"ZPLUNITID": "MpsSubId",
				"ZAPSSUBNETWORK": "ApsSubId",
				"ZPLANNINGPLANT": "planningPlant",
				"ZLEADTIMEPUSHMETHOD": "Zleadtimepushmethod"
			},
			edit: {
				visibility: {
					"ZMASTSCHEDULER": "idMasterScheduler",
					"ZDEPLOYMENTPLANNER": "idDeploymentPlanner",
					"ZPRODSCHEDULER": "idZPRODSCHEDULER",
					"ZMATERIALPLANNER": "idZMATERIALPLANNER",
					"ZFROZENHORIZON": "idProductionFrozenZone",
					"ZTECHALLOCATION": "idPurchaseConstraint",
					"ZFORMALLOCATION": "idProductionConstraint",
					"ZPRODPRIORITYWEIGHTAGE": "idProductPriority",
					"ZFORECASTRELEVANT": "idForecastRelevant",
					"ZPLANNINGSTRATEGY": "idPlanningStrategy",
					"ZBOMEREL": "idBOMRelevancy",
					"ZIOCHANNELSTRATEGY": "idInventoryChannelStrategy",
					"ZTARGETSTOCKTYPE": "idTargetStockLevelMethod",
					"ZSAFETYSTOCKTYPE": "idSafetyStockMethod",
					"ZSAFETYSTOCKQUANTITY": "idStaticSafetyStockQuantity",
					"ZRELATIVEPERCENTAGE": "idRelativePercentageStaticSafetyStock",
					"ZWEEKSOFFORWARDCOVERAGE": "idWFCSupplyMethod",
					"ZWFCQUANTITY": "idStaticWFCQuantity",
					"ZWFCDEMAND": "idWFCDemandMethod",
					"ZMFCRELMODE": "idZMFCRELMODE",
					"ZMFCTRGDISAGG": "idZMFCTRGDISAGG",
					"ZDEMANDPLACEMENTWK": "idForecastRelease",
					"ZCONSUMPTIONTYPE": "idConsumptionType",
					"ZFCSTCONSMODE": "idForecastConsumptionMode",
					"ZMONTHOFFSET": "idForecastOffsetInMonths",
					"ZMINORDERLEADTIME": "idMinOrderLeadTime",
					"ZDEMREASSIGNPARENTID": "idDemandReassignmentParentID",
					"ZAGGLOC": "idAggregateLocation",
					"ZFORCASTCONGROUP": "idZFORCASTCONGROUP",
					"ZSTOCKINGNODETYPE": "idStockingNodeTypeIndicator",
					"ZINVHOLDINGPOLICY": "idInventoryHoldingPolicy",
					"ZPBR": "idPeriodsBetweenReplenishment",
					"ZSAFETYSTOCKPOLICY": "idStockingStockPolicyIndicator",
					"ZPLUNITID": "idMpsSubId",
					"ZAPSSUBNETWORK": "idApsSubId",
					"ZPLANNINGPLANT": "idPlanningPlant",
					"ZTECHALLOCATIONAPS": "idApsPurchaseConstraint",
					"ZFORMALLOCATIONAPS": "idApsProductionConstraint",
					"ZFORECASTROLLREL": "idForecastRolRelevant",
					"ZLEADTIMEPUSHMETHOD": "idZLEADTIMEPUSHMETHOD"
				},
				
				enable: {
					"ZMASTSCHEDULER": "Master",
					"ZDEPLOYMENTPLANNER": "Deployment",
					"ZPRODSCHEDULER": "ZPRODSCHEDULER",
					"ZMATERIALPLANNER": "ZMATERIALPLANNER",
					"ZFROZENHORIZON": "Frozen",
					"ZTECHALLOCATION": "PurchaseConstraint",
					"ZFORMALLOCATION": "ProductionConstraint",
					"ZPRODPRIORITYWEIGHTAGE": "ProductPriority",
					"ZFORECASTRELEVANT": "Forecast",
					"ZPLANNINGSTRATEGY": "planningStrategy",
					"ZBOMEREL": "BomRelevancy",
					"ZIOCHANNELSTRATEGY": "InventoryChannelStrategy",
					"ZTARGETSTOCKTYPE": "Target",
					"ZSAFETYSTOCKTYPE": "Safety",
					"ZSAFETYSTOCKQUANTITY": "StaticSafety",
					"ZRELATIVEPERCENTAGE": "RelativePercentage",
					"ZWEEKSOFFORWARDCOVERAGE": "WFCSupply",
					"ZWFCQUANTITY": "StaticWFC",
					"ZWFCDEMAND": "DemandMethod",
					"ZMFCRELMODE": "ZMFCRELMODE",
					"ZMFCTRGDISAGG": "ZMFCTRGDISAGG",
					"ZDEMANDPLACEMENTWK": "ForecastRelease",
					"ZCONSUMPTIONTYPE": "Consumption",
					"ZFCSTCONSMODE": "ConsumptionMode",
					"ZMONTHOFFSET": "ForecastsOffset",
					"ZMINORDERLEADTIME": "MinOrder",
					"ZDEMREASSIGNPARENTID": "ReassignmentParent",
					"ZAGGLOC": "aggregateLocation",
					"ZFORCASTCONGROUP": "ZFORCASTCONGROUP",
					"ZSTOCKINGNODETYPE": "Indicatortype",
					"ZINVHOLDINGPOLICY": "Inventory",
					"ZPBR": "Replenishment",
					"ZSAFETYSTOCKPOLICY": "policy",
					"ZPLUNITID": "MpsSubId",
					"ZAPSSUBNETWORK": "ApsSubId",
					"ZPLANNINGPLANT": "planningPlant",
					"ZTECHALLOCATIONAPS": "ApsPurchaseConstraint",
					"ZFORMALLOCATIONAPS": "ApsProductionConstraint",
					"ZFORECASTROLLREL": "ForecastRolRel",
					"ZLEADTIMEPUSHMETHOD": "ZLEADTIMEPUSHMETHOD"
				},
			},
			display: {
				"ZMASTSCHEDULER": "disMasterScheduler" ,
				"ZDEPLOYMENTPLANNER": "disDeploymentPlanner" ,
				"ZPRODSCHEDULER": "disZPRODSCHEDULER" ,
				"ZMATERIALPLANNER": "disZMATERIALPLANNER" ,
				"ZFROZENHORIZON": "disProductionFrozenZone" ,
				"ZTECHALLOCATION": "disPurchaseConstraint" ,
				"ZFORMALLOCATION": "disProductPriority" ,
				"ZPRODPRIORITYWEIGHTAGE": "disForecastRelevant" ,
				"ZFORECASTRELEVANT": "disPlanningStrategy" ,
				"ZPLANNINGSTRATEGY": "disBOMRelevancy" ,
				"ZBOMEREL": "disTargetStockLevelMethod" ,
				"ZIOCHANNELSTRATEGY": "disSafetyStockMethod" ,
				"ZTARGETSTOCKTYPE": "disStaticSafetyStockQuantity" ,
				"ZSAFETYSTOCKTYPE": "disRelativePercentageStaticSafetyStock" ,
				"ZSAFETYSTOCKQUANTITY": "disWFCSupplyMethod" ,
				"ZRELATIVEPERCENTAGE": "disStaticWFCQuantity" ,
				"ZWEEKSOFFORWARDCOVERAGE": "disWFCDemandMethod" ,
				"ZWFCQUANTITY": "disZMFCTRGDISAGG" ,
				"ZWFCDEMAND": "disForecastRelease" ,
				"ZMFCRELMODE": "disConsumptionType" ,
				"ZMFCTRGDISAGG": "disForecastConsumptionMode" ,
				"ZDEMANDPLACEMENTWK": "disForecastOffsetInMonths" ,
				"ZCONSUMPTIONTYPE": "disMinOrderLeadTime" ,
				"ZFCSTCONSMODE": "disDemandReassignmentParentID" ,
				"ZMONTHOFFSET": "disAggregateLocation" ,
				"ZMINORDERLEADTIME": "disZFORCASTCONGROUP" ,
				"ZDEMREASSIGNPARENTID": "disStockingNodeTypeIndicator" ,
				"ZAGGLOC": "disInventoryHoldingPolicy" ,
				"ZFORCASTCONGROUP": "disPeriodsBetweenReplenishment" ,
				"ZSTOCKINGNODETYPE": "disStockingStockPolicyIndicator" ,
				"ZINVHOLDINGPOLICY": "disMpsSubId" ,
				"ZPBR": "disApsSubId" ,
				"ZSAFETYSTOCKPOLICY": "disProductionConstraint" ,
				"ZPLUNITID": "disInventoryChannelStrategy" ,
				"ZAPSSUBNETWORK": "disAggIDChangeIndicator" ,
				"ZPLANNINGPLANT":"disZMFCRELMODE",
				"ZTECHALLOCATIONAPS": "disApsPurchaseConstraint",
				"ZFORMALLOCATIONAPS": "disApsProductionConstraint",
				"ZFORECASTROLLREL": "disForecastRollRel",
				"ZLEADTIMEPUSHMETHOD": "disZLEADTIMEPUSHMETHOD"
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