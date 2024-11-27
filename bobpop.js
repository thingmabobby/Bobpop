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
// closeButtonText:		Text of the "X" dismissal button (can be HTML) (default: an SVG red X)
// showCloseButton:		True/false - if type is 'auto' showCloseButton is false, otherwise true
// showOkButton:		True/false - shows an "Ok" button appended to the bottom of the body to dismiss the popover (default: false)
// okButtonText:		Text for the Ok button (default: 'Ok')
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
//		You can style bobpop with a theme by using the theme option when calling it. Please note that it if detects a user's preference is dark mode it will automatically use the dark theme if no theme is specified (light theme defaults otherwise). 
//		You can overwrite theme CSS properties such as font-family, color, background, border, border-radius, and padding.
//
//		Available themes: 'dark', 'light', 'warning', 'error', 'modern', 'fancy', 'pastel', 'ocean', 'nature', 'warm', 'sleek', 'retro', 'elegant', 'bootstrap', 'material', 'tailwind'
*/
function bobpop (options = {}) {
	const defaults = {
		theme: null,
		transition: true,
		bobpopOnOpen: () => {},
		bobpopOnClose: () => {},
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
		showOkButton: false,
		okButtonText: 'Ok',
		allowEscapeKey: true,
		closeButtonText: `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" style="stroke: red; stroke-width: 3; stroke-linecap: round; display: inline-block; vertical-align: middle;">
				<line x1="4" y1="4" x2="20" y2="20"></line>
				<line x1="20" y1="4" x2="4" y2="20"></line>
			</svg>
		`,
		title: '',
		titleTextAlign: 'center',
		titlePadding: '0px',
		titleMargin: '.5rem 0',
		body: '',
		bodyTextAlign: 'inherit',
		anchor: null,
		anchorToId: null,
		anchorMargin: '.5rem 0',
		anchorPositionArea: 'bottom',
		anchorPositionTryFallbacks: 'flip-block, flip-inline, flip-block flip-inline',
		anchorPositionTryOrder: 'most-height',
	};	
	
	const themes = {
		dark: { fontFamily: 'sans-serif', background : '#333', color : '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', padding: '10px', border: 'none' },
		light: { fontFamily: 'sans-serif', background: '#fff', color: '#333', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', padding: '10px', border: '1px solid #ccc' },
		warning: { fontFamily: 'sans-serif', background: '#fff3cd', color: '#333', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', padding: '12px 24px', border: '1px solid #e0a800', borderRadius: '6px' },
		error: { fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #f85032, #e73827)', color: '#fff', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', padding: '12px 24px', border: '1px solid #c53030', borderRadius: '6px' },
		modern: { fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1e3c72, #2a5298)', color: '#fff', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', padding: '12px 24px', borderRadius: '6px', border: 'none' },
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
		xbutton.style.color = 'red';
		xbutton.innerHTML = finalOptions.closeButtonText;
		xbutton.id = finalOptions.id + '_xbutton';
		xbutton.setAttribute('tabindex', '0');
		xbutton.setAttribute('aria-label','Close Popover');
		xbutton.setAttribute('popovertarget', finalOptions.id);
		xbutton.setAttribute('popovertargetaction', 'hide');
		xbutton.setAttribute('onmouseover','this.style.transform = \'scale(1.2)\'');
		xbutton.setAttribute('onmouseout','this.style.transform = \'none\'');
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
	
	
	// append an Ok button to the bottom of the body to dismiss the popover if desired 
	if (finalOptions.showOkButton) {
		let okButtonDiv = document.createElement('div');
		okButtonDiv.setAttribute('id',finalOptions.id + '_okButton');
		let okButton = '<div style="margin-top: 1rem; text-align: center;"><button popovertarget="' + popoverDiv.id + '">' + finalOptions.okButtonText + '</button></div>';		
		okButtonDiv.innerHTML = okButton;
		popoverDiv.appendChild(okButtonDiv);		
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
	
	
	// add the event listener to remove it from the DOM and cleanup when it's been dismissed
	popoverDiv.addEventListener('toggle', (e) => {
		if (e.newState == 'open') {
			if (typeof finalOptions.bobpopOnOpen === 'function') {
				finalOptions.bobpopOnOpen();
			}
		}
		
		if (e.newState === 'closed') {
			// execute anything from the bobpopOnClose trigger
			if (typeof finalOptions.bobpopOnClose === 'function') {
				finalOptions.bobpopOnClose();
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
		const backdropStyleId = "bobpopBackdropStyle";
		const backdropCSS = `
		:where(.bobpopPopover)::backdrop {
			background-color: ${finalOptions.backdrop};
			${finalOptions.backdropBlur}
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
		if (finalOptions.transition && !document.getElementById(transitionStyleId)) {				
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

			const transitionStyleSheet = document.createElement("style");
			transitionStyleSheet.type = "text/css";
			transitionStyleSheet.id = transitionStyleId;
			transitionStyleSheet.textContent = transitionCSS;

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