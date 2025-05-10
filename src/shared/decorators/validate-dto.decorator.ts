import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const ValidateDto = (dto: any) => {
    return createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const dtoInstance = plainToClass(dto, request.body);

        const errors = await validate(dtoInstance);
        if (errors.length > 0) {
            const messages = errors.map(error => {
                return {
                    property: error.property,
                    constraints: error.constraints,
                };
            });

            throw new BadRequestException({
                message: 'Validation failed',
                errors: messages,
            });
        }

        return dtoInstance;
    })();
}; 