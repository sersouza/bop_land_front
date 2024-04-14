let sidebarExpandida = true

/*
  --------------------------------------------------------------------------------------
  Router com hash utilizando javascript vanilla
  --------------------------------------------------------------------------------------
*/

document.addEventListener("DOMContentLoaded", () => {
  const contentDiv = document.getElementById('content');
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  const registroModal = new bootstrap.Modal(document.getElementById("registroModal"));

  //deixando a sidebar expandida ao abrir a aplicação
  document.getElementById("sidebar").classList.toggle("expand")

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

  document.addEventListener('updateListaBOP', () => {
    listarBOP();
    console.log('ativei o evento de atualizar bop')
  });


  // router propriamente dito
  const renderPage = (route) => {
    switch (route) {
      case '/home':
        contentDiv.innerHTML = perfilView
        document.dispatchEvent(new Event('updatePerfilView'))
        break
      case '/listar-bop':
        contentDiv.innerHTML = listarBOPView
        listarBOP()
        break
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
  sidebarExpandida = !sidebarExpandida
  if (sidebarExpandida){
    document.getElementById("sidebar").classList.add("expand")
  } else {
    document.getElementById("sidebar").classList.remove("expand")
  }
})