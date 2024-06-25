
var tela ={width: innerWidth, height: innerHeight - 8}
const canvas = document.querySelector("canvas");
canvas.width = tela.width;
canvas.height = tela.height;

const c = canvas.getContext('2d');
// ---------------------------------------ZOOM IN / PANNING--------------------------------------------------
var sizeUniverse = 3;
var universeWidth = canvas.width * sizeUniverse; 
var universeHeight = canvas.height * sizeUniverse; 
trackTransforms(c)

function redraw(){
    // Clear the entire canvas
    var p1 = c.transformedPoint(0,0);
    var p2 = c.transformedPoint(canvas.width,canvas.height);
    c.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

    c.save();
    if (!CanvasRenderingContext2D.prototype.resetTransform) {
        CanvasRenderingContext2D.prototype.resetTransform = function() {
            this.setTransform(1, 0, 0, 1, 0, 0);
        };
    }
    c.clearRect(0,0,universeWidth,universeHeight);
    c.restore();
}
var lastX=canvas.width/2, lastY=canvas.height/2;
var dragStart,dragged;
canvas.addEventListener('mousedown',function(evt){
    if(evt.button == 1){
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = c.transformedPoint(lastX,lastY);
        dragged = false;
    }
},false);
canvas.addEventListener('mousemove',function(evt){
    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
    dragged = true;
    if (dragStart){
        var pt = c.transformedPoint(lastX,lastY);
        c.translate(pt.x-dragStart.x,pt.y-dragStart.y);
        redraw();
    }
    draweverything();
},false);
canvas.addEventListener('mouseup',function(evt){
    dragStart = null;
},false);
var scaleFactor = 1.05;
var zoom = function(clicks){
    var pt = c.transformedPoint(lastX,lastY);
    c.translate(pt.x,pt.y);
    var factor = Math.pow(scaleFactor,clicks);
    c.scale(factor,factor);
    c.translate(-pt.x,-pt.y);
    redraw();
    draweverything();
}
var handleScroll = function(evt){
    var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
    if (delta){
        zoom(delta);
    }
    return evt.preventDefault() && false;
};
canvas.addEventListener('DOMMouseScroll',handleScroll,false);
canvas.addEventListener('mousewheel',handleScroll,false);
function trackTransforms(c){
    var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    var xform = svg.createSVGMatrix();
    c.getTransform = function(){ return xform; };

    var savedTransforms = [];
    var save = c.save;
    c.save = function(){
        savedTransforms.push(xform.translate(0,0));
        return save.call(c);
    };

    var restore = c.restore;
    c.restore = function(){
        xform = savedTransforms.pop();
        return restore.call(c);
    };

    var scale = c.scale;
    c.scale = function(sx,sy){
        xform = xform.scaleNonUniform(sx,sy);
        return scale.call(c,sx,sy);
    };

    var rotate = c.rotate;
    c.rotate = function(radians){
        xform = xform.rotate(radians*180/Math.PI);
        return rotate.call(c,radians);
    };

    var translate = c.translate;
    c.translate = function(dx,dy){
        xform = xform.translate(dx,dy);
        return translate.call(c,dx,dy);
    };

    var transform = c.transform;
    c.transform = function(a,b,c,d,e,f){
        var m2 = svg.createSVGMatrix();
        m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
        xform = xform.multiply(m2);
        return transform.call(c,a,b,c,d,e,f);
    };

    var setTransform = c.setTransform;
    c.setTransform = function(a,b,c,d,e,f){
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(c,a,b,c,d,e,f);
    };

    var pt  = svg.createSVGPoint();
    c.transformedPoint = function(x,y){
        pt.x=x; pt.y=y;
        return pt.matrixTransform(xform.inverse());
    }
}
var hunger_c = 0.8; 
var hunger_h = 0.8; 
var changeGraphic = false;
var popH;
var velMedH;
var forcaMedH;
var rayMedH;
var rayDetMedH;
var energMedH;
var taxaEnergMedH;

var popC;
var velMedC;
var forcaMedC;
var rayMedC;
var rayDetMedC;
var energMedC;
var taxaEnergMedC;

var magnitude_mutation= 0.1; 
var right_side_empty = true;
var left_side_empty = true;

// QuadTree
let rectangleCanvas = new Rectangle(universeWidth/2, universeHeight/2, universeWidth/2, universeHeight/2);
var popover_id = 1;
var conf_c;
var conf_h;

function createsUniverse(sizeUniverse){
    universeWidth = canvas.width * sizeUniverse; 
    universeHeight = canvas.height * sizeUniverse;
}
function checkViesMutacoes(value, iterations){
    var smaller = 0;
    var bigger = 0;
    var equal = 0;
    var newvalue = 0;
    for(var i = 0; i < iterations; i++){
        newvalue = newmutation(value)
        if(newvalue > value){
            bigger++;
        } else if(newvalue < value){
            smaller++;
        } else{
            equal++;
        }
    }

    console.log("bigger: " + ((bigger * 100)/iterations) + "%")
    console.log("smaller: " + ((smaller * 100)/iterations) + "%")
    console.log("equal: " + ((equal * 100)/iterations) + "%")
    console.log("Mutations: " + (((bigger + smaller) * 100)/iterations) + "%")
}
function checkViasMutacoesLitre(litter_min, litter_max, iterations){
    var smaller = 0;
    var bigger = 0;
    var equal = 0;
    var litter_media = (litter_min + litter_max) / 2;
    for(var i = 0; i < iterations; i++){
        novoInterval = mutationlitter(litter_min, litter_max)
        nova_litter_media = (novoInterval[0] + novoInterval[1]) / 2
        if(nova_litter_media > litter_media){
            bigger++;
        } else if(nova_litter_media < litter_media){
            smaller++;
        } else{
            equal++;
        }
    }

    console.log("bigger: " + ((bigger * 100)/iterations) + "%")
    console.log("smaller: " + ((smaller * 100)/iterations) + "%")
    console.log("equal: " + ((equal * 100)/iterations) + "%")
    console.log("Mutations: " + (((bigger + smaller) * 100)/iterations) + "%")
}
function draweverything(){
    Food.foods.forEach(a => {
        a.display();
    })
    Organisms.organisms.forEach(o => {
        o.display();
    })
}
function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/""/g, '""""');
            result = result.replace(".", ",")
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ';';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}        
function create_Objects(n_carnivores, n_herbivores, n_foods){
    for(var i = 0; i < n_carnivores; i++){
        var x =(Math.random() * (universeWidth - 50) + 25);
        var y = (Math.random() * (universeHeight - 50) + 25);
        generatesCarnivores(x,y);
    }
    for(var i = 0; i < n_herbivores; i++){
        var x =(Math.random() * (universeWidth - 50) + 25);
        var y = (Math.random() * (universeHeight - 50) + 25);
        generatesHerbivores(x,y);    
    }
    for(var i = 0; i < n_foods; i++){
        var x =(Math.random() * (universeWidth - 50) + 25);
        var y = (Math.random() * (universeHeight - 50) + 25);
        generatesFood(x,y);
    }
}
function destroyObjects(){
    Carnivores.carnivores.length = 0;
    Herbivores.herbivores.length = 0;
    Food.foods.length = 0;
}
var intervalRateFoods;
var checkbox_division = document.getElementById('division');
var split_screen;
var loop_limiter = 0;

function generatesFood(x,y){
    var ray = generatesNumeroPorInterval(1, 2);
    return new Food(x, y, ray);
}
function generatesCarnivores(x,y){ 
    var initial_radius = generatesNumeroPorInterval(3, 8);
    var speed_max = generatesNumeroPorInterval(1, 2.2); 
    var force_max = generatesNumeroPorInterval(0.01, 0.05);
    var color = generatescolor();
    var initial_detection_radius = generatesNumeroPorInterval(40, 120);
    var litter_min = generatesInteger(1, 1);
    var litter_max = litter_min + generatesInteger(1, 8);
    var litter_range = [litter_min, litter_max];
    var sex;

    if(Math.random() < 0.5){
        sex = 'XX'
    } else{
        sex = 'XY'
    }

    if(conf_c) {
        initial_radius = conf_c.initial_radius;
        speed_max = conf_c.speed_max;
        force_max = conf_c.force_max;
        color = conf_c.color;
        litter_range = conf_c.litter_range
        sex = conf_c.sex
    }

    var dna = new DNA(
        initial_radius,
        speed_max,
        force_max,
        color,
        initial_detection_radius,
        litter_range,
        sex
    )

    return new Carnivores(
        x, y, dna
    );
}
function generatesHerbivores(x,y){   
    var initial_radius = generatesNumeroPorInterval(3, 8);
    var speed_max = generatesNumeroPorInterval(1, 2.2); 
    var force_max = generatesNumeroPorInterval(0.01, 0.05);
    var color = generatescolor();
    var initial_detection_radius = generatesNumeroPorInterval(40, 120);
    var litter_min = generatesInteger(1, 1);
    var litter_max = litter_min + generatesInteger(1, 8);
    var litter_range = [litter_min, litter_max];
    var sex;

    if(Math.random() < 0.5){
        sex = 'XX'
    } else{
        sex = 'XY'
    }

    if(conf_h) {
        initial_radius = conf_h.initial_radius;
        speed_max = conf_h.speed_max;
        force_max = conf_h.force_max;
        color = conf_h.color;
        litter_range = conf_h.litter_range;
        sex = conf_h.sex;
    }

    var dna = new DNA(
        initial_radius,
        speed_max,
        force_max,
        color,
        initial_detection_radius,
        litter_range,
        sex
    )

    return new Herbivores(
        x, y, dna
    );
}
function generatescolor(){
    var r = Math.floor(Math.random() * 256); 
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var color = "rgb(" + r + "," + g + "," + b + ")";
    return color;
}
function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        "rgb("
        + parseInt(result[1], 16) + ","
        + parseInt(result[2], 16) + ","
        + parseInt(result[3], 16)
        + ")"
    : null;
}
function rgbToHex(rgb) {
    let result = /^rgb\(([\d]{1,3}),([\d]{1,3}),([\d]{1,3})\)$/i.exec(rgb)
    if(!result) return null;

    let r = parseInt(result[1]).toString(16)
    let g = parseInt(result[2]).toString(16)
    let b = parseInt(result[3]).toString(16)
    
    return `#${r.length<2? "0"+r:r}${g.length<2? "0"+g:g}${b.length<2? "0"+b:b}`
}
function colorMutation(style) {
    if(Math.random() < probability_mutation){ 
        let colores = style.substring(4, style.length - 1) 
            .split(',') 
            .map(function(color) { 
                color = parseInt(color);
                let operacao = "";
                let p = Math.random();

                if(color <= 10) { 
                    operacao = "addition"
                } else if(color >= 246) { 
                    operacao = "subtraction"

                } else { 
                    if(Math.random() < 0.5) {
                        operacao = "addition"
                    } else {
                        operacao = "subtraction"
                    }
                }
                if(operacao == "addition") {
                    if(p < 0.002){ 
                        return Math.ceil(color + color * (Math.random() *magnitude_mutation* 10 ));
                    } else if(p < 0.008){ 
                        return Math.ceil(color + color * (Math.random() *magnitude_mutation*4  ));
                    } else if(p < 0.028){ 
                        return Math.ceil(color + color * (Math.random() *magnitude_mutation* 2 ));
                    } else{
                        return Math.ceil(color + color * (Math.random() *magnitude_mutation));
                    }
                } else { 
                    if(p < 0.002){ 
                        return Math.ceil(color - color * (Math.random() *magnitude_mutation* 10 ));
                    } else if(p < 0.008){
                        return Math.ceil(color - color * (Math.random() * magnitude_mutation* 4 ));
                    } else if(p < 0.028){
                        return Math.ceil(color - color * (Math.random() * magnitude_mutation* 2 ));
                    } else{
                        return Math.ceil(color - color * (Math.random() *magnitude_mutation));
                    }
                }
            });
        return `rgb(${colores[0]},${colores[1]},${colores[2]})`
    } else{
        return style;
    }
}
function newMutation(value) {
    if(Math.random() < probability_mutation){ 
        let p = Math.random();
        let variacao = value *magnitude_mutation; 
        if(p < 0.001){ 
            variacao *= 10;
        } else if(p < 0.003){ 
            variacao *= 6;
        } else if(p < 0.008){ 
            variacao *= 3.5;
        } else if(p < 0.028){ 
            variacao *= 2;
        }
        
        let minimo = value - variacao;  
        variacao *= 2                   
                                       
        if(minimo <= 0) {
            minimo = value * 0.01; 
        }
        return minimo + Math.random() * variacao; 
    } else{ 
        return value;
    }
}
function mutationlitter(litter_min, litter_max) {
    if(Math.random() < probability_mutation){ 
        let variacao_litter_min = generatesInteger(0, 2 + Math.floor(magnitude_mutation* 10) );
        let variacao_litter_max = generatesInteger(0, 2 + Math.floor(magnitude_mutation* 10 ));
 
        if(Math.random() >= 0.5) { 
            litter_min += variacao_litter_min;
            litter_max += variacao_litter_max;
        } else{ 
            litter_min -= variacao_litter_min;
            litter_max -= variacao_litter_max;
        }

        if(litter_min <= 0) {
            litter_min = 0;
        }
        if(litter_max <= litter_min) {
            litter_max = litter_min + 1;
        }
    }
    
    return [litter_min, litter_max];
}

function generatesNumeroPorInterval(min, max) {
    let delta = max - min; 
    return parseFloat((Math.random() * delta + min).toFixed(4)); 
}

function createsFoodsGradative(){
    if(!paused){ 
        if(split_screen){
            if(left_side_empty){ 
                var x = generatesNumeroPorInterval(universeWidth/2 + 31, universeWidth - 31);
                var y = Math.random() * (universeHeight - 62) + 31;
                var ray = Math.random() * 1.5 + 1;
    
                if(Food.foods.length < 3000){ 
                    new Food(x, y, ray);
                }
            }
            if(right_side_empty){ 
                var x = generatesNumeroPorInterval(31, universeWidth/2 - 31);
                var y = Math.random() * (universeHeight - 62) + 31;
                var ray = Math.random() * 1.5 + 1;
    
                if(Food.foods.length < 3000){ 
                    new Food(x, y, ray);
                }
            }
            if(!right_side_empty && !left_side_empty){
                var x = Math.random() * (universeWidth - 62) + 31;
                var y = Math.random() * (universeHeight - 62) + 31;
                var ray = Math.random() * 1.5 + 1;

                if(Food.foods.length < 3000){ 
                    new Food(x, y, ray);
                }
            }
        } else{
            var x = Math.random() * (universeWidth - 62) + 31;
            var y = Math.random() * (universeHeight - 62) + 31;
            var ray = Math.random() * 1.5 + 1;

            if(Food.foods.length < 3000){ 
                new Food(x, y, ray);
            }
        }
    }
}
function changeintervalofoods(newvalue, criar=false) {
    new_time = 1000 / newvalue;
    if(!criar) {
        clearInterval(intervalRateFoods);
    }
    if(new_time > 1000) return;
    if(beforeDoPlay) return;
    intervalRateFoods = setInterval(createsFoodsGradative, new_time);
}
function changesProbmutation(newvalue){
    probability_mutation = newvalue / 100;
}
function mudaMagMutacao(novoValor){
    magnitude_mutation = novoValor / 100;
}
function desenhadivision(){
    c.beginPath();
    c.moveTo(universeWidth / 2, 0);
    c.lineTo(universeWidth / 2, universeHeight);
    c.strokeStyle = "white";
    c.stroke();
}
function desenhaQuadTree(qtree){
    qtree.draw();

    let alcance = new rectangle(Math.random() * universeWidth, Math.random() * universeHeight, 170, 123);
    c.rect(alcance.x - alcance.w, alcance.y - alcance.h, alcance.w*2, alcance.h*2);
    c.strokeStyle = "green";
    c.lineWidth = 3;
    c.stroke();
    let Points = qtree.procura(alcance);
    for(let p of Points){
        c.beginPath();
        c.arc(p.x, p.y, 1, 0, 2 * Math.PI);
        c.strokeStyle = "red";
        c.stroke();
    }
}
function createsPoints(){
    let congregation = new point(Math.random() * universeWidth, Math.random() * universeHeight);
    
    for(var i = 0; i < 500; i++){
        let p = new point(Math.random() * universeWidth, Math.random() * universeHeight);
        qtree.insertPoint(p);
    }
    for(var i = 0; i < 300; i++){
        let p = new point(congregation.x + (Math.random() - 0.5) * 300, congregation.y + (Math.random() - 0.5) * 300);
        qtree.insertPoint(p);
    }
    for(var i = 0; i < 400; i++){
        let p = new point(congregation.x + (Math.random() - 0.5) * 600, congregation.y + (Math.random() - 0.5) * 600);
        qtree.insertPoint(p);
    }
    for(var i = 0; i < 400; i++){
        let p = new point(congregation.x + (Math.random() - 0.5) * 800, congregation.y + (Math.random() - 0.5) * 800);
        qtree.insertPoint(p);
    }
}
function calculateDataGraphic(){
    
    popH = velMedH = forcaMedH = rayMedH = rayDetMedH = energMedH = rateEnergMedH = litterMediaH = null;
    popC = velMedC = forcaMedC = rayMedC = rayDetMedC = energMedC = taxaEnergMedC = litterMediaC = null;

    popH = {sem_div: 0, left: 0, say: 0}
    velMedH = {sem_div: 0, left: 0, say: 0};
    forcaMedH = {sem_div: 0, left: 0, say: 0};
    rayMedH = {sem_div: 0, left: 0, say: 0};
    rayDetMedH = {sem_div: 0, left: 0, say: 0};
    energMedH = {sem_div: 0, left: 0, say: 0};
    rateEnergMedH = {sem_div: 0, left: 0, say: 0};
    litterMediaH = {sem_div: 0, left: 0, say: 0};

    popC = {sem_div: 0, left: 0, say: 0}
    velMedC = {sem_div: 0, left: 0, say: 0};
    forcaMedC = {sem_div: 0, left: 0, say: 0};
    rayMedC = {sem_div: 0, left: 0, say: 0};
    rayDetMedC = {sem_div: 0, left: 0, say: 0};
    energMedC = {sem_div: 0, left: 0, say: 0};
    taxaEnergMedC = {sem_div: 0, left: 0, say: 0};
    litterMediaC = {sem_div: 0, left: 0, say: 0};


    Herbivores.herbivores.forEach(herbivore => {
        popH["sem_div"]++
        velMedH["sem_div"] += herbivore.speed_max;
        forcaMedH["sem_div"] += herbivore.force_max;
        rayMedH["sem_div"] += herbivore.initial_radius * 1.5; 
        rayDetMedH["sem_div"] += herbivore.initial_detection_radius * 1.3;
        energMedH["sem_div"] += herbivore.energy_max_fix;
        rateEnergMedH["sem_div"] += herbivore.energy_spend_rate_max ;
        litterMediaH["sem_div"] += (herbivore.litter_range[0] + herbivore.litter_range[1]) / 2;
        if(split_screen){
            let lado;
            if(herbivore.position.x < universeWidth / 2) {
                lado = "left"
            } else {
                lado = "say"
            }
            popH[lado]++
            velMedH[lado] += herbivore.speed_max;
            forcaMedH[lado] += herbivore.force_max;
            rayMedH[lado] += herbivore.initial_radius * 1.5; 
            rayDetMedH[lado] += herbivore.initial_detection_radius * 1.3;
            energMedH[lado] += herbivore.energy_max_fix;
            rateEnergMedH[lado] += herbivore.energy_spend_rate_max ;
            litterMediaH[lado] += (herbivore.litter_range[0] + herbivore.litter_range[1]) / 2;
        }
    });

    Carnivores.carnivores.forEach(carnivore => {
        popC["sem_div"]++
        velMedC["sem_div"] += carnivore.speed_max;
        forcaMedC["sem_div"] += carnivore.force_max;
        rayMedC["sem_div"] += carnivore.initial_radius * 1.5; 
        rayDetMedC["sem_div"] += carnivore.initial_detection_radius * 1.3; 
        energMedC["sem_div"] += carnivore.energy_max_fix;
        taxaEnergMedC["sem_div"] += carnivore.energy_spend_rate_max ;
        litterMediaC["sem_div"] += (carnivore.litter_range[0] + carnivore.litter_range[1]) / 2;

        if(split_screen){
            let lado;
            if(carnivore.position.x < universeWidth / 2) {
                lado = "left"
            } else {
                lado = "say"
            }
            popC[lado]++
            velMedC[lado] += carnivore.speed_max;
            forcaMedC[lado] += carnivore.force_max;
            rayMedC[lado] += carnivore.initial_radius * 1.5; 
            rayDetMedC[lado] += carnivore.initial_detection_radius * 1.3; 
            energMedC[lado] += carnivore.energy_max_fix;
            taxaEnergMedC[lado] += carnivore.energy_spend_rate_max ;
            litterMediaC[lado] += (carnivore.litter_range[0] + carnivore.litter_range[1]) / 2;
        }        
    });


    velMedH.sem_div /= popH.sem_div;
    forcaMedH.sem_div /= popH.sem_div;
    rayMedH.sem_div /= popH.sem_div;
    rayDetMedH.sem_div /= popH.sem_div;
    energMedH.sem_div /= popH.sem_div;
    rateEnergMedH.sem_div /= popH.sem_div;
    litterMediaH.sem_div /= popH.sem_div;
    //
    velMedH.left /= popH.left;
    forcaMedH.left /= popH.left;
    rayMedH.left /= popH.left;
    rayDetMedH.left /= popH.left;
    energMedH.left /= popH.left;
    rateEnergMedH.left /= popH.left;
    litterMediaH.left /= popH.left;
    // 
    velMedH.say /= popH.say;
    forcaMedH.say /= popH.say;
    rayMedH.say /= popH.say;
    rayDetMedH.say /= popH.say;
    energMedH.say /= popH.say;
    rateEnergMedH.say /= popH.say;
    litterMediaH.say /= popH.say;

    // 
    velMedC.sem_div /= popC.sem_div;
    forcaMedC.sem_div /= popC.sem_div;
    rayMedC.sem_div /= popC.sem_div;
    rayDetMedC.sem_div /= popC.sem_div;
    energMedC.sem_div /= popC.sem_div;
    taxaEnergMedC.sem_div /= popC.sem_div;
    litterMediaC.sem_div /= popC.sem_div;
    // 
    velMedC.left /= popC.left;
    forcaMedC.left /= popC.left;
    rayMedC.left /= popC.left;
    rayDetMedC.left /= popC.left;
    energMedC.left /= popC.left;
    taxaEnergMedC.left /= popC.left;
    litterMediaC.left /= popC.left;
    //
    velMedC.say /= popC.say;
    forcaMedC.say /= popC.say;
    rayMedC.say /= popC.say;
    rayDetMedC.say /= popC.say;
    energMedC.say /= popC.say;
    taxaEnergMedC.say /= popC.say;
    litterMediaC.say /= popC.say;
}
function checaPopulacoesDivididas(){
    if(split_screen){
        right_side_empty = true;
        left_side_empty = true;
            
        Herbivores.herbivores.forEach(herbivores => {
            if(herbivores.position.x < universeWidth / 2 - 31){
                left_side_empty = false;
            }

            if(herbivores.position.x > universeWidth / 2 + 31){
                right_side_empty = false;
            }
        })
    }
}
var idAnimate;
function pausa(){
    paused = true;
    btnPausa.classList.add("d-none");
    btnDespausa.classList.remove("d-none");

}
function despausa(){
    paused = false;

    btnDespausa.classList.add("d-none");
    btnPausa.classList.remove("d-none");

    animate();
}
function acelera(){
    animate();
}
function desacelera(){
    pausa();
    setTimeout(despausa, 10);
}
function animate(){
    if(paused == false){
        idAnimate = requestAnimationFrame(animate);
    }
    
    c.clearRect(0, 0, universeWidth, universeHeight);
    c.beginPath();
    c.moveTo(-3, -4);
    c.lineTo(universeWidth + 3, -3);
    c.lineTo(universeWidth + 3, universeHeight + 3);
    c.lineTo(-3, universeHeight + 3);
    c.lineTo(-3, -3);
    c.strokeStyle = "white";
    c.stroke();

    let qtree = new QuadTree(rectangleCanvas, 10);

    if(checkbox_division.checked){
        split_screen = true;
    } else{
        split_screen = false;
    }

    if(split_screen){
        desenhadivision();
        Food.foods.forEach((food, i) => {
            food.display();
            if(food.position.x - universeWidth / 2 < 30 && food.position.x - universeWidth / 2 > -30){ 
                Food.foods.splice(i, 1);
            }
            qtree.insertfood(food); 

        })

        if(loop_limiter < 10){
            loop_limiter++;
        }
        
        Organisms.organisms.forEach((organism) => {
            if(organism.position.x <= universeWidth/2){ 
                if(loop_limiter == 1 && universeWidth/2 - organism.position.x < 10){
                    organism.position.x -= 10;
                }
                organism.createsBorders(true); 
            } else{ 
                if(loop_limiter == 1 && organism.position.x - universeWidth/2 < 10){ 
                    organism.position.x += 10;
                }
                organism.createsBorders(true); 
            }
        })
        Herbivores.herbivores.forEach(herbivore => {
            qtree.insertherbivore(herbivore);
        });
        Carnivores.carnivores.forEach(carnivore => {
            qtree.insertcarnivore(carnivore);
        });

        Herbivores.herbivores.forEach(herbivore => {
            herbivore.update();
            herbivore.wanders();

            let visaoH = new Circular(herbivores.position.x, herbivores.position.y, herbivores.initial_detection);
                
            if(herbivore.energy <= herbivore.energy_max * hunger_h){ // hunger
                herbivore.searchFood(qtree, visaoH);
            }
            herbivore.detectPredator(qtree, visaoH);
        })

        Carnivores.carnivores.forEach(carnivore => {
            carnivore.update();
            carnivore.wanders();
            let visaoC = new Circular(carnivore.position.x, carnivore.position.y, carnivore.initial_detection);

            if(carnivore.energy <= carnivore.energy_max * hunger_c){ 
                carnivore.searchHerbivore(qtree, visaoC);
            }
        })
    } else{ 
        loop_limiter = 0;

        Food.foods.forEach(food => {
            food.display();
            qtree.insertfood(food); 
        })
        Organisms.organisms.forEach((organism) => {
            organism.createsBorders(false); // split_screen: false
        })

        Herbivores.herbivores.forEach(herbivore => {
            qtree.insertherbivore(herbivore); 
        });
        Carnivores.carnivores.forEach(carnivore => {
            qtree.insertcarnivore(carnivore);
        });
        
        Herbivores.herbivores.forEach(herbivore => {
            herbivore.update();
            herbivore.wanders();
            
            let visaoH = new Circular(herbivore.position.x, herbivore.position.y, herbivore.initial_detection);

            if(herbivore.energy <= herbivore.energy_max * hunger_h){ // hunger
                herbivore.searchFood(qtree, visaoH);
            }
            
            herbivore.detectPredator(qtree, visaoH);
        })

        Carnivores.carnivores.forEach(carnivore => {
            carnivore.update();
            carnivore.wanders();

            let visaoC = new Circular(carnivore.position.x, carnivore.position.y, carnivore.initial_detection);

            if(carnivore.energy <= carnivore.energy_max * hunger_c){
                carnivore.searchHerbivore(qtree, visaoC);
            }
        })
    }
}
function generatesInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
// ----------------------------------------------------------------------------------------------

function getOrganism(x, y) {
    let organism = Organisms.organisms.find(o => Math.abs(o.position.x - x) <= 10 && Math.abs(o.position.y - y) <= 10)
    if(organism == undefined) {
        return; 
    }
    let popoverJaExiste = document.querySelectorAll(`.popover-info[data-organismid="${organism.id}"]`).length > 0 ? 1:0
    if (popoverJaExiste) {
        return;
    }
    
    let popover = `
        <div id="popover-${popover_id}" class="popover-info" data-organismid="${organism.id}" style="top:${parseInt(organism.position.y - 20)}px; left:${parseInt(organism.position.x + 15)}px">
            <div class="popover-title">
                ${(organism instanceof Carnivores) ? "Carnivoro":"Herbivoro"} <div style="color: grey; display: inline; font-size: medium">#${organism.id}</div>
            </div>
            <div class="popover-content">
                <b>sex:</b> <div id="pop-sex-${popover_id}" style="display: inline">${organism.sex}</div><br/>
                <b>ray:</b> <div id="pop-ray-${popover_id}" style="display: inline">${organism.ray.toFixed(2)}</div>/${(organism.initial_radius * 1.5).toFixed(2)}<br/>
                <b>Velocidade:</b> <div id="pop-vel-${popover_id}" style="display: inline">${organism.vel.mag().toFixed(2)}</div>/${organism.speed_max.toFixed(2)}<br/>
                <b>ray de detecção:</b> <div id="pop-detection-${popover_id}" style="display: inline">${organism.initial_detection.toFixed(2)}</div><br/>
                <b>energy:</b> <div id="pop-energy-${popover_id}" style="display: inline">${organism.energy.toFixed(2)}</div>/<div id="pop-energy-max-${popover_id}" style="display: inline">${organism.energy_max.toFixed(2)}</div><br/>
                <b>spent energético:</b> <div id="pop-spent-${popover_id}" style="display: inline">${(organism.energy_spend_rate + organism.minimum_spend).toFixed(3)}</div><br/>
                <b>color:</b> <svg width="20" height="20"><rect width="18" height="18" style="fill:${organism.color}"/></svg> ${organism.color}<br/>
                <!-- <b>hunger:</b> <div id="pop-hunger-${popover_id}" style="display: inline">${organism.energy <= organism.energy_max * 0.8 ? "Com hunger":"Satisfeito"}</div><br/> -->
                <b>Status:</b> <div id="pop-status-${popover_id}" style="display: inline">${organism.status}</div><br/>
                <b>Idade:</b> <div id="pop-vida-${popover_id}" style="display: inline">${organism.time_lived}</div>/${organism.life_time}<br/>
                <b>litter: </b> de <div id="pop-litter-min-${popover_id}" style="display: inline">${organism.litter_range[0]}</div> a <div id="pop-litter-max-${popover_id}" style="display: inline">${organism.litter_range[1]}</div><br/>
                <b>Sons:</b> <div id="pop-vezes-reproduzidas-${popover_id}" style="display: inline">${organism.filhos.length}</div><br/>
                <button type="button" class="btn btn-danger btn-sm" onclick="excluirOrganismPopover(${popover_id}, ${organism.id})" style="margin-top: 10px">Excluir ${(organism instanceof Carnivores) ? "Carnivores":"Herbivores"}</button>
            </div>
            <button type="button" class="btn close" aria-label="Close"
                onclick="deletePopover(${popover_id}, ${organism.id})">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `

    $("body").append($(popover));

    let pop_id = popover_id
    organism.proxy = new Proxy(organism["position"], {
        set: function(target_org, key_position, value) {
            target_org[key_position] = value;
            let cssProperty = key_position == "x" ? 

                {left: parseInt((value + 15 - c.transformedPoint(0, 0).x))} : 
                {top: parseInt(value - 20 - c.transformedPoint(0, 0).y)}
            $(`#popover-${pop_id}`).css(cssProperty);
            document.getElementById(`pop-ray-${pop_id}`).textContent = organism.ray.toFixed(1);
            document.getElementById(`pop-vel-${pop_id}`).textContent = organism.vel.mag().toFixed(2);
            document.getElementById(`pop-detection-${pop_id}`).textContent = organism.initial_detection.toFixed(2);
            document.getElementById(`pop-energy-${pop_id}`).textContent = organism.energy.toFixed(1);
            document.getElementById(`pop-energy-max-${pop_id}`).textContent = organism.energy_max.toFixed(1);
            document.getElementById(`pop-spent-${pop_id}`).textContent = (organism.energy_spend_rate + organism.minimum_spend).toFixed(3);
            document.getElementById(`pop-status-${pop_id}`).textContent = organism.status;
            document.getElementById(`pop-vezes-reproduzidas-${pop_id}`).textContent = organism.times_reproduced;
            document.getElementById(`pop-vida-${pop_id}`).textContent = organism.time_lived;
            return true;
        }
    })
    organism.popover_id = pop_id
    popover_id++
}

function deletePopover(popoverId, organismId) {
    const organism = Organism.organisms.find(o => o.id == organismId) || 0;
    if(organism) {
        delete organism.proxy
        delete organism.popover_id
    }
    $(`#popover-${popoverId}`).remove()
    if($(".popover-info").length == 0) {
        $("#btnDeletePopovers").hide();
    }
}

function excluirOrganismPopover(popoverId, organismId){
    const organism = Organism.organisms.find(o => o.id == organismId) || 0;
    if(organism) {
        organism.dies();
        if(paused){
            despausa(); 
            pausa();
        }
    }
    $(`#popover-${popoverId}`).remove()
}
function showEditPanel(type) {
    let config;
    if(type == 1) {
        config = conf_c;
    } else {
        config = conf_h;
    }

    let panel = `
        <div class="row mb-3">
            <div id="edit-title" class="col-8">${type == 1? "Carnivore":"Herbivore"}</div>
            <button id="edit-random" class="btn col-2 btn-gray" onclick="randomConfig(${type})"><i class="fas fa-dice"></i></button>
            <button class="btn close col-2" onclick="$(this).closest('.edit-organism').addClass('d-none').html('')">
                <span class="text-white" aria-hidden="true">&times;</span>
            </button>
        </div>
    

        <form id="formConfig" class="container-fluid">
            <div class="row mb-3">
                <div style="display: inline; width: 50%">
                    <b><label for="input-color">color</label></b>
                    <input id="input-color" name="color" type="color" value="${config? rgbToHex(config.color):"#ff0000"}">
                </div>
            </div>
            <div class="row p-0">
                <div style="display: inline; width: 50%">
                    <b><label for="input-ray">ray</label></b>
                    <input id="input-ray" name="initial_radius" type="number" value="${config? config.initial_radius:(initial_radius||generatesNumeroPorInterval(3, 7).toFixed(2))}" class="form-control p-0">
                </div>  
                <div style="display: inline; width: 50%">                 
                    <b><label for="input-velocidade">Velocidade</label></b>
                    <input id="input-velocidade" name="speed_max" type="number" value="${config? config.speed_max.toFixed(2):generatesNumeroPorInterval(1, 2.2).toFixed(2)}" class="form-control p-0">
                </div>
                <div style="display: inline; width: 50%">
                    <b><label for="input-forca">Agilidade</label></b>
                    <input id="input-forca" name="force_max" type="number" value="${config? config.force_max.toFixed(2):generatesNumeroPorInterval(0.001, 0.05).toFixed(2)}" class="form-control p-0">
                </div>
                <div style="display: inline; width: 50%">
                    <b><label for="input-detection">Visão</label></b>
                    <input id="input-detection" name="initial_detection_radius" type="number" value="${config? config.initial_detection_radius.toFixed(2):generatesNumeroPorInterval(15, 60).toFixed(2)}" class="form-control p-0">
                </div>
                <div style="display: inline; width: 50%">
                    <b><label for="input-litter">Tamanho da litter</label></b>
                    <input id="input-litter-min" name="litter_range_min" type="number" value="${config? config.litter_range[0]:generatesNumeroPorInterval(1, 5)}" class="form-control p-0">
                    <input id="input-litter-max" name="litter_range_max" type="number" value="${config? config.litter_range[1]:generatesNumeroPorInterval(1, 5)}" class="form-control p-0">
                    </div>
            </div>
        </form>
        <div class="row mt-2">
            <button type="button" onclick="serializarFormConfig(${type})" class="btn btn-sm btn-outline-secondary btn-block">Salvar</button>
        </div>
    
    
    `
    
    $("#painelEditar").html(panel).removeClass("d-none")
    if(!config) {
        randomConfig(type);
    }
}

function serializarFormConfig(type) {
    let obj = $("#formConfig").serializeArray().reduce(function(obj, value, i) {
        obj[value.name] = value.value;
        return obj;
    }, {});
    obj.color = hexToRgb(obj["color"])
    obj.initial_radius = parseFloat(obj.initial_radius);
    obj.speed_max = parseFloat(obj.speed_max);
    obj.force_max = parseFloat(obj.force_max);
    obj.initial_detection_radius = parseFloat(obj.initial_detection_radius);
    obj.litter_range = obj.litter_range;
    if(type == 1) {
        conf_c = obj;
    } else {
        conf_h = obj;
    }
}
function randomConfig(type) {
    if($("#edit-random").hasClass("active")) {
        $("#edit-random").removeClass("active");
        $("#formConfig input").prop("disabled", false)
    }
     else {
        if(type==1 && conf_c) {
            let resultado = confirm("When randomizing the values, you will lose the saved settings for Carnivores. Do you wish to continue?")
            if(resultado == true)
                conf_c = undefined;
            else
                return;
        } else if(type==2 && conf_h) {
            let result = confirm("When randomizing the values, you will lose the saved settings for the Herbivores. Do you want to continue?")
            if(result == true)
                conf_h = undefined;
            else
                return;
        }
        $("#edit-random").addClass("active");
        $("#formConfig input").prop("disabled", true)
    }
}
























var stopwatch;

function createsstopwatch(){
    stopwatch = setInterval(() => { timer(); }, 10);
}

function timer() {
    if(!paused){ 
        if ((milisecond+= 10) == 1000) {
        milisecond= 0;
        second++;
        total_seconds++;
        }
        if (second== 60) {
        second= 0;
        minute++;
        }
        if (minute == 60) {
        minute = 0;
        hour++;
        }
        document.getElementById('hour').innerText = returnData(hour);
        document.getElementById('minute').innerText = returnData(minute);
        document.getElementById('second').innerText = returnData(second);
        document.getElementById('milisecond').innerText = returnData(milisecond);
    }
}
  
function returnData(input) {
    return input > 10 ? input : `0${input}`
}

function resetTimer(){
    hour = minute = second= milisecond= total_seconds= 0;

    try {
        clearInterval(stopwatch);
    } catch(e){}

    document.getElementById('hour').innerText = "00";
    document.getElementById('minute').innerText = "00";
    document.getElementById('second').innerText = "00";
    document.getElementById('milisecond').innerText = "00";
}

function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

