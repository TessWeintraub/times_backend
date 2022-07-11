import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as EasyYandexS3 from "easy-yandex-s3";

@Injectable()
export class FilesService {

  async uploadImage(file): Promise<string>{
    const s3 = new EasyYandexS3({
      auth: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
      Bucket: `${process.env.BUCKET}`
    })
    try {
      const upload = await s3.Upload({
        buffer: file.buffer
      },  process.env.BUCKET_DIR );
      return upload.Location
    }
    catch (e) {
      throw new HttpException('Ошибка загрузки изображения',HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
