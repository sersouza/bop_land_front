const SERVIDOR_FORA = "Servidor indisponível. Para utilizar esta página, é essencial que o backend esteja funcionando corretamente."

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

  const url = URL_BASE + 'auth/register'

  fetch(url, { method: 'post', body: formData })
    .then(res => {
      if (res.ok) {
        alert("Salvo com sucesso!")
        setTimeout(() => {
          const closeEvent = new Event('closeRegistroModal');
          document.dispatchEvent(closeEvent);
        }, 500)
      }
      else {
        res.json().then(data => alert(data.mensagem))
      }
    })
    .catch(error => {
      console.log('ERROR ' + error)
      alert(SERVIDOR_FORA)
    })
}

/*
  --------------------------------------------------------------------------------------
  Login de um usuário no sistema
  --------------------------------------------------------------------------------------
*/
const login = async () => {
  const formData = new FormData();
  const email = document.getElementById('email-usuario').value
  const senha = document.getElementById('senha-usuario').value

  formData.append('email', email)
  formData.append('senha', senha)

  const url = URL_BASE + 'auth/login'

  // checando se já existe um token salvo no localStorage
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token')
  }

  try {
    const response = await fetch(url, {
      method: 'post',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      await delay(500);
      dispatchEvents();
    } else {
      const data = await response.json();
      alert(data.mensagem);
    }
  } catch (error) {
    console.log('ERROR ' + error);
    alert(SERVIDOR_FORA)
  }
}

/* utils*/
const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const dispatchEvents = () => {
  const closeEvent = new Event('closeLoginModal');
  const updateEvent = new Event('updatePerfilView');
  document.dispatchEvent(updateEvent);
  document.dispatchEvent(closeEvent);
}

/*
  --------------------------------------------------------------------------------------
  Método para decodificar o jwt token sem uso de bibliotecas externas
  --------------------------------------------------------------------------------------
*/
// Function to convert base64url encoded string to base64 encoded string
const base64UrlToBase64 = (base64Url) => {
  // Replace URL-safe characters with regular base64 characters
  base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  // Pad the base64Url string to ensure it has a length multiple of 4
  while (base64Url.length % 4 !== 0) {
      base64Url += '=';
  }

  return base64Url;
}

// Function to decode a base64url encoded string
const decodeBase64Url = (base64Url) => {
  // Convert base64url to base64
  const base64 = base64UrlToBase64(base64Url);

  // Decode base64 string to UTF-8
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return jsonPayload;
}

// Decode JWT function
const decodeJWT = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
      throw new Error('Expected JWT to contain 3 sections, but found ' + parts.length);
  }

  const payload = JSON.parse(decodeBase64Url(parts[1]));

  return payload;
}

const isTokenExpired = (token) => {
  try {
      const decoded = decodeJWT(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
  } catch (e) {
      console.error("Failed to decode JWT", e);
      return true; // assume expired if there is an error
  }
}

/*
  --------------------------------------------------------------------------------------
  Login de um usuário no sistema
  --------------------------------------------------------------------------------------
*/
const logout = () => {
  // checando se já existe um token salvo no localStorage
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token')
  }

  const openEvent = new Event('openLoginModal');
  document.dispatchEvent(openEvent);

  const clearPerfilView = new Event('clearPerfilView');
  document.dispatchEvent(clearPerfilView);
}

/*
  --------------------------------------------------------------------------------------
  Coletar o dado de seção do usuario
  --------------------------------------------------------------------------------------
*/
const updatePerfilView = async () => {
  const url = URL_BASE + 'auth/quemeusou'

  const user = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(res => res.json())
    .then(data => { return data })
    .catch(error => console.log('ERROR ' + error))

  const content = document.getElementById('perfil-content');

  // Clear existing data
  content.innerHTML = ''

  if (user.msg === "Not enough segments") {
    content.innerHTML = `<h1>Logue e descubra o mundo!!!!!!</h1>`
  }
  else {
    content.innerHTML = `<h1>Olá, ${user.nome}!!!</h1>`
  }
}

/*
  --------------------------------------------------------------------------------------
  Coletar o dado de seção do usuario
  --------------------------------------------------------------------------------------
*/
const clearPerfilView = () => {
  const content = document.getElementById('perfil-content');

  // Clear existing data
  content.innerHTML = ''
}