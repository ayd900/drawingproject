import 'https://cdn.interactjs.io/v1.9.20/auto-start/index.js';
import 'https://cdn.interactjs.io/v1.9.20/actions/drag/index.js';
import 'https://cdn.interactjs.io/v1.9.20/actions/resize/index.js';
import 'https://cdn.interactjs.io/v1.9.20/modifiers/index.js';
import 'https://cdn.interactjs.io/v1.9.20/dev-tools/index.js';
import { domToShape, indicatorToShape } from './index.js';
import interact from 'https://cdn.interactjs.io/v1.9.20/interactjs/index.js';

// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end (event) {
        var textEl = event.target.querySelector('p')

        textEl && (textEl.textContent =
          'moved a distance of ' +
          (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px')
      }
    }
  })

function dragMoveListener (event) {
  var target = event.target;
  const shape = domToShape.get(target);
  const svg = document.querySelector("#polygon-svg"); // Replace with the actual SVG reference
  
  // Get the SVG's bounding rectangle
  const rect = svg.getBoundingClientRect();

  // Convert mouse coordinates to SVG coordinates
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Handle SVG scaling if a viewBox is present
  const viewBox = svg.viewBox.baseVal;
  const scaleX = viewBox.width / rect.width;
  const scaleY = viewBox.height / rect.height;

  const svgX = mouseX * scaleX + viewBox.x;
  const svgY = mouseY * scaleY + viewBox.y;

  target.setAttribute('data-x', svgX)
  target.setAttribute('data-y', svgY)

  // Set the shape's position in SVG coordinates
  shape.setPosition(svgX, svgY);
}

interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    // Require a 75% element overlap for a drop to be possible
    
  
    // listen for drop related events:
  
    ondropactivate: function (event) {
      // add active dropzone feedback
      event.target.classList.add('drop-active')
      const shape = domToShape.get(event.relatedTarget);
      if (shape.managed) {
        const parent = shape.getParent();
        parent.detach(shape);
        shape.setManaged(false);
      }
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget
      var dropzoneElement = event.target
  
      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target')
      draggableElement.classList.add('can-drop')
      draggableElement.textContent = 'Dragged in'
    },
    ondragleave: function (event) {
      // remove the drop feedback style
      event.target.classList.remove('drop-target')
      event.relatedTarget.classList.remove('can-drop')
      event.relatedTarget.textContent = 'Dragged out'
    },
    ondrop: function (event) {
      const side = event.target.dataset.side;
      const parent = indicatorToShape.get(event.target);
      const child = domToShape.get(event.relatedTarget);
      parent.attach(child, side);  
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove('drop-active')
      event.target.classList.remove('drop-target')
    }
  })
  
  interact('.drag-drop')
    .draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      autoScroll: true,
      // dragMoveListener from the dragging demo above
      listeners: { move: dragMoveListener }
    })

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener