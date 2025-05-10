import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProfileModule } from '../../../profile.module';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../../domain/tokens/injection.tokens';
import { AuthModule } from '../../../../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

let app: INestApplication;
let jwtService: JwtService;
let userRepository: IUserRepository;
let authToken: string;
let response: request.Response;
let connection: Connection;
let testUser: User;

Given('que eu sou um usuário autenticado', async function () {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot(),
            MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/gwan-test'),
            ProfileModule,
            AuthModule,
        ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = moduleFixture.get<Connection>(getConnectionToken());
    jwtService = moduleFixture.get<JwtService>(JwtService);
    userRepository = moduleFixture.get<IUserRepository>(USER_REPOSITORY);

    // Limpa a coleção de usuários antes de cada teste
    await connection.collection('users').deleteMany({});
});

Given('que eu tenho um token JWT válido', async function () {
    // Cria um usuário de teste
    testUser = new User();
    testUser.name = 'Test User';
    testUser.email = 'test@example.com';
    testUser.whatsapp = '11999999999';
    testUser.isEmailVerified = true;
    testUser.isActive = true;
    testUser = await userRepository.create(testUser);

    // Gera o token JWT
    authToken = jwtService.sign({
        sub: testUser.id,
        email: testUser.email,
        name: testUser.name,
    });
});

When('eu faço uma requisição GET para {string}', async function (path: string) {
    response = await request(app.getHttpServer())
        .get(path)
        .set('Authorization', `Bearer ${authToken}`);
});

When('eu faço uma requisição PUT para {string}', async function (path: string) {
    response = await request(app.getHttpServer())
        .put(path)
        .set('Authorization', `Bearer ${authToken}`);
});

When('eu envio o token JWT no header de autorização', async function () {
    // Token já está sendo enviado nas requisições acima
});

When('eu envio um JSON com o novo nome', async function () {
    response = await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' });
});

When('eu envio um JSON com a nova descrição', async function () {
    response = await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'New description' });
});

When('eu não envio o token JWT no header de autorização', async function () {
    response = await request(app.getHttpServer())
        .put('/api/profile')
        .send({ name: 'Updated Name' });
});

When('eu envio um token JWT inválido no header de autorização', async function () {
    response = await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', 'Bearer invalid-token')
        .send({ name: 'Updated Name' });
});

When('eu envio um JSON com dados inválidos', async function () {
    response = await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'A' }); // Nome muito curto
});

Then('eu devo receber um status code {int}', async function (statusCode: number) {
    expect(response.status).to.equal(statusCode);
});

Then('o perfil do usuário deve ser retornado com sucesso', async function () {
    expect(response.body).to.have.property('id');
    expect(response.body).to.have.property('name');
    expect(response.body).to.have.property('email');
    expect(response.body).to.have.property('whatsapp');
});

Then('o perfil deve conter os campos obrigatórios', async function () {
    expect(response.body.name).to.equal('Test User');
    expect(response.body.email).to.equal('test@example.com');
    expect(response.body.whatsapp).to.equal('11999999999');
});

Then('o perfil deve ser atualizado com o novo nome', async function () {
    expect(response.body.name).to.equal('Updated Name');
});

Then('o perfil deve ser atualizado com a nova descrição', async function () {
    expect(response.body.description).to.equal('New description');
});

Then('o perfil deve manter os outros campos inalterados', async function () {
    expect(response.body.email).to.equal('test@example.com');
    expect(response.body.whatsapp).to.equal('11999999999');
});

Then('uma mensagem de erro indicando que o usuário não está autenticado', async function () {
    expect(response.body.message).to.equal('Unauthorized');
});

Then('uma mensagem de erro indicando que o token é inválido', async function () {
    expect(response.body.message).to.equal('Unauthorized');
});

Then('uma mensagem de erro indicando os campos inválidos', async function () {
    expect(response.body.message).to.include('name');
}); 