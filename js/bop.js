// const URL_BASE = 'http://127.0.0.1:5000/'
const URL_BASE = 'http://localhost:5000/'

// Definindo a classe BOP
class BOP {
  constructor(valvulasSelecionadas = [], preventoresSelecionados = []) {
    this.valvulasSelecionadas = valvulasSelecionadas
    this.preventoresSelecionados = preventoresSelecionados
  }

  // Example method to set selected valves
  addValvulaSelecionada(valvula) {
    this.valvulasSelecionadas.push(valvula)
  }

  // Example method to set selected preventers
  addPreventorSelecionado(preventor) {
    this.preventoresSelecionados.push(preventor)
  }

  // Example method to set selected valves
  getValvulasSelecionadas() {
    return this.valvulasSelecionadas
  }

  // Example method to set selected preventers
  getPreventoresSelecionados() {
    return this.preventoresSelecionados
  }

  limparPreventoresSelecionados() {
    this.preventoresSelecionados = []
  }

  limparValvulasSelecionadas() {
    this.valvulasSelecionadas = []
  }
}

// instanciado um objeto de BOP
const bop = new BOP()

/*
  --------------------------------------------------------------------------------------
  Função para buscar e mostrar o BOP a partir de um termo
  --------------------------------------------------------------------------------------
*/
const buscarBOP = () => {
  const sondaInput = document.getElementById("sonda-busca")
  const sonda = sondaInput.value

  if (sonda == '') {
    alert("Digite um nome válido")
  }
  else {
    listarBOP(1, sonda)
  }
}

/*

Novo litar BOP c paginação

 */

// Function to fetch data and update table
function fetchData(page) {
  fetch(`${URL_BASE}bop/?page=${page}&per_page=3`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
    .then(response => response.json())
    .then(data => {newPopulateTable(data)})
    .catch(error => console.error('Error fetching data:', error));
}

// Function to update pagination controls
function updatePagination(data) {
  const paginationContainer = document.getElementById('page-navegation');
  paginationContainer.innerHTML = '';
  const totalPages = data.total_pages;
  const currentPage = data.current_page;
  const hasPrev = data.has_prev;
  const hasNext = data.has_next;

  if (hasPrev) {
    paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" onclick="fetchData(${currentPage - 1})">Previous</a></li>`;
  }
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" onclick="fetchData(${i})">${i}</a></li>`;
  }
  if (hasNext) {
    paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" onclick="fetchData(${currentPage + 1})">Next</a></li>`;
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a listar todos os BOPs existentes
  --------------------------------------------------------------------------------------
*/
const listarBOP = async (page = 1, sonda = null) => {
  if (sonda) {
    uri = `bop/?sonda=${sonda}&page=2&per_page=4`
  }
  else {
    uri = `bop/?page=${page}&per_page=3`
  }
  const url = URL_BASE + uri

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      newPopulateTable(data)
      const sondaInput = document.getElementById("sonda-busca")
      sondaInput.value = ''
    } else {
      const data = await response.json();
      alert(data.mensagem);
    }
  } catch (error) {
    console.log('ERROR ' + error);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para salvar os dados do BOP inserido na view cadastrar BOP
  --------------------------------------------------------------------------------------
*/
const salvarBOP = async () => {
  const sondaInput = document.getElementById('sonda-cadastro')
  const sonda = sondaInput.value
  const url = URL_BASE + 'bop/'

  if (sonda == '') {
    alert("Digite um nome de sonda para prosseguir")
  }
  else {
    valvulasSelecionadas = bop.getValvulasSelecionadas()
    preventoresSelecionados = bop.getPreventoresSelecionados()
    console.log("valvulas selecionadas antes de salvar")
    console.log(valvulasSelecionadas)
    //populando o objeto ser enviado no corpo da requisição 
    const body = new FormData()
    body.append('sonda', sonda)
    valvulasSelecionadas.forEach(valvula => {
      body.append('valvulas', valvula)
    })
    preventoresSelecionados.forEach(preventor => {
      body.append('preventores', preventor)
    })

    try {
      const response = await fetch(url, {
        method: 'post',
        body: body,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        //limpando o campo de input de sonda
        sondaInput.value = ''
        alert("Salvo com sucesso!")

        setTimeout(() => {
          //atualizando a lista de bop com o item recém criado
          document.dispatchEvent(new Event('updateListaBOP'))
        }, 1000)
      } else {
        const data = await response.json();
        alert(data.mensagem);
      }
    } catch (error) {
      console.log('ERROR ' + error);
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um BOP a partir do nome da sonda e removê-lo da tela
  --------------------------------------------------------------------------------------
*/
const deletaBOP = async (sonda) => {
  const url = URL_BASE + 'bop/?sonda=' + sonda
  const element = document.getElementById(sonda)

  if (confirm("Quer realmente deletar?")) {
    try {
      const response = await fetch(url, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        //limpando o campo de input de sonda
        element.remove()

      } else {
        const data = await response.json();
        alert(data.mensagem);
      }
    } catch (error) {
      console.log('ERROR ' + error);
    }
  }
}

/* 
  --------------------------------------------------------------------------------------
  --------------------------------------------------------------------------------------
  Funcões auxiliares do BOP
  --------------------------------------------------------------------------------------
  --------------------------------------------------------------------------------------
*/

const trashSymbol = (sonda) => {
  return `<button onclick="deletaBOP('${sonda}')" class="addBtn"><span style="font-size: 1em; color: Tomato;">
  <i class="lni lni-trash-can"></i>
   </span></button>    
`}
/*
  --------------------------------------------------------------------------------------
  Função que injeta na tabela os dados de BOP
  --------------------------------------------------------------------------------------
*/
const populateTable = (data) => {
  const tableBody = document.getElementById('table-body');

  const trashSymbol = (sonda) => {
    return `<button onclick="deletaBOP('${sonda}')" class="addBtn"><span style="font-size: 1em; color: Tomato;">
    <i class="lni lni-trash-can"></i>
     </span></button>    
  `}


  // Clear existing rows
  tableBody.innerHTML = '';

  // Iterate over the data and create table rows
  data?.content?.map(item => {
    const row = document.createElement('tr')
    row.setAttribute("id", item.sonda)
    const valveRows = Math.ceil(item.valvulas.length / 5)
    const preventorRows = Math.ceil(item.preventores.length / 5)
    row.innerHTML = `
          <td class="col-md-2">${item.sonda}</td>
          <td class="col-md-6">
            <table>
                <tbody>
                ${Array.from({ length: valveRows }, (_, i) => i).map(i => `
                    <tr>
                    ${item.valvulas.slice(i * 5, (i + 1) * 5).map(v => `<td scope="col"><span class="badge bg-dark-subtle border border-dark-subtle text-dark-emphasis rounded-pill">${v}</span></td>`).join('')}
                    </tr>`).join('')}
                </tbody>
            </table>
          </td>
          <td class="col-md-6">
            <table>
                <tbody>
                ${Array.from({ length: preventorRows }, (_, i) => i).map(i => `
                    <tr>
                    ${item.preventores.slice(i * 5, (i + 1) * 5).map(p => `<td scope="col"><span class="badge bg-dark-subtle border border-dark-subtle text-dark-emphasis rounded-pill">${p}</span></td>`).join('')}
                    </tr>`).join('')}
                </tbody>
            </table>
        <td>${trashSymbol(item.sonda)}</td>
        `
    tableBody.appendChild(row)
  }
  )
}

/*
  --------------------------------------------------------------------------------------
  Função que injeta na tabela os dados de BOP
  --------------------------------------------------------------------------------------
*/
const newPopulateTable = (data) => {
   // Clear previous table data
   const tableBody = document.getElementById('table-body');
   tableBody.innerHTML = '';

   // Insert new table data
   data.items.content.forEach(item => {
     const row = document.createElement('tr')
     row.setAttribute("id", item.sonda)
     const valveRows = Math.ceil(item.valvulas.length / 5)
     const preventorRows = Math.ceil(item.preventores.length / 5)
     row.innerHTML = `
           <td class="col-md-2">${item.sonda}</td>
           <td class="col-md-6">
             <table>
                 <tbody>
                 ${Array.from({ length: valveRows }, (_, i) => i).map(i => `
                     <tr>
                     ${item.valvulas.slice(i * 5, (i + 1) * 5).map(v => `<td scope="col"><span class="badge bg-dark-subtle border border-dark-subtle text-dark-emphasis rounded-pill">${v}</span></td>`).join('')}
                     </tr>`).join('')}
                 </tbody>
             </table>
           </td>
           <td class="col-md-6">
             <table>
                 <tbody>
                 ${Array.from({ length: preventorRows }, (_, i) => i).map(i => `
                     <tr>
                     ${item.preventores.slice(i * 5, (i + 1) * 5).map(p => `<td scope="col"><span class="badge bg-dark-subtle border border-dark-subtle text-dark-emphasis rounded-pill">${p}</span></td>`).join('')}
                     </tr>`).join('')}
                 </tbody>
             </table>
         <td>${trashSymbol(item.sonda)}</td>
         `
         tableBody.appendChild(row)
   });

   // Update pagination controls
   updatePagination(data);
}


/*
  --------------------------------------------------------------------------------------
  Funcão que permite criar um novo BOP a partir dos elementos básicos usando drag and drop
  --------------------------------------------------------------------------------------
*/
const cadastrarBOP = async () => {
  //limpando os atributos selecionados antes de iniciar o cadastro
  bop.limparPreventoresSelecionados()
  bop.limparValvulasSelecionadas()

  targetValvulas = document.getElementById('target-valvulas')
  targetPreventores = document.getElementById('target-preventores')
  sourceValvulas = document.getElementById('source-valvulas')
  sourcePreventores = document.getElementById('source-preventores')

  //trazendo do backend a lista de todas as válvulas disponíveis no banco
  valvulas = await getData('valvulas')
  //trazendo do backend a lista de todas os preventores disponíveis no banco
  preventores = await getData('preventores')

  //limpando os campos de target
  if (targetPreventores || targetValvulas) {
    removeAllChildNodes(targetPreventores)
    removeAllChildNodes(targetValvulas)
  }

  //limpando os campos de source
  if (sourcePreventores || sourceValvulas) {
    removeAllChildNodes(sourcePreventores)
    removeAllChildNodes(sourceValvulas)
  }

  //popular as valvulas disponiveis
  valvulas?.map(v => {
    const span = document.createElement('span')
    span.innerHTML = `<span id=${v} class="badge bg-dark-subtle border border-dark-subtle text-dark-emphasis rounded-pill" draggable="true">${v}</span>`

    sourceValvulas.appendChild(span)
  })

  //popular os preventores disponiveis
  preventores?.map(p => {
    const span = document.createElement('span')
    span.innerHTML = `<span id=${p} class="badge bg-dark-subtle border border-dark-subtle text-dark-emphasis rounded-pill" draggable="true">${p}</span>`

    sourcePreventores.appendChild(span)
  })

  sourceValvulas.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id)
  })

  sourcePreventores.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id)
  })

  targetValvulas.addEventListener('dragover', (e) => {
    e.preventDefault()
  })

  targetPreventores.addEventListener('dragover', (e) => {
    e.preventDefault()
  })

  targetValvulas.addEventListener('drop', (e) => {
    console.log("evento de target valvula rodando")
    e.preventDefault()
    e.stopImmediatePropagation()
    const sourceID = e.dataTransfer.getData('text/plain')
    const draggedElement = document.getElementById(sourceID);
    if (valvulas.includes(draggedElement.id)) {
      draggedElement.classList.remove('bg-secondary')
      draggedElement.classList.add('bg-success')
      e.target.appendChild(draggedElement)
      bop.addValvulaSelecionada(sourceID)
    }
    else {
      alert('Preventor só pode ir para caixa de preventores aceitos');
    }
  })

  targetPreventores.addEventListener('drop', (e) => {
    e.preventDefault()
    e.stopImmediatePropagation()
    const sourceID = e.dataTransfer.getData('text/plain')
    const draggedElement = document.getElementById(sourceID);
    if (preventores.includes(draggedElement.id)) {
      draggedElement.classList.remove('bg-secondary')
      draggedElement.classList.add('bg-success')
      e.target.appendChild(draggedElement)
      bop.addPreventorSelecionado(sourceID)
    }
    else {
      alert('Válvula só pode ir para caixa de válvulas aceitas');
    }
  })
}

/*
  --------------------------------------------------------------------------------------
  Função auxuliar para eliminar os filhos dos campos de target
  --------------------------------------------------------------------------------------
*/
const removeAllChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para obter dados do backend via requisição GET (válvulas e preventores)
  --------------------------------------------------------------------------------------
*/
const getData = async (uri) => {
  let url = URL_BASE + uri;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
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