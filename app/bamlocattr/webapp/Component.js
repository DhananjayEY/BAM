/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/ey/bamlocattr/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("com.ey.bamlocattr.Component", {
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

                if(sap.ushell !== undefined){
                    this.setModel(models.createModel(), "flpCheck");
                    this.getModel("flpCheck").setProperty("/", {"isRunningOnFlp": false}, null, true);
                }
                
                this.setModel(models.createModel(), "oModel");
                this.getServiceData();
            },

            getServiceData: function () {
                // var OData;
                // var cmdl = this.getView().getModel('Loc');
                $.ajax({
                    type: "GET",
                    url: "/sap/opu/odata/sap/ZBAM_SUPP_LOCATION_SRV/ZBAM_SUPPLY_HCD_SEARCHSet",
                    dataType: "json",
                    async: false,
                    contentType: "application/json;charset=utf-8",
                    success: function (data, textStatus, jqXHR) {
                        // debugger;
                        // OData = data.d.results;s
                        this.setDataModel(data.d.results);
                    }.bind(this),
                    error: function (jqXHR, textStatus, errorThrown) {
                        sap.m.MessageBox.error(textStatus);
                    }
                });
                
                this.getModel('security').loadData('/sap/opu/odata/sap/ZBAM_SUPP_LOCATION_SRV/ZBAM_ATTR_SECURITYSET')
            
            },
    
            setDataModel: function (data) {
                var LocationType = data.filter(function (param) {
                    return param.ParamName === "ZAGLOCTYPE";
                });
                LocationType.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/SupplyAggrLocationType", LocationType);
                
                var LocationPlatform = data.filter(function (param) {
                    return param.ParamName === "ZSUPPLYLOCPLATFORM";
                });
                LocationPlatform.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/SupplyLocationPlatform", LocationPlatform);
                
                var Activity = data.filter(function (param) {
                    return param.ParamName === "ZSUPPLYACTIVITY";
                });
                Activity.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/SupplyActivity", Activity);
                
                var Region = data.filter(function (param) {
                    return param.ParamName === "ZSUPPLYREGIONID";
                });
                Region.unshift({	"ParamValue": "", "ParamText": "Please Select" });
                this.getModel("oModel").setProperty("/SupplyRegion", Region);
                
                /*var Region = data.filter(function (param) {
                    return param.ParamName === "ZSUPPLYREGIONDESC";
                });
                this.getModel("oModel").setProperty("/SupplyRegionDesc", Region);*/
                
                
    
            }
        });
    }
);