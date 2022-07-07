import * as EasyYandexS3 from "easy-yandex-s3";

export const s3 = new EasyYandexS3({
    auth: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    Bucket: `${process.env.BUCKET}`,
    debug: true
})