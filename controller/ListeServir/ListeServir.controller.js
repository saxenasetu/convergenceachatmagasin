sap.ui.define([
	"com/eramet/Convergence_Achat_Magasin/controller/BaseController",
	"com/eramet/Convergence_Achat_Magasin/util/constans",
	"com/eramet/Convergence_Achat_Magasin/util/formatter"
], function (BaseController, constans, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.Convergence_Achat_Magasin.controller.ListeServir.ListeServir", {
		/* eslint-disable */
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "ListeServir") {
				this.registerNavFrom(this);
				this._resetModel();
				var sTile = this.getView().getModel("i18n").getResourceBundle().getText("listeServirTitle");	
				this.getView().byId("title").setText(sTile + " (" + this.getView().getModel("listServirModel").getData().length + ")");
			}
		},
		
		backToHome: function () {
			this.getRouter().navTo("Home");
		},
		
		_resetModel: function () {
		/*	var aElements = [
				{
					"title": "N° liste 1",
			    	"ref": "Réf (OT ou avis) 1",
			    	"demandeur": "Demandeur 1",
			    	"service": "Service 1"
				},
				{
					"title": "N° liste 2",
			    	"ref": "Réf (OT ou avis) 2",
			    	"demandeur": "Demandeur 2",
			    	"service": "Service 2"
				},
				{
					"title": "N° liste 3",
			    	"ref": "Réf (OT ou avis) 3",
			    	"demandeur": "Demandeur 3",
			    	"service": "Service 3"
				}
			];*/
			//constans.aListServir = aElements;
		
			this.listServirModel(constans.aListServir);
		},
		
		onPressNavToList: function (oEvent) {
			var sPath = oEvent.getSource().oBindingContexts.listServirModel.sPath;
			sPath = sPath.split("/")[1];
			if(sPath.indexOf("/") > -1) {
				sPath = sPath.split("/")[0];
			}
			constans.aList = this.getView().byId("serviceList").getModel("listServirModel").getData()[sPath];
			this.getRouter().navTo("Liste");
		},
		
		onSuggest: function (oEvent) {
		//	this._resetModel();
			var value = oEvent.getParameter("suggestValue"),
				afilters = [];
				
			if (value) {
				
				afilters.push(new sap.ui.model.Filter({
				    filters: [
					  new sap.ui.model.Filter("DeliveryDocument", sap.ui.model.FilterOperator.Contains, value)
				 ],
				 and: false
				}));
				
					
			}
			this.getView().byId("servirSearch").getBinding("suggestionItems").filter(afilters);
			this.getView().byId("servirSearch").suggest();
		},
		
		onSearch: function (oEvent) {
			constans.aDoc = [];
			var oItem = oEvent.getParameter("suggestionItem"),
				oView = this.getView();
				
			
			console.log(oEvent.mProperties);	
			console.log(oEvent.getSource());
				
			if(oItem === undefined) {
				console.log("empty search bar");
				console.log("searchbar value",this.getView().byId("servirSearch").getValue());
				if(this.getView().byId("servirSearch").getValue() != ""){
					oView.byId("serviceList").getBinding("items").filter(new sap.ui.model.Filter({
					    filters: [
						  new sap.ui.model.Filter("DeliveryDocument", sap.ui.model.FilterOperator.EQ, this.getView().byId("servirSearch").getValue())
					 ],
					 and: false
					}));
				}
				else{
					oView.byId("serviceList").getBinding("items").filter("");
				}
				
				
				
			}
			else{
				oView.byId("serviceList").getBinding("items").filter(new sap.ui.model.Filter({
				    filters: [
					  new sap.ui.model.Filter("DeliveryDocument", sap.ui.model.FilterOperator.EQ, oItem.getProperty("text"))
				 ],
				 and: false
				}));
				
				
			}
			
		}
		
		
		/* eslint-enable */
	});

});