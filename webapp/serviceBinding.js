function initModel() {
	var sUrl = "/sap/opu/odata/sap/Z_MOB49_02_SALESORDER_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}