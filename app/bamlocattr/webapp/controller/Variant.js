sap.ui.define(["sap/ui/base/ManagedObject"], function (ManagedObject) {
  "use strict";

  return {
    /**
     * Call this method at onInit
     */
    onInitFilterVarient: function (that) {
      //Variant Table Start
      // Peronalisation from ushell service to persist the settings
      if (
        sap.ushell &&
        sap.ushell.Container &&
        sap.ushell.Container.getService
      ) {
        var oComponentTab = sap.ui.core.Component.getOwnerComponentFor(
          that.getView()
        );
        this.oPersonalizationServiceTab = sap.ushell.Container.getService(
          "Personalization"
        );
        var oPersIdTab = {
          container: "PersonalisationContainerForTable",
          item: "LocForTableVariant", //Should be UNIQUE. Replace VAREXC with your table name
        };
        // define scope
        var oScopeTab = {
          keyCategory: this.oPersonalizationServiceTab.constants.keyCategory
            .FIXED_KEY,
          writeFrequency: this.oPersonalizationServiceTab.constants
            .writeFrequency.LOW,
          clientStorageAllowed: false,
          Validity: Infinity,
        };
        // Get a Personalizer
        var oPersonalizerTab = this.oPersonalizationServiceTab.getPersonalizer(
          oPersIdTab,
          oScopeTab,
          oComponentTab
        );
        this.oPersonalizationServiceTab
          .getContainer(
            "PersonalisationContainerForTable",
            oScopeTab,
            oComponentTab
          )
          .fail(function () {
            jQuery.sap.log.error("personalisation container not working");
          })
          .done(
            function (oContainerTab) {
              this.oContainerTab = oContainerTab;
              this.oVariantSetAdapterTab = new sap.ushell.services.Personalization.VariantSetAdapter(
                this.oContainerTab
              );
              // get variant set which is stored in backend
              this.oVariantSetTab = this.oVariantSetAdapterTab.getVariantSet(
                "LocForTableVariant"
              );
              if (!this.oVariantSetTab) {
                //if not in backend, then create one
                this.oVariantSetTab = this.oVariantSetAdapterTab.addVariantSet(
                  "LocForTableVariant"
                );
              }
              // array to store the existing variants
              var VariantTab = [];
              // now get the existing variants from the backend to show as list
              for (var key in this.oVariantSetTab.getVariantNamesAndKeys()) {
                if (
                  this.oVariantSetTab
                    .getVariantNamesAndKeys()
                    .hasOwnProperty(key)
                ) {
                  var oVariantItemObjectTab = {};
                  oVariantItemObjectTab.Key = this.oVariantSetTab.getVariantNamesAndKeys()[
                    key
                  ];
                  oVariantItemObjectTab.Name = key;
                  VariantTab.push(oVariantItemObjectTab);
                }
              }
              // this.oVariantModelTab.oData.defVariant = "Standard";
              if (this.oVariantSetTab.getCurrentVariantKey() !== null) {
                var defVariantKeyTab = this.oVariantSetTab.getCurrentVariantKey(); // this.oVariantModelTab.oData.defVariant = this.oVariantModelTab.oData.VariantTab[defVariantKeyTab].Name;
              }
              // create JSON model and attach to the variant management UI control
              this.oVariantModelTab = new sap.ui.model.json.JSONModel();
              this.oVariantModelTab.oData.VariantTab = VariantTab;
              this.oVariantModelTab.oData.defVariantKeyTab = defVariantKeyTab;
              that.getView().byId("VariantTab").setModel(this.oVariantModelTab, "variant");
              this.oVariantModelTab.updateBindings(true);
              //Default Variant Key
              var variantNameTab = this.oVariantSetTab.getVariant(
                this.oVariantModelTab.oData.defVariantKeyTab
              );
              this._setSelectedVariantToTable(variantNameTab, that);
              if (variantNameTab) {
                variantNameTab = variantNameTab._sVariantName;
                that.getView()
                  .byId("VariantTab")
                  .setInitialSelectionKey(defVariantKeyTab);
              }
            }.bind(this)
          ); 
      }
      //Variant Table End
      //Variant Filter Start
      // Peronalisation from ushell service to persist the settings
      if (
        sap.ushell &&
        sap.ushell.Container &&
        sap.ushell.Container.getService
      ) {
        var oComponentFT = sap.ui.core.Component.getOwnerComponentFor(
          that.getView()
        );
        this.oPersonalizationServiceFT = sap.ushell.Container.getService(
          "Personalization"
        );
        var oPersIdFT = {
          container: "PersoContainerForFilterBar",
          ////Can be any name but should be UNIQUE. Replace VAREXC with your table name
          item: "LocForFilterVaraint", //Should be UNIQUE. Replace VAREXC with your table name
        };
        // define scope
        var oScopeFT = {
          keyCategory: this.oPersonalizationServiceFT.constants.keyCategory
            .FIXED_KEY,
          writeFrequency: this.oPersonalizationServiceFT.constants
            .writeFrequency.LOW,
          clientStorageAllowed: false,
          Validity: Infinity,
        };
        // Get a Personalizer
        var oPersonalizerFT = this.oPersonalizationServiceFT.getPersonalizer(
          oPersIdFT,
          oScopeFT,
          oComponentFT
        );
        this.oPersonalizationServiceFT
          .getContainer(
            "PersoContainerForFilterBar",
            oScopeFT,
            oComponentFT
          )
          .fail(function () {
            jQuery.sap.log.error("personalisation container not working");
          })
          .done(
            function (oContainerFT) {
              this.oContainerFT = oContainerFT;
              this.oVariantSetAdapterFT = new sap.ushell.services.Personalization.VariantSetAdapter(
                this.oContainerFT
              );
              // get variant set which is stored in backend
              this.oVariantSetFT = this.oVariantSetAdapterFT.getVariantSet(
                "LocForFilterVaraint"
              );
              if (!this.oVariantSetFT) {
                //if not in backend, then create one
                this.oVariantSetFT = this.oVariantSetAdapterFT.addVariantSet(
                  "LocForFilterVaraint"
                );
              }
              // array to store the existing variants
              var VariantFT = [];
              // now get the existing variants from the backend to show as list
              for (var key in this.oVariantSetFT.getVariantNamesAndKeys()) {
                if (
                  this.oVariantSetFT
                    .getVariantNamesAndKeys()
                    .hasOwnProperty(key)
                ) {
                  var oVariantItemObjectFT = {};
                  oVariantItemObjectFT.Key = this.oVariantSetFT.getVariantNamesAndKeys()[
                    key
                  ];
                  oVariantItemObjectFT.Name = key;
                  VariantFT.push(oVariantItemObjectFT);
                }
              }
              // this.oVariantModelFT.oData.defVariant = "Standard";
              if (this.oVariantSetFT.getCurrentVariantKey() !== null) {
                var defVariantKeyFT = this.oVariantSetFT.getCurrentVariantKey(); // this.oVariantModelFT.oData.defVariant = this.oVariantModelFT.oData.VariantFT[defVariantKeyFT].Name;
              }
              // create JSON model and attach to the variant management UI control
              this.oVariantModelFT = new sap.ui.model.json.JSONModel();
              this.oVariantModelFT.oData.VariantFT = VariantFT;
              this.oVariantModelFT.oData.defVariantKeyFT = defVariantKeyFT;
              that.getView().byId("VariantFT").setModel(this.oVariantModelFT, "variant");
              this.oVariantModelFT.updateBindings(true);
              //Default Variant Key
              var variantNameFT = this.oVariantSetFT.getVariant(
                this.oVariantModelFT.oData.defVariantKeyFT
              );
              this._setSelectedVariantToFilter(variantNameFT, that);
              if (variantNameFT) {
                variantNameFT = variantNameFT._sVariantName;
                that.getView()
                  .byId("VariantFT")
                  .setInitialSelectionKey(defVariantKeyFT);
              }
            }.bind(this)
          );
      } //Variant Filter End
    },
    /**
     
     * Table Variant management start
     * Handle Save of Table Variant
     */
    onSaveVariTab: function (oEvent, that) {
      // get variant parameters:
      var VariantParam = oEvent.getParameters();
      var aColumnsData = [];
      that.getView()
        .byId("LocalTable")
        .getColumns()
        .forEach(function (oColumn, index) {
          var aColumn = {};
          // aColumn.fieldName = oColumn.getProperty("name");
          aColumn.fieldName = oColumn.getLabel().getText();
          aColumn.index = index;
          aColumn.Visible = oColumn.getVisible();
          aColumnsData.push(aColumn);
        });
      //Save Variant condition
      var flag = 0;
      for (
        var i = 0;
        i < Object.keys(this.oVariantSetTab._oVariantSetData.variants).length;
        i++
      ) {
        if (
          this.oVariantSetTab._oVariantSetData.variants[
            Object.keys(this.oVariantSetTab._oVariantSetData.variants)[i]
          ].name === VariantParam.name
        ) {
          flag = 1;
          break;
        }
      }
      if (flag === 0) {
        this.oVarianTab = this.oVariantSetTab.addVariant(VariantParam.name);
      } else {
        // this.oVarianTab = this.oVariantSetTab.getVariant(that.getView().byId("VariantTab").getSelectionKey());
        this.oVarianTab = this.oVariantSetTab.getVariant(
          this.oVariantSetTab.getVariantKeyByName(
            that.getView().byId("VariantTab")._getVariantText()
          )
        );
      }
      if (this.oVarianTab) {
        this.oVarianTab.setItemValue(
          "ColumnsVal",
          JSON.stringify(aColumnsData)
        );
        if (VariantParam.def === true) {
          this.oVariantSetTab.setCurrentVariantKey(
            this.oVarianTab.getVariantKey()
          );
        }
      }
      // default variant change
      if (VariantParam.def !== "*standard*") {
        this.oVariantSetTab.setCurrentVariantKey(VariantParam.def);
      } else {
        this.oVariantSetTab.setCurrentVariantKey(null);
      }
    },
    /**
     
     * Handle Select Table Variant
     */
    onSelVariTab: function (oEvent, that) {
      //enable save button
      that.getView().byId("VariantTab").currentVariantSetModified(true);
      var selectedKey = oEvent.getParameters().key;
      if (oEvent.getSource().getVariantItems().length !== 0) {
        for (var i = 0; i < oEvent.getSource().getVariantItems().length; i++) {
          if (
            oEvent.getSource().getVariantItems()[i].getProperty("key") ===
            selectedKey
          ) {
            var selectedVariant = oEvent
              .getSource()
              .getVariantItems()
              [i].getProperty("text");
            break;
          }
        }
      } else {
        for (i = 0; i < oEvent.getSource().getItems().length; i++) {
          if (
            oEvent.getSource().getItems()[i].getProperty("key") === selectedKey
          ) {
            selectedVariant = oEvent
              .getSource()
              .getItems()
              [i].getProperty("text");
            break;
          }
        }
      }
      this._setSelectedVariantToTable(selectedVariant, that);
    },
    
    _setSelectedVariantToTable: function (oSelectedVariant, that) {
      var sVariant;
      if (oSelectedVariant) {
        if (oSelectedVariant._sVariantKey === undefined) {
          sVariant = this.oVariantSetTab.getVariant(
            this.oVariantSetTab.getVariantKeyByName(oSelectedVariant)
          );
        } else {
          sVariant = this.oVariantSetTab.getVariant(
            oSelectedVariant.getVariantKey()
          );
        }
        var aColumns = JSON.parse(sVariant.getItemValue("ColumnsVal"));
        // Hide all columns first
        that.getView()
          .byId("LocalTable")
          .getColumns()
          .forEach(function (oColumn) {
            oColumn.setVisible(false);
          });
        // re-arrange columns according to the saved variant
        aColumns.forEach(
          function (aColumn) {
            var aTableColumn = $.grep(
              that.getView().byId("LocalTable").getColumns(),
              function (el, id) {
                // return el.getProperty("name") === aColumn.fieldName;
                return el.getLabel().getText() === aColumn.fieldName;
              }
            );
            if (aTableColumn.length > 0) {
              aTableColumn[0].setVisible(aColumn.Visible);
              that.getView().byId("LocalTable").removeColumn(aTableColumn[0]);
              that.getView()
                .byId("LocalTable")
                .insertColumn(aTableColumn[0], aColumn.index);
            }
          }.bind(this)
        );
      } // null means the standard variant is selected or the variant which is not available, then show all columns
      else {
        that.getView()
          .byId("LocalTable")
          .getColumns()
          .forEach(function (oColumn) {
            oColumn.setVisible(true);
          });
      }
    },
    /**
     
     * Handle Delete of Table Variant
     */
    onManageVariTab: function (oEvent, that) {
      var aParameters = oEvent.getParameters();
      // rename variants
      if (aParameters.renamed.length > 0) {
        aParameters.renamed.forEach(
          function (aRenamed) {
            var sVariant = this.oVariantSetTab.getVariant(aRenamed.key),
              sItemValue = sVariant.getItemValue("ColumnsVal");
            // delete the variant
            this.oVariantSetTab.delVariant(aRenamed.key);
            // after delete, add a new variant
            var oNewVariant = this.oVariantSetTab.addVariant(aRenamed.name);
            oNewVariant.setItemValue("ColumnsVal", sItemValue);
          }.bind(this)
        );
      }
      // default variant change
      if (aParameters.def !== "*standard*") {
        this.oVariantSetTab.setCurrentVariantKey(aParameters.def);
      } else {
        this.oVariantSetTab.setCurrentVariantKey(null);
      }
      // Delete variants
      if (aParameters.deleted.length > 0) {
        aParameters.deleted.forEach(
          function (aDelete) {
            this.oVariantSetTab.delVariant(aDelete);
          }.bind(this)
        );
      }
      //  Save the Variant Container
      this.oContainerTab
        .save()
        .done(function () {
          // Tell the user that the personalization data was saved
          jQuery.sap.log.info("deleted");
        })
        .fail(function () {
          jQuery.sap.log.error("failDe");
        });
    },
    /* Table Variant management End */
    /**
     * Filter Bar Variant Management start
     * Handle Save of Filter Bar Variant
     */
    onSaveVariFT: function (oEvent, that) {
      // get variant parameters:
      var VariantParam = oEvent.getParameters();
      var aFilterData = [];
      //Save Variant condition
      var flag = 0;
      for (
        var i = 0;
        i < Object.keys(this.oVariantSetFT._oVariantSetData.variants).length;
        i++
      ) {
        if (
          this.oVariantSetFT._oVariantSetData.variants[
            Object.keys(this.oVariantSetFT._oVariantSetData.variants)[i]
          ].name === VariantParam.name
        ) {
          flag = 1;
          break;
        }
      }
      if (flag === 0) {
        this.oVarianFT = this.oVariantSetFT.addVariant(VariantParam.name);
      } else {
        // this.oVarianFT = this.oVariantSetFT.getVariant(that.getView().byId("VariantFT").getSelectionKey());
        this.oVarianFT = this.oVariantSetFT.getVariant(
          this.oVariantSetFT.getVariantKeyByName(
            that.getView().byId("VariantFT")._getVariantText()
          )
        );
      }
      if (this.oVarianFT) {
        this.oVarianFT.setItemValue(
          "FiltersVal",
          JSON.stringify(this._filBarVariant(that))
        );
        if (VariantParam.def === true) {
          this.oVariantSetFT.setCurrentVariantKey(
            this.oVarianFT.getVariantKey()
          );
        }
      }
      // default variant change
      if (VariantParam.def !== "*standard*") {
        this.oVariantSetFT.setCurrentVariantKey(VariantParam.def);
      } else {
        this.oVariantSetFT.setCurrentVariantKey(null);
      }
    },
    
    _filBarVariant: function (that) {
      var locationFilterBar = that.getView().byId("locationFilterBar");
      //Filter Bar ID
      var filterColumns = {
        // "filterArray": [],
        filterValues: [],
      };
      var aTokens;
      var filterGroupItems = locationFilterBar.getFilterGroupItems();
      for (var i = 0; i < filterGroupItems.length; i++) {
        // filterGroupItems.forEach(function (i, filterGroupItem) {
        var currentFilterItem = filterGroupItems[i];
        var tProperties = [];
        if (
          locationFilterBar.determineControlByName(
            filterGroupItems[i].getProperty("name")
          ).mAggregations.items === undefined
        ) {
          aTokens = locationFilterBar
            .determineControlByName(filterGroupItems[i].getProperty("name"))
            .getTokens();
        } else {
          aTokens = locationFilterBar
            .determineControlByName(filterGroupItems[i].getProperty("name"))
            .getSelectedItems();
        }
        for (var j = 0; j < aTokens.length; j++) {
          // aTokens.forEach(function (j, aToken) {
          tProperties.push(aTokens[j].mProperties); // var obj = {key: aTokens[j].getKey(),text: aTokens[j].getText()};
          // tProperties.push(obj);
          // });
        }
        // filterColumns.filterArray.push(filterGroupItems[i].mProperties);
        filterColumns.filterValues.push({
          name: filterGroupItems[i].getProperty("name"),
          values: tProperties,
          property: filterGroupItems[i].getProperty("visibleInFilterBar"),
        }); // }.bind(this));
      }
      return filterColumns;
    },

    /**
     * Handle Select Filter Bar Variant
     */
    onSelVariFT: function (oEvent, that) {
      //enable save button
      that.getView().byId("VariantFT").currentVariantSetModified(true);
      var selectedKey = oEvent.getParameters().key;
      if (oEvent.getSource().getVariantItems().length !== 0) {
        for (var i = 0; i < oEvent.getSource().getVariantItems().length; i++) {
          if (
            oEvent.getSource().getVariantItems()[i].getProperty("key") ===
            selectedKey
          ) {
            var selectedVariant = oEvent
              .getSource()
              .getVariantItems()
              [i].getProperty("text");
            break;
          }
        }
      } else {
        for (i = 0; i < oEvent.getSource().getItems().length; i++) {
          if (
            oEvent.getSource().getItems()[i].getProperty("key") === selectedKey
          ) {
            selectedVariant = oEvent
              .getSource()
              .getItems()
              [i].getProperty("text");
            break;
          }
        }
      }
      this._setSelectedVariantToFilter(selectedVariant, that);
    },
    
    _setSelectedVariantToFilter: function (oSelectedVariant, that) {
      var sVariant;
      if (oSelectedVariant) {
        if (oSelectedVariant._sVariantKey === undefined) {
          sVariant = this.oVariantSetFT.getVariant(
            this.oVariantSetFT.getVariantKeyByName(oSelectedVariant)
          );
        } else {
          sVariant = this.oVariantSetFT.getVariant(
            oSelectedVariant.getVariantKey()
          );
        }
        var aFilters = JSON.parse(sVariant.getItemValue("FiltersVal"))
          .filterValues;
        var aCurrentFilters = that.getView()
          .byId("locationFilterBar")
          .getAllFilterItems();
        //Filter Bar ID
        if (aFilters) {
          for (var i = 0; i < aFilters.length; i++) {
            for (var j = 0; j < aCurrentFilters.length; j++) {
              if (aFilters[i].name === aCurrentFilters[j].getProperty("name")) {
                var tokens = [];
                aFilters[i].values.forEach(function (el) {
                  var tok = new sap.m.Token({
                    key: el.key,
                    text: el.text,
                  });
                  tokens.push(tok);
                });
                // if (aCurrentFilters[j].getControl().mAggregations.items === undefined) {
                if (
                  aCurrentFilters[j].getControl().mAggregations.tokenizer !==
                  undefined
                ) {
                  aCurrentFilters[j].getControl().setTokens(tokens);
                } else {
                  var keyArr = [];
                  for (var a = 0; a < tokens.length; a++) {
                    keyArr.push(tokens[a].getKey());
                  }
                  aCurrentFilters[j].getControl().setSelectedKeys(keyArr);
                }
                aCurrentFilters[j].setVisibleInFilterBar(aFilters[i].property);
              }
            }
          }
        }
      } // null means the standard variant is selected or the variant which is not available, then show all columns
      else {
        that.getView()
          .byId("locationFilterBar")
          .getAllFilterItems()
          .forEach(function (oFilters) {
            oFilters.setVisible(true);
            oFilters.setVisibleInFilterBar(true);
            if (oFilters.getControl().mAggregations.items === undefined) {
              oFilters.getControl().removeAllTokens();
            } else {
              oFilters.getControl().removeAllItems();
            }
          });
      }
    },

    /**
     * Handle Delete of Filter Bar Variant
     */
    onManageVariFT: function (oEvent, that) {
      var aParameters = oEvent.getParameters();
      // rename variants
      if (aParameters.renamed.length > 0) {
        aParameters.renamed.forEach(
          function (aRenamed) {
            var sVariant = this.oVariantSetFT.getVariant(aRenamed.key),
              fItemValue = sVariant.getItemValue("FiltersVal");
            // delete the variant
            this.oVariantSetFT.delVariant(aRenamed.key);
            // after delete, add a new variant
            var oNewVariant = this.oVariantSetFT.addVariant(aRenamed.name);
            oNewVariant.setItemValue("FiltersVal", fItemValue);
          }.bind(this)
        ); // if (this.oVariantSetFT.getCurrentVariantKey() !== null) {
        // 	var defVariantKey = [{
        // 		key: this.oVariantSetFT.getCurrentVariantKey()
        // 	}];
        // }
      }
      // default variant change
      if (aParameters.def !== "*standard*") {
        this.oVariantSetFT.setCurrentVariantKey(aParameters.def);
      } else {
        this.oVariantSetFT.setCurrentVariantKey(null);
      }
      // Delete variants
      if (aParameters.deleted.length > 0) {
        aParameters.deleted.forEach(
          function (aDelete) {
            this.oVariantSetFT.delVariant(aDelete);
          }.bind(this)
        );
      }
      //  Save the Variant Container
      this.oContainerFT
        .save()
        .done(function () {
          // Tell the user that the personalization data was saved
          jQuery.sap.log.info("deleted");
        })
        .fail(function () {
          jQuery.sap.log.error("failDe");
        });
    },
  };
});
