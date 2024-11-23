class Seddari {
  constructor(
    seddariWidth = "70px",
    seddariLength = "200px",
    position = "800px",
    angle01 = 0,
    angle12 = 90,
    angle23 = 0,
    angle03 = 90,
    polygonFill = "white",
    strokeColor = "black",
    strokeWidth = "2"
  ) {
    this.polygonFill = polygonFill;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.seddariWidth = parseFloat(seddariWidth);
    this.seddariLength = parseFloat(seddariLength);
    this.positionX = parseFloat(position);
    this.positionY = parseFloat(position);
    this.angle01 = angle01;
    this.angle12 = angle12;
    this.angle23 = angle23;
    this.angle03 = angle03;
    this.polygonContainer = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    this.point0 = { x: this.positionX, y: this.positionY };
    this.managed = false;
    this.parent = null;
    this.attachedShapes = [];
    
    this.indicator01 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.indicator12 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.indicator23 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.indicator30 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.indicator01.dataset.side = "0-1";
    this.indicator12.dataset.side = "1-2";
    this.indicator23.dataset.side = "2-3";
    this.indicator30.dataset.side = "3-0";
    this.indicator01.classList.add("dropzone");
    this.indicator12.classList.add("dropzone");
    this.indicator23.classList.add("dropzone");
    this.indicator30.classList.add("dropzone");
    indicatorToShape.set(this.indicator01, this);
    indicatorToShape.set(this.indicator12, this);
    indicatorToShape.set(this.indicator23, this);
    indicatorToShape.set(this.indicator30, this);
    
  // Set common attributes for indicators
    [this.indicator01, this.indicator12, this.indicator23, this.indicator30].forEach((indicator) => {
      indicator.setAttribute("width", "10");
      indicator.setAttribute("height", "10");
      indicator.setAttribute("fill", "transparent");
      indicator.classList.add("attach-indicator");
    });

    this.updatePoints();
    this.updateDrawing();
  }

  attach(shape, side) {
    this.attachedShapes.push({ shape, side });
    shape.setManaged(true, this);
    this.render();
  }

  detach(shape) {
    let index = -1;
    for (let i=0; i<this.attachedShapes.length; i++) {
      if (this.attachedShapes[i].shape === shape) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      this.attachedShapes.splice(index, 1);
    }
    shape.setManaged(false);
  }

  setSizes(width, length) {
    this.seddariWidth = width;
    this.seddariLength = length;
    this.updatePoints();
    this.render();
  }

  rotate(rotationAngle) {
    // Convert rotationAngle to radians
    const radians = (rotationAngle * Math.PI) / 180;
  
    // Adjust the angles based on the rotation
    this.angle01 += rotationAngle;
    this.angle03 += rotationAngle;
    this.angle12 += rotationAngle;
    this.angle23 += rotationAngle;
  
    // Update the points based on the new angles
    this.updatePoints();
  
    // Re-render the shape with updated points
    this.render();
  }

  setPosition(xPosition, yPosition) {
    this.positionX = xPosition;
    this.positionY = yPosition;
    this.updatePoints();
    this.render();
  }

  moveBaseLine(newx, newy, newx2, newy2) {
    this.point0 = { x: newx, y: newy}
    this.point1 = { x: newx2, y: newy2}
    this.updatePoints();
    this.render();
  }

  setManaged(boolean, parent = null) {
    this.managed = boolean;
    this.parent = parent;
  }

  getParent() {
    return this.parent;
  }

  setPolygonFill(polygonFill) {
    this.polygonFill = polygonFill;
    this.updateDrawing();
  }

  setStrokeColor(strokeColor) {
    this.strokeColor = strokeColor;
    this.updateDrawing();
  }

  setStrokeWidth(strokeWidth) {
    this.strokeWidth = strokeWidth;
    this.updateDrawing();
  }

  updateDrawing() {
    this.polygonContainer.setAttribute("fill", this.polygonFill);
    this.polygonContainer.setAttribute("stroke", this.strokeColor);
    this.polygonContainer.setAttribute("stroke-width", this.strokeWidth);
    this.render();
  }

  safeDeleteComponents() {
    this.indicator01.remove();
    this.indicator12.remove();
    this.indicator23.remove();
    this.indicator30.remove();
    this.polygonContainer.remove();
  }

  updatePoints() {
    if (!this.managed) {
      this.point0 = { x: this.positionX, y: this.positionY };
      this.point1 = {
          x: this.point0.x + this.seddariWidth * Math.cos((this.angle01 * Math.PI) / 180),
          y: this.point0.y - this.seddariLength * Math.sin((this.angle01 * Math.PI) / 180)
      }
      this.point2 = {
          x: this.point1.x + this.seddariWidth * Math.cos((this.angle12 * Math.PI) / 180),
          y: this.point1.y - this.seddariLength * Math.sin((this.angle12 * Math.PI) / 180)
      }
      this.point3 = {
          x: this.point0.x + this.seddariWidth * Math.cos((this.angle03 * Math.PI) / 180),
          y: this.point0.y - this.seddariLength * Math.sin((this.angle03 * Math.PI) / 180)
      }
    } else {
      const dx = this.point0.x - this.point1.x;
      const dy = this.point0.y - this.point1.y;
      const perpendicularX = -dy;
      const perpendicularY = dx;
      const length = Math.sqrt(perpendicularX * perpendicularX + perpendicularY * perpendicularY);
      const unitPerpendicularX = perpendicularX / length;
      const unitPerpendicularY = perpendicularY / length;
      this.point2 = {
        x: (this.point1.x) - unitPerpendicularX * this.seddariLength,
        y: (this.point1.y) - unitPerpendicularY * this.seddariLength
      }
      this.point3 = {
        x: (this.point0.x) - unitPerpendicularX * this.seddariLength,
        y: (this.point0.y) - unitPerpendicularY * this.seddariLength
      }
    }
    this.indicator01Position = {
      x: (this.point0.x + this.point1.x) / 2 - 5,
      y: (this.point0.y + this.point1.y) / 2 - 5,
    }
    this.indicator12Position = {
      x: (this.point1.x + this.point2.x) / 2 - 5, // -5 to center the rect
      y: (this.point1.y + this.point2.y) / 2 - 5,
    };
    this.indicator23Position = {
      x: (this.point2.x + this.point3.x) / 2 - 5,
      y: (this.point2.y + this.point3.y) / 2 - 5,
    };
    this.indicator30Position = {
      x: (this.point0.x + this.point3.x) / 2 - 5,
      y: (this.point0.y + this.point3.y) / 2 - 5,
    };
  }

  render() {
    const polygonPoints = `${this.point0.x},${this.point0.y} ${this.point1.x},${this.point1.y} ${this.point2.x},${this.point2.y} ${this.point3.x},${this.point3.y} ${this.point0.x},${this.point0.y}`;        
    this.polygonContainer.setAttribute("points", polygonPoints);

    this.indicator01.setAttribute("x", this.indicator01Position.x);
    this.indicator01.setAttribute("y", this.indicator01Position.y);
    this.indicator12.setAttribute("x", this.indicator12Position.x);
    this.indicator12.setAttribute("y", this.indicator12Position.y);
    this.indicator23.setAttribute("x", this.indicator23Position.x);
    this.indicator23.setAttribute("y", this.indicator23Position.y);
    this.indicator30.setAttribute("x", this.indicator30Position.x);
    this.indicator30.setAttribute("y", this.indicator30Position.y);

  // Ensure indicators are part of the SVG
    const parent = this.polygonContainer.parentNode;
    if (parent) {
      parent.appendChild(this.indicator01);
      parent.appendChild(this.indicator12);
      parent.appendChild(this.indicator23);
      parent.appendChild(this.indicator30);
    }

    this.attachedShapes.forEach(({ shape, side }) => {
      if (side == "0-1") {
        shape.moveBaseLine(this.point0.x, this.point0.y, this.point1.x, this.point1.y)
      } else if (side == "1-2") {
        shape.moveBaseLine(this.point1.x, this.point1.y, this.point2.x, this.point2.y)
      } else if (side == "2-3") {
        shape.moveBaseLine(this.point2.x, this.point2.y, this.point3.x, this.point3.y)
      } else if (side == "3-0") {
        shape.moveBaseLine(this.point3.x, this.point3.y, this.point0.x, this.point0.y)
      }
    });

    this.polygonContainer.classList.add("draggable");
    this.polygonContainer.addEventListener("click", ()=>{
      selectedShape = this.polygonContainer;
    })
    return this.polygonContainer;
  }
}

class Fromage {
  constructor(
    seddariWidth = "70px",
    triangleSides = "95px",
    angle01 = 0,
    angle04 = 90,
    angle12 = 90,
    angle34 = 0,
    position = "600px",
    polygonFill = "white",
    strokeColor = "black",
    strokeWidth = "2"
  ) {
    this.polygonFill = polygonFill;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.seddariWidth = parseFloat(seddariWidth);
    this.triangleSides = parseFloat(triangleSides);
    this.positionX = parseFloat(position);
    this.positionY = parseFloat(position);
    this.angle01 = angle01;
    this.angle04 = angle04;
    this.angle12 = angle12;
    this.angle34 = angle34;
    this.polygonContainer = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    this.attachedShapes = [];
    this.parent = null;
    this.managed = false;

    this.indicator12 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.indicator34 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.indicator12.dataset.side = "1-2";
    this.indicator34.dataset.side = "3-4";
    this.indicator12.dataset.shape = this;
    this.indicator34.dataset.shape = this;
    this.indicator12.classList.add("dropzone");
    this.indicator34.classList.add("dropzone");
    indicatorToShape.set(this.indicator12, this);
    indicatorToShape.set(this.indicator34, this);

  // Set common attributes for indicators
    [this.indicator12, this.indicator34].forEach((indicator) => {
      indicator.setAttribute("width", "10");
      indicator.setAttribute("height", "10");
      indicator.setAttribute("fill", "transparent");
      indicator.classList.add("attach-indicator");
    });
    
    this.updatePoints();
    this.updateDrawing();
  }

  getParent() {
    return this.parent;
  }

  setSizes(width, length) {
    this.seddariWidth = width;
    this.triangleSides = length;
    this.updatePoints();
    this.render();
  } 

  rotate(rotationAngle) {
    // Convert rotationAngle to radians
    const radians = (rotationAngle * Math.PI) / 180;
  
    // Adjust the angles based on the rotation
    this.angle01 += rotationAngle;
    this.angle04 += rotationAngle;
    this.angle12 += rotationAngle;
    this.angle34 += rotationAngle;
  
    // Update the points based on the new angles
    this.updatePoints();
  
    // Re-render the shape with updated points
    this.render();
  }

  hasChild(shape) {
    if (this.attachedShapes.find(shape)) {
      return true;
    }
    return false;
  }

  setPosition(xPosition, yPosition) {
    this.positionX = xPosition;
    this.positionY = yPosition;
    this.updatePoints();
    this.render();
  }

  attach(shape, side) {
    this.attachedShapes.push({ shape, side });
    shape.setManaged(true, this);
    this.render();
  }

  detach(shape) {
    let index = -1;
    for (let i=0; i<this.attachedShapes.length; i++) {
      if (this.attachedShapes[i].shape === shape) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      this.attachedShapes.splice(index, 1);
    }
    shape.setManaged(false);
  }

  setManaged(boolean, parent = null) {
    this.managed = boolean;
    this.parent = parent;
  }

  setPolygonFill(polygonFill) {
    this.polygonFill = polygonFill;
    this.updateDrawing();
  }

  setStrokeColor(strokeColor) {
    this.strokeColor = strokeColor;
    this.updateDrawing();
  }

  setStrokeWidth(strokeWidth) {
    this.strokeWidth = strokeWidth;
    this.updateDrawing();
  }
  
  updateDrawing() {
    this.polygonContainer.setAttribute("fill", this.polygonFill);
    this.polygonContainer.setAttribute("stroke", this.strokeColor);
    this.polygonContainer.setAttribute("stroke-width", this.strokeWidth);
    this.render();
  }

  updatePoints() {
    // Recalculate all points
    if (!this.managed) {
      this.point0 = { x: this.positionX, y: this.positionY };
      this.point1 = {
        x: this.point0.x + this.triangleSides * Math.cos((this.angle01 * Math.PI) / 180),
        y: this.point0.y - this.triangleSides * Math.sin((this.angle01 * Math.PI) / 180),
      };
      this.point2 = {
        x: this.point1.x + this.seddariWidth * Math.cos((this.angle12 * Math.PI) / 180),
        y: this.point1.y - (this.seddariWidth * Math.sin((this.angle12 * Math.PI) / 180)),
      };
      this.point4 = {
        x: this.point0.x + this.triangleSides * Math.cos((this.angle04 * Math.PI) / 180),
        y: this.point0.y - this.triangleSides * Math.sin((this.angle04 * Math.PI) / 180),
      };
      this.point3 = {
        x: this.point4.x + this.seddariWidth * Math.cos((this.angle34 * Math.PI) / 180),
        y: this.point4.y - this.seddariWidth * Math.sin((this.angle34 * Math.PI) / 180),
      };
    } else {
      
      this.point2 = {
        x: this.point1.x + this.seddariWidth * Math.cos((this.angle12 * Math.PI) / 180),
        y: this.point1.y - (this.seddariWidth * Math.sin((this.angle12 * Math.PI) / 180)),
      };
      this.point4 = {
        x: this.point0.x + this.triangleSides * Math.cos((this.angle04 * Math.PI) / 180),
        y: this.point0.y - this.triangleSides * Math.sin((this.angle04 * Math.PI) / 180),
      };
      this.point3 = {
        x: this.point4.x + this.seddariWidth * Math.cos((this.angle34 * Math.PI) / 180),
        y: this.point4.y - this.seddariWidth * Math.sin((this.angle34 * Math.PI) / 180),
      };
    }
    this.indicator12Position = {
      x: (this.point1.x + this.point2.x) / 2 - 5, // -5 to center the rect
      y: (this.point1.y + this.point2.y) / 2 - 5,
    };
    this.indicator34Position = {
      x: (this.point3.x + this.point4.x) / 2 - 5,
      y: (this.point3.y + this.point4.y) / 2 - 5,
    };
  }

  setAngle(side1, side2, angle) {
    // Set the angle and update relevant points
    if (side1 === 0 && side2 === 1) {
      this.angle01 = angle;
    } else if (side1 === 1 && side2 === 2) {
      this.angle12 = angle;
    } else if (side1 === 0 && side2 === 4) {
      this.angle04 = angle;
    } else if (side1 === 3 && side2 === 4) {
      this.angle34 = angle;
    } else {
      console.error("Invalid sides provided to setAngle");
      return;
    }

    // Update points after setting the angle
    this.updatePoints();
    this.render();
  }

  safeDeleteComponents() {
    this.polygonContainer.remove();
    this.indicator12.remove();
    this.indicator34.remove();
    for (let i=0; i<this.attachedShapes.length; i++) {
      this.attachedShapes[i].shape.safeDeleteComponents()
      this.attachedShapes[i].shape = null;
    }
  }

  moveBaseLine(newx, newy, newx2, newy2) {
    this.point1 = { x: newx, y: newy}
    this.point2 = { x: newx2, y: newy2}
    this.updatePoints();
    this.render();
  }
  
  render() {
    const polygonPoints = `${this.point0.x},${this.point0.y} ${this.point1.x},${this.point1.y} ${this.point2.x},${this.point2.y} ${this.point3.x},${this.point3.y} ${this.point4.x},${this.point4.y} ${this.point0.x},${this.point0.y}`;
    this.polygonContainer.setAttribute("points", polygonPoints);

    this.indicator12.setAttribute("x", this.indicator12Position.x);
    this.indicator12.setAttribute("y", this.indicator12Position.y);
    this.indicator34.setAttribute("x", this.indicator34Position.x);
    this.indicator34.setAttribute("y", this.indicator34Position.y);

  // Ensure indicators are part of the SVG
    const parent = this.polygonContainer.parentNode;
    if (parent) {
      parent.appendChild(this.indicator12);
      parent.appendChild(this.indicator34);
    }
    this.attachedShapes.forEach(({ shape, side }) => {
        if (side == '1-2') {
            shape.moveBaseLine(this.point1.x, this.point1.y, this.point2.x, this.point2.y)
        } else if (side == '3-4') {
            shape.moveBaseLine(this.point3.x, this.point3.y, this.point4.x, this.point4.y)
        }
    });
    this.polygonContainer.classList.add("draggable");
    this.polygonContainer.addEventListener("click", ()=>{
      selectedShape = this.polygonContainer;
    })
    return this.polygonContainer;
  }
}

export const domToShape = new WeakMap();
export const indicatorToShape = new WeakMap();
const svgContainer = document.getElementById("polygon-svg");

document.addEventListener("DOMContentLoaded", () => {
  let fromage = new Fromage();
  let fromageRender = fromage.render();
  domToShape.set(fromageRender, fromage);
  svgContainer.appendChild(fromageRender);
  fromage.setAngle(1,2,90);
  fromage.setAngle(0,4, 90);
  fromage.setAngle(3,4,0);
  fromage.setPolygonFill("white");
  let seddari = new Seddari();
  fromage.attach(seddari, "1-2");
  fromage.detach(seddari);
  let seddariRender = seddari.render();
  domToShape.set(seddariRender, seddari);
  svgContainer.appendChild(seddariRender);
  seddari.setPolygonFill("white");
  fromage.setAngle(3,4,0);
  fromage.setPosition(200,200);
  let seddari_two = new Seddari();
  let seddaritwoRender = seddari_two.render();
  domToShape.set(seddaritwoRender, seddari_two);
  svgContainer.appendChild(seddaritwoRender);
});

document.getElementById("spawn-rectangle").addEventListener("click", ()=>{
  let seddari = new Seddari();
  let seddariRender = seddari.render();
  domToShape.set(seddariRender, seddari);
  svgContainer.appendChild(seddariRender);
})

let selectedShape = null;

document.getElementById("spawn-fromage").addEventListener("click", ()=>{
  let fromage = new Fromage();
  let fromageRender = fromage.render();
  domToShape.set(fromageRender, fromage);
  svgContainer.appendChild(fromageRender);
})

document.getElementById("rotate-selected").addEventListener("click", ()=>{
  if (selectedShape != null) {
    const input = document.getElementById("rotate").value;

    if (input != 0 || input != null) {
      const shape = domToShape.get(selectedShape);
      shape.rotate(parseInt(input));
    }
  }
})

document.getElementById("angle04").addEventListener("input", ()=>{
  if (selectedShape != null) {
    const shape = domToShape.get(selectedShape);
    shape.setAngle(0,4,document.getElementById("angle04").value);
  }
})

document.getElementById("angle01").addEventListener("input", ()=>{
  if (selectedShape != null) {
    const shape = domToShape.get(selectedShape);
    shape.setAngle(0,1,document.getElementById("angle01").value);
  }
})

document.getElementById("angle12").addEventListener("input", ()=>{
  if (selectedShape != null) {
    const shape = domToShape.get(selectedShape);
    shape.setAngle(1,2,document.getElementById("angle12").value);
  }
})

document.getElementById("angle34").addEventListener("input", ()=>{
  if (selectedShape != null) {
    const shape = domToShape.get(selectedShape);
    shape.setAngle(3,4,document.getElementById("angle34").value);
  }
})

document.getElementById("delete-shape").addEventListener("click", ()=>{
  if (selectedShape != null) {
    let shape = domToShape.get(selectedShape);
    domToShape.delete(selectedShape);
    shape.safeDeleteComponents();
    shape = null;
  }
})

document.getElementById("size-btn").addEventListener("click", ()=>{
  const seddariWidth = document.getElementById("seddariwidth").value;
  const seddariLength = document.getElementById("length").value;
  if (selectedShape != null) {
    let shape = domToShape.get(selectedShape);
    shape.setSizes(seddariWidth, seddariLength);
  }
})

const textures = document.querySelectorAll(".texture");

textures.forEach((text)=>{
  text.addEventListener("click", ()=>{
    const imgWithin = text.querySelector("img");
    const imgSrc = imgWithin.getAttribute("src");
  })
})