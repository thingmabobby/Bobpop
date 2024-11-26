/*
// Bobpop
// Vanilla JavaScript custom alerts using the Popover API and CSS anchors to show alerts/tooltips in the top layer potentially positioned with CSS anchors.
//
// I originally wrote this to help me create popover API error alerts on top of my existing dialog modals, but I figured it can be used for any small alert. 
// This was mostly me just testing the Popover API and CSS anchors. It is pretty limited in what you can do with anchors, but I figured it was good enough as a test.
//
// OPTIONS:
// 
// id: 					The DOM ID to specify to be used (default: 'bobpop'). Multiple instances will be assigned a unique ID.
// type: 				Defaults to 'auto' (lightly dismissed - escape or click outside of it), but you can specify 'manual' (or anything else) to make the user hit the "X" to dismiss it (escape will not dismiss using manual so avoid manual if accessibility is a concern)
//
// title:				The header title of the popover (can be HTML) 
// titlePadding:		CSS padding for the title div (default: '0px 0px')
// titleMargin:			CSS margin for the title div (default: '.5rem 0')
// titleBorderSize:		CSS size for the title div border-bottom (default: unset)
// titleBorderType:		CSS border type for the title div border-bottom (default: unset)
// titleBorderColor:	CSS border color for the title div border-bottom (default: unset)
// titleTextAlign:		CSS text-align for the title text (default: 'left')

// body: 				The body of the popover (can be HTML)
// bodyTextAlign:		CSS text-align for the body text (default: unset)
// closeButtonText:		Text of the "X" dismissal button (can be HTML) (default: an SVG red X)
// hideCloseButton:		True/false - hides the "X" dismissal button only if type is set to 'auto'
// showOkButton:		True/false - shows an "Ok" button appended to the bottom of the body to dismiss the popover (default: false)
// okButtonText:		Text for the Ok button (default: 'Ok')
//
// maxHeight			CSS max-height (default: '85svh')
// maxWidth				CSS max-width (default: '90vw')
// scrollbarWidth		CSS Scrollbar Width (default: 'thin')
// border:				CSS border (default: unset)
// borderRadius:		CSS border-radius (default: '15px')
// padding:				CSS padding (default: '1rem')
// fontFamily			CSS font-family (default: unset)
// color: 				CSS font color (default: unset)
// background: 			CSS background (default: unset)
// boxShadow: 			CSS box-shadow (default: '0 4px 8px rgba(0, 0, 0, 0.5)')
// backdrop:			CSS background-color used in the ::backdrop pseudoclass for the popover (default: 'rgb(107 114 128 / .5)')
// backdropBlur:		CSS backdrop-filter: blur (default: false)
// backdropBlurPx:		CSS blur amount in pixels for backdropBlur (default: '4')
// 
// position: 			CSS position - you may want to use absolute if you are using anchoring, but results may vary (default: 'fixed')
// margin: 				CSS margin (default: unset, default if anchor is specified: '.5rem 0')
// 
// anchor: 				CSS anchor name to attach it to (e.g.: '--anchorname')
// anchorToId:			Given a valid DOM element ID it will append the "anchor-name" CSS style with the given anchor option from above (--anchorname) so it will anchor the popover to it
// anchorPositionArea:	CSS position-area (default: 'bottom' - can be many things like 'bottom right', 'top left', 'end end', 'start end', etc.)
//
// tooltipArrow:		Displays an arrow pointing outwards in the specified placement. (default: 'top center')
//							- The corners ('left top', 'left bottom', 'right top', 'right bottom') point outwards diagonally and the others point outwards horizontally or vertically ('top left', 'top center', 'top right', 'left middle', 'right middle', 'bottom left', 'bottom center', 'bottom right').
//						Please note: the arrow will not point correctly if anchor positioning is being used and it flips to stay on screen 
//							(e.g. set to top with arrow pointing down towards the anchor element, but user scrolls down and it shifts to bottom of anchor element, but arrow still points down instead of up)
// tooltipArrowColor:	The color of the tooltip arrow. (default: 'black')
//						 ________________________________________________________________________________________
//						|																				 	   	 |
//						|left top - top left				top center						top right - right top|
//						|																				 	   	 |
//						|left middle																 right middle|
//						|																					   	 |
//						|left bottom - bottom left 			bottom center			  bottom right - right bottom|
//						|________________________________________________________________________________________|
//
// transition:			True/false if the default fade/scale transition in and out is to be used (default: true)
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
//
// There's also a custom function that you can use:
// bobpopCloseAll():  Every bobpop popover gets assigned a class "bobpopPopover" so this will loop through all of them and .hidePopover() on them (which triggers the toggle event listener for each and removes them from the DOM)
//
// Themes:
// 		usage -  theme: 'fancy'
//		You can style bobpop with a theme by using the theme option when calling it. Please note that it if detects a user's preference is dark mode it will automatically use the dark theme if no theme is added. 
//		You can overwrite theme CSS properties such as font-family, color, background, border, border-radius, and padding.
//
//		Available themes: 'dark', 'light', 'modern', 'fancy', 'pastel', 'ocean', 'nature', 'warm', 'sleek', 'retro', 'elegant', 'bootstrap', 'material', 'tailwind'
*/
function bobpop ({
	id = 'bobpop',
	type = 'auto',
	title = '',
	titleTextAlign = 'left',
	titleBorderSize = '',
	titleBorderType = '',
	titleBorderColor = '',
	titleMargin = '.5rem 0',
	titlePadding = '0px 0px',
	body = '',
	bodyTextAlign = '',
	maxHeight = '85svh',
	maxWidth = '90vw',
	scrollbarWidth = 'thin',
	border = 'none',
	padding = '1rem',
	borderRadius = '15px',
	fontFamily = '',
	color = '',
	background = '',
	boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)',
	backdrop = 'rgb(107 114 128 / .5)',
	backdropBlur = false,
	backdropBlurPx = '4',
	hideCloseButton = false,
	showOkButton = false,
	okButtonText = 'Ok',
	closeButtonText = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" style="stroke: red; stroke-width: 3; stroke-linecap: round; display: inline-block; vertical-align: middle;">
			<line x1="4" y1="4" x2="20" y2="20"></line>
			<line x1="20" y1="4" x2="4" y2="20"></line>
		</svg>
	`,
	position = 'fixed',
	anchor = '',
	anchorToId = '',
	anchorMargin = '.5rem 0',
	anchorPositionArea = 'bottom',
	margin = '',
	tooltipArrow = '',
	tooltipArrowColor = 'black',
	transition = true,
	theme = '',
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
	popoverDiv.classList.add('bobpopPopover');
	
	// if the user's preference is dark mode then use the dark theme (assuming no theme choice has been made)
	if (theme == '' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		theme = 'dark';
    }
	
	let themeFontFamily = '', themeBackground = '', themeColor = '', themeBoxShadow = '', themePadding = '', themeBorder = '', themeBorderRadius = '';
	switch (theme) {
		case 'dark': 
			themeFontFamily = 'sans-serif'; themeBackground  = '#333'; themeColor  = '#fff'; themeBoxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)'; themePadding = '10px'; themeBorder = 'none';
			break;
		case 'light':
			themeFontFamily = 'sans-serif'; themeBackground = '#eaeaea'; themeColor = '#333'; themeBoxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'; themePadding = '10px'; themeBorder = '1px solid #ccc';
			break;
		case 'modern':
			themeFontFamily = 'sans-serif'; themeBackground = 'linear-gradient(135deg, #1e3c72, #2a5298)'; themeColor = '#fff'; themeBoxShadow = '0 6px 12px rgba(0, 0, 0, 0.1)'; themePadding = '12px 24px'; themeBorderRadius = '6px'; themeBorder = 'none';
			break;
		case 'fancy':
			themeFontFamily = 'sans-serif'; themeBackground = 'linear-gradient(135deg, #6a11cb, #2575fc)'; themeColor = '#fff'; themeBoxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'; themePadding = '15px'; themeBorder = 'none';
			break;
		case 'pastel':
			themeFontFamily = 'sans-serif'; themeBackground = 'linear-gradient(135deg, #f6d365, #fda085)'; themeColor = '#333'; themeBoxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; themePadding = '12px 24px'; themeBorderRadius = '8px'; themeBorder = '1px solid #f7a2b4';
			break;
		case 'ocean':
			themeFontFamily = 'sans-serif'; themeBackground = 'linear-gradient(135deg, #00b4d8, #0077b6)'; themeColor = '#fff'; themeBoxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'; themePadding = '12px 20px'; themeBorderRadius = '6px'; themeBorder = 'none';
			break;
		case 'nature':
			themeFontFamily = 'sans-serif'; themeBackground = 'linear-gradient(135deg, #2c3e50, #4ca1af)'; themeColor = '#fff'; themeBoxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)'; themePadding = '14px 28px'; themeBorderRadius = '8px'; themeBorder = 'none';
			break;
		case 'warm':
			themeFontFamily = 'sans-serif'; themeBackground = 'linear-gradient(135deg, #ff7e5f, #feb47b)'; themeColor = '#333'; themeBoxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; themePadding = '12px 24px'; themeBorderRadius = '6px'; themeBorder = '1px solid #ffad9c';
			break;
		case 'sleek':
			themeFontFamily = 'sans-serif'; themeBackground = 'linear-gradient(135deg, #2a2a72, #009ffd)'; themeColor = '#fff'; themeBoxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'; themePadding = '12px 24px'; themeBorderRadius = '6px'; themeBorder = 'none';
			break;
		case 'retro':
			themeFontFamily = 'sans-serif'; themeBackground = 'linear-gradient(135deg, #f1c40f, #e67e22)'; themeColor = '#333'; themeBoxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'; themePadding = '12px 24px'; themeBorderRadius = '8px'; themeBorder = '1px solid #f39c12';
			break;
		case 'elegant':
			themeFontFamily = 'sans-serif'; themeBackground = 'linear-gradient(135deg, #4b79a1, #283e51)'; themeColor = '#fff'; themeBoxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)'; themePadding = '14px 28px'; themeBorderRadius = '8px'; themeBorder = '1px solid #1f3a5f';
			break;
		case 'bootstrap':
			themeFontFamily = '-apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif'; themeBackground = '#ffffff'; themeColor = '#212529'; themeBoxShadow = '0 .5rem 1rem rgba(0, 0, 0, 0.15)'; themePadding = '0.75rem 1.25rem'; themeBorder = '1px solid #dee2e6'; themeBorderRadius = '0.375rem';
			break;
		case 'material':
			themeFontFamily = 'Roboto, Arial, sans-serif'; themeBackground = '#ffffff'; themeColor = '#000000'; themeBoxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)'; themePadding = '16px'; themeBorder = 'none'; themeBorderRadius = '4px';
			break;
		case 'tailwind':
			themeFontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif'; themeBackground = '#f9fafb'; themeColor = '#1f2937'; themeBoxShadow = '0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.1)'; themePadding = '1rem'; themeBorder = '1px solid #d1d5db'; themeBorderRadius = '0.5rem';
			break;
	}
		
	popoverDiv.style.maxHeight = maxHeight;
	popoverDiv.style.maxWidth = maxWidth;
	popoverDiv.style.scrollbarWidth = scrollbarWidth;
	popoverDiv.style.padding = padding || themePadding; 
	popoverDiv.style.fontFamily = fontFamily || themeFontFamily;
	popoverDiv.style.border = border || themeBorder; 
	popoverDiv.style.borderRadius = borderRadius || themeBorderRadius; 
	popoverDiv.style.color = color || themeColor;
	popoverDiv.style.background = background || themeBackground;
	popoverDiv.style.boxShadow = boxShadow || themeBoxShadow;
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
		xbutton.style.padding = '.25rem';
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
	titleDiv.style.textAlign = titleTextAlign;
	titleDiv.style.fontWeight = 'bold';
	titleDiv.style.fontSize = '1.2rem';
	titleDiv.style.margin = titleMargin;
	titleDiv.style.borderBottom = titleBorderSize + ' ' + titleBorderType + ' ' + titleBorderColor;
	
	if (title == 'none' || title == '') { titlePadding = '0px;'; titleDiv.style.border = 'none'; }
	
	titleDiv.style.padding = titlePadding;
	titleDiv.innerHTML = title;
	titleDiv.setAttribute('id',id + '_title');	
	
	// create the body div
	let bodyDiv = document.createElement('div');
	bodyDiv.style.textAlign = bodyTextAlign;
	popoverDiv.appendChild(bodyDiv);
	bodyDiv.innerHTML = body;
	bodyDiv.setAttribute('id',id + '_body');
	
	// append an Ok button to the bottom of the body to dismiss the popover if desired 
	if (showOkButton) {
		let okButtonDiv = document.createElement('div');
		okButtonDiv.setAttribute('id',id + '_okButton');
		let okButton = '<div style="margin-top: 1rem; text-align: center;"><button popovertarget="' + popoverDiv.id + '">' + okButtonText + '</button></div>';		
		okButtonDiv.innerHTML = okButton;
		popoverDiv.appendChild(okButtonDiv);		
	}	
	
	// if an anchor is specified it needs to be passed as a css anchor name (e.g.:  --anchorname)
	if (anchor != '') {
		// if it wasn't given with the prepended -- then just add them
		if (anchor.slice(0,2) != '--') { anchor = '--' + options.anchor; }
		
		// anchor name 
		popoverDiv.style.positionAnchor = anchor; 
		popoverDiv.style.margin = anchorMargin;
		popoverDiv.style.positionArea = anchorPositionArea;
		popoverDiv.style.inset = 'auto';
		popoverDiv.style.visibility = 'anchors-visible';
		popoverDiv.style.positionTryFallbacks = 'flip-block, flip-inline, flip-block flip-inline';
		popoverDiv.style.tryOrder = 'most-height';
		
		// anchor to an element by ID by adding the style of anchor-name: --name to the specified ID
		if (anchorToId && document.getElementById(anchorToId)) {
			document.getElementById(anchorToId).style.anchorName = anchor;
		}
	}	
	
	// tooltip arrow
	// note: arrow will not point correctly if anchor positioning is being used and it flips to stay on screen 
	// (e.g. set to top with arrow pointing down towards the anchor element, but user scrolls down and it shifts to bottom of anchor element, but arrow still points down instead of up)
	if (tooltipArrow) {
		// if a tooltip arrow is specified then set the title margin to allow space for it
		titleDiv.style.margin = '1rem 0';
		
		// top - no diag (default top center)
		let tooltipArrowTop = '5%';
		let tooltipArrowRight = '';
		let tooltipArrowBottom = '';
		let tooltipArrowLeft = '50%';
		let tooltipArrowBorderColor = 'transparent transparent ' + tooltipArrowColor;
		
		if (tooltipArrow == 'top left') {
			tooltipArrowTop = '5%';
			tooltipArrowRight = '';
			tooltipArrowLeft = '10%';
			tooltipArrowBottom = '';
		}
		if (tooltipArrow == 'top right') {
			tooltipArrowTop = '5%';
			tooltipArrowRight = '10%';
			tooltipArrowBottom = '';
			tooltipArrowLeft = '';
		}
		
		// bottom - no diag
		if (tooltipArrow == 'bottom left') {
			tooltipArrowTop = '';
			tooltipArrowRight = '';
			tooltipArrowBottom = '5%';
			tooltipArrowLeft = '10%';
			tooltipArrowBorderColor = tooltipArrowColor + ' transparent transparent';
		}
		if (tooltipArrow == 'bottom center') {
			tooltipArrowTop = '';
			tooltipArrowRight = '';
			tooltipArrowBottom = '5%';
			tooltipArrowLeft = '50%';
			tooltipArrowBorderColor = tooltipArrowColor + ' transparent transparent';	
		}
		if (tooltipArrow == 'bottom right') {
			tooltipArrowTop = '';
			tooltipArrowRight = '10%';
			tooltipArrowBottom = '5%';
			tooltipArrowLeft = '';
			tooltipArrowBorderColor = tooltipArrowColor + ' transparent transparent';
		}
		
		// left side (left top and left bottom are diags)
		if (tooltipArrow == 'left top') {
			tooltipArrowTop = '5%';
			tooltipArrowRight = '';
			tooltipArrowBottom = '';
			tooltipArrowLeft = '5%';
			tooltipArrowBorderColor = tooltipArrowColor + ' transparent transparent ' + tooltipArrowColor;
		}
		if (tooltipArrow == 'left middle') {
			tooltipArrowTop = '50%';
			tooltipArrowRight = '';
			tooltipArrowBottom = '';
			tooltipArrowLeft = '5';
			tooltipArrowBorderColor = 'transparent ' + tooltipArrowColor + ' transparent transparent';
		}
		if (tooltipArrow == 'left bottom') {
			tooltipArrowTop = '';
			tooltipArrowRight = '';
			tooltipArrowBottom = '5%';
			tooltipArrowLeft = '5%';
			tooltipArrowBorderColor = 'transparent transparent ' + tooltipArrowColor + ' ' + tooltipArrowColor;
		}
		
		// right side (right top and right bottom are diags)
		if (tooltipArrow == 'right top') {
			tooltipArrowTop = '5%';
			tooltipArrowRight = '5%';
			tooltipArrowBottom = '';
			tooltipArrowLeft = '';
			tooltipArrowBorderColor = tooltipArrowColor + ' ' + tooltipArrowColor + ' transparent transparent';
		}
		if (tooltipArrow == 'right middle') {
			tooltipArrowTop = '50%';
			tooltipArrowRight = '5%';
			tooltipArrowBottom = '';
			tooltipArrowLeft = '';
			tooltipArrowBorderColor = 'transparent transparent transparent ' + tooltipArrowColor;
		}
		if (tooltipArrow == 'right bottom') {
			tooltipArrowTop = '5%';
			tooltipArrowRight = '';
			tooltipArrowBottom = '5%';
			tooltipArrowLeft = '';
			tooltipArrowBorderColor = 'transparent ' + tooltipArrowColor + ' ' + tooltipArrowColor + ' transparent';
		}
		
		styleManager.add('#' + id + '::before','content: "";top: ' +tooltipArrowTop + ';right: ' + tooltipArrowRight + ';bottom: ' + tooltipArrowBottom + ';left: ' + tooltipArrowLeft + ';border: solid transparent;height: 0;width: 0;position: absolute;pointer-events: none;border-color: ' + tooltipArrowBorderColor + ';border-width: 8px;margin-left: -8px;');
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
				styleManager.remove('#' + id + '::before');			
			}
			
			// if there is a transition detected on the popover then wait for it to finish and then remove it from the DOM
			listenForTransitions(popoverDiv, isTransitioning => {
				if (isTransitioning === false) {
					popoverDiv.remove();
					styleManager.remove('#' + id + '::before');
				}
			});
		}
	});
	
	// inject the CSS as a stylesheet in the DOM that we can't add inline for bobpop (backdrop pseudoclass and transition stuff)
	if (backdropBlur) { backdropBlur = `backdrop-filter: blur(${backdropBlurPx}px);`; }
	const bobpopInjectCSS = () => {
		const backdropStyleId = "bobpopBackdropStyle";
		const backdropCSS = `
		:where(.bobpopPopover)::backdrop {
			background-color: ${backdrop};
			${backdropBlur}
		}
		`;
			
		if (!document.getElementById(backdropCSS)) {
			const styleSheet = document.createElement("style");
			styleSheet.type = "text/css";
			styleSheet.id = backdropStyleId;
			styleSheet.textContent = backdropCSS;

			document.head.appendChild(styleSheet);
		}

		const transitionStyleId = "bobpopTransitionStyles";
		if (transition && !document.getElementById(transitionStyleId)) {				
			const transitionCSS = `
			:where(.bobpopPopover) {
				/* popover transition in/out */
				&, &::backdrop {
					transition: 
						display .5s allow-discrete, 
						overlay .5s allow-discrete, 
						transform .5s,
						opacity .5s;
					opacity: 0;
				}
				  
				/* open state */
				&:popover-open {
					opacity: 1;
					transform: scale(1);
					
					&::backdrop {
						opacity: 1;
					}
				}
				  
				/* offstage styles */
				@starting-style {
					&:popover-open {
						transform: scale(0);
						opacity: 0;
					}
					&:popover-open, &:popover-open::backdrop {
						opacity: 0;
					}
				}

				/* only scale if it's ok with the user */
				@media (prefers-reduced-motion: no-preference) {
					transform: scale(.95);
				}
			}
			`;

			const styleSheet = document.createElement("style");
			styleSheet.type = "text/css";
			styleSheet.id = transitionStyleId;
			styleSheet.textContent = transitionCSS;

			document.head.appendChild(styleSheet);				
		}
	};

	// call the function to inject the CSS
	bobpopInjectCSS();
	
	// show the popover
	popoverDiv.showPopover();
}

// function to close all bobpop popovers based on them having the bobpopPopover class
function bobpopCloseAll() {
	document.querySelectorAll('.bobpopPopover').forEach(bobpop => {
		bobpop.hidePopover();
	})
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