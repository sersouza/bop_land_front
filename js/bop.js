const URL_BASE = 'http://localhost:5000/'

// Definindo a classe BOP
class BOP {
  constructor(valvulasSelecionadas = [], preventoresSelecionados = []) {
    this.valvulasSelecionadas = valvulasSelecionadas
    this.preventoresSelecionados = preventoresSelecionados
  }

  // Método para adicionar válvula na lista valvulasSelecionadas
  addValvulaSelecionada(valvula) {
    this.valvulasSelecionadas.push(valvula)
  }

  // Método para adicionar preventor na lista preventoresSelecionados
  addPreventorSelecionado(preventor) {
    this.preventoresSelecionados.push(preventor)
  }

  // Método que retorna todas as válvulas selecionadas
  getValvulasSelecionadas() {
    return this.valvulasSelecionadas
  }

  // Método que retorna todas as válvulas selecionadas
  getPreventoresSelecionados() {
    return this.preventoresSelecionados
  }
  // Método que limpa a lista valvulasSelecionadas
  limparPreventoresSelecionados() {
    this.preventoresSelecionados = []
  }
  // Método que limpa a lista preventoresSelecionados
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
    listarBOP({sonda: sonda})
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para listar todos os BOPs existentes de forma paginada
  --------------------------------------------------------------------------------------
*/
const listarBOP = async ({ pagina = 1, sonda = null } = {}) => {
  if (sonda) {
    uri = `bop/?sonda=${sonda}&pagina=${pagina}&per_pagina=3`
  }
  else {
    uri = `bop/?pagina=${pagina}&por_pagina=3`
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
      const data = await response.json()
      populaTabela(data)
      const sondaInput = document.getElementById("sonda-busca")
      sondaInput.value = ''
    } else {
      const data = await response.json()
      alert(data.mensagem)
    }
  } catch (error) {
    console.log('ERROR ' + error)
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
    //populando o objeto ser enviado no corpo da requisição 
    const body = JSON.stringify({
      sonda: sonda,
      valvulas: bop.getValvulasSelecionadas(),
      preventores: bop.getPreventoresSelecionados()
    })

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: body
      })
      if (response.ok) {
        //limpando o campo de input de sonda
        sondaInput.value = ''
        alert("Salvo com sucesso!")
        setTimeout(() => {
          //atualizando a lista de bop com o item recém criado
          document.dispatchEvent(new Event('updateListaBOP'))
        }, 1000)
      } else {
        const data = await response.json()
        alert(data.mensagem)
      }
    } catch (error) {
      console.log('ERROR ' + error)
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um BOP a partir do nome da sonda e removê-lo da tela
  --------------------------------------------------------------------------------------
*/
const deletaBOP = async (id) => {
  const url = URL_BASE + 'bop/?id=' + id
  const element = document.getElementById(id)

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
        const data = await response.json()
        alert(data.mensagem)
      }
    } catch (error) {
      console.log('ERROR ' + error)
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
const acaoDeletar = (id) => {
  return `<button onclick="deletaBOP('${id}')" class="addBtn"><span style="font-size: 1em; color: Tomato;">
  <i class="lni lni-trash-can"></i>
   </span></button>    
`}

/*
  --------------------------------------------------------------------------------------
  Função atualiza a paginação da tabela do BOP
  --------------------------------------------------------------------------------------
*/
const atualizaPaginacao = (data) => {
  const paginationContainer = document.getElementById('page-navegation');
  paginationContainer.innerHTML = ''
  const totalPaginas = data.total_paginas
  const paginaAtual = data.pagina_atual
  const temAnterior = data.tem_anterior
  const temProximo = data.tem_proximo

  if (temAnterior) {
    paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" onclick="listarBOP({pagina: ${paginaAtual - 1}})">Anterior</a></li>`
  }
  for (let i = 1; i <= totalPaginas; i++) {
    paginationContainer.innerHTML += `<li class="page-item ${i === paginaAtual ? 'active' : ''}"><a class="page-link" onclick="listarBOP({pagina: ${i}})">${i}</a></li>`
  }
  if (temProximo) {
    paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" onclick="listarBOP({pagina: ${paginaAtual + 1}})">Próximo</a></li>`
  }
}

/*
  --------------------------------------------------------------------------------------
  Função que injeta na tabela os dados de BOP
  --------------------------------------------------------------------------------------
*/
const populaTabela = (data) => {
   // limpa os dados anteriores
   const tableBody = document.getElementById('table-body-bop')
   tableBody.innerHTML = ''

   // Insere os novos dados na tabela
   data.items.content.forEach(item => {
     const row = document.createElement('tr')
     row.setAttribute("id", item.id)
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
         <td>${acaoDeletar(item.id)}</td>
         `
         tableBody.appendChild(row)
   });

   // Atualiza os controles de paginação
   atualizaPaginacao(data)
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
  valvulas = await getData('valvula/all')
  //trazendo do backend a lista de todas os preventores disponíveis no banco
  preventores = await getData('preventor/all')

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
      draggedElement.classList.remove('bg-dark-subtle')
      draggedElement.classList.remove('text-dark-emphasis')
      draggedElement.classList.add('bg-primary')
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
      draggedElement.classList.remove('bg-dark-subtle')
      draggedElement.classList.remove('text-dark-emphasis')
      draggedElement.classList.add('bg-primary')
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
    parent.removeChild(parent.firstChild)
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para obter dados do backend via requisição GET (válvulas e preventores)
  --------------------------------------------------------------------------------------
*/
const getData = async (uri) => {
  let url = URL_BASE + uri
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    return data // Return the parsed JSON data
  } catch (error) {
    console.error('Error:', error)
    throw error // Re-throw the error to be caught by the caller
  }
}