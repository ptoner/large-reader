import { inject, injectable } from "inversify";
import { ReaderSettings } from "../dto/reader-settings";
import { ValidationException } from "../util/validation-exception";

import { ReaderSettingsRepository } from "../repository/reader-settings-repository";
import { validate, ValidationError } from 'class-validator';
import { SchemaService } from "./core/schema-service";


@injectable()
class ReaderSettingsService {

  @inject("ReaderSettingsRepository")
  private readerSettingsRepository:ReaderSettingsRepository

  @inject("SchemaService")
  private schemaService: SchemaService


  constructor() { 
  }

  async get(): Promise<ReaderSettings> {

    await this.schemaService.load(["reader-settings"])

    return this.readerSettingsRepository.get()
  }

  async put(readerSettings:ReaderSettings): Promise<void> {     

    readerSettings.lastUpdated = new Date().toJSON()


    //Validate
    let errors: ValidationError[] = await validate(readerSettings, {
        forbidUnknownValues: true,
        whitelist: true
    })

    if (errors.length > 0) {
        throw new ValidationException(errors)
    }


    await this.readerSettingsRepository.put(readerSettings)     
  }


  async updateCurrentPage(tokenId:number) {

    let readerSettings = await this.get()

    readerSettings.currentPage = tokenId
    await this.put(readerSettings)

    console.log(readerSettings)

  }
}


export { ReaderSettingsService }

