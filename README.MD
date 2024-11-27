# Bobpop
 Vanilla JavaScript custom alerts using the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API "Popover API") and [CSS anchors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning "CSS anchors") to show alerts/dialogs/tooltips in the top layer potentially positioned with CSS anchors.

 I originally wrote this to help me create popover API error alerts on top of my existing dialog modals, but I figured it can be used for any small alert, dialog, or tooltip. This was mostly me just testing the Popover API and CSS anchors and slowly adding options.


**OPTIONS:**

| Option   |   Description|
| ------------ | ------------ |
| id  | The DOM ID to specify to be used (default: 'bobpop'). Multiple instances will be assigned a unique ID.  |
| type | Defaults to 'auto' (lightly dismissed - escape or click outside of it), but you can specify 'manual' (or anything else) to make the user hit the "X" to dismiss it (escape will dismiss it regardless of type unless allowEscapeKey is false)  |
| title | The header title of the popover (can be HTML)   |
| body | The body of the popover (can be HTML) |
| closeButtonText  | Text of the "X" dismissal button (can be HTML) (default: an SVG red X) |
| showCloseButton | true/false - if type is 'auto' showCloseButton is false, otherwise true |
| showOkButton | true/false - shows an "Ok" button appended to the bottom of the body to dismiss the popover (default: false) |
| okButtonText | Text for the Ok button (default: 'Ok') |
| allowEscapeKey | true/false - Allows the escape key to dismiss a manual type popover (default: true) |
| transition | true/false if the default fade/scale transition in and out is to be used (default: true) |
| bobpopOnOpen | This will run an anonymous function you provide when the popover is opened |
| bobpopOnClose | This will run an anonymous function you provide when the popover is closed |

|  Style Option | Description  |
| ------------ | ------------ |
| border  | CSS border (default: 'none')  |
| borderRadius | CSS border-radius (default: '15px')  |
| padding  | CSS padding (default: '1rem')  |
| fontFamily | CSS font-family (default: 'inherit') |
| color | CSS font color (default: 'inherit')  |
| background | CSS background (default: 'inherit')  |
| boxShadow | CSS box-shadow (default: '0 4px 8px rgba(0, 0, 0, 0.5)') |
| backdrop | CSS background-color used in the ::backdrop pseudoclass for the popover (default: 'rgb(107 114 128 / .5)') |
| backdropBlur | CSS backdrop-filter: blur (default: false) |
| backdropBlurPx | CSS blur amount in pixels for backdropBlur (default: '4') |
| maxHeight | CSS max-height (default: '85svh') |
| maxWidth | CSS max-width (default: '90vw') |
| scrollbarWidth | CSS scrollbar-width (default: 'thin') |
| position | CSS position - you may want to use absolute if you are using anchoring, but results may vary (default: 'fixed')  |
| anchor | CSS anchor-name to attach it to (e.g.: '--anchorname')  |
| anchorToId | Given a valid DOM element ID it will append the "anchor-name" CSS style with the given anchor option from above (--anchorname) so it will anchor the popover to it  |
| anchorPositionArea |  CSS position-area (default: 'bottom' - can be many things like 'bottom right', 'top left', 'end end', 'start end', etc.) |
| anchorMargin | CSS margin (default: '0', default if anchor is specified: '.5rem 0')  |
| titlePadding | CSS padding for the title div (default: '0px 0px') |
| titleMargin | CSS margin for the title div (default: '.5rem 0'). Note if a tooltip arrow is specified it will apply a title margin of '1rem 0'. |
| titleTextAlign | CSS text-align for the title text (default: 'center') |
| bodyTextAlign | CSS text-align for the body text (default: 'inherit') |
| theme | See "Themes" section |

| Custom Function | Description |
| --------- | --------- |
| bobpopCloseAll() | Every bobpop popover gets assigned a class "bobpopPopover" so this will loop through all of them and .hidePopover() on them (which triggers the toggle event listener for each and removes them from the DOM after waiting for the transition to end) |



**THEMES:**

You can style bobpop with a theme by using the theme option when calling it. Please note that it if detects a user's preference is dark mode it will automatically use the dark theme if no theme is specified (light theme defaults otherwise). You can overwrite theme CSS properties such as font-family, color, background, border, border-radius, and padding.
Usage - theme: 'fancy'

| Theme   | Description |
|---------|-------------|
| dark    | A dark theme with a black background and white text, designed for low-light environments. |
| light   | A light theme with a light grey background and dark text, ideal for bright environments. |
| modern  | A modern theme with a blue gradient background, featuring a sleek, minimalistic design. |
| fancy   | A vibrant gradient theme with purple and blue tones, offering a stylish and bold look. |
| pastel  | A soft pastel gradient theme with light pink and orange hues, perfect for a gentle aesthetic. |
| ocean   | A cool oceanic gradient with blue shades, evoking a calm and refreshing feel. |
| nature  | A nature-inspired gradient theme with shades of green and blue, perfect for an earthy vibe. |
| warm    | A warm gradient with soft orange and pink tones, giving off a cozy and inviting feeling. |
| sleek   | A sleek, tech-inspired blue gradient theme with a clean and sharp design. |
| retro   | A retro-inspired theme with yellow and orange gradients, giving a vintage yet vibrant look. |
| elegant | An elegant gradient theme with blue and dark tones, creating a sophisticated atmosphere. |
| bootstrap | Moderately rounded corners, heavier shadows, classic typography. |
| material | Slightly sharper look with a focus on prominent shadows and clean spacing. |
| tailwind | Minimalistic design with soft shadows and neutral tones, ideal for modern aesthetics. |


**Examples**

- A light-dismissed, very simple, and generic error messsage. See example: [copdepen](https://codepen.io/Bobby-L-the-decoder/pen/BagjGzo "codepen")
````
bobpop({
	title: 'Error!',
	body: 'Something went wrong.'
})
````


- A hard-dismissed, very simple, and generic error messsage. See example: [codepen](https://codepen.io/Bobby-L-the-decoder/pen/mdZVQVN "codepen")
````
bobpop({
	type: 'manual',
	title: 'Error!',
	body: 'Something went wrong.'
})
````


- Anchored to a specific DOM element. If you scroll it should try to shift and stay in the viewport. See example: [codepen](https://codepen.io/Bobby-L-the-decoder/pen/WNqrYQx "codepen")
````
bobpop({	
	title: 'Hello',
	body: 'Here is some body text for you!',
	anchor: '--myanchor',
	anchorToId: 'myElement',
	anchorPositionArea: 'top',
	anchorMargin: '2rem'
})
````


- A light-dismissed alert hiding the "X" close button, a fancy theme, anchored to a specific DOM element, custom HTML in the title. See example: [codepen](https://codepen.io/Bobby-L-the-decoder/pen/xxoZQKj "codepen")
````
bobpop({
	body: 'Check out this <b>sweet</b> popover!',
	theme: 'fancy',
	hideCloseButton: true,
	anchor: '--myanchor',
	anchorToId: 'myElement',
})
````

- Here's an example using bobpopOnOpen to open a manually-dismissed bobpop using a tailwind theme with a form in the body that also has a submit button to check validity and then run a function. See example: [codepen](https://codepen.io/Bobby-L-the-decoder/pen/wvVKQyQ "codepen")
```
function addUser() {
	const bodyhtml = `
		<p>This will add a new user.</p>
		<form id="addUser">
			User Name: <input type="text" id="newusername" autofocus required>
			<button id='addUserSubmitButton'>Add</button>
		</form>
	`;

	bobpop({
		title: 'Add User',
		type: 'manual',
		theme: 'tailwind',
		body: bodyhtml,
		bobpopOnOpen: () => {
			document.getElementById('addUser').addEventListener('submit', (event) => {
				event.preventDefault();				
				const isValid = document.getElementById('addUser').checkValidity();
				
				if (isValid) {
					addUserSubmit();
				}
			});
		}
	})
}

function addUserSubmit() {
	console.log('do something!');
}
```