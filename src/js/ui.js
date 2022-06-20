const UIconstants = {
    leftHam: true,
    rightHam: true,
    leftDisplay: true
}

const leftHam = document.getElementById("id_leftHamburger");
const rightHam = document.getElementById("id_rightHamburger");
const homeButton = document.getElementById("id_imgHome");
const leftBar = document.getElementById("id_UIleft");
const chkBoxWireframe = document.getElementById("inp_chkboxWireframe");
const chkBoxTransformCont = document.getElementById("inp_chkTransCont");
const chkBoxBbox = document.getElementById("inp_chkBbox");
const ambLight = document.getElementById("inp_ambLight");
const highlightObjects = document.getElementById("inp_highlightObject");
const selectObjects = document.getElementById("inp_selectObject");

function fillModelTree(){
    const divModelPart = document.getElementById("id_divModelTree");
    app.partNames.forEach(element => {
        const divElement = document.createElement("div");
        divElement.id = "divId_" + element;
        const paraElement = document.createElement("p");
        paraElement.style.cursor = "pointer";
        paraElement.textContent = element;
        paraElement.onmouseenter = function(){
            paraElement.parentElement.style.backgroundColor = "white";
            paraElement.style.color = "black";
            app.highlightPart(paraElement.textContent);
        }
        paraElement.onmouseleave = function(){
            paraElement.parentElement.style.backgroundColor = "black";
            paraElement.style.color = "white";
            app.removeHighlight(paraElement.textContent);
        }
        divElement.appendChild(paraElement);
        divModelPart.appendChild(divElement);
    });
} 

function highlightModelName(id) {
    const highlightObject = viewer.sceneObject.getObjectById(id);
    const divId = "divId_" + highlightObject.name;
    const element = document.getElementById(divId);
    // console.log(element);
    element.style.backgroundColor = "white";
    element.childNodes[0].style.color = "black";
}

function removeHighlightNameFromModelTree(id) {
    const highlightObject = viewer.sceneObject.getObjectById(id);
    const divId = "divId_" + highlightObject.name;
    const element = document.getElementById(divId);
    // console.log(element);
    element.style.backgroundColor = "black";
    element.childNodes[0].style.color = "white";
}

selectObjects.onclick = function(){
    if(selectObjects.checked){
        app.addEventForPartSelect();
    }else{
        app.showAllParts();
        app.removeEventForPartSelect();
    }
}

highlightObjects.onclick = function(){
    if(highlightObjects.checked){
        app.addEventListenerForHighlightObject();
        selectObjects.disabled = false;
    }else{
        app.removeEventListenerForHighlightObject();
        selectObjects.disabled = true;
    }
}

chkBoxBbox.onclick = function(){
    app.showOrHideBoundingBox(chkBoxBbox.checked);
}

chkBoxTransformCont.onclick = function(){
    if(chkBoxTransformCont.checked){
        app.addTransformControls();
    }else{
        app.removeTransformControls();
    }
}

chkBoxWireframe.onclick = function(){
    app.turnModelToWireframe(chkBoxWireframe.checked);
}

ambLight.oninput = function(){
    const ambientLight = viewer.scene.getObjectByName("ambient_light");
    ambientLight.intensity = ambLight.value;
}

leftHam.onclick = function() {
    const leftBar = document.getElementById("id_UIleft");
    if(UIconstants.leftHam){
        leftHam.src = "./src/assets/icons/close.png";
        UIconstants.leftHam = !UIconstants.leftHam;
        leftBar.style.width = "18%";
        if(UIconstants.leftDisplay){
            addVerticesAndTriangleCount();
            fillModelTree();
            UIconstants.leftDisplay = !UIconstants.leftDisplay;
        }
    }else{
        leftHam.src = "./src/assets/icons/hamburger.png";
        UIconstants.leftHam = !UIconstants.leftHam;
        leftBar.style.width = "0%";
    }
}

rightHam.onclick = function() {
    const rightBar = document.getElementById("id_UIright");
    if(UIconstants.rightHam){
        rightHam.src = "./src/assets/icons/close.png";
        UIconstants.rightHam = false;
        rightBar.style.width = "18%";
    }else{
        rightHam.src = "./src/assets/icons/hamburger.png";
        UIconstants.rightHam = true;
        rightBar.style.width = "0%";
    }
}

homeButton.onclick = function(){
    app.homePosition()
}

/**
 * Adds vertices and triangle count on the left side bar
 */
function addVerticesAndTriangleCount(){
    const divContainer = document.createElement("div");
    divContainer.style.position = "absolute";
    divContainer.style.bottom = "1px";
    divContainer.style.padding = "5px";
    divContainer.style.width = "100%";
    divContainer.style.backgroundColor = "black";

    const divVerticesContainer = document.createElement("div");
    const divVertices = document.createElement("div");
    divVertices.textContent = "Vertices : ";
    divVertices.style.color = "white";
    divVertices.style.display = "inline";
    const divVerticesCount = document.createElement("div");
    divVerticesCount.textContent = app.verticesCount;
    divVerticesCount.style.color = "white";
    divVerticesCount.style.display = "inline";
    divVerticesContainer.append(divVertices);
    divVerticesContainer.append(divVerticesCount);

    const divTrianglesContainer = document.createElement("div");
    const divTriangles = document.createElement("div");
    divTriangles.textContent = "Triangles : ";
    divTriangles.style.color = "white";
    divTriangles.style.display = "inline";
    const divTrianglesCount = document.createElement("div");
    divTrianglesCount.textContent = app.trianglesCount;
    divTrianglesCount.style.color = "white";
    divTrianglesCount.style.display = "inline";
    divTrianglesContainer.append(divTriangles);
    divTrianglesContainer.append(divTrianglesCount);

    divContainer.appendChild(divVerticesContainer);
    divContainer.appendChild(divTrianglesContainer);
    leftBar.appendChild(divContainer);
}
