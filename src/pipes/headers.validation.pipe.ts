import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { HeadersDto, headersSchema } from '../utils'; // Adjust the path as necessary
import { z } from 'zod';

export const HeadersValidation = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): HeadersDto => {
        const request = ctx.switchToHttp().getRequest();
        const headers = request.headers;
        console.log("headers:", headers)
        try {
            const parsedValue = headersSchema.parse(headers);
            console.log("parsedValue:", parsedValue)
            return parsedValue
        } catch (error) {
            console.log("error:", error.errors)
            // if (error instanceof z.ZodError) {
            throw new BadRequestException('om el error',error.errors);
            // }
            // throw error
        }
    },
);
