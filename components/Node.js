export class Node{
    isActive = false;
    
    constructor(key, x, y, size, text, ctx){
        this.key = key;
        this.size = size;
        this.text = text;
        this.ctx = ctx;
        this.setCoord(x, y);
        this.render();
    }
    setCoord(x, y){
        this.x = x;
        this.y = y;
    }
    mouseIsOver(e){
        if(e.clientX > this.x - this.size/1.2 && e.clientX < this.x + this.size/1.2 && 
            e.clientY > this.y - this.size/1.2 && e.clientY < this.y + this.size/1.2){
            return true;
        }
    }
    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        if(this.isActive){
            this.ctx.fillStyle = '#b4f095';
        }
        else{
            this.ctx.fillStyle = '#d6d6d6';
        }
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.font="bold 20px sans-serif";
        this.ctx.fillStyle = "#000000";
        this.ctx.strokeStyle = "#000000";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline="middle";
        this.ctx.fillText(`${this.text}`, this.x, this.y);
    }
}