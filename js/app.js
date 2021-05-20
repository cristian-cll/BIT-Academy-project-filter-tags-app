const state = {
    offers: [], //Datos cargados del json.
    filters: {
        clean: function(){
            this.languages = [];
            this.tools = [];
        },
        languages: [], //Tags de lenguajes seleccionados por el usuario.
        tools: [], //Tags de tools seleccionados por el usuario.    
    },
    filteredData: function() {
        const search = this.offers.filter(item =>{
            if(state.filters.languages.every(elem=>item.languages.includes(elem))
             && state.filters.tools.every(elem=>item.tools.includes(elem))) {
                return item;    
            } 
        })
        return search;
    },
    fetchDataJson: (async function(){
        const response = await fetch('./data.json');
        let result = await response.json();
        state.offers = result; //Almacenamos el json en un array global de objetos.
        //console.log("Data from JSON", state.offers); 
        return result;
    })().then(() => {render(state.offers)}) //Renderizamos el primer resultado con todos los datos
}


//Función que pinta el array que le pasemos en el HTML, sección main.
function render(jobOffers){
    let main= document.querySelector('main');
    main.innerHTML = "";
    jobOffers.forEach(job=>{
        main.innerHTML+=`
            <div class="card ${job.featured === true ? `card_featured`: ""}"> <!-- DIV CARD -->
                <div class="card_image">
                    <img src="${job.logo}" height="60">
                </div>
                <div class="card_body">
                    <div class="card_body_text_title">
                        <p>${job.company}</p>
                        ${job.new === true ? `<p class="new">NEW!</p>`: ""}
                        ${job.featured === true ? `<p class="featured">FEATURED</p>`: ""}
                    </div>
                    <h3>${job.position}</h3>
                    <p>${job.postedAt} ● ${job.contract} ● ${job.location}</p>
                </div>
                <div class="card_tags">
                    ${getTags(job.languages, "languageTag")}
                    ${getTags(job.tools, "toolTag")}
                </div>
            </div>
            `
    })
    setActiveListeners(); //Activamos los eventos.
}

//Recupera en un gran string los tags, los cuales están en otro array del objeto, que se llaman desde el render de cada jobo.
function getTags(tags, cssClass){
    let result = "";
    tags.forEach(tag => result += `<p class="${cssClass}">${tag}</p>`);
    return result; 
}


//Establece la espera de los eventos. 
function setActiveListeners(){
    let languageTags = document.querySelectorAll("p.languageTag"); //Recupera jobos clase languageTag
    let toolsTags = document.querySelectorAll("p.toolTag"); //Recupera jobos clase toolTag
    let search = document.querySelector(".search"); //Recupera el cajón
    let btnClear = document.querySelector("#btnClear"); //Recupera botón clear
    let languageTagsFilter = document.querySelectorAll("p.languageTagFilter"); //Recupera jobos del cajón
    let toolTagsFilter = document.querySelectorAll("p.toolTagFilter"); //Recupera jobos del cajón
   
    //Toggle para activar el boton de limpiar del cajón de búsqueda.
    (state.filters.languages.length>0 || state.filters.tools.length>0 ) ? btnClear.style.display = 'flex' : "none";

    //evento para eliminar todos los tagsdel cajón búsqueda 
    btnClear.addEventListener("click", ()=>{
        state.filters.clean();
        search.innerHTML = "";
        render(state.filteredData());
    })
  
    //evento para eliminar tags de lenguajes del cajón búsqueda 
    languageTagsFilter.forEach(tag=>{
        tag.addEventListener("click",(event)=>{
            //console.log("nuevo", event.target);
            state.filters.languages.splice(state.filters.languages.indexOf(tag.textContent));
            tag.remove(); //Eliminamos el tag, también sirve: tag.parentNode.removeChild(tag);
            render(state.filteredData()); //Renderizamos con la función que nos filtra.
        })
    })
    //evento para eliminar tags de tools del cajón búsqueda 
    toolTagsFilter.forEach(tag=>{
        tag.addEventListener("click",(event)=>{
            //console.log("test", event.target);
            state.filters.tools.splice(state.filters.tools.indexOf(tag.textContent));
            tag.remove(); //Eliminamos el tag, también sirve: tag.parentNode.removeChild(tag);
            render(state.filteredData()); //Renderizamos con la función que nos filtra.
        })
    })
    
    //evento para añadir tags de lenguajes al cajón búsqueda
    languageTags.forEach((tag) => {
        tag.addEventListener("click", () => {
            //Si no existe el tag en filterLanguagesTags, lo agrega al array y crea el jobo en el cajón de búsqueda.
            if(!state.filters.languages.includes(tag.textContent)){
                let newNode = document.createElement("p");
                newNode.className = "languageTagFilter";
                newNode.innerHTML = tag.textContent;
                search.appendChild(newNode)
                state.filters.languages.push(tag.textContent); 
                console.log("lenguajes tags", state.filters.languages);   
            }
            render(state.filteredData());
        })
    })
    //evento para añadir tags de tools al cajón búsqueda
    toolsTags.forEach((tag) => {
        tag.addEventListener("click", () => {
            //Si no existe el tag en ilterToolsTags, lo agrega al array y crea el jobo en el cajón de búsqueda.
            if(!state.filters.tools.includes(tag.textContent)){
                let newNode = document.createElement("p");
                newNode.className = "toolTagFilter";
                newNode.innerHTML = tag.textContent;
                search.appendChild(newNode)
                state.filters.tools.push(tag.textContent);    
                console.log("tools tags", state.filters.tools);        
            }
            render(state.filteredData());
        })
    })
}
