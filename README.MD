# Bobpop
 Vanilla JavaScript custom alerts using the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API "Popover API") and [CSS anchors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning "CSS anchors") to show alerts/tooltips in the top layer potentially positioned with CSS anchors.

 I originally wrote this to help me create popover API error alerts on top of my existing dialog modals, but I figured it can be used for any small alert or tooltip. This was mostly me just testing the Popover API and CSS anchors. It is pretty limited in what you can do with anchors, but I figured it was good enough as a test.

**OPTIONS:**

| Option   |   Description|
| ------------ | ------------ |
| id  | The DOM ID to specify to be used (default: bobpop)  |
| type | Defaults to auto (lightly dismissed - escape or click outside of it), but you can specify automatic to make them hit the "X" to dismiss it (escape will not dismiss using manual so avoid manual if accessibility is a concern)  |
| title  | The header title of the popover (can be HTML)   |
| body | The body of the popover (can be HTML) |
| closeButtonText  | Text of the "X" dismissal button (can be HTML) (default: ❌) |
| hideCloseButton| True/false - hides the "X" dismissal button only if type is set to auto |

|  Style Option | Description  |
| ------------ | ------------ |
| border  | CSS border (default: none)  |
| borderRadius | CSS border-radius (default: 15px)  |
| padding  | CSS padding (default: 15px)  |
| color | CSS font color (default: black)  |
| background | CSS background (default: pink)  |
| boxShadow | CSS box-shadow (default cover backdrop with a mask of opacity) |
| position | CSS position - you may want to use absolute if you are using anchoring, but results may vary (default: fixed)  |
| margin | CSS margin (default: unset, default if anchor is specified: .5rem 0)  |
| anchor | CSS anchor name to attach it to (e.g.: --anchorname)  |
| anchorToId | Given a valid DOM element ID it will append the "anchor-name" CSS style with the given anchor option from above (--anchorname) so it will anchor the popover to it  |
| anchorBottom | CSS bottom (default: anchor(top))  |
| anchorInsetArea |  CSS inset-area (default: bottom) |
| tooltipArrow  | Displays an arrow pointing outwards in the specified placement. (default: top center).  The corners (left top, left bottom, right top, right bottom) point outwards diagonally and the others point outwards horizontally or vertically. |
| tooltipArrowColor | The color of the tooltip arrow. (default: black) |

**Examples**

A light-dismissed, very simple, and generic error messsage.
````
bobpop({
	title: 'Error!',
	body: 'Something went wrong.'
})
````


A hard-dismissed, very simple, and generic error messsage.
````
bobpop({
	type: 'manual',
	title: 'Error!',
	body: 'Something went wrong.'
})
````


Anchored to a specific DOM element with a "tooltip arrow" pointing to it
````
bobpop({
	title: 'Error!',
	body: 'Something went wrong.',
	anchor: '--myanchor',
	anchorToId: 'myElement',
	tooltipArrow: 'left top'
})
````


A light-dismissed alert hiding the "X" close button, a custom background, anchored to a specific DOM element, custom HTML in the title, and a red tooltip arrow
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