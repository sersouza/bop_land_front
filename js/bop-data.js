const URL_BASE = 'http://127.0.0.1:5000/'


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async (uri) => {
    let url = URL_BASE + uri
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => populateTable(data))
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Chamada da função para carregamento inicial dos dados
    --------------------------------------------------------------------------------------
  */
  getList('bops')
 

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
    data.bops.map(item =>{
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


  const buscarBOP = () => {
    const sonda = document.getElementById("sonda").value
    const uri = 'bop?sonda=' + sonda

    getList(uri)
  }