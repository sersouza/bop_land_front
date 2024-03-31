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
const login = () => {
  const formData = new FormData();
  const email = document.getElementById('email-usuario').value
  const senha = document.getElementById('senha-usuario').value

  formData.append('email', email)
  formData.append('senha', senha)

  const url = URL_BASE + 'login'

  // checando se já existe um token salvo no localStorage
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token')
  }

  fetch(url, { method: 'post', body: formData })
    .then(res => {
      if (res.ok) {
        res.json().then(data => localStorage.setItem('token', data.access_token))
        setTimeout(() => {
          const closeEvent = new Event('closeLoginModal');
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
const logout = () => {

  // checando se já existe um token salvo no localStorage
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token')
  }

  const openEvent = new Event('openLoginModal');
  document.dispatchEvent(openEvent);
}

/*
  --------------------------------------------------------------------------------------
  Coletar o dado de seção do usuario
  --------------------------------------------------------------------------------------
*/
const dadoSecao = async () => {
  const url = URL_BASE + 'usuario'

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

  console.log(user)

  // Clear existing data
  content.innerHTML = ''

  if (user.msg==="Not enough segments"){
    content.innerHTML = `<h1>Logue e descubra o mundo!!!!!!</h1>`
  }
  else{
    content.innerHTML = `<h1>Olá, ${user.nome}!!!</h1>`
  }
}