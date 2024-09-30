/*
// Bobpop
// Vanilla JavaScript custom alerts using the Popover API and CSS anchors to show alerts/tooltips in the top layer potentially positioned with CSS anchors.
//
// I originally wrote this to help me create popover API error alerts on top of my existing dialog modals, but I figured it can be used for any small alert. 
// This was mostly me just testing the Popover API and CSS anchors. It is pretty limited in what you can do with anchors, but I figured it was good enough as a test.
//
// OPTIONS:
// 
// id: 					The DOM ID to specify to be used (default: bobpop)
// type: 				Defaults to auto (lightly dismissed - escape or click outside of it), but you can specify "manual" to make them hit the "X" to dismiss it (escape won't dismiss using manual so avoid manual if accessibility is a concern)
//
// title:				The header title of the popover (can be HTML) 
// titlePadding:		CSS padding for the title div (default: 5px 0px)
// titleBorderSize:		CSS size for the title div border-bottom (default: 1px)
// titleBorderType:		CSS border type for the title div border-bottom (default: dashed)
// titleBorderColor:	CSS border color for the title div border-bottom (default: #00000059)
//
// body: 				The body of the popover (can be HTML)
// closeButtonText:		Text of the "X" dismissal button (can be HTML) (default: ❌)
// hideCloseButton:		True/false - hides the "X" dismissal button only if type is set to auto
//
// maxHeight			CSS max-height (default: 90vh)
// scrollbarWidth		CSS Scrollbar Width (default: thin)
// border:				CSS border (default: none)
// borderRadius:		CSS border-radius (default: 15px)
// padding:				CSS padding (default: 15px)
// fontFamily			CSS font-family (default: sans-serif)
// color: 				CSS font color (default: black)
// background: 			CSS background (default: pink)
// boxShadow: 			CSS box-shadow (default cover backdrop with a mask of opacity)
// 
// position: 			CSS position - you may want to use absolute if you are using anchoring, but results may vary (default: fixed)
// margin: 				CSS margin (default: unset, default if anchor is specified: .5rem 0)
// 
// anchor: 				CSS anchor name to attach it to (e.g.: --anchorname)
// anchorToId:			Given a valid DOM element ID it will append the "anchor-name" CSS style with the given anchor option from above (--anchorname) so it will anchor the popover to it
// anchorBottom:		CSS bottom (default: anchor(top))
// anchorPositionArea:	CSS position-area (default: bottom)
//
// tooltipArrow:		Displays an arrow pointing outwards in the specified placement. (default: top center)
//							- The corners (left top, left bottom, right top, right bottom) point outwards diagonally and the others point outwards horizontally or vertically.
// tooltipArrowColor:	The color of the tooltip arrow. (default: black)
//						 ________________________________________________________________________________________
//						|																				 	   	 |
//						|left top - top left				top center						top right - right top|
//						|																				 	   	 |
//						|left middle																 right middle|
//						|																					   	 |
//						|left bottom - bottom left 			bottom center			  bottom right - right bottom|
//						|________________________________________________________________________________________|
//
// 
// bobpopOnOpen:		Will run an anonymous function you provide when the popover is opened.
//							Example to open a bobpop and have a form in the body 
//							with a submit button to check validity and run a function you want:
//
//								function addUser() {
//									const bodyhtml = `
//										<p>This will add a new user.</p>
//										<form id="addUser">
//											User Name: <input type="text" id="newusername" autofocus required>
//											<button id='addUserSubmitButton'>Add</button>
//										</form>
//									`;
//
//									bobpop({
//										title: 'Add User',
//										type: 'manual',
//										background: '#ddf0ff',
//										body: bodyhtml,
//										bobpopOnOpen: () => {
//											document.getElementById('addUser').addEventListener('submit', (event) => {
//												event.preventDefault();				
//												const isValid = document.getElementById('addUser').checkValidity();
//												
//												if (isValid) {
//													addUserSubmit();
//												}
//											});
//										}
//									})
//								}
//
//								function addUserSubmit() {
//									// do something
//								}
//
//
// bobpopOnClose:		Will run an anonymous function you provide when the popover is closed.
//							Example:
//								bobpop({
//									id: 'bobpop_warning',
//									title: 'Error',
//									body: 'That username is already taken! Please enter another.',
//									bobpopOnClose: () => {
//										document.getElementById('newusername').value = '';
//										document.getElementById('newusername').focus();
//									}
//								})
*/
function bobpop({
	id = 'bobpop',
	type = 'auto',
	title = 'Error!',
	titleBorderSize = '1px',
	titleBorderType = 'dashed',
	titleBorderColor = '#00000059',
	titlePadding = '5px 0px',
	body = 'An error occured!',
	maxHeight = '90vh',
	scrollbarWidth = 'thin',
	border = 'none',
	padding = '15px',
	borderRadius = '15px',
	fontFamily = 'sans-serif',
	color = 'black',
	background = 'pink',
	boxShadow = 'rgba(0, 0, 0, 0.8) 0px 0px 0px 100vmax',
	hideCloseButton = false,
	closeButtonText = '❌',
	position = 'fixed',
	anchor = '',
	anchorToId = '',
	anchorMargin = '.5rem 0',
	anchorBottom = 'anchor(top)',
	anchorPositionArea = 'bottom',
	margin = '',
	tooltipArrow = '',
	tooltipArrowColor = 'black',
	bobpopOnOpen = () => {},
	bobpopOnClose = () => {}
}) {	
	let popoverDiv = document.createElement('div');
	document.body.appendChild(popoverDiv);
	
	// if the id already exists then add a random string of numbers to the end to make a different ID (keep generating new ones in case the last one is somehow in use)
	if (document.getElementById(id)) {
		while (document.getElementById(id)) {
			let random = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
			id = 'bobpop' + random;
		}
	}
	popoverDiv.setAttribute('id',id);
	
	
	popoverDiv.setAttribute('popover', type);
	popoverDiv.style.maxHeight = maxHeight;
	popoverDiv.style.scrollbarWidth = scrollbarWidth;
	popoverDiv.style.border = border; 
	popoverDiv.style.padding = padding; 
	popoverDiv.style.borderRadius = borderRadius; 
	popoverDiv.style.color = color;
	popoverDiv.style.background = background;
	popoverDiv.style.boxShadow = boxShadow;
	popoverDiv.style.position = position;
	
	if (type != 'auto') { hideCloseButton = false; }	
	if (margin != '') { popoverDiv.style.margin = margin; }
	
	
	// create the X button div & X button
	if (!hideCloseButton) {
		let xbuttonDiv = document.createElement('div');
		popoverDiv.appendChild(xbuttonDiv);
		xbuttonDiv.style.position = 'absolute';
		xbuttonDiv.style.right =  '0.25rem';
		xbuttonDiv.style.top = '0.5rem';
	
		let xbutton = document.createElement('button');
		xbuttonDiv.appendChild(xbutton);
		xbutton.style.width = 'fit-content';
		xbutton.style.padding = '5px';
		xbutton.style.margin = '0px';
		xbutton.style.border = 'none';
		xbutton.style.background = 'transparent';
		xbutton.style.cursor = 'pointer';
		xbutton.style.color = 'red';
		xbutton.innerHTML = closeButtonText;
		xbutton.id = id + '_xbutton';
		xbutton.setAttribute('popovertarget', id);
		xbutton.setAttribute('popovertargetaction', 'hide');
		xbutton.setAttribute('onmouseover','this.style.transform = \'scale(1.2)\'');
		xbutton.setAttribute('onmouseout','this.style.transform = \'none\'');
	}
	
	// create the title div 
	let titleDiv = document.createElement('div');
	popoverDiv.appendChild(titleDiv);
	titleDiv.style.fontWeight = 'bold';
	titleDiv.style.fontSize = '1.2rem';
	titleDiv.style.marginBottom = '15px';
	titleDiv.style.borderBottom = titleBorderSize + ' ' + titleBorderType + ' ' + titleBorderColor;
	titleDiv.style.padding = titlePadding;
	titleDiv.innerHTML = title;
	titleDiv.setAttribute('id',id + '_title');
	
	
	// create the body div
	let bodyDiv = document.createElement('div');
	popoverDiv.appendChild(bodyDiv);
	bodyDiv.innerHTML = body;
	bodyDiv.setAttribute('id',id + '_body');
	
	
	// if an anchor is specified it needs to be passed as a css anchor name (e.g.:  --anchorname)
	if (anchor != '') {
		// if it wasn't given with the prepended -- then just add them
		if (anchor.slice(0,2) != '--') { anchor = '--' + options.anchor; }
		
		// anchor name 
		popoverDiv.style.positionAnchor = anchor; 
		popoverDiv.style.margin = anchorMargin;
		popoverDiv.style.bottom = anchorBottom;
		popoverDiv.style.positionArea = anchorPositionArea;
		
		// anchor to an element by ID by adding the style of anchor-name: --name to the specified ID
		if (anchorToId && document.getElementById(anchorToId)) {
			document.getElementById(anchorToId).style.anchorName = anchor;
		}
	}
	
	
	// tooltip arrow
	if (tooltipArrow) {
		// top - no diag (default top center)
		let tooltipArrowBottom = '90%';
		let tooltipArrowLeft = '50%';
		let tooltipArrowBorderColor = 'transparent transparent ' + tooltipArrowColor;
		
		if (tooltipArrow == 'top left') {
			tooltipArrowLeft = '10%';
		}
		if (tooltipArrow == 'top right') {
			tooltipArrowLeft = '90%';
		}
		
		// bottom - no diag
		if (tooltipArrow == 'bottom left') {
			tooltipArrowBottom = '0%';
			tooltipArrowLeft = '10%';
			tooltipArrowBorderColor = tooltipArrowColor + ' transparent transparent';
		}
		if (tooltipArrow == 'bottom center') {
			tooltipArrowBottom = '0%';
			tooltipArrowLeft = '50%';
			tooltipArrowBorderColor = tooltipArrowColor + ' transparent transparent';	
		}
		if (tooltipArrow == 'bottom right') {
			tooltipArrowBottom = '0%';
			tooltipArrowLeft = '90%';
			tooltipArrowBorderColor = tooltipArrowColor + ' transparent transparent';
		}
		
		// left side (left top and left bottom are diags)
		if (tooltipArrow == 'left top') {
			tooltipArrowBottom = '80%';
			tooltipArrowLeft = '8%';
			tooltipArrowBorderColor = tooltipArrowColor + ' transparent transparent ' + tooltipArrowColor;
		}
		if (tooltipArrow == 'left ceter') {
			tooltipArrowBottom = '50%';
			tooltipArrowLeft = '0%';
			tooltipArrowBorderColor = 'transparent ' + tooltipArrowColor + ' transparent transparent';
		}
		if (tooltipArrow == 'left bottom') {
			tooltipArrowBottom = '5%';
			tooltipArrowLeft = '6%';
			tooltipArrowBorderColor = 'transparent transparent ' + tooltipArrowColor + ' ' + tooltipArrowColor;
		}
		
		// right side (right top and right bottom are diags)
		if (tooltipArrow == 'right top') {
			tooltipArrowBottom = '80%';
			tooltipArrowLeft = '92%';
			tooltipArrowBorderColor = tooltipArrowColor + ' ' + tooltipArrowColor + ' transparent transparent';
		}
		if (tooltipArrow == 'right center') {
			tooltipArrowBottom = '50%';
			tooltipArrowLeft = '90%';
			tooltipArrowBorderColor = 'transparent transparent transparent ' + tooltipArrowColor;
		}
		if (tooltipArrow == 'right bottom') {
			tooltipArrowBottom = '6%';
			tooltipArrowLeft = '93%';
			tooltipArrowBorderColor = 'transparent ' + tooltipArrowColor + ' ' + tooltipArrowColor + ' transparent';
		}
		
		styleManager.add('#' + id + '::before','content: "";bottom: ' + tooltipArrowBottom + ';left: ' + tooltipArrowLeft + ';border: solid transparent;height: 0;width: 0;position: absolute;pointer-events: none;border-color: ' + tooltipArrowBorderColor + ';border-width: 8px;margin-left: -8px;');
	}
	
	
	// remove anti-interaction just in case (I was using this in combination with another custom dialog I made and I disabled pointer events on the body while it was open)
	popoverDiv.style.pointerEvents = 'all';
	popoverDiv.style.userSelect = 'auto';
	popoverDiv.setAttribute('aria-hidden','false');
	popoverDiv.removeAttribute('inert');	
	
	// accessibility
	popoverDiv.setAttribute('role','alertdialog');
	popoverDiv.setAttribute('aria-labelledby', id + '_title');
	popoverDiv.setAttribute('aria-describedby', id + '_body');
	
	// add the event listener to remove it from the DOM and cleanup when it's been dismissed
	popoverDiv.addEventListener('toggle', (e) => {
		if (e.newState == 'open') {
			if (typeof bobpopOnOpen === 'function') {
				bobpopOnOpen();
			}
		}
		
		if (e.newState === 'closed') {
			// execute anything from the bobpopOnClose trigger
			if (typeof bobpopOnClose === 'function') {
				bobpopOnClose();
			}
			
			popoverDiv.removeEventListener('toggle', e);
			
			// if there are no transitions applied to the popover then just remove it from the DOM
			if (hasTransitionProperty(popoverDiv) === false) {
				popoverDiv.remove();
			}
			
			// if there is a transition detected on the popover then wait for it to finish and then remove it from the DOM
			listenForTransitions(popoverDiv, isTransitioning => {
				if (isTransitioning === false) {
					popoverDiv.remove();
				}
			});
			
			styleManager.remove('#' + id + '::before');
			
			if (anchorToId && document.getElementById(anchorToId)) {
				document.getElementById(anchorToId).style.anchorName = '';
			}
		}
	});
	
	// show the popover
	popoverDiv.showPopover();
}


// function to check if an element has a transition duration of 0s or not to detect if it has a css transition applied to it (might be a better way to do this...)
function hasTransitionProperty(element) {
    const computedStyle = window.getComputedStyle(element);
    const transition = computedStyle.getPropertyValue('transition-duration');
    return transition && transition.trim() !== '0s';
}

// function to listen for when a transition ends so we can remove the bobpop element after the animation ends
function listenForTransitions(element, callback) {
    const transitionEndHandler = event => {
        callback(false); // Transition ended
        element.removeEventListener('transitionend', transitionEndHandler);
    };

    element.addEventListener('transitionend', transitionEndHandler);
    callback(true); // Transition started
}


// add a stylesheet to the document (creates a pseudo element ::before style for the popover tooltip arrow option)
// Reference: https://stackoverflow.com/a/28930990/104380
let styleManager = (function() {
    // Create the <style> tag
    let style = document.createElement("style")

    // WebKit hack
    style.appendChild(document.createTextNode(""));

    // Add the <style> element to the page
    document.head.appendChild(style);
    
    function getStyleRuleIndexBySelector(selector, prop){
      let result = [], i,
          value = (prop ? selector + "{" + prop + "}" : selector).replace(/\s/g, ''), // remove whitespaces
          s = prop ? "cssText" : "selectorText";

      for( i=0; i < style.sheet.cssRules.length; i++ )
        if( style.sheet.cssRules[i][s].replace(/\s/g, '') == value)
          result.push(i);

      return result;
    };

    return {
      style : style,
      
      getStyleRuleIndexBySelector : getStyleRuleIndexBySelector,
      
      add(prop, value){
        return style.sheet.insertRule(`${prop}{${value}}`, style.sheet.cssRules.length);
      },
      
      remove(selector, prop){
        let indexes = getStyleRuleIndexBySelector(selector, prop), i = indexes.length;
        
        // reversed iteration so indexes won't change after deletion for each iteration
        for( ; i-- ; )
          style.sheet.deleteRule( indexes[i] );
      }
    }
})();