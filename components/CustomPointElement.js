// components/CustomPointElement.js
import { PointElement } from "chart.js";

class CustomPointElement extends PointElement {
  draw(ctx) {
    const vm = this.getProps(["x", "y", "radius"]);
    const size = vm.radius * 2; // Size of the square

    ctx.save();
    ctx.fillStyle = this.options.backgroundColor;
    ctx.strokeStyle = this.options.borderColor;
    ctx.lineWidth = this.options.borderWidth;

    ctx.beginPath();
    ctx.rect(vm.x - size / 2, vm.y - size / 2, size, size);
    ctx.closePath();

    if (this.options.borderWidth) {
      ctx.stroke();
    }

    ctx.fill();
    ctx.restore();
  }
}

export default CustomPointElement;
