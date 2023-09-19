export class Arrow {
  length;
  thickness = 3;
  isActive = false;
  begin = { x: null, y: null };
  end = { x: null, y: null };

  constructor(beginNode, endNode, isOriented, text, ctx) {
    this.beginNode = beginNode;
    this.endNode = endNode;
    this.isOriented = isOriented;
    this.text = text;
    this.ctx = ctx;
    this.setCoord(beginNode, endNode);
    this.render();
  }
  setCoord(node_1, node_2) {
    const dx = Math.abs(node_1.x - node_2.x);
    const dy = Math.abs(node_1.y - node_2.y);
    this.length = Math.pow(Math.pow(dx, 2) + Math.pow(dy, 2), 0.5);

    if (node_2.x > node_1.x) {
      this.begin.x =
        node_2.x - ((this.length - node_1.size - 10) * dx) / this.length;
      this.end.x = node_2.x - ((node_2.size + 10) * dx) / this.length;
    } else {
      this.begin.x =
        node_2.x + ((this.length - node_1.size - 10) * dx) / this.length;
      this.end.x = node_2.x + ((node_2.size + 10) * dx) / this.length;
    }
    if (node_2.y > node_1.y) {
      this.begin.y =
        node_2.y - ((this.length - node_1.size - 10) * dy) / this.length;
      this.end.y = node_2.y - ((node_2.size + 10) * dy) / this.length;
    } else {
      this.begin.y =
        node_2.y + ((this.length - node_1.size - 10) * dy) / this.length;
      this.end.y = node_2.y + ((node_2.size + 10) * dy) / this.length;
    }
  }
  mouseIsOver(e) {
    const dx1 = this.end.x - this.begin.x;
    const dy1 = this.end.y - this.begin.y;
    const dx = e.clientX - this.begin.x;
    const dy = e.clientY - this.begin.y;
    const S = dx1 * dy - dy1 * dx;
    const ab = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const h = S / ab;
    if (Math.abs(h) < this.thickness * 3) return true;
  }
  render() {
    if (this.length - this.beginNode.size - this.endNode.size > 20) {
      this.ctx.beginPath();

      if (this.isActive) this.ctx.strokeStyle = "#2ecde6";
      else this.ctx.strokeStyle = "#000000";

      this.ctx.lineWidth = this.thickness;
      this.ctx.moveTo(this.begin.x, this.begin.y);
      this.ctx.lineTo(this.end.x, this.end.y);
      this.ctx.stroke();

      if (this.isOriented) {
        const getAngle = (p1, p2) => {
          const x = p2.x - p1.x;
          const y = p2.y - p1.y;
          return Math.atan2(y, x);
        };
        const alpha = getAngle(this.begin, this.end);

        this.ctx.beginPath();
        this.ctx.moveTo(this.end.x, this.end.y);
        this.ctx.lineTo(
          this.end.x + Math.cos(alpha + (150 / 180) * Math.PI) * 20,
          this.end.y + Math.sin(alpha + (150 / 180) * Math.PI) * 20
        );
        this.ctx.moveTo(this.end.x, this.end.y);
        this.ctx.lineTo(
          this.end.x + Math.cos(alpha - (150 / 180) * Math.PI) * 20,
          this.end.y + Math.sin(alpha - (150 / 180) * Math.PI) * 20
        );
        this.ctx.stroke();
      }

      this.ctx.font = "bold 20px sans-serif";
      this.ctx.fillStyle = "#d90f0f";
      this.ctx.strokeStyle = "#d90f0f";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      var x, y;

      if (this.begin.x > this.end.x)
        x = this.begin.x - Math.abs(this.begin.x - this.end.x) / 2;
      else x = this.begin.x + Math.abs(this.begin.x - this.end.x) / 2;

      if (this.begin.y > this.end.y)
        y = this.begin.y - Math.abs(this.begin.y - this.end.y) / 2;
      else y = this.begin.y + Math.abs(this.begin.y - this.end.y) / 2;

      this.ctx.fillText(`${this.text}`, x, y - 20);
    }
  }
}
