import { Node } from './components/Node.js';
import { Arrow } from './components/Arrow.js';
import { Scene } from './components/Scene.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
canvas.width = document.documentElement.scrollWidth*4;
canvas.height = document.documentElement.scrollHeight*4;
canvas.style.width = window.innerWidth*4 + 'px';
canvas.style.height = window.innerHeight*4 + 'px';


canvas.onmousedown = (e) => {
    let isFound = false;
    if(e.shiftKey){
        scene.nodes.forEach((node) => {
            if(node.mouseIsOver(e)){
                isFound = true;
                node.isActive = true;

                if(scene.nodesToConnect.length < 2)
                    scene.nodesToConnect.push(node);
                else{
                    scene.nodesToConnect.shift().isActive = false;
                    scene.nodesToConnect.push(node);
                }
            }
        });
    }
    else{
        scene.nodes.forEach((node) => {
            node.isActive = false;
            if(node.mouseIsOver(e) && !isFound){
                scene.nodesToConnect = [];
                isFound = true;
                node.isActive = true;
                scene.nodesToConnect.push(node);

                canvas.onmousemove = (e) => {
                    node.setCoord(e.clientX, e.clientY);
                    scene.setArrowsCoord(node);
                    scene.render();
                }
                canvas.onmouseup = () => canvas.onmousemove = null;
            }
        });
        scene.arrows.forEach((arrow) => {
            arrow.isActive = false;
            if(arrow.mouseIsOver(e) && !isFound){
                arrow.isActive = true;
                isFound = true;
            }
        });
    }
    if(!isFound){
        scene.nodesToConnect = [];
        scene.nodes.forEach(node => node.isActive = false);
        scene.arrows.forEach(arrow => arrow.isActive = false);
    }

    scene.render();
}

canvas.ondblclick = (e) => {
    const node = new Node(scene.nodes.length, e.clientX, e.clientY, 30, '', ctx);
    node.isActive = true;
    scene.nodes.push(node);
    scene.nodesToConnect.push(node);
    scene.historyPrev.push({event: 'create', node: node, arrows: []});
    scene.historyNext = [];

    scene.render();
}

document.onkeydown = (e) => {
    var item = null;

    const node = scene.nodes.find((node) => {
        if(node) return node.isActive;
    });

    const arrow = scene.arrows.find(arrow => arrow.isActive);

    if(node) item = node;
    else if(arrow) item = arrow;

    if(item){
        const historyBar = {
            event: '',
            node: null,
            arrows: []
        };

        if(e.key == 'Delete'){
            historyBar.event = 'delete';
            if(item.constructor.name == "Node"){
                historyBar.node = node;
                delete scene.nodes[node.key];

                function removeArrows(arrows){
                    arrows.forEach((arrow) => {
                        if(arrow.beginNode.key == node.key || arrow.endNode.key == node.key ){
                            arrows.splice(scene.arrows.indexOf(arrow), 1);
                            historyBar.arrows.push(arrow)
                            removeArrows(scene.arrows);
                        }
                    });
                };
                removeArrows(scene.arrows);
            }
            else{
                historyBar.arrows.push(arrow);
                scene.arrows.splice(scene.arrows.indexOf(arrow), 1);
            }
        }

        if(item.constructor.name == "Node"){
            if(e.key == '+' && item.size < 150){
                item.size += 30;
                scene.setArrowsCoord(item);
            }
            if(e.key == '-' && item.size > 40){
                item.size -= 30;
                scene.setArrowsCoord(item);
            }
            if(scene.nodesToConnect.length == 2 && e.key == '1' || e.key == '2'){
                if(!scene.arrows.find(arrow => scene.nodesToConnect.every(node => node.key == arrow.beginNode.key || node.key == arrow.endNode.key))){
                    const arrow = new Arrow(scene.nodesToConnect[0], scene.nodesToConnect[1], true, '', ctx);
                    if(e.key == '2') arrow.isOriented = false;
                    historyBar.event = 'create';
                    historyBar.arrows.push(arrow);
                    scene.arrows.push(arrow);
                }
            }
        }

        if(e.keyCode == 13) scene.inputWindow(item);
        
        if(historyBar.node != null || historyBar.arrows.length != 0){
            scene.historyPrev.push(historyBar);
            scene.historyNext = [];
        }
        
    }

    if (e.keyCode == 90 && e.ctrlKey) scene.historyAction(false);
    if (e.keyCode == 89 && e.ctrlKey) scene.historyAction(true); 

    scene.render();
}


const scene = new Scene(ctx, canvas.width, canvas.height);


document.querySelectorAll('.button').forEach((btn) => {
    btn.addEventListener('mouseover', () => btn.querySelector('.buttonActive').style.left = -1 + '%');
    btn.addEventListener('mouseout', () => btn.querySelector('.buttonActive').style.left = '');
});


function updateScene(object){
    const nodes = [];
    const arrows = [];

    object.nodes.forEach((node) => {
        nodes.push(new Node(node.key, node.x, node.y, node.size, node.text, ctx));
    });

    object.arrows.forEach((arrow) => {
        arrows.push(new Arrow(nodes.find(node => node.key == arrow.beginNode), nodes.find(node => node.key == arrow.endNode), arrow.isOriented, arrow.text, ctx));
    });

    scene.nodes = nodes;
    scene.arrows = arrows;

    scene.render();
}


document.querySelector('#file').addEventListener('input', () => {
    const file = document.querySelector('#file').files[0];
    const reader = new FileReader();

    if(file.name.match(/\.([^.]+)$/)?.[1] != 'txt') alert('File extension must be "txt"');
    else reader.readAsText(file);
     
    reader.onload = () => updateScene(JSON.parse(reader.result));
    reader.onerror = () => alert('Reader: error');
});


document.querySelector('.btnSave').addEventListener('click', () => {

    const blob = new Blob([getJSON()], {type: 'text/plain'});
    const link = document.querySelector('#blobLink');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'map');

    function getJSON(){
        const object = { nodes: [], arrows: [] };

        scene.nodes.forEach((node) => { 
            if(node) object.nodes.push({ key: node.key, x: node.x, y: node.y, size: node.size, text: node.text });
        });
        scene.arrows.forEach(arrow => 
            object.arrows.push({ beginNode: arrow.beginNode.key, endNode: arrow.endNode.key, isOriented: arrow.isOriented, text: arrow.text }));

        return JSON.stringify(object);
    }
    
});