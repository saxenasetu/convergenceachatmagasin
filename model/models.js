sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createLocalModel: function(oView, oData, sName) {
			var oInitData = typeof oData === "undefined" ? {} : oData;
			oView.setModel(new JSONModel(oInitData), sName);
		},
		
		listDocModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "listDocModel");
			
		},
		
		listModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "listModel");
		},
		
		imageModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "imageModel");
		},
		
		documentsModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "documentsModel");
		},
		
		listServirModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "listServirModel");
		},
		
		purchaseModel: function(oView, oData){
			this.createLocalModel(oView, oData, "purchaseModel");
		}

	};
});