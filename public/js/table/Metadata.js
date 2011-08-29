var Table_Metadata = function(dataTable){
	this.dataTable = dataTable;
	
	//var nNodes = dataTable.fnGetNodes( );
	var myThis = this;
	//dataTable.fnSetColumnVis( 0, false );
	
	/*for(var i=0;i<nNodes.length;i++){
		alert(nNodes[i].innerHTML);
	}*/
	$('.metadata-edit-image').click(function (e){myThis.editImage(this)});
	$('.metadata-delete-image').click(function (e){myThis.deleteElement(this)});
	
	
	this.editImage = function(myThis){
		var node = myThis.parentNode.parentNode;
		var pos = this.dataTable.fnGetPosition(node);
		alert(pos);
		
		//var rowNode = this.parentNode.class;
		//alert(rowNode);
		//var pos = dataTable.fnGetPosition(rowNode);
		//alert(pos);
		//popup('uploadmetaimage', '/asset/uploadmetaimage', 400, 200, 400);
		
	}
	
	this.deleteElement = function(myThis){
		var node = myThis.parentNode.parentNode;
		var pos = this.dataTable.fnGetPosition(node);
		//alert(pos);
	}
	
	
}