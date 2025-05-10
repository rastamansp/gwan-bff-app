# language: pt
# encoding: utf-8

Funcionalidade: Gerenciamento de Usuários
  Como um administrador do sistema
  Eu quero gerenciar usuários
  Para que eu possa manter o cadastro de usuários atualizado

  Contexto:
    Dado que existe um usuário cadastrado com email "test@example.com" e nome "Test User"

  Cenário: Listar todos os usuários
    Quando eu solicitar a listagem de usuários
    Então devo receber uma lista contendo o usuário cadastrado

  Cenário: Buscar usuário por ID
    Quando eu solicitar o usuário com ID "<id>"
    Então devo receber os dados do usuário cadastrado

  Cenário: Buscar usuário por ID inexistente
    Quando eu solicitar o usuário com ID "id-inexistente"
    Então devo receber um erro informando que o usuário não foi encontrado

  Cenário: Atualizar nome do usuário
    Quando eu solicitar a atualização do nome do usuário com ID "<id>" para "Novo Nome"
    Então devo receber os dados do usuário com o nome atualizado

  Cenário: Atualizar usuário inexistente
    Quando eu solicitar a atualização do usuário com ID "id-inexistente"
    Então devo receber um erro informando que o usuário não foi encontrado 