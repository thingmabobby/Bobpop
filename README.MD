** Bobpop**
 Custom popover API modal

 I originally wrote this to help me create popover API error modals on top of dialog modals, but I figured it can be used for any small alert modal.

** OPTIONS:**

| Option   |   Description|
| ------------ | ------------ |
| id  | The DOM ID to specify to be used (default: bobpop)  |
| type | Defaults to auto (lightly dismissed - escape or click outside of it), but you can specify automatic to make them hit the "X" to dismiss it (escape won't dismiss using manual so avoid manual if accessibility is a concern)  |
| title  | The header title of the modal (can be HTML)   |
|  body |  The body of the modal (can be HTML) |
| closeButtonText  |  Inner text of the "X" dismissal button (default: ❌) |
| hideCloseButton| True/false - hides the "X" dismissal button only if type is set to auto |

|  Style Option | Description  |
| ------------ | ------------ |
| border  | CSS border (default: none)  |
| borderRadius | CSS border-radius (default: 15px)  |
| padding  | CSS padding (default: 15px)  |
|  color | CSS font color (default: black)  |
|  background | CSS background (default: pink)  |
|  boxShadow |  CSS box-shadow (default cover backdrop with a mask of opacity) |
|  position | CSS position - you may want to use absolute if you are using anchoring, but results may vary (default: fixed)  |
|  margin | CSS margin (default: unset, default if anchor is specified: .5rem 0)  |
|  anchor | CSS anchor name to attach it to (e.g.: --anchorname)  |
|  anchorToId | Given a valid DOM element ID it will append the "anchor-name" CSS style with the given anchor option from above (--anchorname) so it will anchor the modal to it  |
|  anchorBottom | CSS bottom (default: anchor(top))  |
|  anchorInsetArea |  CSS inset-area (default: bottom) |
| tooltipArrow  | Displays an arrow pointing outwards in the specified placement. (default: top center).  The corners (left top, left bottom, right top, right bottom) point outwards diagonally and the others point outwards horizontally or vertically. |