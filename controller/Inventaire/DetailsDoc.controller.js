sap.ui.define([
	"com/eramet/Convergence_Achat_Magasin/controller/BaseController",
	"com/eramet/Convergence_Achat_Magasin/util/constans",
	"com/eramet/Convergence_Achat_Magasin/util/formatter",
	"sap/m/MessageBox"
], function (BaseController, constans, formatter, MessageBox) {
	"use strict";

	return BaseController.extend("com.eramet.Convergence_Achat_Magasin.controller.Inventaire.DetailsDoc", {
	
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "DetailsDoc") {
				this.registerNavFrom(this);
				var sTile = this.getView().getModel("i18n").getResourceBundle().getText("detailsDoc");	
			//	this.getView().byId("title").setText(sTile + " " + constans.aDetailDoc.title.split("N° doc ")[1]);
			
			//Breadcrumb title is corrupted becuase there is a new property name
			//	this.getView().byId("breadcrumbs").setCurrentLocationText(sTile + " " + constans.aDetailDoc.title.split("N° doc ")[1]);
				this.getView().byId("breadcrumbs").setCurrentLocationText(sTile + " " + constans.aDetailDoc.PhysicalInventoryDocumentTitle);
				this._resetModel();
				this._onSetSearchFieldEmpty();
			//	this._initStepInputs();
			//	this._setTitle();
			}
		},
		
		_setTitle: function () {
			var sTile = this.getView().getModel("i18n").getResourceBundle().getText("detailsDoc"),
				sValue = this.getView().getModel("documentsModel").getData().length;
			this.getView().byId("title").setText(sTile + " " + sValue);
		},
		
		backToHome: function () {
			this._resetModel();
			this.getRouter().navTo("Home");
			
			this.activeLine = "";
		},
		
		onPressNavBack: function () {
			this._resetModel();
			this.getRouter().navTo("Inventaire");
			
			this.activeLine = "";
		},
		
		_resetModel: function () {
			var aElements = [];
			/*var aElements = [
				{
					"title": "Code article 1",
			    	"designation": "Désignation 1",
			    	"emplacement": "Emplacement 1",
			    	"quantity": "0",
			    	"addEnabled":false,
			    	"removeEnabled":false
				},
				{
					"title": "Code article 2",
			    	"designation": "Désignation 1",
			    	"emplacement": "Emplacement 1",
			    	"quantity": "0",
			    	"addEnabled":false,
			    	"removeEnabled":false
				},
				{
					"title": "Code article 3",
			    	"designation": "Désignation 3",
			    	"emplacement": "Emplacement 3",
			    	"quantity": "0",
			    	"addEnabled":false,
			    	"removeEnabled":false
				},
				{
					"title": "Code article 4",
			    	"designation": "Désignation 4",
			    	"emplacement": "Emplacement 4",
			    	"quantity": "0",
			    	"addEnabled":false,
			    	"removeEnabled":false
				},
				{
					"title": "Code article 5",
			    	"designation": "Désignation 5",
			    	"emplacement": "Emplacement 5",
			    	"quantity": "0",
			    	"addEnabled":false,
			    	"removeEnabled":false
				},
				{
					"title": "Code article 6",
			    	"designation": "Désignation 6",
			    	"emplacement": "Emplacement 6",
			    	"quantity": "0",
			    	"addEnabled":false,
			    	"removeEnabled":false
				}
			];*/
			
			
			var that = this;
			var sUrl = com.eramet.Convergence_Achat_Magasin.Component.getMetadata().getManifestEntry("sap.app").dataSources["MM_IM_PHYS_INV_DOC_SRV"].uri;
			
			var oModel = new sap.ui.model.odata.ODataModel(sUrl,true);
			
			oModel.read("/C_PhysInvtryDocItemObjPage", {
				success: function (oData, oResponse) {
					
					console.log(constans.aDetailDoc.PhysicalInventoryDocumentTitle.split(" ")[0]);
					console.log(oData.results[0].PhysicalInventoryDocument);
					for(var i=0;i<oData.results.length;i++){
						if(oData.results[i].PhysicalInventoryDocument === constans.aDetailDoc.PhysicalInventoryDocumentTitle.split(" ")[0]){
							
							oData.results[i].addEnabled = false;
							oData.results[i].removeEnabled = false;
							oData.results[i].baseQuantity = 0;
							oData.results[i].Quantity = "0";
							oData.results[i].emplacement = " ";
							oData.results[i].designation = "Désignation "+i;
							
							aElements.push(oData.results[i]);
						}
					}
					
					that.onConcatModels(aElements);
					that.documentsModel(aElements);
				//	constans.aListDoc = oData.results;     
					that.getView().getModel("documentsModel").setData(aElements);
					that.getView().getModel("documentsModel").refresh(true);
					that._checkFullList();
					that._setTitle();
					that._initStepInputs();
				//	that.getView().byId("inventory").getTileContent()[0].getAggregation("content").setValue(oData.results.length);
				},
				error: function (oData, oResponse) {
					console.log("fail",oResponse);
				}
			});
			
			
			
		},
		
		onConcatModels: function(aElements){
			var that = this;
			var sUrlDetails = com.eramet.Convergence_Achat_Magasin.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZI_INV_ARTICLEDETAIL_CDS"].uri;
			var oModelDetails = new sap.ui.model.odata.ODataModel(sUrlDetails,true);
			var aExtendedMaterial = [];
			
			oModelDetails.read("ZI_INV_ARTICLEDETAIL", {
				success: function (oData, oResponse) {
				
					console.log(oData.results);
					
					for(var i=0; i<oData.results.length;i++){
						for(var j=0; j<aElements.length; j++){
							//console.log(oData.results[i])
							if(aElements[j].Material == oData.results[i].matnr){

								aElements[j].materialDesc = oData.results[i].maktx;
								//aElements[j].emplacement = oData.results[i].maktx;
								aElements[j].designation = oData.results[i].mtart;
								
							//	aExtendedMaterial.push(aElements[j]);
								
								that.documentsModel(aElements);
							
							}
						}
						
					}
				},
				error: function (oData, oResponse) {
					console.log("fail",oResponse);
				}
			});
			
		},
		
		onSuggest: function (oEvent) {
		//	this._resetModel();
			var value = oEvent.getParameter("suggestValue"),
				afilters = [];
				
			if (value) {
				/*filters.push(new sap.ui.model.Filter("emplacement", function(sDes) {
						return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
					}));*/
				/*GT - 20.02.2020 - add Article filter currently we call it title in the json object*/	
				afilters.push(new sap.ui.model.Filter({
				    filters: [
				     // new sap.ui.model.Filter("emplacement", sap.ui.model.FilterOperator.Contains, value),
					  new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.Contains, value),
					  new sap.ui.model.Filter("designation", sap.ui.model.FilterOperator.Contains, value)
				 ],
				 and: false
				}));
				
					
			}
			this.getView().byId("searchField").getBinding("suggestionItems").filter(afilters);
			this.getView().byId("searchField").suggest();
		},
		
		onSearch: function (oEvent) {
			constans.aDoc = [];
			var oItem = oEvent.getParameter("suggestionItem"),
				oView = this.getView();
				
			if(oItem === undefined) {
				if(oView.byId("searchField").mBindingInfos && oView.byId("searchField").mBindingInfos.suggestionItems && 
				oView.byId("searchField").mBindingInfos.suggestionItems.binding && oView.byId("searchField").mBindingInfos.suggestionItems.binding.aIndices &&
				oView.byId("searchField").mBindingInfos.suggestionItems.binding.aIndices.length > 0) {
					var aElements = [],
						documentsModel = this.getModel("documentsModel").getData();
						
					for(var i = 0; 	i < oView.byId("searchField").mBindingInfos.suggestionItems.binding.aIndices.length; i++) {
						
						aElements.push(documentsModel[oView.byId("searchField").mBindingInfos.suggestionItems.binding.aIndices[i]]);
					}

					constans.aDoc = aElements;
					this.documentsModel(aElements);
				}
		
				
			}
			else{

				var aElements = []

				oView.byId("searchField").setValue(oEvent.mParameters.suggestionItem.mProperties["description"].split(" ")[0]);
				
				var aDetails = this.getModel("documentsModel").getData();
				
				for(var i=0; i<aDetails.length;i++){
					if(aDetails[i]["Material"] === oEvent.mParameters.suggestionItem.mProperties["description"].split(" - ")[0]){
						aElements.push(aDetails[i]);
					}
				}
				
				this.documentsModel(aElements);
				
			}
			
			this.activeLine = "";
		},
		
		_onSetSearchFieldEmpty: function(){
			this.getView().byId("searchField").setValue("");
		},
		
		onChangeQuantity: function (oEvent) {
			
			console.log(oEvent);
			
			var documentsModel = this.getView().getModel("documentsModel").getData(),
				sId = oEvent.getSource().sId.split("documentList-")[1];
			documentsModel[sId].quantity = oEvent.getSource().getValue();
			
			this.getView().getModel("documentsModel").updateBindings(true);
			this.getView().getModel("documentsModel").refresh(true);
			this._checkFullList();
			this._initStepInputs();
		},
		
		_checkFullList: function () {

			var oList = this.getView().getModel("documentsModel").getData(),
				bFull = false,
				iCounter = 0;
			for(var i = 0; i < oList.length; i++) {
				if(parseInt(oList[i].quantity) > 0) {
					iCounter++;
				}
			}
			//if(iCounter === oList.length)
			//Because of partial inventory we don't need to check the full list
			if(iCounter >= 1){
				bFull = true;
			}
			if(bFull) {
				this.getView().byId("confirmer").setEnabled(true);
				this.getView().byId("confirmer").setType("Emphasized");
			} else {
				this.getView().byId("confirmer").setEnabled(false);
				this.getView().byId("confirmer").setType("Ghost");
			}
			
			/*Set partial inventory flag*/
			if(iCounter === oList.length){
				this.bPartialInventory = false;
			}
			else{
				this.bPartialInventory = true;
			}
			
			
		},
		
		onPressConfirmer: function () {
			var that = this;
			var sMessage = "";
			var sTitle = this.getView().getModel("i18n").getResourceBundle().getText("detailsDocMessageBoxTitle"),
				sButtonSave = this.getView().getModel("i18n").getResourceBundle().getText("detailsDocMessageBoxButton1"),
				sButtonCancel = this.getView().getModel("i18n").getResourceBundle().getText("detailsDocMessageBoxButton2");
		
			console.log(this.bPartialInventory);
			
			if(this.bPartialInventory){
				sMessage = this.getView().getModel("i18n").getResourceBundle().getText("detailsDocPartialMessageText");
			}
			else{
				sMessage = this.getView().getModel("i18n").getResourceBundle().getText("detailsDocMessageText");
			}
				
			MessageBox.confirm(sMessage, {
				title: sTitle,
				actions: [sButtonSave, sButtonCancel],
				onClose: function (oAction) {
					console.log(oAction);
					
					if(oAction === "Oui"){
						BaseController.prototype.displayPopup(
						"L’inventaire a été sauvegardé",
						"Confirmer",
						"warning",
						function close(){
								that.onCountItems();
							}
						);
					}
					
				}
			});
		},
		
		onCountItems: function(){
			var that = this;
			var sUrlDetails = com.eramet.Convergence_Achat_Magasin.Component.getMetadata().getManifestEntry("sap.app").dataSources["API_PHYSICAL_INVENTORY_DOC_SRV"].uri;
			var oModelDetails = new sap.ui.model.odata.ODataModel(sUrlDetails,true);
			var oInventoryItemsModel = new sap.ui.model.odata.ODataModel(sUrlDetails,true);
			
			var aListData = this.getView().getModel("documentsModel").getData();
			
			oModelDetails.read("A_PhysInventoryDocHeader(PhysicalInventoryDocument='"+aListData[0].PhysicalInventoryDocument+"',FiscalYear='"+aListData[0].FiscalYear+"')", {
				success: function (oData, oResponse) {
				
				var batchModel = oInventoryItemsModel;
					var batchChanges=[];

						var oChangeSet;
						
						for(var i=0;i<aListData.length;i++){
							/*For partial inventory we have to check which items have been changed. If the Quantity is bigger than 0 it means that 
							the user changed the item
							*/
							if(aListData[i].Quantity > 0){
								oChangeSet = {
									"QuantityInUnitOfEntry" : ""+aListData[i].Quantity+"",
									"UnitOfEntry" : ""+aListData[i].UnitOfEntry+"",
									"Material" : ""+aListData[i].Material+"",
									"Batch":aListData[i].Batch
								};
								batchChanges.push(
									batchModel.createBatchOperation("A_PhysInventoryDocItem(PhysicalInventoryDocument='"+aListData[i].PhysicalInventoryDocument+"',FiscalYear='"+aListData[i].FiscalYear+"',PhysicalInventoryDocumentItem='"+aListData[i].PhysicalInventoryDocumentItem+"')","PATCH", oChangeSet, {sETag: oResponse.headers.etag}));
							}
						}

					batchModel.setUseBatch(true);
					batchModel.addBatchChangeOperations(batchChanges);
		    		batchModel.submitBatch(
		    			function(oData){
		    				console.log(oData.__batchResponses);
		    				
		    				if(oData.__batchResponses[0].response){
		    					var oError = JSON.parse(oData.__batchResponses[0].response.body);
		    					var sErrorText = oError.error.message.value;
		
			                    MessageBox.error(sErrorText,
			                        {
			                            styleClass: "sapUiSizeCompact"
			                        }
			                    ); 
		    				}
		    				else{
		    					that.onPressNavBack();
		    				}
		    			},
		    			function(oData,oResponse){
		    			
		    			}
		    		);	

				},
				error: function (oData, oResponse) {
					console.log("fail",oResponse);
				}
			});
			
		},
		
		
		onOpenAjoutDePosteDialog: function (evt) {
			var ajoutDialog = sap.ui.xmlfragment("com.eramet.Convergence_Achat_Magasin.view.fragment.ajoutDePoste", this);
			this.getView().addDependent(ajoutDialog);
			ajoutDialog.open();
			this._fillAjoutDePosteDialog();
		},
		
		_fillAjoutDePosteDialog: function () {
			var oList = this.getView().getModel("documentsModel").getData(),
				core = sap.ui.getCore(),
				sCodeArt = "Code article " + (oList.length + 1),
				sDesignation = "Désignation " + (oList.length + 1),
				sEmplacement = "Emplacement " + (oList.length + 1);
			core.byId("codeArt").setValue(sCodeArt);
			core.byId("designation").setValue(sDesignation);
			core.byId("emplacement").setValue(sEmplacement);
		},
		
		onPressClose: function () {
			var oList = this.getView().getModel("documentsModel").getData(),
				core = sap.ui.getCore(),
				oElement = {};
			
			
			/*Get data from dialog*/
			oElement.title = core.byId("codeArt").getValue();
			oElement.designation = core.byId("designation").getValue();
			oElement.emplacement = core.byId("emplacement").getValue();
			/*Handle the case if the quantity is zero*/
			core.byId("quantity").getValue() === "" ? oElement.Quantity = 0 : oElement.Quantity = core.byId("quantity").getValue();
			
			oElement.addEnabled = true;
			oElement.removeEnabled = false;
			
			oList.push(oElement);
			this.documentsModel(oList);
		
			this._onSetListItemInactive(); 

			this.activeLine = this.getView().getModel("documentsModel").getData().length-1;
			
			this._checkFullList();
			this._initStepInputs();
			this._setTitle();
			this._closePopup();
		},
		
		_closePopup: function () {
			var core = sap.ui.getCore();
			core.byId("ajoutDePoste").close();
			core.byId("ajoutDePoste").destroy();
		},
		
		onPressSave: function () {
			var that = this;
			var oList = this.getView().getModel("documentsModel").getData();
			/*removingElements = [],
			j = 0;
			for (var i = 0; i < oList.length; i++) {
				if(parseInt(oList[i].quantity) > 0) {
					removingElements[j] = i;
					j++;
				}
			}
			removingElements.sort();
			for (var k = removingElements.length - 1; k >= 0; k--) {
				oList.splice(removingElements[k], 1);
			}*/
			BaseController.prototype.displayPopup(
				"L’inventaire n°"+ that.getView().byId("breadcrumbs").getProperty("currentLocationText")+" a été réalisé",
				"Sauvetage",
				"success",
				function close(){
					
					//that.onPressNavBack()
					
					var that = this;
							var sUrlDetails = com.eramet.Convergence_Achat_Magasin.Component.getMetadata().getManifestEntry("sap.app").dataSources["API_PHYSICAL_INVENTORY_DOC_SRV"].uri;
							var oModelDetails = new sap.ui.model.odata.ODataModel(sUrlDetails,true);
							var oModelDetails2 = new sap.ui.model.odata.ODataModel(sUrlDetails,true);
					
					/*	oModelDetails.read("A_PhysInventoryDocHeader(PhysicalInventoryDocument='100000007',FiscalYear='2020')", {
								success: function (oData, oResponse) {
								//	console.log(oData);
								//	console.log(oResponse.headers.etag);
								
								var batchModel = oModelDetails2;
									var batchChanges=[];
									
									var changeSet ={
										  "Plant": "ZP11",
										  "StorageLocation": "MAIN",
										  "Material":"28",
										  "Batch":"0000000026"
										}
									
									batchChanges.push(batchModel.createBatchOperation("A_PhysInventoryDocItem(FiscalYear='2020',PhysicalInventoryDocument='100000007',PhysicalInventoryDocumentItem='006')", "PATCH", changeSet,{sETag: oResponse.headers.etag} ));
									
									batchModel.setUseBatch(true);
									batchModel.addBatchChangeOperations(batchChanges);
						    		batchModel.submitBatch(
						    			function(oData){
						    				console.log(oData);
						    		
						    			},
						    			function(oResponse){
						    				console.log(oResponse);
						    			}
						    		);	

								},
								error: function (oData, oResponse) {
									console.log("fail",oResponse);
								}
							});*/
					
					}
				);
		
			this.documentsModel(oList);
			this._initStepInputs();
			this._setTitle();
		},
		
		_initStepInputs: function () {
			
			var oList = this.getView().byId("documentList").getItems();
			console.log(this.getView().byId("documentList").getItems());
			for(var i = 0; i < oList.length; i++) {
				 if(parseInt(oList[i].getContent()[0].getItems()[3].getItems()[1].getValue()) === 0) {
				 	oList[i].getContent()[0].getItems()[3].getItems()[0].setEnabled(false);
				 }
			} 
		},
		
		onPressDec: function (oEvent) {
			var core = sap.ui.getCore(),
				iValue = parseInt(core.byId(oEvent.getSource().oParent.oParent.getItems()[3].getItems()[1].sId).getValue());
			iValue = iValue - 1;
			core.byId(oEvent.getSource().oParent.oParent.getItems()[3].getItems()[1].sId).setValue("" + iValue);
			
			var sId = oEvent.getSource().sId.split("documentList-")[1]; 
			this.getView().getModel("documentsModel").getData()[sId].quantity =  iValue; 
			this.getView().getModel("documentsModel").refresh(true);
			this._checkFullList();
			if(parseInt(core.byId(oEvent.getSource().oParent.oParent.getItems()[3].getItems()[1].sId).getValue()) === 0) {
				core.byId(oEvent.getSource().oParent.oParent.getItems()[3].getItems()[0].sId).setEnabled(false);
			} else {
				core.byId(oEvent.getSource().oParent.oParent.getItems()[3].getItems()[0].sId).setEnabled(true);
			}
		},
		
		onPressInc: function (oEvent) {
			var core = sap.ui.getCore();
			var	iValue = parseInt(core.byId(oEvent.getSource().oParent.oParent.getItems()[3].getItems()[1].sId).getValue());

			iValue = iValue + 1;
			core.byId(oEvent.getSource().oParent.oParent.getItems()[3].getItems()[1].sId).setValue("" + iValue);
			
			var sId = oEvent.getSource().sId.split("documentList-")[1]; 
			this.getView().getModel("documentsModel").getData()[sId].quantity =  iValue; 
			this.getView().getModel("documentsModel").refresh(true);
			this._checkFullList();
			if(parseInt(core.byId(oEvent.getSource().oParent.oParent.getItems()[3].getItems()[1].sId).getValue()) > 0) {
				core.byId(oEvent.getSource().oParent.oParent.getItems()[3].getItems()[0].sId).setEnabled(true);
			} else {
				core.byId(oEvent.getSource().oParent.oParent.getItems()[3].getItems()[0].sId).setEnabled(false);
			}
		},
		
		/*Enable counters in the list*/
		
		//activeLine is a flag to handle the active/inactive line state
		activeLine: "",
		bPartialInventory: false,
		
		/*This function handle the line item active/inactive state*/
		onEnableItem: function(oEvent){
			var sPath = oEvent.getSource().sId.split("-")[4];
			var oDocumentsModel = this.getView().getModel("documentsModel");

			/*Handle the active line item flag */
			this._onSetListItemInactive();
			
			//If there is a valid quantity we have to enable the minus button
			oDocumentsModel.getData()[sPath].quantity > 0 ? oDocumentsModel.getData()[sPath].removeEnabled = true : "";
			
			/*Make button clickable*/
			oDocumentsModel.getData()[sPath].addEnabled = true;
			oDocumentsModel.refresh(true);
			
			/*set the active line item flag*/
			this.activeLine = sPath;

		},
		
		_onSetListItemInactive: function(){
			var oDocumentsModel = this.getView().getModel("documentsModel");
			
			if(this.activeLine === ""){
			}
			else{
				oDocumentsModel.getData()[this.activeLine].addEnabled = false;
				oDocumentsModel.getData()[this.activeLine].removeEnabled = false
			}
			
			this.getView().getModel("documentsModel").refresh(true);
			
			console.log(this.getView().getModel("documentsModel").getData());
		}
	});
});