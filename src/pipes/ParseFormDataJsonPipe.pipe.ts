import { PipeTransform, BadRequestException } from "@nestjs/common";
const { deepParseJson } = require('deep-parse-json')

export class ParseFormDataJsonPipe implements PipeTransform {

  transform(value: string) {
    try {
      console.log(true);
      return JSON.parse(value)
    }catch (e) {
      throw new BadRequestException('Не удалось распарсить тело')
    }
  }
}