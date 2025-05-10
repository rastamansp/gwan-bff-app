import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { Test } from '@nestjs/testing';
import { GetUserUseCase } from '../get-user.use-case';
import { UpdateUserUseCase } from '../update-user.use-case';
import { ListUsersUseCase } from '../list-users.use-case';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserNotFoundError } from '../../../domain/errors/user-not-found.error';

let userRepository: IUserRepository;
let getUserUseCase: GetUserUseCase;
let updateUserUseCase: UpdateUserUseCase;
let listUsersUseCase: ListUsersUseCase;
let testUser: User;
let result: any;
let error: Error;

class MockUserRepository implements IUserRepository {
    private users: Map<string, User> = new Map();

    async findById(id: string): Promise<User | null> {
        return this.users.get(id) || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return Array.from(this.users.values()).find(user => user.email === email) || null;
    }

    async create(user: User): Promise<User> {
        this.users.set(user.id, user);
        return user;
    }

    async update(user: User): Promise<User> {
        if (!this.users.has(user.id)) {
            return null;
        }
        this.users.set(user.id, user);
        return user;
    }

    async delete(id: string): Promise<void> {
        this.users.delete(id);
    }

    async list(): Promise<User[]> {
        return Array.from(this.users.values());
    }
}

Given('que existe um usuário cadastrado com email {string} e nome {string}', async function (email: string, name: string) {
    const moduleRef = await Test.createTestingModule({
        providers: [
            GetUserUseCase,
            UpdateUserUseCase,
            ListUsersUseCase,
            {
                provide: 'IUserRepository',
                useClass: MockUserRepository,
            },
        ],
    }).compile();

    userRepository = moduleRef.get('IUserRepository');
    getUserUseCase = moduleRef.get(GetUserUseCase);
    updateUserUseCase = moduleRef.get(UpdateUserUseCase);
    listUsersUseCase = moduleRef.get(ListUsersUseCase);

    testUser = User.create(
        'test-id',
        name,
        email,
        true,
    );
    await userRepository.create(testUser);
});

When('eu solicitar a listagem de usuários', async function () {
    result = await listUsersUseCase.execute();
});

Then('devo receber uma lista contendo o usuário cadastrado', function () {
    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(1);
    expect(result[0].email).to.equal(testUser.email);
    expect(result[0].name).to.equal(testUser.name);
});

When('eu solicitar o usuário com ID {string}', async function (id: string) {
    try {
        result = await getUserUseCase.execute(id);
    } catch (err) {
        error = err;
    }
});

Then('devo receber os dados do usuário cadastrado', function () {
    expect(result).to.be.instanceOf(User);
    expect(result.email).to.equal(testUser.email);
    expect(result.name).to.equal(testUser.name);
});

Then('devo receber um erro informando que o usuário não foi encontrado', function () {
    expect(error).to.be.instanceOf(UserNotFoundError);
});

When('eu solicitar a atualização do nome do usuário com ID {string} para {string}', async function (id: string, newName: string) {
    try {
        result = await updateUserUseCase.execute({
            id,
            name: newName,
        });
    } catch (err) {
        error = err;
    }
});

Then('devo receber os dados do usuário com o nome atualizado', function () {
    expect(result).to.be.instanceOf(User);
    expect(result.name).to.equal('Novo Nome');
    expect(result.email).to.equal(testUser.email);
}); 