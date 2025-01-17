import { simplify } from './simplify.js'
import type { Entities, Entity, SimplifiedEntity } from '../types/entity.js'
import type { SimplifyEntityOptions } from '../types/options.js'

export const simplifyEntity = (entity: Entity, options: SimplifyEntityOptions = {}): SimplifiedEntity => {
  const { type } = entity
  const simplified: any = {
    id: entity.id,
    type,
    modified: entity.modified,
  }

  if (type === 'item') {
    simplifyIfDefined(entity, simplified, 'labels')
    simplifyIfDefined(entity, simplified, 'descriptions')
    simplifyIfDefined(entity, simplified, 'aliases')
    simplifyIfDefined(entity, simplified, 'claims', options)
    simplifyIfDefined(entity, simplified, 'sitelinks', options)
  } else if (type === 'property') {
    simplified.datatype = entity.datatype
    simplifyIfDefined(entity, simplified, 'labels')
    simplifyIfDefined(entity, simplified, 'descriptions')
    simplifyIfDefined(entity, simplified, 'aliases')
    simplifyIfDefined(entity, simplified, 'claims', options)
  } else if (type === 'lexeme') {
    simplifyIfDefined(entity, simplified, 'lemmas')
    simplified.lexicalCategory = entity.lexicalCategory
    simplified.language = entity.language
    simplifyIfDefined(entity, simplified, 'claims', options)
    simplifyIfDefined(entity, simplified, 'forms', options)
    simplifyIfDefined(entity, simplified, 'senses', options)
  }

  return simplified
}

const simplifyIfDefined = (entity, simplified, attribute, options?) => {
  if (entity[attribute] != null) {
    simplified[attribute] = simplify[attribute](entity[attribute], options)
  }
}

export const simplifyEntities = (entities: Entities, options: SimplifyEntityOptions = {}) => {
  // @ts-ignore
  if (entities.entities) entities = entities.entities
  const { entityPrefix } = options
  return Object.keys(entities).reduce((obj, key) => {
    const entity = entities[key]
    if (entityPrefix) key = `${entityPrefix}:${key}`
    obj[key] = simplifyEntity(entity, options)
    return obj
  }, {})
}

// Set those here instead of in ./simplify to avoid a circular dependency
// @ts-ignore
simplify.entity = simplifyEntity
// @ts-ignore
simplify.entities = simplifyEntities
