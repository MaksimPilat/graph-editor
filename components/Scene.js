export class Scene{
    nodes = [];
    nodesToConnect = [];
    arrows = [];
    historyPrev = [];
    historyNext = [];

    constructor(ctx, canvasWidth, canvasHeight){
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }
    
    setArrowsCoord(node){
        this.arrows.forEach((arrow) => {
            if(arrow.beginNode.key == node.key)
                arrow.setCoord(node, arrow.endNode);
            if(arrow.endNode.key == node.key)
                arrow.setCoord(arrow.beginNode, node);
        });
    }
    inputWindow(item){
        const itemInputBox = document.querySelector('.itemInputBox');
        const input = itemInputBox.querySelector('#itemInput');
        if(window.getComputedStyle(itemInputBox).display == 'none'){
            itemInputBox.style.display = 'block';
            input.value = item.text;
            if(item.constructor.name == "Node") input.placeholder = "node text";
            else input.placeholder = "arrow text";
                
            input.focus();
            document.querySelector('canvas').style.filter = 'blur(8px)';
        }
        else{
            item.text = input.value;
            itemInputBox.style.display = 'none';
            document.querySelector('canvas').style.filter = '';
        }
    }
    historyAction(flag){
        function first(bar){
            if(bar.node != null) 
                this.nodes[bar.node.key] = bar.node;
            if(flag){
                if(!(bar.node != null && bar.arrows.length != 0))
                    bar.arrows.forEach(arrow => this.arrows.push(arrow));   
            }
            else bar.arrows.forEach(arrow => this.arrows.push(arrow));   
             
            
        }
        function second(bar){
            if(bar.node != null){
                delete this.nodes[bar.node.key];
                this.arrows.splice(this.arrows.length - bar.arrows.length, bar.arrows.length)
            }
            else this.arrows.pop();
        }

        const add = first.bind(this);
        const remove = second.bind(this);

        if(!flag) 
        {
            if(this.historyPrev.length != 0){
                const bar = this.historyPrev.pop();
                this.historyNext.push(bar);

                if(bar.event == 'delete') add(bar);
                if(bar.event == 'create') remove(bar);
            }
        }
        else{
            if(this.historyNext.length != 0){
                const bar = this.historyNext.pop();
                this.historyPrev.push(bar);

                if(bar.event == 'delete') remove(bar);
                if(bar.event == 'create') add(bar);
            }
        }
       
    }
    render(){
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.nodes.forEach(node => node.render());
        this.arrows.forEach(arrow => arrow.render());
    }
}