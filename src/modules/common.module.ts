import { Global, Module } from "@nestjs/common";
import { SendEmailService } from "../common/services";

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [SendEmailService],
    exports: [SendEmailService]
})

export class CommonModule { }