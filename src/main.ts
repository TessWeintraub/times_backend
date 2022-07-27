import {NestFactory} from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from 'cookie-parser';
import {AppModule} from "./app.module";

async function start(){
    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule)

    const config = new DocumentBuilder()
      .setTitle('API Justice Times')
      .setDescription('Документация REST API')
      .setVersion('1.0.0')
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)

    await app.enableCors({
        credentials: true,
        origin: 'http://justicetimes.com:3000'
    });

    await app.use(cookieParser());
    await app.listen(PORT, ()=> console.log(`Server started on port = ${PORT}`))
}
start()