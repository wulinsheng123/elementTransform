import type { ObjectExpression } from '@babel/types'
import type { Attrs } from './type'
// @ts-ignore
import * as t from '@babel/types'
import { kill } from 'process'

export function getTag(name: string) {
  if (name.includes('el')) return `${name.slice(3, 4).toLocaleUpperCase()}${name.slice(4)}`

  return name
}

export function createObjectProprety(key: string, expression: ObjectExpression) {
  return t.objectProperty(t.stringLiteral(key), expression)
}

export function objectTransformArray(object: Record<string, any>) {
  const array: Array<Record<string, any>> = []

  for (let key of Object.keys(object)) {

    const newObject: Record<string, any> = {
      key: null,
      value: null
    }

    newObject.key = key
    newObject.value = object[key]
    array.push(newObject)
  }
  return array
}

export function astAttrsIntoObject(properties: Array<t.ObjectProperty>, attrsList: Array<Attrs>) {
  const MAPFunction = {
    StringLiteral(item, attrs) {
      attrs.value = item.value
    },
    Identifier(item, attrs) {
      attrs.value = item.name
    },
    CallExpression(item, attrs) {
      // TODO 暂时还没做函数型的参数处理 
      // attrs.value = item
    },
    ObjectExpression(item, attrs) {
      attrs.value = []
      return astAttrsIntoObject(item.properties, attrs.value)
    }
  }


  properties.forEach((item) => {
    const attrs: Attrs = {
      key: '',
      type: null,
      value: ''
    }

    attrs.key = (item.key as t.StringLiteral).value || (item.key as t.Identifier).name
    const func = MAPFunction[item.value.type]
    func(item.value, attrs)
    attrs.type = item.value.type as any

    attrsList.push(attrs)
  })
}


export function getFunctionBody(str: string) {
  return str.substring(str.indexOf('{') + 1, str.lastIndexOf('}'))
}

export function camel(string: string) {
  return string.replace(/\"([a-z]+\w)-(\w)([a-z]+)\"\s*/ig, (all, $1, $2, $3) => {
    return `${$1}${$2.toLocaleUpperCase()}${$3}`
  })
}