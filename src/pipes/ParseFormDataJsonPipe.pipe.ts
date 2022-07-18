import { PipeTransform, BadRequestException } from "@nestjs/common";
const { deepParseJson } = require('deep-parse-json')

export class ParseFormDataJsonPipe implements PipeTransform {

  transform(value: string) {
    try {
      return JSON.parse(value)
    }catch (e) {
      throw new BadRequestException('Не удалось распарсить тело')
    }
  }
}