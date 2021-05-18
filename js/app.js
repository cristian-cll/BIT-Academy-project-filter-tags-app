async function fetchDataJson() {
    const response = await fetch('./data.json');
    //console.log(await response.json())
    let result = await response.json();
    //Una vez tenemos los datos asíncronos...
    render(result); //Renderizamos el primer resultado con todos los datos
    dataCharged = result; //Almacenamos el json en un array global de objetos.
    console.log("Data from JSON", dataCharged);
}

fetchDataJson();

let dataCharged = []; //Datos cargados del json.
let filterLanguagesTags = []; //Tags de lenguajes seleccionados por el usuario.
let filterToolsTags = []; //Tags de tools seleccionados por el usuario.

//Función que pinta el array que le pasemos en el HTML, sección main.
function render(array){
    let main= document.querySelector('main');
    main.innerHTML = "";
    array.forEach(element=>{
        main.innerHTML+=`
        <div class="card ${element.featured === true ? `card_featured`: ""}"> <!-- DIV CARD -->
            <div class="card_image">
                <img src="${element.logo}" height="60">
            </div>
            <div class="card_body">
                <div class="card_body_text_title">
                    <p>${element.company}</p>
                    ${element.new === true ? `<p class="new">NEW!</p>`: ""}
                    ${element.featured === true ? `<p class="featured">FEATURED</p>`: ""}
                </div>
                <h3>${element.position}</h3>
                <p>${element.postedAt} ● ${element.contract} ● ${element.location}</p>
            </div>
            <div class="card_tags">
                ${getTags(element.languages, "languageTag")}
                ${getTags(element.tools, "toolTag")}
            </div>
        </div>
        `
    })
    getActiveListeners(); //Activamos los eventos.
}

//Recupera en un gran string los tags, los cuales están en otro array del objeto, que se llaman desde el render de cada elemento.
function getTags(tags, cssClass){
    let result = "";
    tags.forEach(tag => result += `<p class="${cssClass}">${tag}</p>`);
    return result; 
}

//Función que filtra los datos cargados del json según los tags seleccionados por el usuario (filterLanguagesTags).
//"Todos" los elementos del array filterLanguagesTags y filterToolsTags han de estar contenidos en el array que buscamos para filtrar. Por eso usamos every.
function getDataFiltered(){
    const search = dataCharged.filter(item =>{
        if(filterLanguagesTags.every(elem=>item.languages.includes(elem))){
            if(filterToolsTags.every(elem=>item.tools.includes(elem))){
                return item;
            } 
        } 
    })
    //console.log("filterLanguagesTags", filterLanguagesTags);
    //console.log("filterToolsTags", filterToolsTags);
    return search;
}

//Activa la espera de los eventos. 
function getActiveListeners(){
    let languageTags = document.querySelectorAll("p.languageTag"); //Recupera elementos clase languageTag
    let toolsTags = document.querySelectorAll("p.toolTag"); //Recupera elementos clase toolTag
    let search = document.querySelector(".search"); //Recupera el cajón
    let languageTagsFilter = document.querySelectorAll("p.languageTagFilter"); //Recupera elementos del cajón
    let toolTagsFilter = document.querySelectorAll("p.toolTagFilter"); //Recupera elementos del cajón
    let btnClear = document.getElementById("btnClear"); //Recupera botón clear
   
    //Toggle para activar el boton de limpiar del cajón de búsqueda.
    (filterLanguagesTags.length>0 || filterToolsTags>0 ) ? btnClear.style.display = 'flex' : btnClear.style.display = 'none';

    //evento para eliminar todos los tagsdel cajón búsqueda 
    btnClear.addEventListener("click", ()=>{
        filterLanguagesTags = [];
        filterToolsTags = [];
        search.innerHTML = "";
        console.log("filterLanguagesTags", filterLanguagesTags);
        console.log("filterToolsTags", filterToolsTags);
        render(getDataFiltered());
    })
  
    //evento para eliminar tags de lenguajes del cajón búsqueda 
    languageTagsFilter.forEach(tag=>{
        tag.addEventListener("click",(event)=>{
            //console.log("nuevo", event.target);
            filterLanguagesTags.splice(filterLanguagesTags.indexOf(tag.textContent));
            tag.remove(); //Eliminamos el tag, también sirve: tag.parentNode.removeChild(tag);
            render(getDataFiltered()); //Renderizamos con la función que nos filtra.
        })
    })
    //evento para eliminar tags de tools del cajón búsqueda 
    toolTagsFilter.forEach(tag=>{
        tag.addEventListener("click",(event)=>{
            //console.log("test", event.target);
            filterToolsTags.splice(filterToolsTags.indexOf(tag.textContent));
            tag.remove(); //Eliminamos el tag, también sirve: tag.parentNode.removeChild(tag);
            render(getDataFiltered()); //Renderizamos con la función que nos filtra.
        })
    })
    
    //evento para añadir tags de lenguajes al cajón búsqueda
    languageTags.forEach((tag) => {
        tag.addEventListener("click", () => {
            //Si no existe el tag en filterLanguagesTags, lo agrega al array y crea el elemento en el cajón de búsqueda.
            if(!filterLanguagesTags.includes(tag.textContent)){
                let newNode = document.createElement("p");
                newNode.className = "languageTagFilter";
                newNode.innerHTML = tag.textContent;
                search.appendChild(newNode)
                filterLanguagesTags.push(tag.textContent);         
            }
            render(getDataFiltered());
        })
    })
    //evento para añadir tags de tools al cajón búsqueda
    toolsTags.forEach((tag) => {
        tag.addEventListener("click", () => {
            //Si no existe el tag en ilterToolsTags, lo agrega al array y crea el elemento en el cajón de búsqueda.
            if(!filterToolsTags.includes(tag.textContent)){
                let newNode = document.createElement("p");
                newNode.className = "toolTagFilter";
                newNode.innerHTML = tag.textContent;
                search.appendChild(newNode)
                filterToolsTags.push(tag.textContent);         
            }
            render(getDataFiltered());
        })
    })
}




