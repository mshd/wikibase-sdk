// @ts-nocheck
import 'should'
import { cloneDeep, pick } from 'lodash-es'
import { simplifyEntity, simplifyEntities } from '../src/helpers/simplify_entity.js'
import { requireJson } from './lib/utils.js'

const L525 = requireJson(import.meta.url, './data/L525.json')
const P8098 = requireJson(import.meta.url, './data/P8098.json')
const Q571 = requireJson(import.meta.url, './data/Q571.json')

describe('simplify.entity', () => {
  it('should be a function', () => {
    simplifyEntity.should.be.a.Function()
  })

  it('should support items', () => {
    const Q571Clone = cloneDeep(Q571)
    const simplifiedEntity = simplifyEntity(Q571Clone)
    simplifiedEntity.type.should.equal('item')
    simplifiedEntity.labels.fr.should.equal('livre')
    simplifiedEntity.descriptions.fr.should.equal('document écrit formé de pages reliées entre elles')
    simplifiedEntity.aliases.pl.should.be.an.Array()
    simplifiedEntity.aliases.pl[0].should.equal('Tom')
    simplifiedEntity.claims.P279.should.be.an.Array()
    simplifiedEntity.claims.P279[0].should.equal('Q2342494')
    simplifiedEntity.sitelinks.afwiki.should.equal('Boek')
  })

  it('should support properties', () => {
    const P8098Clone = cloneDeep(P8098)
    const simplifiedEntity = simplifyEntity(P8098Clone)
    simplifiedEntity.type.should.equal('property')
    simplifiedEntity.datatype.should.equal('external-id')
    simplifiedEntity.labels.fr.should.equal('identifiant Biographical Dictionary of Architects in Canada')
    simplifiedEntity.descriptions.fr.should.equal("identifiant d'un architecte dans le Biographical Dictionary of Architects in Canada")
    simplifiedEntity.aliases.fr.should.be.an.Array()
    simplifiedEntity.aliases.fr[0].should.equal('identifiant BDAC')
    simplifiedEntity.claims.should.be.an.Object()
    simplifiedEntity.claims.P1630.should.be.an.Array()
    simplifiedEntity.claims.P1630[0].should.equal('http://dictionaryofarchitectsincanada.org/node/$1')
  })

  it('should support lexemes', () => {
    const L525Clone = cloneDeep(L525)
    const simplifiedEntity = simplifyEntity(L525Clone)
    simplifiedEntity.type.should.equal('lexeme')
    simplifiedEntity.lemmas.should.be.an.Object()
    simplifiedEntity.lemmas.fr.should.equal('maison')
    simplifiedEntity.claims.should.be.an.Object()
    simplifiedEntity.lexicalCategory.should.equal('Q1084')
    simplifiedEntity.language.should.equal('Q150')
    simplifiedEntity.claims.should.be.an.Object()
    simplifiedEntity.claims.P5185[0].should.equal('Q1775415')
    simplifiedEntity.forms.should.be.an.Object()
    simplifiedEntity.forms[0].claims.P443[0].should.equal('LL-Q150 (fra)-0x010C-maisons.wav')
    simplifiedEntity.senses.should.be.an.Object()
    simplifiedEntity.senses[0].glosses.fr.should.equal("édifice destiné à l'habitation")
    simplifiedEntity.senses[0].claims.P5137[0].should.equal('Q3947')
  })

  it('should pass options down to subfunctions', () => {
    const Q571Clone = cloneDeep(Q571)
    const simplifiedEntity = simplifyEntity(Q571Clone, { keepQualifiers: true, keepIds: true, addUrl: true })
    simplifiedEntity.labels.fr.should.equal('livre')
    simplifiedEntity.descriptions.fr.should.equal('document écrit formé de pages reliées entre elles')
    simplifiedEntity.aliases.pl.should.be.an.Array()
    simplifiedEntity.aliases.pl[0].should.equal('Tom')
    simplifiedEntity.claims.P279.should.be.an.Array()
    simplifiedEntity.claims.P279[0].should.be.an.Object()
    simplifiedEntity.claims.P279[0].value.should.equal('Q2342494')
    simplifiedEntity.sitelinks.afwiki.should.be.an.Object()
    simplifiedEntity.sitelinks.afwiki.title.should.equal('Boek')
    simplifiedEntity.sitelinks.afwiki.url.should.equal('https://af.wikipedia.org/wiki/Boek')
  })

  it('should accept partial entities', () => {
    const Q571Clone = cloneDeep(Q571)
    const emptyEntity = simplifyEntity({})
    Object.keys(emptyEntity).length.should.equal(3)
    const partialEntity = simplifyEntity(pick(Q571Clone, 'id', 'type', 'labels'))
    Object.keys(partialEntity).length.should.equal(4)
    partialEntity.labels.should.be.an.Object()
    partialEntity.labels.fr.should.equal('livre')
  })
})

describe('simplify.entities', () => {
  it('should accept enities objects', () => {
    const Q571Clone = cloneDeep(Q571)
    const entities = { Q571: Q571Clone }
    const simplifiedEntities = simplifyEntities(entities)
    simplifiedEntities.Q571.labels.fr.should.equal('livre')
    simplifiedEntities.Q571.descriptions.fr.should.equal('document écrit formé de pages reliées entre elles')
    simplifiedEntities.Q571.aliases.pl.should.be.an.Array()
    simplifiedEntities.Q571.aliases.pl[0].should.equal('Tom')
    simplifiedEntities.Q571.claims.P279.should.be.an.Array()
    simplifiedEntities.Q571.claims.P279[0].should.equal('Q2342494')
    simplifiedEntities.Q571.sitelinks.afwiki.should.equal('Boek')
  })
})
