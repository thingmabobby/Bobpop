# Bobpop
 Vanilla JavaScript custom alerts using the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API "Popover API") and [CSS anchors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning "CSS anchors") to show alerts/tooltips in the top layer potentially positioned with CSS anchors.

 I originally wrote this to help me create popover API error alerts on top of my existing dialog modals, but I figured it can be used for any small alert or tooltip. This was mostly me just testing the Popover API and CSS anchors. It is pretty limited in what you can do with anchors, but I figured it was good enough as a test.

**OPTIONS:**

| Option   |   Description|
| ------------ | ------------ |
| id  | The DOM ID to specify to be used (default: bobpop)  |
| type | Defaults to auto (lightly dismissed - escape or click outside of it), but you can specify automatic to make them hit the "X" to dismiss it (escape will not dismiss using manual so avoid manual if accessibility is a concern)  |
| title | The header title of the popover (can be HTML)   |
| body | The body of the popover (can be HTML) |
| closeButtonText  | Text of the "X" dismissal button (can be HTML) (default: ❌) |
| hideCloseButton | True/false - hides the "X" dismissal button only if type is set to auto |
| showOkButton | True/false - shows an "Ok" button appended to the bottom of the body to dismiss the popover (default: false) |
| okButtonText | Text for the Ok button (default: "Ok") |
| bobpopOnOpen | This will run an anonymous function you provide when the popover is opened |
| bobpopOnClose | This will run an anonymous function you provide when the popover is closed |

|  Style Option | Description  |
| ------------ | ------------ |
| border  | CSS border (default: none)  |
| borderRadius | CSS border-radius (default: 15px)  |
| padding  | CSS padding (default: 15px)  |
| fontFamily | CSS font-family (default: sans-serif) |
| color | CSS font color (default: black)  |
| background | CSS background (default: pink)  |
| boxShadow | CSS box-shadow (default cover backdrop with a mask of opacity) |
| position | CSS position - you may want to use absolute if you are using anchoring, but results may vary (default: fixed)  |
| margin | CSS margin (default: unset, default if anchor is specified: .5rem 0)  |
| anchor | CSS anchor name to attach it to (e.g.: --anchorname)  |
| anchorToId | Given a valid DOM element ID it will append the "anchor-name" CSS style with the given anchor option from above (--anchorname) so it will anchor the popover to it  |
| anchorPositionArea |  CSS position-area (default: bottom - can be many things like bottom right, top left, end end, start end, etc.) |
| tooltipArrow  | Displays an arrow pointing outwards in the specified placement. (default: top center).  The corners (left top, left bottom, right top, right bottom) point outwards diagonally and the others point outwards horizontally or vertically (top left, top center, top right, left middle, right middle, bottom left, bottom center, bottom right). |
| tooltipArrowColor | The color of the tooltip arrow. (default: black) |
| titlePadding | CSS padding for the title div (default: 5px 0px) |
| titleBorderSize | CSS size for the title div border-bottom (default: 1px) |
| titleBorderType | CSS border type for the title div border-bottom (default: dashed) |
| titleBorderColor | CSS border color for the title div border-bottom (default: #00000059) |


| Custom Function | Description |
| --------- | --------- |
| bobpopCloseAll() | Every bobpop popover gets assigned a class "bobpopPopover" so this will loop through all of them and .hidePopover() on them (which triggers the toggle event listener for each and removes them from the DOM) |

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


- Anchored to a specific DOM element with a "tooltip arrow" pointing to it. See example: [codepen](https://codepen.io/Bobby-L-the-decoder/pen/WNqrYQx "codepen")
````
bobpop({
	title: 'Error!',
	body: 'Something went wrong.',
	anchor: '--myanchor',
	anchorToId: 'myElement',
	tooltipArrow: 'left top'
})
````


- A light-dismissed alert hiding the "X" close button, a custom background, anchored to a specific DOM element, custom HTML in the title, and a red tooltip arrow. See example: [codepen](https://codepen.io/Bobby-L-the-decoder/pen/xxoZQKj "codepen")
````
bobpop({
	title: '<div style="text-align: center;">Tooltip</div>',
	body: 'You could use this as a tooltip',
	background: '#f0f0f0',
	boxShadow: 'none',
	hideCloseButton: true,
	anchor: '--myanchor',
	anchorToId: 'myElement',
	tooltipArrow: 'top center',
	tooltipArrowColor: 'red'
})
````

- Here's an example using bobpopOnOpen to open a manually-dismissed bobpop with a form in the body that also has a submit button to check validity and then run a function. See example: [codepen](https://codepen.io/Bobby-L-the-decoder/pen/wvVKQyQ "codepen")
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
		background: '#ddf0ff',
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