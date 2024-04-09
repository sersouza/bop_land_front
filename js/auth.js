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
        res.json().then(data => alert(data.message))
      }
    })
    .catch(error => console.log('ERROR ' + error))
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
      alert(data.message);
    }
  } catch (error) {
    console.log('ERROR ' + error);
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

  if (user.msg==="Not enough segments"){
    content.innerHTML = `<h1>Logue e descubra o mundo!!!!!!</h1>`
  }
  else{
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