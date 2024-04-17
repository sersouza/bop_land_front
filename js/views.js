/*
  --------------------------------------------------------------------------------------
  Views injetadas diretamente para evitar uso de servidor de HTML
  --------------------------------------------------------------------------------------
*/

const listarBOPView = `
<div class="container-fluid">
  <h1>Lista de BOPs</h1>
  <section class="newItem">
    <input type="text" id="sonda-busca" placeholder="Digite a sonda:">
    <button onclick="buscarBOP()" class="addBtn">Buscar</button>
    <button onclick="listarBOP()" class="addBtn">Todos</button>
    <button onclick="cadastrarBOP()" type="button" data-bs-toggle="offcanvas" data-bs-target="#cadastrarBOPSideBar" aria-controls="cadastrarBOPSideBar">Criar BOP</button>
  </section>
  <div class="table-responsive">
    <table id="data-table" class="table">
      <thead>
        <tr>
          <th scope="col">Sonda</th>
          <th scope="col">Válvulas</th>
          <th scope="col">Preventores</th>
          <th scope="col">Ações</th>
        </tr>
      </thead>
      <tbody id="table-body-bop">
        <!-- Data will be inserted here dynamically -->
      </tbody>
    </table>
  </div>
  <nav aria-label="Page navigation example" >
  <ul class="pagination pagination-sm" id="page-navegation"></ul>
</nav>
  
  <div class="offcanvas offcanvas-end" tabindex="-1" id="cadastrarBOPSideBar" aria-labelledby="cadastrarBOPSideBarLabel">
      <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="cadastrarBOPSideBarLabel">Criar BOP</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
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
          <button onclick="salvarBOP()" class="mt-3" data-bs-dismiss="offcanvas" >Salvar</button>
      </div>
      </div>
  </div>
</div>
`
const testarBOPView = `
<div class="container-fluid">
  <h1>Lista de Testes</h1>
  <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="seleciona-sondas">
  </select>
  <div class="row gy-4">
    <div class="col-6">
      <div class="card">
          <div class="card-header">
          Válvulas disponíveis
          </div>
          <div id="source-valvulas-teste" class="card-body"></div>
      </div>
    </div>
    <div class="col-6">
      <div class="card">
          <div class="card-header">
          Preventores disponíveis
          </div>
          <div id="source-preventores-teste" class="card-body"></div>
      </div>
    </div>
  </div>
  <button onclick="criarTeste()" class="mt-3">+Teste</button>
  <div id="criar-teste-area"></div>
  <div class="table-responsive">
  <table id="data-table" class="table">
    <thead>
      <tr>
        <th scope="col">Nome do teste</th>
        <th scope="col">Válvulas</th>
        <th scope="col">Preventores</th>
        <th scope="col">Ações</th>
      </tr>
    </thead>
    <tbody id="table-body-teste">
      <!-- Data will be inserted here dynamically -->
    </tbody>
  </table>
</div>
</div>
`

const perfilView = `
<div class="container-fluid">
  <div id="perfil-content"></div>
`

const cadastrarBOPView = `
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