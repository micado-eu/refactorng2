import { Entity, model, property } from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: { schema: 'micadoapp', table: 'step_translation' }
  }
})
export class StepTranslation extends Entity {
  @property({
    type: 'string',
    required: true,
    id: true,
    //   postgresql: { columnName: 'id', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO' },
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    length: 10,
    postgresql: { columnName: 'lang', dataType: 'character varying', dataLength: 10, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  lang?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: { columnName: 'step', dataType: 'character varying', dataLength: 250, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  step?: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'description', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  description?: string;

  @property({
    type: 'date',
    jsonSchema: { nullable: true },
    postgresql: { columnName: 'translation_date', dataType: 'timestamp without time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  translationDate?: string;

  @property({
    type: 'number',
    scale: 0,
    postgresql: {columnName: 'translationState', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  translationState: number;

  @property({
    type: 'boolean',
    postgresql: {columnName: 'translated', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  translated?: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [prop: string]: any;

  constructor(data?: Partial<StepTranslation>) {
    super(data);
  }
}

export interface StepTranslationRelations {
  // describe navigational properties here
}

export type StepTranslationWithRelations = StepTranslation & StepTranslationRelations;
