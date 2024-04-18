const SERVIDOR_FORA = "Servidor indisponível. Para utilizar esta página, é essencial que o backend esteja funcionando corretamente."

/*
  --------------------------------------------------------------------------------------
  Registrar um usuário no sistema
  --------------------------------------------------------------------------------------
*/
const cadastrarUsuario = async () => {
  const nome = document.getElementById('nome-usuario-registro').value
  const email = document.getElementById('email-usuario-registro').value
  const senha = document.getElementById('senha-usuario-registro').value

  if (nome.trim() === '' || email.trim() === '' || senha.trim() === '') {
    alert("Por favor, preencha todos os campos")
    return
  }

  //populando o objeto a ser enviado no corpo da requisição 
  const body = JSON.stringify({
    nome: nome,
    email: email,
    senha: senha,
  })

  const url = URL_BASE + 'auth/register'

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
      setTimeout(() => {
        const closeEvent = new Event('closeRegistroModal')
        document.dispatchEvent(closeEvent)
      }, 500)
    } else {
      const data = await response.json()
      alert(data.mensagem)
    }
  } catch (error) {
    console.log('ERROR ' + error)
    alert(SERVIDOR_FORA)
  }
}

/*
  --------------------------------------------------------------------------------------
  Login de um usuário no sistema
  --------------------------------------------------------------------------------------
*/
const login = async () => {
  const formData = new FormData()
  const email = document.getElementById('email-usuario').value
  const senha = document.getElementById('senha-usuario').value

  formData.append('email', email)
  formData.append('senha', senha)

  const url = URL_BASE + 'auth/login'

  // checando se já existe um token salvo no localStorage, em caso positivo remove para inserir um novo
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token')
  }

  try {
    const response = await fetch(url, {
      method: 'post',
      body: formData
    })

    if (response.ok) {
      const data = await response.json()
      // guardo o token no local storage
      localStorage.setItem('token', data.access_token)
      // fecha o modal de login
      const closeEvent = new Event('closeLoginModal')
      // atualiza a home do usuário
      const updateEvent = new Event('updatePerfilView')
      document.dispatchEvent(updateEvent)
      document.dispatchEvent(closeEvent)
    } else {
      const data = await response.json()
      alert(data.mensagem)
    }
  } catch (error) {
    console.log('ERROR ' + error)
    alert(SERVIDOR_FORA)
  }
}

/*
  --------------------------------------------------------------------------------------
  Logout de um usuário no sistema
  --------------------------------------------------------------------------------------
*/
const logout = () => {
  // checando se já existe um token salvo no localStorage, caso positivo remove o token
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token')
  }
  // abre o modal de login
  const openEvent = new Event('openLoginModal')
  document.dispatchEvent(openEvent)

  // limpa a home do usuário
  const clearPerfilView = new Event('clearPerfilView')
  document.dispatchEvent(clearPerfilView)
}

/*
  --------------------------------------------------------------------------------------
  Coletar o dado de seção do usuario e inserir na Home
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

  const content = document.getElementById('perfil-content')

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
  Limpar a home do usuario
  --------------------------------------------------------------------------------------
*/
const clearPerfilView = () => {
  const content = document.getElementById('perfil-content')

  // Clear existing data
  content.innerHTML = ''
}