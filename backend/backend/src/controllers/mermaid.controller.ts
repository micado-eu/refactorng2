// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { Step, StepDocument } from '../models';
import { StepRepository } from '../repositories';
import { StepLinkRepository } from '../repositories';
import { DocumentTypeTranslationRepository } from '../repositories';
import { DocumentTypeRepository } from '../repositories';



export class MermaidController {
  constructor(
    @repository(StepRepository)
    public stepRepository: StepRepository,
    @repository(StepLinkRepository) protected stepLinkRepository: StepLinkRepository,
    @repository(DocumentTypeTranslationRepository) protected documentTypeTranslationRepository: DocumentTypeTranslationRepository,
    @repository(DocumentTypeRepository) protected documentTypeRepository: DocumentTypeRepository,
  ) { }


  @get('/mermaid', {
    responses: {
      '200': {
        description: 'Array of Step model instances',
        content: {
          'application/json': {
            schema: { type: 'string' },
          },
        },
      },
    },
  })
  async mermaid (
    @param.query.number('processid') processid = 0,
    @param.query.string('lang') lang = 'en',
    @param.query.string('defaultlang') defaultlang = 'en'
  ): Promise<any> {
    let mermaidRet = JSON.parse("[]")
    let steps = await this.stepRepository.find({
      where: {
        idProcess: { eq: processid },
      },

      include: [
        {
          relation: "translations_prod"
        },
        {
          relation: "documents"
        }
      ]
    });

    let steplinks = await this.stepLinkRepository.find({
      where: {
        idProcess: { eq: processid },
      },

      include: [
        {
          relation: "translations_prod"
        }
      ]
    });
    //let defaultlang = 'en'
    const start = async () => {
      await this.asyncForEach(steps, async (astep: any) => {
        console.log("nel primo asynforeach")
        console.log(astep)
        let curTransl = astep.translations_prod.filter(function (atransl: any) { return atransl.lang == lang }, lang)[0]
        console.log("I AM CURTRANSLA AFTER RESEARCH")
        console.log(curTransl)
        if(!curTransl){
          console.log("inside if")
          console.log(" INSIDE IF USING BASE LANGUAG--------------------------------")
          curTransl = astep.translations_prod.filter(function (atransl: any) { return atransl.lang == defaultlang }, defaultlang)[0]
        }
        let docarray = JSON.parse("[]")

        if (astep.documents != null) {
          console.log("there are documents in the step")

          const parti = async () => {
            await this.asyncForEach(astep.documents, async (adoc: any) => {
              console.log("nel secondo asynforeach")
              console.log(adoc)
              let docs = await this.documentTypeRepository.dataSource.execute(
                "select * from document_type t inner join document_type_translation_prod tt on t.id=tt.id and tt.lang=$1 and t.id=$2 union select * from document_type t inner join document_type_translation_prod tt on t.id = tt.id and tt.lang = $3 and t.id=$2 and t.id not in (select t.id from document_type t inner join document_type_translation_prod tt on t.id = tt.id and tt.lang = $1)",
                [lang, adoc.idDocument, defaultlang]
              )
              /*
              let docs = await this.documentTypeTranslationRepository.find({
                where: {
                  id: { eq: adoc.idDocument },
                  lang: { eq: lang }
                }
              })
              */
              console.log(docs)
              //     docarray.push(docs[0].document)
              docarray.push({
                id: adoc.idDocument,
                type: docs[0].document,
                text: docs[0].document,
                emitter: docs[0].issuer,
                price: adoc.cost,
                image: docs[0].icon,
                model:docs[0].model
              })
            })
            console.log('Dopo il secondo asyncforeach');

          }
          await parti()

        } else {
          console.log("there are NO documents in the step")
        }

        let my_nexts = steplinks.filter(alink => {
          return alink.fromStep == astep.id
        })
        console.log("NEXT")
        var next :any = []
        var transl = null
        console.log(my_nexts)
        if(my_nexts.length > 0){
          next = my_nexts.map(function (o) { return o.toStep })
          console.log(" INSIDE IF AFTER SETTING THE NEXT------------------------")
           var temp_transl = my_nexts[0].translations_prod.filter((tran)=>{
            return tran.lang == lang
          })
          if(temp_transl.length >0){
            transl = temp_transl[0].description
          }
          else{
            transl = my_nexts[0].translations_prod.filter((tran)=>{
              return tran.lang == defaultlang
            })[0].description
          }
        }
        console.log(my_nexts)
       
        console.log(curTransl)
        let node_element = {
          id: astep.id,
          text: '"' + curTransl.step + '"',
          description: curTransl.description,
          link: ((transl != null && transl.length >0) ? "--" + transl + "---" : "---" ),
          editable: true,
          next: next,
          data: {
            location: astep.location,
            cost: astep.cost,
            url:astep.link,
            longitude: astep.locationLon,
            latitude: astep.locationLat,
            documents: docarray
          }

        }
        mermaidRet.push(node_element)
      });
      console.log('Dopo il primo asyncforeach');
    }


    await start();

    /*
        steplinks.forEach(asteplink => {
          console.log(asteplink)
          let curTransl = asteplink.translations.filter(function (atransl) { return atransl.lang == lang }, lang)[0]
          console.log(curTransl)
          let element = {
            group: "edges", data: {
              id: asteplink.id,
              source: asteplink.fromStep,
              target: asteplink.toStep,
              description: curTransl.description
            }
          }
          mermaidRet.elements.push(element)
        });
    */
    console.log(mermaidRet)

    return mermaidRet
  }
  @get('/mermaid_pa', {
    responses: {
      '200': {
        description: 'Array of Step model instances',
        content: {
          'application/json': {
            schema: { type: 'string' },
          },
        },
      },
    },
  })
  async mermaid_pa (
    @param.query.number('processid') processid = 0,
    @param.query.string('lang') lang = 'en'
  ): Promise<any> {
    const lod = require('lodash'); 

    let mermaidRet = JSON.parse("[]")
    let steps = await this.stepRepository.find({
      where: {
        idProcess: { eq: processid },
      },

      include: [
        {
          relation: "translations"
        },
        {
          relation: "documents"
        }
      ]
    });

    let steplinks = await this.stepLinkRepository.find({
      where: {
        idProcess: { eq: processid },
      },

      include: [
        {
          relation: "translations"
        }
      ]
    });
    let defaultlang = 'en'
    const start = async () => {
      await this.asyncForEach(steps, async (astep: any) => {
        console.log("nel primo asynforeach")
        console.log(astep)
        let curTransl = astep.translations.filter(function (atransl: any) { return atransl.lang == lang }, lang)[0]
        console.log("I AM CURTRANSLA AFTER RESEARCH")
        console.log(curTransl)
        if(!curTransl){
          console.log("inside if")
          curTransl = astep.translations.filter(function (atransl: any) { return atransl.lang == defaultlang }, defaultlang)[0]
        }
        let docarray = JSON.parse("[]")

        if (astep.documents != null) {
          console.log("there are documents in the step")

          const parti = async () => {
            await this.asyncForEach(astep.documents, async (adoc: any) => {
              console.log("nel secondo asynforeach")
              console.log(adoc)
              let docs = await this.documentTypeRepository.dataSource.execute(
                "select * from document_type t inner join document_type_translation_prod tt on t.id=tt.id and tt.lang=$1 and t.id=$2 union select * from document_type t inner join document_type_translation_prod tt on t.id = tt.id and tt.lang = $3 and t.id=$2 and t.id not in (select t.id from document_type t inner join document_type_translation_prod tt on t.id = tt.id and tt.lang = $1)",
                [lang, adoc.idDocument, defaultlang]
              )
              /*
              let docs = await this.documentTypeTranslationRepository.find({
                where: {
                  id: { eq: adoc.idDocument },
                  lang: { eq: lang }
                }
              })
              */
              console.log(docs)
              //     docarray.push(docs[0].document)
              docarray.push({
                id: adoc.idDocument,
                type: docs[0].document,
                text: docs[0].document,
                emitter: docs[0].issuer,
                price: adoc.cost,
                image: docs[0].icon,
                model:docs[0].model
              })
            })
            console.log('Dopo il secondo asyncforeach');

          }
          await parti()

        } else {
          console.log("there are NO documents in the step")
        }

        let my_nexts = steplinks.filter(alink => {
          return alink.fromStep == astep.id
        })
        console.log("NEXT")
        var next :any = []
        var transl = null
        if(my_nexts.length > 0){
          next = my_nexts.map(function (o) { return o.toStep })
          transl = my_nexts[0].translations.filter((tran)=>{
            return tran.lang == lang
          })[0].description
        }
        console.log(my_nexts)

        console.log(curTransl)
        let node_element = {
          id: astep.id,
          text: '"' + curTransl.step + '"',
          description: curTransl.description,
          link: ((transl != null && transl.length >0) ? "--" + transl + "---" : "---" ),
          editable: true,
          next: next,
          data: {
            location: astep.location,
            cost: astep.cost,
            url:astep.link,
            longitude: astep.locationLon,
            latitude: astep.locationLat,
            documents: docarray
          }

        }
        mermaidRet.push(node_element)
      });
      console.log('Dopo il primo asyncforeach');
    }


    await start();

    /*
        steplinks.forEach(asteplink => {
          console.log(asteplink)
          let curTransl = asteplink.translations.filter(function (atransl) { return atransl.lang == lang }, lang)[0]
          console.log(curTransl)
          let element = {
            group: "edges", data: {
              id: asteplink.id,
              source: asteplink.fromStep,
              target: asteplink.toStep,
              description: curTransl.description
            }
          }
          mermaidRet.elements.push(element)
        });
    */
    console.log(mermaidRet)

    return mermaidRet
  }




  async asyncForEach (array: any, callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

}
