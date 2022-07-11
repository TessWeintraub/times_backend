import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

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
    await app.enableCors();
    await app.listen(PORT, ()=> console.log(`Server started on port = ${PORT}`))
}

start()