/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/ey/bamlocprdattr/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("com.ey.bamlocprdattr.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.setModel(models.createModel(), "oModel");
                this.setModel(models.createModel(), "root");
                this.getModel("root").setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
    
                this.getServiceData();
                
                if(sap.ushell !== undefined){
                    this.setModel(models.createModel(), "flpCheck");
                    this.getModel("flpCheck").setProperty("/", {"isRunningOnFlp": false}, null, true);
                }
            },

            getServiceData: function () {
                var oBusy = new sap.m.BusyDialog({
                    text: "Services are loading..."
                });
    
                oBusy.open();
    
                Promise.all([
                    this.ajaxMethod("ZSTOCKINGNODETYPE", oBusy),
                    this.ajaxMethod("ZSAFETYSTOCKPOLICY", oBusy),
                    this.ajaxMethod("ZFORECASTRELEVANT", oBusy),
                    this.ajaxMethod("ZINVHOLDINGPOLICY", oBusy),
                    this.ajaxMethod("ZCONSUMPTIONTYPE", oBusy),
                    this.ajaxMethod("ZFCSTCONSMODE", oBusy),
                    this.ajaxMethod("ZSAFETYSTOCKTYPE", oBusy),
                    this.ajaxMethod("ZWEEKSOFFORWARDCOVERAGE", oBusy),
                    this.ajaxMethod("ZWFCDEMAND", oBusy),
                    this.ajaxMethod("ZTARGETSTOCKTYPE", oBusy),
                    this.ajaxMethod("ZTECHALLOCATION", oBusy),
                    this.ajaxMethod("ZFORMALLOCATION", oBusy),
                    this.ajaxMethod("ZDEMANDPLACEMENTWK", oBusy),
                    this.ajaxMethod("ZIOCHANNELSTRATEGY", oBusy),
                    this.ajaxMethod("ZIBPSUPPLYRELEVANT", oBusy),
                    this.ajaxMethod("ZSUPPLYBOMRELEVANT", oBusy),
                    this.ajaxMethod("ZMFCTRGDISAGG", oBusy),
                    this.ajaxMethod("ZUPSIDEREL", oBusy),
                    this.ajaxMethod("ZLOT_SIZE_PROCEDURE", oBusy),
                    this.ajaxMethod("ZSAFETY_STOCK", oBusy),
                    this.ajaxMethod("ZMAXINVENTORYRELEVANT", oBusy),
                    this.getModel('security').loadData('/sap/opu/odata/sap/ZBAM_LOC_PRODUCT_SRV/ZBAM_ATTR_SECURITYSET')
                    /*this.ajaxMethod("ZAPSSUBNETWORK", oBusy),
                    this.ajaxMethod("ZPLUNITID", oBusy)*/
                ]).then(() => {
                    var temp = $.extend(true, [], this.getModel("oModel").getData());
                    this.getModel("root").setData(temp);
                    oBusy.close();
                });
            },
    
            ajaxMethod: function (oFilter, oBusy) {
    
                return new Promise((resolve, reject) => {
                    $.ajax({
                        type: "GET",
                        url: "/sap/opu/odata/sap/ZBAM_LOC_PRODUCT_SRV/ZBAM_SUPPLY_HCD_SEARCHSet?$filter=ParamName eq '" + oFilter + "'",
                        dataType: "json",
                        async: true,
                        contentType: "application/json;charset=utf-8",
                        success: function (data, textStatus, jqXHR) {
                            this.setDataModel(data.d.results);
                            resolve(data.d.results);
                        }.bind(this),
                        error: function (jqXHR, textStatus, errorThrown) {
                            sap.m.MessageBox.error(oFilter + " " + textStatus);
                            oBusy.close();
                        }
                    });
                })
            },
    
            setDataModel: function (data) {
                /*var MASTSCHEDULER = data.filter(function (param) {
                    return param.Name_Text === "ZMASTSCHEDULER";
                });
                this.getModel("oModel").setProperty("/MasterScheduler", MASTSCHEDULER);
    
                var DEPLOYMENTPLANNER = data.filter(function (param) {
                    return param.Name_Text === "ZDEPLOYMENTPLANNER";
                });
                this.getModel("oModel").setProperty("/DeploymentPlanner", DEPLOYMENTPLANNER);*/
                
                var LocationType = data.filter(function (param) {
                    return param.ParamName === "ZAGLOCTYPE";
                });
                LocationType.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/SupplyAggrLocationType", LocationType);
    
                var StockingNodeTypeIndicator = data.filter(function (param) {
                    return param.ParamName === "ZSTOCKINGNODETYPE";
                });
                StockingNodeTypeIndicator.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/StockingNodeTypeIndicator", StockingNodeTypeIndicator);
    
                var SAFETYSTOCKPOLICY = data.filter(function (param) {
                    return param.ParamName === "ZSAFETYSTOCKPOLICY";
                });
                SAFETYSTOCKPOLICY.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/Stockingstockpolicyindicator", SAFETYSTOCKPOLICY);
    
                var ForecastRelevant = data.filter(function (param) {
                    return param.ParamName === "ZFORECASTRELEVANT";
                });
                ForecastRelevant.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/ForecastRelevant", ForecastRelevant);
    
                var INVHOLDINGPOLICY = data.filter(function (param) {
                    return param.ParamName === "ZINVHOLDINGPOLICY";
                });
                INVHOLDINGPOLICY.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/InventoryHoldingPolicy", INVHOLDINGPOLICY);
    
                var ConsumptionType = data.filter(function (param) {
                    return param.ParamName === "ZCONSUMPTIONTYPE";
                });
                ConsumptionType.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/ConsumptionType", ConsumptionType);
    
                var ForecastConsumptionMode = data.filter(function (param) {
                    return param.ParamName === "ZFCSTCONSMODE";
                });
                ForecastConsumptionMode.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/ForecastConsumptionMode", ForecastConsumptionMode);
    
                var SafetyStockMethod = data.filter(function (param) {
                    return param.ParamName === "ZSAFETYSTOCKTYPE";
                });
                SafetyStockMethod.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/SafetyStockMethod", SafetyStockMethod);
    
                var WFCSupplyMethod = data.filter(function (param) {
                    return param.ParamName === "ZWEEKSOFFORWARDCOVERAGE";
                });
                WFCSupplyMethod.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/WFCSupplyMethod", WFCSupplyMethod);
    
                var WFCDemandMethod = data.filter(function (param) {
                    return param.ParamName === "ZWFCDEMAND";
                });
                WFCDemandMethod.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/WFCDemandMethod", WFCDemandMethod);
    
                var TargetStockLevelMethod = data.filter(function (param) {
                    return param.ParamName === "ZTARGETSTOCKTYPE";
                });
                TargetStockLevelMethod.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/TargetStockLevelMethod", TargetStockLevelMethod);
    
                var PurchaseConstraint = data.filter(function (param) {
                    return param.ParamName === "ZTECHALLOCATION";
                });
                PurchaseConstraint.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/PurchaseConstraint", PurchaseConstraint);
    
                var ProductionConstraint = data.filter(function (param) {
                    return param.ParamName === "ZFORMALLOCATION";
                });
                ProductionConstraint.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/ProductionConstraint", ProductionConstraint);
                
                var ForecastRolRelevant = data.filter(function (param) {
                    return param.ParamName === "ZFORMALLOCATION";
                });
                ForecastRolRelevant.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/ForecastRolRelevant", ForecastRolRelevant);
    
                var ForecastRelease = data.filter(function (param) {
                    return param.ParamName === "ZDEMANDPLACEMENTWK";
                });
                ForecastRelease.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/ForecastRelease", ForecastRelease);
    
                var InventoryChannelStrategy = data.filter(function (param) {
                    return param.ParamName === "ZIOCHANNELSTRATEGY";
                });
                InventoryChannelStrategy.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/InventoryChannelStrategy", InventoryChannelStrategy);
    
                var IBPSupplyRelevant = data.filter(function (param) {
                    return param.ParamName === "ZIBPSUPPLYRELEVANT";
                });
                IBPSupplyRelevant.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/IBPSupplyRelevant", IBPSupplyRelevant);
                
                var BOMRelevant = data.filter(function (param) {
                    // return param.ParamName === "ZSUPPLYBOMRELEVANT";
                    return param.ParamName === "ZBOMEREL";
                });
                BOMRelevant.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                //BOMRelevant[1].ParamValue = ""
                this.getModel("oModel").setProperty("/BOMRelevant", BOMRelevant);
                
                /*var PlanningStrategy = [
                        {"ParamValue": "10", "ParamText": ""},
                        {"ParamValue": "20", "ParamText": ""}
                    ]*/
                var PlanningStrategy = data.filter(function (param) {
                    return param.ParamName === "ZPLANNINGSTRATEGY";
                });
                PlanningStrategy.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/PlanningStrategy", PlanningStrategy);
                
                var ApsSubNetworkID = data.filter(function (param) {
                    return param.ParamName === "ZAPSSUBNETWORK";
                });
                this.getModel("oModel").setProperty("/ApsSubNetworkID", ApsSubNetworkID);
                
                var MpsSubNetworkID = data.filter(function (param) {
                    return param.ParamName === "ZPLUNITID";
                });
                this.getModel("oModel").setProperty("/MpsSubNetworkID", MpsSubNetworkID);
                
                var MfcTrgtDisagg = data.filter(function (param) {
                    return param.ParamName === "ZMFCTRGDISAGG";
                });
                MfcTrgtDisagg.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/MfcTrgtDisagg", MfcTrgtDisagg);
    
                var Zupsiderel = data.filter(function (param) {
                    return param.ParamName === "ZUPSIDEREL";
                });
                Zupsiderel.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/Zupsiderel", Zupsiderel);
                
                var Zprodpriorityweightage = data.filter(function (param) {
                    return param.ParamName === "ZPRODPRIORITYWEIGHTAGE";
                });
                Zprodpriorityweightage.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/Zprodpriorityweightage", Zprodpriorityweightage);
                
                var Zleadtimepushmethod = data.filter(function (param) {
                    return param.ParamName === "ZLEADTIMEPUSHMETHOD";
                });
                Zleadtimepushmethod.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/Zleadtimepushmethod", Zleadtimepushmethod);
                // New code added to Fix defect -SCTASK1014097-Mannu(12/02/2021)
                var MaxDeliveryOverride = data.filter(function (param) {
                    return param.ParamName === "ZMAXDELIVERYOVERRIDE";
                });
                MaxDeliveryOverride.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/zmaxdeliveryoverride", MaxDeliveryOverride);
                //Changes Complete
                
                // New code added for filed Lot Sizing Procedure -Mannu(05/05/2021)
                // New Changes to fix Filed issue-04/06/2021
                var ZLOT_SIZE_PROCEDURE = data.filter(function (param) {
                    return param.ParamName === "ZLOT_SIZE_PROCEDURE";
                });
                ZLOT_SIZE_PROCEDURE.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/ZLOT_SIZE_PROCEDURE", ZLOT_SIZE_PROCEDURE);// New Changes by Mnnu-04/06/2021
                //Changes Complete
                
                // New Changes to add filed Safety Stock Disagg-27/07/2021
                var ZSAFETY_STOCK = data.filter(function (param) {
                    return param.ParamName === "ZSAFETY_STOCK";
                });
                ZSAFETY_STOCK.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/ZSAFETY_STOCK", ZSAFETY_STOCK);// New Changes by Mnnu-04/06/2021
                //Changes Complete
                
                // New Changes to add filed  Max Inventory Relevant-28/03/2022
                var ZMAXINVENTORYRELEVANT = data.filter(function (param) {
                    return param.ParamName === "ZMAXINVENTORYRELEVANT";
                });
                ZMAXINVENTORYRELEVANT.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/ZMAXINVENTORYRELEVANT", ZMAXINVENTORYRELEVANT);// New Changes by Mannu-28/03/2022
                //Changes Complete
            }
        });
    }
);