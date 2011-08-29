

var Widget_ColorPickerLoader = function(parentId, colorIni){
	this.parentId = parentId;
	this.colorIni = colorIni;
	
	this.contentId = parentId+'_wColorPicker';
	this.inputId = parentId+'_wColorPicker_field';
	this.selectorId = parentId+'_wColorPicker_selector';
	this.holderId = parentId+'_wColorPicker_holder';
	this.widt;

	
	this.generateHTML = function(){
		try{
 
			var parent = $("#"+this.parentId).get(0);
			//CONTENT
			var content = document.createElement('div');
			content.setAttribute("id", this.contentId);
			content.setAttribute("class", "wColorPicker");
			parent.appendChild(content);
			
			//INPUT
			var input = document.createElement('input');
			input.setAttribute("id", this.inputId);	
			input.setAttribute("class", "colorpickerField");
			input.setAttribute("maxlength", "6");
			input.setAttribute("size", "6");
			input.setAttribute("type", "text");
			input.setAttribute("value", this.colorIni);
			//input.style.backgroundColor = "#"+this.colorIni;
			content.appendChild(input);
			
			
			//SELECTOR
			var selector = document.createElement('div');
			selector.setAttribute("id", this.selectorId);	
			selector.setAttribute("class", "colorSelector");
			content.appendChild(selector);
			//INSIDE SELECTOR
			var insideSelector = document.createElement('div');
			insideSelector.style.backgroundColor = "#"+this.colorIni;
			selector.appendChild(insideSelector);
			
			
			
			
			//SELECTOR
			var holder = document.createElement('div');
			holder.setAttribute("id", this.holderId);	
			holder.setAttribute("class", "colorpickerHolder");
			content.appendChild(holder);
		
		
		}
		catch(e){
		 //salert('An error has occurred: '+e.message+' ->'+this.parentId)
		}
		
		

		
	}
	
	this.changeValue = function(value){
		$('#'+this.selectorId+' div').css('backgroundColor', '#' + value);
		$('#'+this.inputId)[0].setAttribute("value", value);
		
	}
	
	
	this.loadWidget = function(){
		this.generateHTML();
		var myThis = this;
		
		
		
		$('#'+myThis.inputId).ColorPicker({
				eventName: '',
				
				onSubmit: function(hsb, hex, rgb, el) {
					$(el).val(hex);
					$(el).ColorPickerHide();
					
					
					$('#'+myThis.selectorId+' div').css('backgroundColor', '#' + hex);
					//$(el).css('backgroundColor', '#' + hex);
					
				},
				onBeforeShow: function (hsb, hex, rgb, el) {
					$(this).ColorPickerSetColor(this.value);
					$('#'+myThis.selectorId+' div').css('backgroundColor', '#' + this.value);
					$('#'+myThis.holderId).stop().animate({height: true ? 0 : 173}, 500);
					myThis.widt = false;
					$(el).ColorPickerHide();
	
				}
			})
			.bind('keyup', function(){
				
				$(this).ColorPickerSetColor(this.value);
				$('#'+myThis.selectorId+' div').css('backgroundColor', '#' + this.value);		
				
			}
		);
			
			
		$('#'+myThis.holderId).ColorPicker({
			flat: true,
			color: this.colorIni,
			onSubmit: function(hsb, hex, rgb, el) {
				
				$('#'+myThis.selectorId+' div').css('backgroundColor', '#' + hex);
				//$('#'+myThis.inputId).css('backgroundColor', '#' + hex);
				
				$('#'+myThis.inputId).get(0).value = hex;
				$(el).stop().animate({height: myThis.widt ? 0 : 173}, 500);
				myThis.widt = !myThis.widt;
				
				
				
			}
		});
		
		$('#'+myThis.holderId+'>div').css('position', 'absolute');
			myThis.widt = false;
			$('#'+myThis.selectorId).bind('click', function() {
				$('#'+myThis.holderId).stop().animate({height: myThis.widt ? 0 : 173}, 500);
				myThis.widt = !myThis.widt;
				
		});
	
		
	}
	
	this.loadColorPicker = function(){
			myThis = this;
			$(document).ready(function() {
				myThis.loadWidget();	
			});
	}
		

	return this;
}

var loadColorPicker = function(parentId, colorBase){
	$(document).ready(function() {
		var colorPickerObj = new Widget_ColorPickerLoader(parentId, colorBase);
		colorPickerObj.loadWidget();	
	});
}
