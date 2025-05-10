# language: pt
@profile
Funcionalidade: Gerenciamento de Perfil
  Como um usuário autenticado
  Eu quero gerenciar meu perfil
  Para que eu possa manter minhas informações atualizadas

  Contexto:
    Dado que eu sou um usuário autenticado
    E que eu tenho um token JWT válido

  Cenário: Obter perfil do usuário
    Quando eu faço uma requisição GET para "/api/profile"
    E eu envio o token JWT no header de autorização
    Então eu devo receber um status code 200
    E o perfil do usuário deve ser retornado com sucesso
    E o perfil deve conter os campos obrigatórios

  Cenário: Atualizar nome do perfil
    Quando eu faço uma requisição PUT para "/api/profile"
    E eu envio o token JWT no header de autorização
    E eu envio um JSON com o novo nome
    Então eu devo receber um status code 200
    E o perfil deve ser atualizado com o novo nome
    E o perfil deve manter os outros campos inalterados

  Cenário: Atualizar descrição do perfil
    Quando eu faço uma requisição PUT para "/api/profile"
    E eu envio o token JWT no header de autorização
    E eu envio um JSON com a nova descrição
    Então eu devo receber um status code 200
    E o perfil deve ser atualizado com a nova descrição
    E o perfil deve manter os outros campos inalterados

  Cenário: Tentar atualizar perfil sem autenticação
    Quando eu faço uma requisição PUT para "/api/profile"
    E eu não envio o token JWT no header de autorização
    Então eu devo receber um status code 401
    E uma mensagem de erro indicando que o usuário não está autenticado

  Cenário: Tentar atualizar perfil com token inválido
    Quando eu faço uma requisição PUT para "/api/profile"
    E eu envio um token JWT inválido no header de autorização
    Então eu devo receber um status code 401
    E uma mensagem de erro indicando que o token é inválido

  Cenário: Tentar atualizar perfil com dados inválidos
    Quando eu faço uma requisição PUT para "/api/profile"
    E eu envio o token JWT no header de autorização
    E eu envio um JSON com dados inválidos
    Então eu devo receber um status code 400
    E uma mensagem de erro indicando os campos inválidos 