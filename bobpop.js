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
// titleTextAlign:		CSS text-align for the title text (default: 'center')

// body: 				The body of the popover (can be HTML)
// bodyTextAlign:		CSS text-align for the body text (default: inherit)
// showCloseButton:		True/false - if type is 'auto' showCloseButton is false, otherwise true
// closeButtonColor:	CSS color for the stroke of the X svg close button.
// showOkButton:		True/false - shows an "Ok" button appended to the bottom of the body to dismiss the popover and return a "confirmed" event. (default: false)
// okButtonText:		Text for the Ok button (default: 'Ok')
// showCancelButton:	True/false - shows a "Cancel" button appended to the bottom of the body to dismiss the popover and return a "cancelled" event. (default: false)
// cancelButtonText:	Text for the Cancel button (default: 'Cancel')
// allowEscapeKey:		True/false - Allows the escape key to dismiss a manual type popover (default: true)
//
// maxHeight			CSS max-height (default: '85svh')
// maxWidth				CSS max-width (default: '90vw')
// scrollbarWidth		CSS Scrollbar Width (default: 'thin')
// border:				CSS border (default: none)
// borderRadius:		CSS border-radius (default: '15px')
// padding:				CSS padding (default: '1rem')
// fontFamily			CSS font-family (default: inherit)
// color: 				CSS font color (default: inherit)
// background: 			CSS background (default: inherit)
// boxShadow: 			CSS box-shadow (default: '0 4px 8px rgba(0, 0, 0, 0.5)')
// chatBubbleTail:		If the chatbubble theme is chosen then adds a "tail" on the topLeft, topRight, topCenter, bottomLeft, bottomCenter, or bottomRight of bobPop. (default: bottomLeft)
// backdrop:			CSS background-color used in the ::backdrop pseudoclass for the popover (default: 'rgb(107 114 128 / .5)')
// backdropBlur:		CSS backdrop-filter: blur (default: false)
// backdropBlurPx:		CSS blur amount in pixels for backdropBlur (default: '4')
// 
// position: 			CSS position - you may want to use absolute if you are using anchoring, but results may vary (default: 'fixed')
// 
// anchor: 				CSS anchor name to attach it to (e.g.: '--anchorname')
// anchorToId:			Given a valid DOM element ID it will append the "anchor-name" CSS style with the given anchor option from above (--anchorname) so it will anchor the popover to it
// anchorMargin: 		CSS margin (margin for bobpop is 0, but if an anchor is specified it defaults to: '.5rem 0')
// anchorPositionArea:	CSS position-area (default: 'bottom' - can be many things like 'bottom right', 'top left', 'end end', 'start end', etc.)
//
// transition:			True/false if the default fade/scale transition in and out is to be used (default: true)
//
// onOpen:		Will run an anonymous function you provide when the popover is opened.
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
//										onOpen: () => {
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
// onClose:		Will run an anonymous function you provide when the popover is closed.
//							Example:
//								bobpop({
//									id: 'bobpop_warning',
//									title: 'Error',
//									body: 'That username is already taken! Please enter another.',
//									onClose: () => {
//										document.getElementById('newusername').value = '';
//										document.getElementById('newusername').focus();
//									}
//								})
//
// onBeforeOpen:	Will run an anonymous function you provide before bobpop is toggled to show.
// onBeforeClose: Will run an anonymous function you provide before bobpop is toggled to hide.
//
// There's also a custom function that you can use:
// bobpopCloseAll():  Every bobpop popover gets assigned a class "bobpopPopover" so this will loop through all of them and .hidePopover() on them (which triggers the toggle event listener for each and removes them from the DOM)
//
// Themes:
// 		usage -  theme: 'fancy'
//		You can style bobpop with a theme by using the theme option when calling it. Please note that it if detects a user's preference is dark mode it will automatically use the dark theme if no theme is specified (light theme defaults otherwise). 
//		You can overwrite theme CSS properties such as font-family, color, background, border, border-radius, and padding.
//
//		Available themes: 'dark', 'light', 'warning', 'error', 'chatbubble', 'modern', 'fancy', 'pastel', 'ocean', 'nature', 'warm', 'sleek', 'retro', 'elegant', 'bootstrap', 'material', 'tailwind'
//
// Transitions:
//		bobpop uses the scale transition by default, but you can specify any of the transitions below.
//		Usage: - transitionType: 'falling'
//
//		Available transitions: 'scale', 'slideTop', 'slideBottom', 'slideLeft', 'slideRight', 'flip', 'rotate', 'fadeSlide', 'stretchHorizontal', 'stretchVertical', 'pop', 'falling'
*/
function bobpop (options = {}) {
	const defaults = {
		theme: null,
		transition: true,
		transitionType: 'scale',
		onBeforeOpen: null,
		onOpen: null,
		onBeforeClose: null,
		onClose: null,
		id: 'bobpop',
		type: 'auto',
		maxHeight: '85svh',
		maxWidth: '90vw',
		scrollbarWidth: 'thin',
		padding: '1rem',
		fontFamily: 'inherit',
		border: 'none',
		borderRadius: '15px',
		color: 'inherit',
		background: 'inherit',
		boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
		backdrop: 'rgb(107 114 128 / .5)',
		backdropBlur: false,
		backdropBlurPx: '4',
		position: 'fixed',
		showCloseButton: false,
		closeButtonColor: '#FF0000',
		showOkButton: false,
		okButtonText: 'Ok',
		showCancelButton: false,
		cancelButtonText: 'Cancel',
		allowEscapeKey: true,
		title: '',
		titleTextAlign: 'center',
		titlePadding: '0px',
		titleMargin: '.5rem 0',
		body: '',
		bodyTextAlign: 'center',
		anchor: null,
		anchorToId: null,
		anchorMargin: '.5rem 0',
		anchorPositionArea: 'bottom',
		anchorPositionTryFallbacks: 'flip-block, flip-inline, flip-block flip-inline',
		anchorPositionTryOrder: 'most-height',
		chatBubbleTail: 'bottomLeft'
	};	
	
	const themes = {
		dark: { fontFamily: 'sans-serif', background : '#333', color : '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', padding: '10px', border: 'none' },
		light: { fontFamily: 'sans-serif', background: '#fff', color: '#333', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', padding: '10px', border: '1px solid #ccc' },
		warning: { fontFamily: 'sans-serif', background: '#fff3cd', color: '#333', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', padding: '12px 24px', border: '1px solid #e0a800', borderRadius: '6px' },
		error: { fontFamily: 'sans-serif', background: 'linear-gradient(135deg, rgb(200, 60, 40), rgb(180, 45, 30))', color: '#fff', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', padding: '12px 24px', border: '1px solid #c53030', borderRadius: '6px', closeButtonColor: '#fff' },
		modern: { fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1e3c72, #2a5298)', color: '#fff', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', padding: '12px 24px', borderRadius: '6px', border: 'none' },
		chatbubble: { fontFamily: 'sans-serif', background: '#f0f0f0', color: '#212529', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', padding: '2rem', borderRadius: '32px' },
		fancy: { fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #6a11cb, #2575fc)', color: '#fff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', padding: '15px', border: 'none' },
		pastel: { fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #f6d365, #fda085)', color: '#333', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', padding: '12px 24px', borderRadius: '8px', border: '1px solid #f7a2b4' },
		ocean: { fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #00b4d8, #0077b6)', color: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', padding: '12px 20px', borderRadius: '6px', border: 'none' },
		nature: { fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #2c3e50, #4ca1af)', color: '#fff', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', padding: '14px 28px', borderRadius: '8px', border: 'none' },
		warm: { fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #ff7e5f, #feb47b)', color: '#333', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', padding: '12px 24px', borderRadius: '6px', border: '1px solid #ffad9c' },
		sleek: { fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #2a2a72, #009ffd)', color: '#fff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', padding: '12px 24px', borderRadius: '6px', border: 'none' },
		retro: { fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #f1c40f, #e67e22)', color: '#333', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', padding: '12px 24px', borderRadius: '8px', border: '1px solid #f39c12' },
		elegant: { fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #4b79a1, #283e51)', color: '#fff', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', padding: '14px 28px', borderRadius: '8px', border: '1px solid #1f3a5f' },
		bootstrap: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"', background: '#ffffff', color: '#212529', boxShadow: '0 .5rem 1rem rgba(0, 0, 0, 0.15)', padding: '0.75rem 1.25rem', border: '1px solid #dee2e6', borderRadius: '0.375rem' },
		material: { fontFamily: 'Roboto, Arial, sans-serif', background: '#ffffff', color: '#000000', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)', padding: '16px', border: 'none', borderRadius: '4px' },
		tailwind: { fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', background: '#f9fafb', color: '#1f2937', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.1)', padding: '1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }
	}	
	
	// assign the theme and fallback to light mode if none was selected
	let theme = themes[options.theme] || themes['light'];
	
	// if the user's preference is dark mode then use the dark theme instead (assuming no theme choice has been made)
	if (!options.theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		theme = themes.dark;
    }
	
	
	// load in the defaults, overwritten by themes, overwritten by user-supplied options
	let finalOptions = {
		...defaults,
		...theme,
		...options,
	};	
	
	
	// if the id already exists then add a random string of numbers to the end to make a different ID (keep generating new ones in case the last one is somehow in use)
	if (document.getElementById(finalOptions.id)) {
		while (document.getElementById(finalOptions.id)) {
			let random = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
			finalOptions.id = 'bobpop' + random;
		}
	} else {
		finalOptions.id = 'bobpop';
	}
	
	
	// create the popover div and assign attributes, class, and styles
	let popoverDiv = document.createElement('div');
	popoverDiv.setAttribute('id',finalOptions.id);
	popoverDiv.setAttribute('popover',finalOptions.type);
	popoverDiv.classList.add('bobpopPopover');
	popoverDiv.style.maxHeight = finalOptions.maxHeight;
	popoverDiv.style.maxWidth = finalOptions.maxWidth;
	popoverDiv.style.scrollbarWidth = finalOptions.scrollbarWidth;
	popoverDiv.style.padding = finalOptions.padding; 
	popoverDiv.style.fontFamily = finalOptions.fontFamily;
	popoverDiv.style.border = finalOptions.border; 
	popoverDiv.style.borderRadius = finalOptions.borderRadius; 
	popoverDiv.style.color = finalOptions.color;
	popoverDiv.style.background = finalOptions.background;
	popoverDiv.style.boxShadow = finalOptions.boxShadow;
	popoverDiv.style.position = finalOptions.position;
	if (finalOptions.type != 'auto') { finalOptions.showCloseButton = true; }
	document.body.appendChild(popoverDiv);
		
			
	// create the X button div & X button
	let cancelled = false;
	if (finalOptions.showCloseButton) {
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
		xbutton.style.boxShadow = 'none';
		
		const closeButtonText = `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" style="stroke: ${finalOptions.closeButtonColor}; stroke-width: 3; stroke-linecap: round; display: inline-block; vertical-align: middle;">
				<line x1="4" y1="4" x2="20" y2="20"></line>
				<line x1="20" y1="4" x2="4" y2="20"></line>
			</svg>
		`;
		xbutton.innerHTML = closeButtonText;
		
		xbutton.id = finalOptions.id + '_xbutton';
		xbutton.setAttribute('tabindex', '0');
		xbutton.setAttribute('aria-label','Close Popover');
		xbutton.setAttribute('aria-controls', finalOptions.id);
		xbutton.setAttribute('popovertarget', finalOptions.id);
		xbutton.setAttribute('popovertargetaction', 'hide');
		xbutton.setAttribute('onmouseover','this.style.transform = \'scale(1.2)\'');
		xbutton.setAttribute('onmouseout','this.style.transform = \'none\'');
		xbutton.addEventListener('click', () => {
			cancelled = true;
		});
	}
	
	
	// create the title div 
	let titleDiv = document.createElement('div');
	popoverDiv.appendChild(titleDiv);
	titleDiv.style.textAlign = finalOptions.titleTextAlign;
	titleDiv.style.fontWeight = 'bold';
	titleDiv.style.fontSize = '1.2rem';
	titleDiv.style.margin = finalOptions.titleMargin;
	
	if (!finalOptions.title) { finalOptions.titlePadding = '0px;'; }
	
	titleDiv.style.padding = finalOptions.titlePadding;
	titleDiv.innerHTML = finalOptions.title;
	titleDiv.setAttribute('id',finalOptions.id + '_title');	
	
	
	// create the body div
	let bodyDiv = document.createElement('div');
	bodyDiv.style.textAlign = finalOptions.bodyTextAlign;
	popoverDiv.appendChild(bodyDiv);
	bodyDiv.innerHTML = finalOptions.body;
	bodyDiv.setAttribute('id',finalOptions.id + '_body');
	
	
	// create the control button div if applicable (ok/cancel buttons)
	let controlButtonDiv;
	if (finalOptions.showOkButton || finalOptions.showCancelButton) {
		controlButtonDiv = document.createElement('div');
		controlButtonDiv.style.marginTop = '1rem';
		controlButtonDiv.style.textAlign = 'center';
		popoverDiv.appendChild(controlButtonDiv);
	}
	
	// append an Ok button to the bottom of the body to dismiss the popover if desired 
	let confirmed = false;
	if (finalOptions.showOkButton) {
		let okButton = document.createElement('button');
		okButton.setAttribute('popovertarget',finalOptions.id);
		okButton.setAttribute('aria-label',finalOptions.okButtonText);
		okButton.setAttribute('aria-controls',finalOptions.id);
		okButton.setAttribute('aria-expanded',false);
		okButton.textContent = finalOptions.okButtonText;
		okButton.setAttribute('id',finalOptions.id + '_okButton');
		okButton.classList.add('bobpop-okButton');
		okButton.addEventListener('click', () => {
			confirmed = true;
		});					
		controlButtonDiv.appendChild(okButton);
	}

	// append a Cancel button to the bottom of the body do dismiss the popover if desired
	if (finalOptions.showCancelButton) {
		let cancelButton = document.createElement('button');
		cancelButton.setAttribute('popovertarget',finalOptions.id);
		cancelButton.setAttribute('aria-label',finalOptions.cancelButtonText);
		cancelButton.setAttribute('aria-controls',finalOptions.id);
		cancelButton.setAttribute('aria-expanded',false);
		cancelButton.textContent = finalOptions.cancelButtonText;
		cancelButton.setAttribute('id',finalOptions.id + '_cancelButton');
		cancelButton.classList.add('bobpop-cancelButton');
		cancelButton.addEventListener('click', () => {
			cancelled = true;
		});
		controlButtonDiv.appendChild(cancelButton);
	}
	
	// if an anchor is specified it needs to be passed as a css anchor name (e.g.:  --anchorname)
	if (finalOptions.anchor) {
		// if it wasn't given with the prepended -- then just add them
		if (finalOptions.anchor.slice(0,2) != '--') { finalOptions.anchor = '--' + finalOptions.anchor; }
		
		// anchor name 
		popoverDiv.style.positionAnchor = finalOptions.anchor; 
		popoverDiv.style.margin = finalOptions.anchorMargin;
		popoverDiv.style.positionArea = finalOptions.anchorPositionArea;
		popoverDiv.style.inset = 'auto';
		popoverDiv.style.visibility = 'anchors-visible';
		popoverDiv.style.positionTryFallbacks = 'flip-block, flip-inline, flip-block flip-inline';
		popoverDiv.style.tryOrder = 'most-height';
		
		// anchor to an element by ID by adding the style of anchor-name: --name to the specified ID
		if (finalOptions.anchorToId && document.getElementById(finalOptions.anchorToId)) {
			document.getElementById(finalOptions.anchorToId).style.anchorName = finalOptions.anchor;
		}
	}	
	
	
	// remove anti-interaction just in case (I was using this in combination with another custom dialog I made and I disabled pointer events on the body while it was open)
	popoverDiv.style.pointerEvents = 'all';
	popoverDiv.style.userSelect = 'auto';
	popoverDiv.setAttribute('aria-hidden','false');
	popoverDiv.removeAttribute('inert');	
	
	
	// accessibility
	popoverDiv.setAttribute('role','alertdialog');
	popoverDiv.setAttribute('aria-labelledby', finalOptions.id + '_title');
	popoverDiv.setAttribute('aria-describedby', finalOptions.id + '_body');
	
	
	// add the event listener to trigger a before open or before closed function
	popoverDiv.addEventListener('beforetoggle', (e) => {
		if (e.newState == 'open') {
			if (typeof finalOptions.onBeforeOpen === 'function') {
				finalOptions.onBeforeOpen(e);
			}			
		} else {
			if (typeof finalOptions.onBeforeClose === 'function') {
				if (confirmed) { e.confirmed = true; }
				if (cancelled) { e.cancelled = true; }
				finalOptions.onBeforeClose(e);
			}
		}
	});
	
	// add the event listener to remove it from the DOM and cleanup when it's been dismissed
	popoverDiv.addEventListener('toggle', (e) => {
		if (e.newState == 'open') {
			if (typeof finalOptions.onOpen === 'function') {
				finalOptions.onOpen(e);
			}
		}
		
		if (e.newState === 'closed') {
			// execute anything from the onClose trigger
			if (typeof finalOptions.onClose === 'function') {
				if (confirmed) { e.confirmed = true; }
				if (cancelled) { e.cancelled = true; }
				finalOptions.onClose(e);
			}
		
			popoverDiv.removeEventListener('beforetoggle', e);		
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
		}
	});
	
	
	// if the type is manual (anything other than auto is considered hard-dismissed for the popover API) set an event listener for the escape key to close the popover (auto is lightly dismissed so escape works)
	if (finalOptions.type != 'auto' && finalOptions.allowEscapeKey) {
		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') {
				const popover = document.getElementById(finalOptions.id);
				
				if (popover) {
					popover.hidePopover();
				}
			}
		});
	}
		
	
	// inject the CSS as a stylesheet in the DOM that we can't add inline for bobpop (backdrop pseudoclass and transition stuff)
	if (finalOptions.backdropBlur) { finalOptions.backdropBlur = `backdrop-filter: blur(${finalOptions.backdropBlurPx}px);`; }
	const bobpopInjectCSS = () => {
		// chat bubble theme tail CSS 
		if (options.theme == 'chatbubble') {
			const chatBubbleStyleId = 'bobpopChatBubbleStyles';
			
			if (!document.getElementById(chatBubbleStyleId)) {			
				const chatBubbleCSS = `
					.bobpop-chat {
						overflow: visible;
					}
					.bobpopPopover[data-tail='bottomLeft']::after {
						content: '';
						position: absolute;
						width: 0;
						height: 0;
						border-style: solid;
						border-width: 32px 32px 0 0;
						border-color: ${finalOptions.background} transparent transparent transparent;
						bottom: -20px;
						left: 20px;
					}
					.bobpopPopover[data-tail='topCenter']::after {
						content: '';
						position: absolute;
						width: 0;
						height: 0;
						border-style: solid;
						border-width: 0 32px 32px 32px;
						border-color: transparent transparent ${finalOptions.background} transparent;
						top: -10%;
						left: 50%;
						transform: translateX(-50%);
					}
					.bobpopPopover[data-tail='bottomRight']::after {
						content: '';
						position: absolute;
						width: 0;
						height: 0;
						border-style: solid;
						border-width: 32px 0 0 32px;
						border-color: ${finalOptions.background} transparent transparent transparent;
						bottom: -20px;
						right: 20px;
					}
					.bobpopPopover[data-tail='topLeft']::after {
						content: '';
						position: absolute;
						width: 0;
						height: 0;
						border-style: solid;
						border-width: 0 32px 32px 0;
						border-color: transparent transparent ${finalOptions.background} transparent;
						top: -20px;
						left: 20px;
					}
					.bobpopPopover[data-tail='bottomCenter']::after {
						content: '';
						position: absolute;
						width: 0;
						height: 0;
						border-style: solid;
						border-width: 32px 32px 0 32px;
						border-color: ${finalOptions.background} transparent transparent transparent;
						bottom: -10%;
						left: 50%;
						transform: translateX(-50%);
					}
					.bobpopPopover[data-tail='topRight']::after {
						content: '';
						position: absolute;
						width: 0;
						height: 0;
						border-style: solid;
						border-width: 0 0 32px 32px;
						border-color: transparent transparent ${finalOptions.background} transparent;
						top: -20px;
						right: 20px;
					}
				`;
				
				const chatBubbleStylesheet = document.createElement('style');
				chatBubbleStylesheet.type = 'text/css';
				chatBubbleStylesheet.id = chatBubbleStyleId;
				chatBubbleStylesheet.textContent = chatBubbleCSS;				
				document.head.appendChild(chatBubbleStylesheet);
			}
			popoverDiv.classList.add('bobpop-chat');
			popoverDiv.setAttribute('data-tail', finalOptions.chatBubbleTail);
		}
	
		// ok & cancel button styles
		const buttonStylesId = 'bobpopButtonStyle';
		const buttonCSS = `
		:where(.bobpopPopover) {
			button {
				background: linear-gradient(135deg, rgb(240, 240, 240), rgb(220, 220, 220));
				border: 1px solid rgb(200, 200, 200);
				color: #333;
				padding: 0.25rem .5rem;
				font-size: 1rem;
				border-radius: 4px;
				cursor: pointer;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
			}
			button:hover {
				background: linear-gradient(135deg, rgb(230, 230, 230), rgb(210, 210, 210));
				box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
				transform: translateY(-2px);
			}
			button:active {
				background: rgb(200, 200, 200);
				box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
				transform: translateY(0);
			}
			button:disabled {
				background: rgb(240, 240, 240);
				color: rgb(180, 180, 180);
				border-color: rgb(200, 200, 200);
				cursor: not-allowed;
				opacity: 0.7;
				box-shadow: none;
			}			
			button.bobpop-okButton {
				margin: 0 .25rem;
				background: #28a745;
				color: white;
				border: none;
				padding: 0.6em 1.2em;
				font-size: 1rem;
				font-weight: bold;
				border-radius: 4px;
				cursor: pointer;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				transition: background-color 0.3s ease, box-shadow 0.3s ease;
			}
			button.bobpop-okButton:hover {
				background: #218838;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
			}
			button.bobpop-okButton:active {
				background: #1e7e34;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
			}
			button.bobpop-cancelButton {
				margin: 0 .25rem;
				background: #dc3545;
				color: white;
				border: none;
				padding: 0.6em 1.2em;
				font-size: 1rem;
				font-weight: bold;
				border-radius: 4px;
				cursor: pointer;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				transition: background-color 0.3s ease, box-shadow 0.3s ease;
			}
			button.bobpop-cancelButton:hover {
				background: #c82333;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
			}
			button.bobpop-cancelButton:active {
				background: #bd2130;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
			}
		}
		`;
		if (!document.getElementById(buttonStylesId)) {
			const buttonStyleSheet = document.createElement('style');
			buttonStyleSheet.type = 'text/css';
			buttonStyleSheet.id = buttonStylesId;
			buttonStyleSheet.textContent = buttonCSS;
			document.head.appendChild(buttonStyleSheet);
		}
		
		
		// backdrop style
		const backdropStyleId = 'bobpopBackdropStyle';
		const backdropCSS = `
		:where(.bobpopPopover)::backdrop {
			background-color: ${finalOptions.backdrop};
			${finalOptions.backdropBlur}
		}
		`;
			
		if (!document.getElementById(backdropStyleId)) {
			const backdropStyleSheet = document.createElement('style');
			backdropStyleSheet.type = 'text/css';
			backdropStyleSheet.id = backdropStyleId;
			backdropStyleSheet.textContent = backdropCSS;
			document.head.appendChild(backdropStyleSheet);
		}

		// transition styles
		const transitionStyleId = 'bobpopTransitionStyles_' + (finalOptions.transitionType || 'scale');
		if (finalOptions.transition) {
			// common transition CSS shared across all types
			const commonTransitionCSS = `
				:where(.bobpopPopover) {
					&, &::backdrop {
						transition: 
							display .6s allow-discrete,
							overlay .6s allow-discrete,
							transform .6s ease,
							opacity .6s;
						opacity: 0;
					}

					/* Open state */
					&:popover-open {
						opacity: 1;
						transform: {transformOpen};
						
						&::backdrop {
							opacity: 1;
						}
					}

					/* Offstage styles */
					@starting-style {
						&:popover-open {
							transform: {transformClosed};
							opacity: 0;
						}
					}
				}
			`;

			// transition type-specific settings
			const transitions = {
				scale: { transformOpen: 'scale(1)',	transformClosed: 'scale(0)', extraCSS: `@media (prefers-reduced-motion: no-preference) { transform: scale(.95);	}` },
				slideTop: { transformOpen: 'translateY(0)', transformClosed: 'translateY(-100%)', extraCSS: `@media (prefers-reduced-motion: reduce) { transform: translateY(0); transition: opacity .3s ease; }` },
				slideBottom: { transformOpen: 'translateY(0)', transformClosed: 'translateY(100%)',	extraCSS: `@media (prefers-reduced-motion: reduce) { transform: translateY(0); transition: opacity .3s ease; }` },
				slideLeft: { transformOpen: 'translateX(0)', transformClosed: 'translateX(-100%)', extraCSS: `@media (prefers-reduced-motion: reduce) { transform: translateY(0); transition: opacity .3s ease; }` },
				slideRight: { transformOpen: 'translateX(0)', transformClosed: 'translateX(100%)', extraCSS: `@media (prefers-reduced-motion: reduce) {	transform: translateY(0); transition: opacity .3s ease; }` },
				flip: { transformOpen: 'rotateY(0)', transformClosed: 'rotateY(90deg)', extraCSS: `@media (prefers-reduced-motion: reduce) { transform: none; transition: opacity .3s ease;	}` },
				rotate: { transformOpen: 'rotate(0deg)', transformClosed: 'rotate(-180deg)', extraCSS: `@media (prefers-reduced-motion: reduce) { transform: none; transition: opacity .3s ease; }`	},
				fadeSlide: { transformOpen: 'translateY(0)', transformClosed: 'translateY(-10%)', extraCSS: `& { transition: opacity .6s ease, transform .6s ease; } @media (prefers-reduced-motion: reduce) { transform: none;	transition: opacity .3s ease; }` },
				stretchHorizontal: { transformOpen: 'scaleX(1)', transformClosed: 'scaleX(0)', extraCSS: `transform-origin: left; @media (prefers-reduced-motion: reduce) { transform: none; transition: opacity .3s ease; }` },
				stretchVertical: { transformOpen: 'scaleY(1)', transformClosed: 'scaleY(0)', extraCSS: `transform-origin: top; @media (prefers-reduced-motion: reduce) { transform: none; transition: opacity .3s ease; }` },
				pop: { transformOpen: 'scale(1)', transformClosed: 'scale(0.5)', extraCSS: `@media (prefers-reduced-motion: reduce) { transform: none; transition: opacity .3s ease; }` },
				falling: { transformOpen: 'translateY(0) rotate(0)', transformClosed: 'translateY(-100%) rotate(-15deg)', extraCSS: `@media (prefers-reduced-motion: reduce) { transform: none; transition: opacity .3s ease; }` }
			};

			// get the transition settings for the selected type
			const selectedTransition = transitions[finalOptions.transitionType || 'scale'];

			// replace placeholders in the common transition CSS
			let transitionCSS = commonTransitionCSS
				.replace('{transformOpen}', selectedTransition.transformOpen)
				.replace('{transformClosed}', selectedTransition.transformClosed);

			// add any extra CSS specific to the transition type (prefers-reduce-motion stuff)
			if (selectedTransition.extraCSS) {
				transitionCSS += selectedTransition.extraCSS;
			}

			// create and append the stylesheet
			const transitionStyleSheet = document.createElement('style');
			transitionStyleSheet.type = 'text/css';
			transitionStyleSheet.id = transitionStyleId;
			transitionStyleSheet.textContent = transitionCSS;
			if (document.getElementById(transitionStyleId)) { document.getElementById(transitionStyleId).remove(); }
			document.head.appendChild(transitionStyleSheet);
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