# language: pt
# encoding: utf-8

Funcionalidade: Autenticação de usuários
  Como um usuário do sistema
  Eu quero poder me autenticar
  Para acessar recursos protegidos

  Cenário: Registro de novo usuário com sucesso
    Dado que eu não tenho um usuário cadastrado com email "novo@exemplo.com"
    Quando eu me registro com os seguintes dados:
      | email                      | senha  | name          | whatsapp      |
      | pedro.hp.almeida@gmail.com | 123456 | Pedro Almeida | 5511987221050 |
    Então o usuário deve ser criado com sucesso
    E o status da resposta deve ser 201
    E eu devo receber um código de verificação

  Cenário: Tentativa de registro com email já existente
    Dado que eu tenho um usuário cadastrado com email "existente@exemplo.com"
    Quando eu tento me registrar com email "existente@exemplo.com"
    Então eu devo receber uma mensagem de erro informando que o email já existe
    E o status da resposta deve ser 409

  Cenário: Login com usuário não verificado
    Dado que eu tenho um usuário cadastrado com email "pedro.hp.almeida@gmail.com" e senha "123456"
    Quando eu faço login com email "pedro.hp.almeida@gmail.com" e senha "123456"
    Então eu devo receber uma mensagem de erro informando que o usuário não está verificado
    E o status da resposta deve ser 400

  Cenário: Login com credenciais inválidas
    Dado que eu tenho um usuário cadastrado com email "pedro.hp.almeida@gmail.com" e senha "123456"
    Quando eu faço login com email "pedro.hp.almeida@gmail.com" e senha "senha_errada"
    Então eu devo receber uma mensagem de erro de credenciais inválidas
    E o status da resposta deve ser 400

  Cenário: Verificação de email com código válido
    Dado que eu tenho um usuário não verificado com email "pedro.hp.almeida@gmail.com"
    E o código de verificação é "123456"
    Quando eu verifico o email com o código "123456"
    Então eu devo receber uma mensagem de erro informando que o código não foi encontrado
    E o status da resposta deve ser 400

  Cenário: Verificação de email com código inválido
    Dado que eu tenho um usuário não verificado com email "pedro.hp.almeida@gmail.com"
    E o código de verificação é "123456"
    Quando eu tento verificar o email com o código "000000"
    Então eu devo receber uma mensagem de erro de código inválido
    E o status da resposta deve ser 400 