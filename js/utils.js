
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
  