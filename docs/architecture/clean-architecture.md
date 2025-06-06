# Clean Architecture

O GWAN BFF segue os princípios da Clean Architecture para garantir um código limpo, testável e manutenível.

## 🏗️ Camadas da Arquitetura

### 1. Domain Layer
Localização: `src/core/domain/`

Esta é a camada mais interna e contém as regras de negócio fundamentais.

#### Componentes:
- **Entities**: Objetos de negócio com regras e comportamentos
  ```typescript
  // Exemplo: User Entity
  export class User {
    private readonly id: string;
    private readonly email: Email;
    private readonly password: Password;
    
    constructor(props: UserProps) {
      this.id = props.id;
      this.email = Email.create(props.email);
      this.password = Password.create(props.password);
    }
    
    // Métodos de domínio
    public async verifyPassword(password: string): Promise<boolean> {
      return this.password.compare(password);
    }
  }
  ```

- **Value Objects**: Objetos imutáveis que representam conceitos do domínio
  ```typescript
  // Exemplo: Email Value Object
  export class Email {
    private readonly value: string;
    
    private constructor(email: string) {
      this.value = email;
    }
    
    public static create(email: string): Email {
      if (!this.isValid(email)) {
        throw new InvalidEmailError();
      }
      return new Email(email);
    }
    
    private static isValid(email: string): boolean {
      // Lógica de validação
    }
  }
  ```

- **Domain Services**: Serviços que implementam regras de negócio complexas
  ```typescript
  // Exemplo: Notification Service
  export interface INotificationService {
    sendVerificationCode(user: User): Promise<void>;
    sendPasswordReset(user: User): Promise<void>;
  }
  ```

### 2. Application Layer
Localização: `src/core/application/`

Esta camada orquestra o fluxo de dados e implementa os casos de uso.

#### Componentes:
- **Use Cases**: Implementações dos casos de uso da aplicação
  ```typescript
  // Exemplo: Register Use Case
  @Injectable()
  export class RegisterUseCase {
    constructor(
      private readonly userRepository: IUserRepository,
      private readonly notificationService: INotificationService,
    ) {}
    
    async execute(data: RegisterDto): Promise<User> {
      const email = Email.create(data.email);
      const password = Password.create(data.password);
      
      const user = await this.userRepository.create({
        email: email.getValue(),
        password: password.getValue(),
      });
      
      await this.notificationService.sendVerificationCode(user);
      return user;
    }
  }
  ```

- **DTOs**: Objetos de transferência de dados
  ```typescript
  // Exemplo: Register DTO
  export class RegisterDto {
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8)
    password: string;
  }
  ```

### 3. Infrastructure Layer
Localização: `src/core/infrastructure/`

Esta camada implementa as interfaces definidas nas camadas internas.

#### Componentes:
- **Repositories**: Implementações concretas dos repositórios
  ```typescript
  // Exemplo: MongoDB User Repository
  @Injectable()
  export class MongoUserRepository implements IUserRepository {
    constructor(
      @InjectModel(User.name)
      private readonly userModel: Model<UserDocument>,
    ) {}
    
    async create(data: CreateUserDto): Promise<User> {
      const user = await this.userModel.create(data);
      return this.toDomain(user);
    }
  }
  ```

- **External Services**: Implementações de serviços externos
  ```typescript
  // Exemplo: SMTP Notification Service
  @Injectable()
  export class SmtpNotificationService implements INotificationService {
    constructor(
      private readonly mailerService: MailerService,
    ) {}
    
    async sendVerificationCode(user: User): Promise<void> {
      await this.mailerService.sendMail({
        to: user.email.getValue(),
        subject: 'Verificação de Email',
        template: 'verification',
        context: { code: user.verificationCode },
      });
    }
  }
  ```

### 4. Presentation Layer
Localização: `src/modules/*/presentation/`

Esta camada lida com a interface do usuário (API REST).

#### Componentes:
- **Controllers**: Endpoints da API
  ```typescript
  // Exemplo: Auth Controller
  @Controller('auth')
  export class AuthController {
    constructor(
      private readonly registerUseCase: RegisterUseCase,
    ) {}
    
    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<User> {
      return this.registerUseCase.execute(dto);
    }
  }
  ```

## 🔄 Fluxo de Dados

1. **Request HTTP** → Controller
2. **Controller** → Use Case
3. **Use Case** → Domain Services/Entities
4. **Use Case** → Repository
5. **Repository** → Database
6. **Response** → Controller → Client

## 📦 Módulos

Cada módulo segue a estrutura da Clean Architecture:

```
modules/{module-name}/
├── domain/          # Entidades e regras específicas
├── application/     # Casos de uso do módulo
├── infrastructure/  # Implementações específicas
└── presentation/    # Controllers e DTOs
```

## 🎯 Benefícios

1. **Independência de Frameworks**
   - O código de negócio não depende de frameworks
   - Fácil troca de tecnologias

2. **Testabilidade**
   - Cada camada pode ser testada isoladamente
   - Fácil mock de dependências

3. **Independência de UI**
   - A lógica de negócio não conhece a UI
   - Fácil adicionar novas interfaces

4. **Independência de Banco de Dados**
   - A lógica de negócio não conhece o banco
   - Fácil trocar o banco de dados

5. **Independência de Agentes Externos**
   - A lógica de negócio não conhece o mundo exterior
   - Fácil trocar serviços externos

## 📚 Próximos Passos

- [Estrutura do Projeto](project-structure.md)
- [Guia de Desenvolvimento](../development/guide.md)
- [Padrões de Código](../development/code-standards.md) 