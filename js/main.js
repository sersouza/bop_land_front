/*
  --------------------------------------------------------------------------------------
  Router com hash utilizando javascript vanilla
  --------------------------------------------------------------------------------------
*/

document.addEventListener("DOMContentLoaded", () => {
  const contentDiv = document.getElementById('content');
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  const registroModal = new bootstrap.Modal(document.getElementById("registroModal"));

  // deixando o modal de login ativo ao abrir a aplicação
  loginModal.show()

  //criando um listener para fechar o modal após registrar-se ou logar
  document.addEventListener('closeLoginModal', () => {
    loginModal.hide();
  });

  //criando um listener para fechar o modal após registrar-se ou logar
  document.addEventListener('closeRegistroModal', () => {
    registroModal.hide();
  });

  document.addEventListener('openLoginModal', () => {
    loginModal.show();
  });

  document.addEventListener('updatePerfilView', () => {
    updatePerfilView();
  });

  document.addEventListener('clearPerfilView', () => {
    clearPerfilView();
  });


  // router propriamente dito
  const renderPage = (route) => {
    switch (route) {
      case '/':
        contentDiv.innerHTML = homeView
        fetchDataAndPopulateTable('bops', '')
        break;
      case '/cadastrar':
        contentDiv.innerHTML = cadastrarView
        cadastrarBOP()
        break;
      case '/about':
        contentDiv.innerHTML = '<h2>About Page</h2>';
        break;
      default:
        contentDiv.innerHTML = perfilView
    }
  }

  function handleHashChange() {
    const route = window.location.hash.slice(1);
    renderPage(route);
  }

  window.addEventListener('hashchange', handleHashChange);
  // Initial page load
  handleHashChange();
});

/*
  --------------------------------------------------------------------------------------
  Criar a resposividade da sidebar
  --------------------------------------------------------------------------------------
*/

const hamburguer = document.getElementById('toggle-btn')

hamburguer.addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("expand")
})