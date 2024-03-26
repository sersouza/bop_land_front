const urlPageTitle = "BOP Land"
const URL_BASE = 'http://127.0.0.1:5000/'


/*
  --------------------------------------------------------------------------------------
  Router utilizando javascript vanilla
  --------------------------------------------------------------------------------------
*/
document.addEventListener("click", (e) => {
    const { target } = e
    if (!target.matches("nav a")) {
        return
    }
    e.preventDefault()
    urlRoute()
})

const urlRoutes = {
    404: {
        template: "/templates/404.html",
        title: "404 | " + urlPageTitle,
        description: "Page not found"
    },
    "/": {
        template: "/templates/listar.html",
        title: "BOPs | " + urlPageTitle,
        description: "This is the home page"
    },
    "/cadastrar": {
        template: "/templates/cadastrar.html",
        title: "Cadastrar | " + urlPageTitle,
        description: "This is the home page"
    },
    "/about": {
        template: "/templates/about.html",
        title: "About Us | " + urlPageTitle,
        description: "This is the about page"
    },
    "/contact": {
        template: "/templates/contact.html",
        title: "Contact Us | " + urlPageTitle,
        description: "This is the contact page"
    },

}

const urlRoute = (event) => {
    event = event || window.event
    event.preventDefault()
    window.history.pushState({}, "", event.target.href)
    urlLocationHandler();
}

const urlLocationHandler = async () => {
    const location = window.location.pathname
    if (location.length == 0) {
        location = "/"
    }

    const route = urlRoutes[location] || urlRoutes[404]
    const html = await fetch(route.template).then((response) => response.text())
    document.getElementById("content").innerHTML = html
    document.title = route.title
    document
        .querySelector('meta[name="description"]')
        .setAttribute("content", route.description)

    // Chamada a API para carregamento inicial dos dados e posterior visualização em tabela
    fetchDataAndPopulateTable('bops', '')
    dragAndDrop()
}

window.onpopstate = urlLocationHandler
window.route = urlRoute

urlLocationHandler()


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

const getBOPList = async (uri) => {
    try {
        let url = URL_BASE + uri;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data; // Return the parsed JSON data
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

const fetchDataAndPopulateTable = async (uri, termo) => {
    try {
        const data = await getBOPList(uri); // Wait for the data to be fetched
        populateTable(data); // Populate the table with the fetched data
    } catch (error) {
        console.error('Error fetching data:', error);
        notFound(termo)
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
// Function to populate the table with data
const populateTable = (data) => {
    const tableBody = document.getElementById('table-body');

    // Clear existing rows
    tableBody.innerHTML = '';

    // Iterate over the data and create table rows
    data.bops.map(item => {
        const row = document.createElement('tr')
        const valveRows = Math.ceil(item.valvulas.length / 5)
        const preventorRows = Math.ceil(item.preventores.length / 5)
        row.innerHTML = `
          <td class="col-md-2">${item.sonda}</td>
          <td class="col-md-1">${item.tipo}</td>
          <td class="col-md-6">
            <table>
                <tbody>
                ${Array.from({ length: valveRows }, (_, i) => i).map(i => `
                    <tr>
                    ${item.valvulas.slice(i * 5, (i + 1) * 5).map(v => `<td scope="col"><span class="badge bg-secondary">${v}</span></td>`).join('')}
                    </tr>`).join('')}
                </tbody>
            </table>
          </td>
          <td class="col-md-6">
          <table>
              <tbody>
              ${Array.from({ length: preventorRows }, (_, i) => i).map(i => `
                  <tr>
                  ${item.preventores.slice(i * 5, (i + 1) * 5).map(p => `<td scope="col"><span class="badge bg-secondary">${p}</span></td>`).join('')}
                  </tr>`).join('')}
              </tbody>
          </table>
        </td>
        `
        tableBody.appendChild(row)
        console.log(item.valvulas)
    }
    )
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir mensagem caso não tenham dados
  --------------------------------------------------------------------------------------
*/
const notFound = (termo) => {
    const tableBody = document.getElementById('table-body');

    // Clear existing rows
    tableBody.innerHTML = '';

    const p = document.createElement('p')
    p.innerHTML = `<p> BOP com nome: <strong>${termo}</strong> não encontrado</p>`

    tableBody.appendChild(p)
}

/*
  --------------------------------------------------------------------------------------
  Função para buscar e mostrar o BOP a partir de um termo
  --------------------------------------------------------------------------------------
*/
const buscarBOP = () => {
    const sonda = document.getElementById("sonda").value
    const uri = 'bop?sonda=' + sonda

    fetchDataAndPopulateTable(uri, sonda)
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a listar todos os BOPs existentes
  --------------------------------------------------------------------------------------
*/

const listarBOP = () => {

    fetchDataAndPopulateTable('bops', '')
    const sonda = document.getElementById("sonda")
    sonda.value = ''
}


/*
  --------------------------------------------------------------------------------------
  Criando a funcionaliddae drag and drop
  --------------------------------------------------------------------------------------
*/

const dragAndDrop = () => {

    const valvulas = ['IGLANNULAR', 'IGUANNULAR']
    const preventores = ['LANNULAR', 'UANNULAR']
    const valvulasAceitas = []
    const preventoresAceitos = []
    const sourceValvulas = document.getElementById('source-valvulas')
    const targetValvulas = document.getElementById('target-valvulas')
    const sourcePreventores = document.getElementById('source-preventores')
    const targetPreventores = document.getElementById('target-preventores')

    //popular as valvulas disponiveis
    valvulas.map(v=> {
        const span = document.createElement('span')
        span.innerHTML = `<span id=${v} class="badge bg-secondary" draggable="true">${v}</span>`
       
        sourceValvulas.appendChild(span)})

    
    sourceValvulas.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id)
    })

    //popular os preventores disponiveis
    preventores.map(p=> {
        const span = document.createElement('span')
        span.innerHTML = `<span id=${p} class="badge bg-secondary" draggable="true">${p}</span>`
        
        sourcePreventores.appendChild(span)})

    sourcePreventores.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id)
    })

    targetValvulas.addEventListener('dragover', (e)=>{
        e.preventDefault()
    })

    targetPreventores.addEventListener('dragover', (e)=>{
        e.preventDefault()
    })

    targetValvulas.addEventListener('drop', (e) => {
        e.preventDefault()
        const sourceID = e.dataTransfer.getData('text/plain')
        const draggedElement = document.getElementById(sourceID);
        if (valvulas.includes(draggedElement.id)){
            e.target.appendChild(draggedElement)
            valvulasAceitas.push(sourceID)
            console.log(valvulasAceitas)
        }
        else{
            alert('Preventor só pode ir para caixa de preventores aceitos');
        }
    })

    targetPreventores.addEventListener('drop', (e) => {
        e.preventDefault()
        const sourceID = e.dataTransfer.getData('text/plain')
        const draggedElement = document.getElementById(sourceID);
        if (preventores.includes(draggedElement.id)){
            e.target.appendChild(draggedElement)
            preventoresAceitos.push(sourceID)
            console.log(preventoresAceitos)
        }
        else{
            alert('Válvula só pode ir para caixa de válvulas aceitas');
        }
    })

}
