sap.ui.define([
	"com/eramet/Convergence_Achat_Magasin/controller/BaseController",
	"com/eramet/Convergence_Achat_Magasin/util/constans",
	"com/eramet/Convergence_Achat_Magasin/util/formatter"
], function (BaseController, constans, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.Convergence_Achat_Magasin.controller.Inventaire.Inventaire", {
		/* eslint-disable */
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Inventaire") {
				this.registerNavFrom(this);
				this._resetModel();
				//We have one entry currently so for test we don't want to navigate
				/*if(this.getView().getModel("listDocModel").getData().length === 1) {
					constans.aDetailDoc = this.getView().byId("documentList").getModel("listDocModel").getData()[0];
					this.getRouter().navTo("DetailsDoc");
				}*/
			}
		},
		
		backToHome: function () {
			this.getRouter().navTo("Home");
		},
		
		_resetModel: function () {
			/*var aElements = [
				{
					"PhysicalInventoryDocumentTitle": "N° doc 1",
			    	"Plant": "Plant 1",
			    	"StorageLocation": "Storage location 1"
				},
				{
					"PhysicalInventoryDocumentTitle": "N° doc 2",
			    	"Plant": "Plant 2",
			    	"StorageLocation": "Storage location 2"
				},
				{
					"PhysicalInventoryDocumentTitle": "N° doc 3",
			    	"Plant": "Plant 3",
			    	"StorageLocation": "Storage location 3"
				}
			];
			constans.aListDoc = aElements;*/
			console.log(constans.aListDoc);
			this.listDocModel(constans.aListDoc);
		},
		
		onPressNavToDoc: function (oEvent) {
			var sPath = oEvent.getSource().oBindingContexts.listDocModel.sPath;
			sPath = sPath.split("/")[1];
			if(sPath.indexOf("/") > -1) {
				sPath = sPath.split("/")[0];
			}
			constans.aDetailDoc = this.getView().byId("documentList").getModel("listDocModel").getData()[sPath];
			this.getRouter().navTo("DetailsDoc");
		}
		/* eslint-enable */
	});
});