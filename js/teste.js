var testeId = 0
const testeGlobal = {}
var idBOPSelecionado = null
// Definindo a classe Teste
class Teste {
  constructor(
    nome,
    bopId,
    valvulasTestadas = [],
    preventoresTestados = []) {
    this.nome = nome
    this.bopId = bopId
    this.valvulasTestadas = valvulasTestadas
    this.preventoresTestados = preventoresTestados
  }

  // Example method to set selected valves
  addValvulaTestada(valvula) {
    this.valvulasTestadas.push(valvula)
  }

  // Example method to set selected preventers
  addPreventorTestado(preventor) {
    this.preventoresTestados.push(preventor)
  }

  // Example method to set selected valves
  getValvulasTestadas() {
    return this.valvulasTestadas
  }

  // Example method to set selected preventers
  getPreventoresTestados() {
    return this.preventoresTestados
  }
}

// Definindo a classe Teste
class BOPSalvo {
  constructor(
    sonda,
    valvulasDisponiveis = [],
    preventoresDisponiveis = []) {
    this.sonda = sonda
    this.valvulasDisponiveis = valvulasDisponiveis
    this.preventoresDisponiveis = preventoresDisponiveis
  }

  // Example method to set selected valves
  getValvulasDisponiveis() {
    return this.valvulasDisponiveis
  }

  // Example method to set selected preventers
  getPreventoresDisponiveis() {
    return this.preventoresDisponiveis
  }
}

// instanciado um objeto de BOP
const bopSalvo = new BOPSalvo()

/*
  --------------------------------------------------------------------------------------
  Lista todas as sondas disponíveis e inseri-los no select
  --------------------------------------------------------------------------------------
*/
const listarSondas = async () => {
  const selectElement = document.getElementById("seleciona-sondas")

  // limpando opções anteriores
  selectElement.innerHTML = ""

  //trazendo do back a lista de sondas disponíveis
  bopData = await getData('bop/sondas')

  bopData?.items.map(
    item => {
      selectElement.innerHTML += `<option value=${item.id}>${item.sonda}</option>`
    }
  )
  // deixando a primeira opção como id inicial
  idBOPSelecionado = bopData?.items[0]?.id
  // trazendo do back as válvulas/preventores do BOP selecionado
  bopSalvo.valvulasDisponiveis = await listarValvulas(idBOPSelecionado)
  bopSalvo.preventoresDisponiveis = await listarPreventores(idBOPSelecionado)
  // mostrando os elementos disponiveis do BOP
  visualizarElementosBOP()

  //criando um listener para capturar a alteração no campo select e listar as válvulas para BOP dessa sonda
  selectElement.addEventListener('change', async function () {
    idBOPSelecionado = this.value
    // trazendo do back as válvulas/preventores do BOP selecionado
    bopSalvo.valvulasDisponiveis = await listarValvulas(idBOPSelecionado)
    bopSalvo.preventoresDisponiveis = await listarPreventores(idBOPSelecionado)
    // mostrando os elementos disponiveis do BOP
    visualizarElementosBOP()
  })
}

/*
  --------------------------------------------------------------------------------------
  Lista todas as válvulas da sonda escolhida no select
  --------------------------------------------------------------------------------------
*/
const listarValvulas = async (bop_id) => {
  uri = `valvula/?bop_id=${bop_id}`
  const url = URL_BASE + uri

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      return data?.content
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
  Lista todos os preventores da sonda escolhida no select
  --------------------------------------------------------------------------------------
*/
const listarPreventores = async (bop_id) => {
  uri = `preventor/?bop_id=${bop_id}`
  const url = URL_BASE + uri

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      return data?.content
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
  Funcão que permite visualizar as válvulas e preventores a partir do BOP selecionado 
  no select
  --------------------------------------------------------------------------------------
*/
const visualizarElementosBOP = () => {
  sourceValvulas = document.getElementById('source-valvulas-teste')
  sourcePreventores = document.getElementById('source-preventores-teste')

  valvulas = bopSalvo.getValvulasDisponiveis()
  preventores = bopSalvo.getPreventoresDisponiveis()

  //limpando os campos de source
  if (sourcePreventores || sourceValvulas) {
    removeAllChildNodes(sourcePreventores)
    removeAllChildNodes(sourceValvulas)
  }

  //popular as valvulas disponiveis
  valvulas?.map(v => {
    const span = document.createElement('span')
    span.innerHTML = `<span id=${geraIdComposto(v)} class="badge bg-dark-subtle border border-dark-subtle text-dark-emphasis rounded-pill" draggable="true">${v.acronimo}</span>`

    sourceValvulas.appendChild(span)
  })

  //popular os preventores disponiveis
  preventores?.map(p => {
    const span = document.createElement('span')
    span.innerHTML = `<span id=${geraIdComposto(p)} class="badge bg-dark-subtle border border-dark-subtle text-dark-emphasis rounded-pill" draggable="true">${p.acronimo}</span>`

    sourcePreventores.appendChild(span)
  })

  sourceValvulas.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id)
  })

  sourcePreventores.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id)
  })
}

/*
  --------------------------------------------------------------------------------------
  Função que injeta na tabela os dados de Teste
  --------------------------------------------------------------------------------------
*/
const criarTeste = () => {
  const tableBody = document.getElementById('table-body-teste')

  // incrementando testeid em cada novo teste
  testeId++

  // instanciado um objeto de Teste
  const teste = new Teste()
  // salvando o bop_id no objeto instanciado
  teste.bopId = idBOPSelecionado

  const row = document.createElement('tr')
  row.setAttribute("id", "testeId_" + testeId)
  row.innerHTML = `
  <td class="col-md-1 align-middle">${idBOPSelecionado}</td>
  <td class="col-md-2 align-middle"><input type="text" id="nome-teste-${testeId}" class="form-control"></td>
  <td id="target-valvulas-teste-${testeId}" class="col-md-4 tst"></td>
  <td id="target-preventores-teste-${testeId}" class="col-md-4 tst"></td>
  <td class="col-md-1 align-middle">${saveSymbol(testeId)}</td>
  `
  tableBody.appendChild(row)

  const inputElement = document.getElementById(`nome-teste-${testeId}`)
  const nomeTesteDefault = `Teste ${testeId}`
  inputElement.value = nomeTesteDefault
  teste.nome = nomeTesteDefault
  //criando um listener para capturar a alteraçã no campo select e listar as válvulas para BOP dessa sonda
  inputElement.addEventListener('change', function () {
    // salvando o nome do teste no objeto instanciado
    teste.nome = this.value
  })


  valvulasTestadas = document.getElementById(`target-valvulas-teste-${testeId}`)
  preventoresTestados = document.getElementById(`target-preventores-teste-${testeId}`)

  const valvulasId = bopSalvo.getValvulasDisponiveis().map(v => geraIdComposto(v))
  const preventoresId = bopSalvo.getPreventoresDisponiveis().map(p => geraIdComposto(p))

  valvulasTestadas.addEventListener('dragover', (e) => {
    e.preventDefault()
  })

  preventoresTestados.addEventListener('dragover', (e) => {
    e.preventDefault()
  })

  valvulasTestadas.addEventListener('drop', (e) => {
    console.log("evento de target valvula rodando")
    e.preventDefault()
    e.stopImmediatePropagation()
    const sourceID = e.dataTransfer.getData('text/plain')
    const draggedElement = document.getElementById(sourceID)
    if (valvulasId.includes(draggedElement.id)) {
      draggedElement.classList.remove('bg-dark-subtle')
      draggedElement.classList.remove('text-dark-emphasis')
      draggedElement.classList.add('bg-primary')
      e.target.appendChild(draggedElement)
      // salvando válvula a ser testada no objeto instanciado
      teste.addValvulaTestada(sourceID)
    }
    else {
      alert('Preventor só pode ir para caixa de preventores aceitos')
    }
  })

  preventoresTestados.addEventListener('drop', (e) => {
    e.preventDefault()
    e.stopImmediatePropagation()
    const sourceID = e.dataTransfer.getData('text/plain')
    const draggedElement = document.getElementById(sourceID)
    if (preventoresId.includes(draggedElement.id)) {
      draggedElement.classList.remove('bg-dark-subtle')
      draggedElement.classList.remove('text-dark-emphasis')
      draggedElement.classList.add('bg-primary')
      e.target.appendChild(draggedElement)
      // salvando preventor a ser testado no objeto instanciado
      teste.addPreventorTestado(sourceID)
    }
    else {
      alert('Válvula só pode ir para caixa de válvulas aceitas')
    }
  })
  // guardando a instância do teste na variável global
  testeGlobal[testeId] = teste
}

/* 
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
Funcões auxiliares do Teste
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
*/

const saveSymbol = (id) => {
  return `<button onclick="salvarTeste(${id})" class="addBtn"><span style="font-size: 1em color: Tomato">
  <i class="lni lni lni-save"></i>
   </span></button>    
`}

const geraIdComposto = (elemento) => {
  // console.log(elemento.id + ' ' + elemento.acronimo)
  return idBOPSelecionado + '_' + elemento.id + '_' + elemento.acronimo
}

const idCompostoParaObjeto = (arrayElementos) => {
  return arrayElementos.map(idComposto => {
    const [_, id, acronimo] = idComposto.split('_')
    return { id: id, acronimo: acronimo }
  })
}

/*
  --------------------------------------------------------------------------------------
  Função para salvar os dados do BOP inserido na view cadastrar BOP
  --------------------------------------------------------------------------------------
*/
const salvarTeste = async (id) => {
  const testeObj = testeGlobal[id]
  const valvulasIdComposto = testeObj.getValvulasTestadas()
  const preventoresIdComposto = testeObj.getPreventoresTestados()
  const valvulas = idCompostoParaObjeto(valvulasIdComposto)
  const preventores = idCompostoParaObjeto(preventoresIdComposto)
  const obj = { ...testeObj, valvulasTestadas: valvulas, preventoresTestados: preventores }
  const url = URL_BASE + 'teste/'
    
  //populando o objeto ser enviado no corpo da requisição 
  const body = JSON.stringify({
    nome: obj.nome,
    bop_id: obj.bopId,
    valvulas_testadas: obj.valvulasTestadas,
    preventores_testados: obj.preventoresTestados
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
      alert("Salvo com sucesso!")
      const testeElement = document.getElementById(`testeId_${id}`)
      testeElement.remove()
    } else {
      const data = await response.json()
      alert(data.mensagem)
    }
  } catch (error) {
    console.log('ERROR ' + error)
  }
}
