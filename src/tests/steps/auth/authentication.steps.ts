import { Given, When, Then, Before, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { expect } from 'chai';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestModule } from '../../support/test.module';
import { UserService } from '../../../modules/auth/domain/services/user.service';
import { User } from '../../../modules/auth/domain/entities/user.entity';
import { AppModule } from '../../../app.module';

let app: INestApplication;
let userService: UserService;
let response: request.Response;
let testUser: User;

// Função auxiliar para logar requisições e respostas
async function logRequest(method: string, url: string, body?: any) {
    console.log('\n=== Request ===');
    console.log(`${method} ${url}`);
    if (body) {
        console.log('Body:', JSON.stringify(body, null, 2));
    }
}

async function logResponse(res: request.Response) {
    console.log('\n=== Response ===');
    console.log(`Status: ${res.status}`);
    console.log('Body:', JSON.stringify(res.body, null, 2));
    console.log('================\n');
}

// Hooks
BeforeAll(async function () {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
});

AfterAll(async function () {
    await app.close();
});

Before(async function () {
    // Limpar banco de dados de teste
    await userService.deleteMany({});
});

// Steps para registro
Given('que eu não tenho um usuário cadastrado com email {string}', async function (email: string) {
    // Limpar usuário se existir
    try {
        await request(app.getHttpServer())
            .delete(`/api/users/${email}`)
            .send();
    } catch (error) {
        // Ignora erro se usuário não existir
    }
});

When('eu me registro com os seguintes dados:', async function (dataTable) {
    const data = dataTable.hashes()[0];
    await logRequest('POST', '/api/auth/register', {
        email: data.email,
        password: data.senha,
        name: data.name,
        whatsapp: data.whatsapp,
    });
    response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
            email: data.email,
            password: data.senha,
            name: data.name,
            whatsapp: data.whatsapp,
        });
    await logResponse(response);
});

Then('o usuário deve ser criado com sucesso', function () {
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.have.property('name');
    expect(response.body.user).to.have.property('email');
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.include('registrado com sucesso');
});

Then('o status da resposta deve ser {int}', function (status: number) {
    expect(response.status).to.equal(status);
});

Then('eu devo receber um código de verificação', function () {
    expect(response.body.message).to.include('Verifique seu email e WhatsApp');
});

// Steps para login
Given('que eu tenho um usuário cadastrado com email {string}', async function (email: string) {
    // Criar usuário de teste
    await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
            email,
            password: '123456',
            name: 'Test User',
            whatsapp: '5511999999999',
        });
});

Given('que eu tenho um usuário cadastrado com email {string} e senha {string}', async function (email: string, password: string) {
    // Criar usuário de teste
    await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
            email,
            password,
            name: 'Test User',
            whatsapp: '5511999999999',
        });
});

When('eu faço login com email {string} e senha {string}', async function (email: string, password: string) {
    await logRequest('POST', '/api/auth/login', { email, password });
    response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
            email,
            password,
        });
    await logResponse(response);
});

Then('eu devo receber uma mensagem de erro informando que o usuário não está verificado', function () {
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Usuário não está verificado');
});

// Steps para verificação de email
Given('que eu tenho um usuário não verificado com email {string}', async function (email: string) {
    // Criar usuário não verificado
    await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
            email,
            password: '123456',
            name: 'Test User',
            whatsapp: '5511999999999',
        });
});

Given('o código de verificação é {string}', async function (code: string) {
    // Simular código de verificação no banco de dados
    const user = await userService.findByEmail('pedro.hp.almeida@gmail.com');
    if (user) {
        await userService.updateVerificationCode(user.id, code, new Date(Date.now() + 3600000));
    }
});

When('eu verifico o email com o código {string}', async function (code: string) {
    await logRequest('POST', '/api/auth/verify-code', {
        email: 'pedro.hp.almeida@gmail.com',
        code,
    });
    response = await request(app.getHttpServer())
        .post('/api/auth/verify-code')
        .send({
            email: 'pedro.hp.almeida@gmail.com',
            code,
        });
    await logResponse(response);
});

Then('eu devo receber uma mensagem de erro informando que o código não foi encontrado', function () {
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Código de ativação não encontrado');
});

// Steps para verificação de status
Then('eu devo receber uma mensagem de erro informando que o email já existe', function () {
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Email já está em uso');
});

Then('eu devo receber uma mensagem de erro de credenciais inválidas', function () {
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Usuário não está verificado');
});

Then('eu devo receber uma mensagem de erro de código inválido', function () {
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Código de ativação não encontrado');
});

// Steps adicionais
When('eu tento me registrar com email {string}', async function (email: string) {
    await logRequest('POST', '/api/auth/register', {
        email,
        password: '123456',
        name: 'Test User',
        whatsapp: '5511999999999',
    });
    response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
            email,
            password: '123456',
            name: 'Test User',
            whatsapp: '5511999999999',
        });
    await logResponse(response);
});

When('eu tento verificar o email com o código {string}', async function (code: string) {
    await logRequest('POST', '/api/auth/verify-code', {
        email: 'pedro.hp.almeida@gmail.com',
        code,
    });
    response = await request(app.getHttpServer())
        .post('/api/auth/verify-code')
        .send({
            email: 'pedro.hp.almeida@gmail.com',
            code,
        });
    await logResponse(response);
}); 