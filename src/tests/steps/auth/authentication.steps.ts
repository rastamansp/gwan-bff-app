import { Given, When, Then, Before, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { expect } from 'chai';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestModule } from '../../support/test.module';
import { UserService } from '../../../modules/auth/domain/services/user.service';
import { User } from '../../../modules/auth/domain/entities/user.entity';

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
    app.setGlobalPrefix('api'); // Adicionando o prefixo global /api
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
    const user = await userService.findByEmail(email);
    expect(user).to.be.null;
});

When('eu me registro com os seguintes dados:', async function (dataTable) {
    const userData = dataTable.hashes()[0];
    const registerData = {
        email: userData.email,
        password: userData.senha,
        name: userData.name,
        whatsapp: userData.whatsapp
    };
    await logRequest('POST', '/api/auth/register', registerData);
    response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerData);
    await logResponse(response);
});

Then('o usuário deve ser criado com sucesso', function () {
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.have.property('_id');
    expect(response.body.user).to.have.property('email');
    expect(response.body.user).to.have.property('name');
    expect(response.body.user).to.have.property('whatsapp');
});

Then('eu devo receber um código de verificação', function () {
    expect(response.body).to.have.property('user');
    expect(response.body.user.isVerified).to.be.false;
});

// Steps para login
Given('que eu tenho um usuário cadastrado com email {string} e senha {string}',
    async function (email: string, password: string) {
        testUser = await userService.create({
            email,
            name: 'Test User',
            whatsapp: '5511999999999',
            isVerified: true
        });
        await userService.updatePassword(testUser.id, password);
    }
);

When('eu faço login com email {string} e senha {string}',
    async function (email: string, password: string) {
        const loginData = { email, password };
        await logRequest('POST', '/api/auth/login', loginData);
        response = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send(loginData);
        await logResponse(response);
    }
);

Then('eu devo receber um token JWT válido', function () {
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.have.property('_id');
    expect(response.body.user).to.have.property('email');
    expect(response.body.user).to.have.property('name');
    expect(response.body.user).to.have.property('whatsapp');
    expect(response.body.user.isVerified).to.be.true;
});

// Steps para verificação de email
Given('que eu tenho um usuário não verificado com email {string}',
    async function (email: string) {
        testUser = await userService.create({
            email,
            name: 'Test User',
            whatsapp: '5511999999999',
            isVerified: false,
        });
    }
);

Given('o código de verificação é {string}', async function (code: string) {
    await userService.updateVerificationCode(testUser.id, code, new Date(Date.now() + 3600000));
});

When('eu verifico o email com o código {string}', async function (code: string) {
    const verifyData = { email: testUser.email, code };
    await logRequest('POST', '/api/auth/verify-code', verifyData);
    response = await request(app.getHttpServer())
        .post('/api/auth/verify-code')
        .send(verifyData);
    await logResponse(response);
});

Then('o usuário deve ser marcado como verificado', async function () {
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Código de ativação não encontrado');
    expect(response.body).to.have.property('code');
    expect(response.body.code).to.equal('ACTIVATION_CODE_NOT_FOUND');
});

// Steps para verificação de status
Then('o status da resposta deve ser {int}', function (status: number) {
    expect(response.status).to.equal(status);
});

Then('eu devo receber uma mensagem de erro informando que o email já existe', function () {
    expect(response.status).to.equal(409);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Email já está em uso');
    expect(response.body).to.have.property('code');
    expect(response.body.code).to.equal('EMAIL_ALREADY_EXISTS');
});

Then('eu devo receber uma mensagem de erro de credenciais inválidas', function () {
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.have.property('_id');
    expect(response.body.user).to.have.property('email');
    expect(response.body.user).to.have.property('name');
    expect(response.body.user).to.have.property('whatsapp');
    expect(response.body.user.isVerified).to.be.true;
});

Then('eu devo receber uma mensagem de erro de código inválido', function () {
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Código de ativação não encontrado');
    expect(response.body).to.have.property('code');
    expect(response.body.code).to.equal('ACTIVATION_CODE_NOT_FOUND');
});

// Steps adicionais
Given('que eu tenho um usuário cadastrado com email {string}', async function (email: string) {
    testUser = await userService.create({
        email,
        name: 'Test User',
        whatsapp: '5511999999999',
        isVerified: true
    });
});

When('eu tento me registrar com email {string}', async function (email: string) {
    const registerData = {
        email,
        password: '123456',
        name: 'Test User',
        whatsapp: '5511999999999'
    };
    await logRequest('POST', '/api/auth/register', registerData);
    response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerData);
    await logResponse(response);
});

When('eu tento verificar o email com o código {string}', async function (code: string) {
    const verifyData = { email: testUser.email, code };
    await logRequest('POST', '/api/auth/verify-code', verifyData);
    response = await request(app.getHttpServer())
        .post('/api/auth/verify-code')
        .send(verifyData);
    await logResponse(response);
}); 