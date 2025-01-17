import type { SimplifiedSparqlResults, SparqlResults } from '../types/sparql.js'

export type SimplifySparqlResultsOptions = {
  readonly minimize?: boolean
}

export function simplifySparqlResults (input: SparqlResults, options: SimplifySparqlResultsOptions = {}): SimplifiedSparqlResults {
  if (typeof input === 'string') {
    input = JSON.parse(input)
  }

  const { vars } = input.head
  const results = input.results.bindings

  if (vars.length === 1 && options.minimize === true) {
    const varName = vars[0]
    return results
      .map(result => parseValue(result[varName]))
      // filtering-out bnodes
      .filter(result => result != null)
  }

  const { richVars, associatedVars, standaloneVars } = identifyVars(vars)
  return results.map(getSimplifiedResult(richVars, associatedVars, standaloneVars))
}

type ValueObj = {
  readonly type: 'uri' | 'bnode'
  readonly datatype?: string
  readonly value: string
}

function parseValue (valueObj: ValueObj | undefined): string | number | boolean | null {
  // blank nodes will be filtered-out in order to get things simple
  if (!valueObj || valueObj.type === 'bnode') return null

  const { value } = valueObj

  if (valueObj.type === 'uri') return parseUri(value)

  const datatype = (valueObj.datatype || '').replace('http://www.w3.org/2001/XMLSchema#', '')

  if (datatype === 'decimal' || datatype === 'integer' || datatype === 'float' || datatype === 'double') {
    return parseFloat(value)
  }

  if (datatype === 'boolean') {
    return value === 'true'
  }

  // return the raw value if the datatype is missing
  return value
}

function parseUri (uri: string) {
  // ex: http://www.wikidata.org/entity/statement/
  if (uri.match(/http.*\/entity\/statement\//)) {
    return convertStatementUriToGuid(uri)
  }

  return uri
    // ex: http://www.wikidata.org/entity/
    .replace(/^https?:\/\/.*\/entity\//, '')
    // ex: http://www.wikidata.org/prop/direct/
    .replace(/^https?:\/\/.*\/prop\/direct\//, '')
}

function convertStatementUriToGuid (uri: string) {
  // ex: http://www.wikidata.org/entity/statement/
  uri = uri.replace(/^https?:\/\/.*\/entity\/statement\//, '')
  const parts = uri.split('-')
  return parts[0] + '$' + parts.slice(1).join('-')
}

const identifyVars = vars => {
  let richVars = vars.filter(varName => vars.some(isAssociatedVar(varName)))
  richVars = richVars.filter(richVar => {
    return !richVars.some(otherRichVar => {
      return richVar !== otherRichVar && richVar.startsWith(otherRichVar)
    })
  })
  const associatedVarPattern = new RegExp(`^(${richVars.join('|')})[A-Z]`)
  const associatedVars = vars.filter(varName => associatedVarPattern.test(varName))
  const standaloneVars = vars.filter(varName => {
    return !richVars.includes(varName) && !associatedVarPattern.test(varName)
  })
  return { richVars, associatedVars, standaloneVars }
}

const isAssociatedVar = varNameA => {
  const pattern = new RegExp(`^${varNameA}[A-Z]\\w+`)
  return pattern.test.bind(pattern)
}

const getSimplifiedResult = (richVars, associatedVars, standaloneVars) => result => {
  const simplifiedResult = {}
  for (const varName of richVars) {
    const richVarData: any = {}
    const value = parseValue(result[varName])
    if (value != null) richVarData.value = value
    for (const associatedVarName of associatedVars) {
      if (associatedVarName.startsWith(varName)) addAssociatedValue(result, varName, associatedVarName, richVarData)
    }
    if (Object.keys(richVarData).length > 0) simplifiedResult[varName] = richVarData
  }
  for (const varName of standaloneVars) {
    simplifiedResult[varName] = parseValue(result[varName])
  }
  return simplifiedResult
}

const addAssociatedValue = (result, varName, associatedVarName, richVarData) => {
  // ex: propertyType => Type
  let shortAssociatedVarName = associatedVarName.split(varName)[1]
  // ex: Type => type
  shortAssociatedVarName = shortAssociatedVarName[0].toLowerCase() + shortAssociatedVarName.slice(1)
  // ex: altLabel => aliases
  shortAssociatedVarName = specialNames[shortAssociatedVarName] || shortAssociatedVarName
  const associatedVarData = result[associatedVarName]
  if (associatedVarData != null) richVarData[shortAssociatedVarName] = associatedVarData.value
}

const specialNames = {
  altLabel: 'aliases',
}
