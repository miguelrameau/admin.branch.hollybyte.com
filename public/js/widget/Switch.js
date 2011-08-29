var Widget_Switch = function(id, active, class){
		var baseId = "switch_"+id;
		this.id = id;
		var myThis = this;
		this.state = active;
		this.switchState = function(){};
		this.switchOnEvent = function(){};
		this.switchOffEvent = function(){};
		//ELEMENT-INFO "switch_"+
		this.widget = document.createElement('div');
		this.widget.setAttribute( "id", baseId );
		this.widget.setAttribute( "class", class );
		
		this.widgetEnabled = document.createElement('img');
		this.widgetEnabled.setAttribute("id", baseId+"_on");
		this.widgetEnabled.setAttribute("src", "images/assetlist/publish_on.png");
		this.widgetEnabled.onclick = function(e){myThis.switchState(myThis)};
		this.widget.appendChild(this.widgetEnabled);
		
		this.widgetDisabled = document.createElement('img');
		this.widgetDisabled.setAttribute("id", baseId+"_on");
		this.widgetDisabled.setAttribute("src", "images/assetlist/publish_off.png");
		this.widgetDisabled.onclick = function(e){myThis.switchState(myThis)};
		this.widget.appendChild(this.widgetDisabled);
		
		if(active){
			this.widgetDisabled.setAttribute('style', 'display:none;');
		}else{
			this.widgetEnabled.setAttribute('style', 'display:none;');
		}
		
		
		//RETURN THE DOM ELEMENT
		this.getElement = function (){
			return this.widget;
		}
		
		//CHANGE THE STATE ON/OFF
		this.switchState = function (myThis){
			
			if(myThis.state == true){
				myThis.widgetEnabled.setAttribute('style', 'display:none;');
				myThis.widgetDisabled.setAttribute('style', 'display:block;');
				myThis.state = false;
				myThis.switchOffEvent();
			}else{
				myThis.widgetDisabled.setAttribute('style', 'display:none;');	
				myThis.widgetEnabled.setAttribute('style', 'display:block;');
				myThis.state = true;
				myThis.switchOnEvent();
			}
			
			return myThis.state;
		
		}
		
		
}



