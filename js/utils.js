
/*
  --------------------------------------------------------------------------------------
  Método para decodificar o jwt token sem uso de bibliotecas externas
  --------------------------------------------------------------------------------------
*/
// Função para converter string codificada em base64url em string codificada em base64
const base64UrlToBase64 = (base64Url) => {
    // Substitui caracteres seguros para URL por caracteres base64 regulares
    base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  
    // Preenche a string base64Url para garantir que ela tenha um comprimento múltiplo de 4
    while (base64Url.length % 4 !== 0) {
        base64Url += '='
    }
    return base64Url
  }
  
  // Função para decodificar uma string codificada em base64url
  const decodeBase64Url = (base64Url) => {
    // Converte base64url para base64
    const base64 = base64UrlToBase64(base64Url)
  
    // Decodificar string base64 para UTF-8
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  
    return jsonPayload
  }
  
  // Função para decodificar o JWT
  const decodeJWT = (token) => {
    const parts = token.split('.')
    if (parts.length !== 3) {
        throw new Error('Esperado o JWT conter 3 seções, mas foram encontrados ' + parts.length)
    }
    const payload = JSON.parse(decodeBase64Url(parts[1]))
    return payload
  }
  
  // Função para verificar se o token expirou
  const isTokenExpired = (token) => {
    try {
        const decoded = decodeJWT(token)
        const currentTime = Math.floor(Date.now() / 1000)
        return decoded.exp < currentTime
    } catch (e) {
        console.error("Falha ao decodificar o JWT", e)
        return true // assume expired if there is an error
    }
  }

  /*
  --------------------------------------------------------------------------------------
  Função atualiza a paginação da tabela do BOP
  --------------------------------------------------------------------------------------
*/
const atualizaPaginacaoGenerica = (data, func, elemId) => {
    const paginationContainer = document.getElementById(elemId);
    paginationContainer.innerHTML = ''; // Clear existing content

    const { total_paginas, pagina_atual, tem_anterior, tem_proximo } = data;

    // Handler for creating page links
    const createPageItem = (page, label, isActive, isDisabled) => {
        const li = document.createElement('li');
        li.className = `page-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`;
        const a = document.createElement('a');
        a.className = 'page-link';
        a.textContent = label;
        if (!isDisabled) {
            a.href = '#'; // Prevent default link behavior
            a.addEventListener('click', () => func({ pagina: page }));
        }
        li.appendChild(a);
        return li;
    };

    // Previous page link
    if (tem_anterior) {
        paginationContainer.appendChild(createPageItem(pagina_atual - 1, 'Anterior', false, false));
    }

    // Numeric page links
    for (let i = 1; i <= total_paginas; i++) {
        paginationContainer.appendChild(createPageItem(i, i.toString(), i === pagina_atual, false));
    }

    // Next page link
    if (tem_proximo) {
        paginationContainer.appendChild(createPageItem(pagina_atual + 1, 'Próximo', false, false));
    }
}

  /*
  --------------------------------------------------------------------------------------
  Função para formatar a data de aprovação do Teste
  --------------------------------------------------------------------------------------
*/
// const dataFormatada = (data) => {
//     // Ensure the input is a Date object
//     if (!(data instanceof Date)) {
//         data = new Date(data + 'Z');
//     }

//     let dia = data.getDate().toString().padStart(2, '0');   // Get the dia, pad with zero if necessary
//     let mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Get the month, pad with zero (month is 0-indexed)
//     let ano = data.getFullYear(); // Get the full year
//     let horas = data.getHours().toString().padStart(2, '0'); // Get hours, pad with zero
//     let minutos = data.getMinutes().toString().padStart(2, '0'); // Get minutes, pad with zero

//     return `${dia}-${mes}-${ano} ${horas}:${minutos}`; // Construct the format "dd-mm-yyyy HH:mm"
// }

// function dataFormatada(data) {
//     if (!(data instanceof Date)) {
//         data = new Date(data + 'Z');  // Append 'Z' to indicate UTC if not included
//     }

//     // Convert São Paulo time (UTC-3) to true UTC by adding 3 hours
//     const utcDate = new Date(data.getTime() + 3 * 60 * 60 * 1000);

//     // Now format the UTC date in any desired format or use it for calculations
//     let dia = utcDate.getUTCDate().toString().padStart(2, '0');
//     let mes = (utcDate.getUTCMonth() + 1).toString().padStart(2, '0');
//     let ano = utcDate.getUTCFullYear();
//     let horas = utcDate.getUTCHours().toString().padStart(2, '0');
//     let minutos = utcDate.getUTCMinutes().toString().padStart(2, '0');

//     return `${dia}-${mes}-${ano} ${horas}:${minutos}`; // Construct the format "dd-mm-yyyy HH:mm"
// }
