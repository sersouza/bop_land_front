const urlPageTitle = "BOP Land"
const URL_BASE = 'http://127.0.0.1:5000/'
let valvulasAceitas = []
let preventoresAceitos = []
let targetValvulas
let targetPreventores
let sourceValvulas
let sourcePreventores
let preventores
let valvulas

/*
  --------------------------------------------------------------------------------------
  Views injetadas diretamente para evitar uso de servidor de HTML
  --------------------------------------------------------------------------------------
*/

const homeView = `
<div class="container-fluid">
  <h1>Lista de BOPs</h1>
  <section class="newItem">
    <input type="text" id="sonda-busca" placeholder="Digite a sonda:">
    <button onclick="buscarBOP()" class="addBtn">Buscar</button>
    <button onclick="listarBOP()" class="addBtn">Todos</button>
  </section>
  <table id="data-table" class="table">
    <thead>
      <tr>
        <th scope="col">Sonda</th>
        <th scope="col">Válvulas</th>
        <th scope="col">Preventores</th>
        <th scope="col">Ações</th>
      </tr>
    </thead>
    <tbody id="table-body">
      <!-- Data will be inserted here dynamically -->
    </tbody>
  </table>
</div>
`

const cadastrarView = `
<div class="container-fluid">
  <h1>Criar BOP</h1>
  <input class="mb-3" type="text" id="sonda-cadastro" placeholder="Digite a sonda:">
  <div class="row gy-4">
    <div class="col-6">
      <div class="card">
          <div class="card-header">
          Válvulas disponíveis
          </div>
          <div id="source-valvulas" class="card-body"></div>
      </div>
    </div>
    <div class="col-6">
      <div class="card">
          <div class="card-header">
          Preventores disponíveis
          </div>
          <div id="source-preventores" class="card-body"></div>
      </div>
    </div>
    <div class="col-6">
      <div class="card">
          <div class="card-header">
          Válvulas selecionadas
          </div>
          <div id="target-valvulas" class="card-body"></div>
      </div>
    </div>
    <div class="col-6">
      <div class="card">
          <div class="card-header">
          Preventores selecionados
          </div>
          <div id="target-preventores" class="card-body"></div>
      </div>
    </div>
  </div>
  <button onclick="salvarBOP()" class="mt-3">Salvar</button>
</div>`

/*
  --------------------------------------------------------------------------------------
  Router com hash utilizando javascript vanilla
  --------------------------------------------------------------------------------------
*/

document.addEventListener("DOMContentLoaded", () => {
  const contentDiv = document.getElementById('content');
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  const registroModal = new bootstrap.Modal(document.getElementById("registroModal"));
  
  // deixando o modal de login ativo ao abrir a aplicação
  loginModal.show()

  //criando um listener para fechar o modal após registrar-se ou logar
  document.addEventListener('closeLoginModal', () => {
    loginModal.hide();
});

  //criando um listener para fechar o modal após registrar-se ou logar
  document.addEventListener('closeRegistroModal', () => {
    registroModal.hide();
});

  // router propriamente dito
  const renderPage = (route) => {
    switch (route) {
      case '/':
        contentDiv.innerHTML = homeView
        fetchDataAndPopulateTable('bops', '')
        break;
      case '/cadastrar':
        contentDiv.innerHTML = cadastrarView
        cadastrarBOP()
        break;
      case '/about':
        contentDiv.innerHTML = '<h2>About Page</h2>';
        break;
      default:
        contentDiv.innerHTML = '<h2>Olá</h2>';
        // getUserData('secao')
    }
  }

  function handleHashChange() {
    const route = window.location.hash.slice(1);
    renderPage(route);
  }

  window.addEventListener('hashchange', handleHashChange);
  // Initial page load
  handleHashChange();
});


/*
  --------------------------------------------------------------------------------------
  Registrar um usuário no sistema
  --------------------------------------------------------------------------------------
*/
const cadastrarUsuario = () => {
  const nome = document.getElementById('nome-usuario-registro').value
  const email = document.getElementById('email-usuario-registro').value 
  const senha = document.getElementById('senha-usuario-registro').value
  
  if (nome.trim() === '' || email.trim() === '' || senha.trim() === '') {
    alert("Por favor, preencha todos os campos");
    return; // Exit the function early
  }
  
  const formData = new FormData();
  formData.append('nome', nome)
  formData.append('email', email)
  formData.append('senha', senha)

  const url = URL_BASE + 'cadastro'

  fetch(url, { method: 'post', body: formData })
  .then(res => {
    if (res.ok){
      alert("Salvo com sucesso!")
      setTimeout(() => {
        const closeEvent = new Event('closeRegistroModal');
        document.dispatchEvent(closeEvent);
      }, 500)
    }
    else{
      res.json().then(data => alert(data.message))
    }
  })
  .catch(error => console.log('ERROR '+error))
}

/*
  --------------------------------------------------------------------------------------
  Login de um usuário no sistema
  --------------------------------------------------------------------------------------
*/

const login = () => {
  const formData = new FormData();
  const email = document.getElementById('email-usuario').value 
  const senha = document.getElementById('senha-usuario').value

  formData.append('email', email)
  formData.append('senha', senha)

  const url = URL_BASE + 'login'

  fetch(url, { method: 'post', body: formData })
  .then(res => {
    if (res.ok){
      setTimeout(() => {
        const closeEvent = new Event('closeLoginModal');
        document.dispatchEvent(closeEvent);
      }, 500)
    }
    else{
      res.json().then(data => alert(data.message))
    }
  })
  .catch(error => console.log('ERROR '+error))
}

/*
  --------------------------------------------------------------------------------------
  Criar a resposividade da sidebar
  --------------------------------------------------------------------------------------
*/

const hamburguer = document.getElementById('toggle-btn')

hamburguer.addEventListener("click", ()=> {
    document.getElementById("sidebar").classList.toggle("expand")

})


/*
  --------------------------------------------------------------------------------------
  Função para obter dados do backend via requisição GET
  --------------------------------------------------------------------------------------
*/

const getData = async (uri) => {
  let url = URL_BASE + uri;
  try {
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
  Função para salvar dados do backend via requisição POST
  --------------------------------------------------------------------------------------
*/

const postData = async (uri, corpo) => {
  const formData = new FormData();
  formData.append('sonda', corpo.sonda)
  corpo.valvulas.forEach(valvula => {
    formData.append('valvulas', valvula);
  })
  corpo.preventores.forEach(preventor => {
    formData.append('preventores', preventor);
  })

  try {
    let url = URL_BASE + uri;
    const response = await fetch(url, { method: 'post', body: formData });
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

/*
  --------------------------------------------------------------------------------------
  Função para deletar um BOP pelo nome da sonda via método DELETE
  --------------------------------------------------------------------------------------
*/

const delData = async (uri) => {
  try {
    let url = URL_BASE + uri;
    const response = await fetch(url, { method: 'delete' });
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
  data.bops.map(item => {
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
  Função que combina os  dados vindos da API e os populam como uma tabela no frontend
  --------------------------------------------------------------------------------------
*/

const fetchDataAndPopulateTable = async (uri, termo) => {
  try {
    const data = await getData(uri); // Wait for the data to be fetched
    populateTable(data); // Populate the table with the fetched data
  } catch (error) {
    console.error('Error fetching data:', error);
    notFound(termo)
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para buscar e mostrar o BOP a partir de um termo
  --------------------------------------------------------------------------------------
*/
const buscarBOP = () => {
  let sondaInput = document.getElementById("sonda-busca")
  const sonda = sondaInput.value

  if (sonda == '') {
    alert("Digite um nome válido")
  }
  else {
    const uri = 'bop?sonda=' + sonda
    fetchDataAndPopulateTable(uri, sonda)
    //limpa o campo sonda para uma nova busca
    sondaInput.value = ''
  }

}

/*
  --------------------------------------------------------------------------------------
  Função para obter a listar todos os BOPs existentes
  --------------------------------------------------------------------------------------
*/

const listarBOP = () => {
  fetchDataAndPopulateTable('bops', '')
  //limpa o campo de busca, caso haja algo escrito
  const sondaInput = document.getElementById("sonda-busca")
  sondaInput.value = ''
}


/*
  --------------------------------------------------------------------------------------
  Funcão que permite criar um novo BOP a partir dos elementos básicos usando drag and drop
  --------------------------------------------------------------------------------------
*/

const cadastrarBOP = async () => {
  limpaCadastro()
  targetValvulas = document.getElementById('target-valvulas')
  targetPreventores = document.getElementById('target-preventores')

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
    e.preventDefault()
    const sourceID = e.dataTransfer.getData('text/plain')
    const draggedElement = document.getElementById(sourceID);
    if (valvulas.includes(draggedElement.id)) {
      draggedElement.classList.remove('bg-secondary')
      draggedElement.classList.add('bg-success')
      e.target.appendChild(draggedElement)
      valvulasAceitas.push(sourceID)
    }
    else {
      alert('Preventor só pode ir para caixa de preventores aceitos');
    }
  })

  targetPreventores.addEventListener('drop', (e) => {
    e.preventDefault()
    const sourceID = e.dataTransfer.getData('text/plain')
    const draggedElement = document.getElementById(sourceID);
    if (preventores.includes(draggedElement.id)) {
      draggedElement.classList.remove('bg-secondary')
      draggedElement.classList.add('bg-success')
      e.target.appendChild(draggedElement)
      preventoresAceitos.push(sourceID)
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
  Função para limpar área de cadastro do BOP
  --------------------------------------------------------------------------------------
*/

const limpaCadastro = async () => {
  sourceValvulas = document.getElementById('source-valvulas')
  sourcePreventores = document.getElementById('source-preventores')
  
  // limpando variaveis globais
  valvulasAceitas = []
  preventoresAceitos = []

  if (targetPreventores || targetValvulas){
    //limpando os campos de target
    removeAllChildNodes(targetPreventores)
    removeAllChildNodes(targetValvulas)
  }
  
  //trazendo do backend a lista de todas as válvulas disponíveis no banco
  valvulas = await getData('valvulas')
  //trazendo do backend a lista de todas os preventores disponíveis no banco
  preventores = await getData('preventores')

  //popular as valvulas disponiveis
  valvulas.map(v => {
    const span = document.createElement('span')
    span.innerHTML = `<span id=${v} class="badge bg-dark-subtle border border-dark-subtle text-dark-emphasis rounded-pill" draggable="true">${v}</span>`

    sourceValvulas.appendChild(span)
  })

  //popular os preventores disponiveis
  preventores.map(p => {
    const span = document.createElement('span')
    span.innerHTML = `<span id=${p} class="badge bg-dark-subtle border border-dark-subtle text-dark-emphasis rounded-pill" draggable="true">${p}</span>`

    sourcePreventores.appendChild(span)
  })
}


/*
  --------------------------------------------------------------------------------------
  Função para salvar os dados do BOP inserido na view cadastrar BOP
  --------------------------------------------------------------------------------------
*/
const salvarBOP = () => {
  const sondaInput = document.getElementById('sonda-cadastro')
  const sonda = sondaInput.value

  if (sonda == '') {
    alert("Digite um nome de sonda para prosseguir")
  }
  else {
    postData('bop', { sonda: sonda, valvulas: valvulasAceitas, preventores: preventoresAceitos })

    //limpando as variaveis globais após o salvamento
    limpaCadastro()

    //limpando o campo de input de sonda
    sondaInput.value = ''
    alert("Salvo com sucesso!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um BOP a partir do nome da sonda e removê-lo da tela
  --------------------------------------------------------------------------------------
*/
const deletaBOP = (sonda) => {
  const uri = 'bop?sonda=' + sonda
  const element = document.getElementById(sonda)

  if (confirm("Você tem certeza?")) {
    delData(uri)
    alert("Removido!")
    element.remove()
  }
}
