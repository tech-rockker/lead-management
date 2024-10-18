/* eslint-disable no-invalid-this */
import { useTranslation } from 'react-i18next'
import i18n from '../../configs/i18n'
import i18next from 'i18next'

const isDebug = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
let ddebug = function () {}

if (isDebug) {
  ddebug = console.log.bind(window.console)
}
export const log = ddebug

export const debug = (...x) => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    try {
      // Code throwing an exception
      throw new Error()
    } catch (e) {
      log(...x)
      console.log(e.stack)
    }
  } else {
    return false
  }
}

export const isValid = (val, extra = null) => {
  let r = true
  if (val === null) {
    r = false
  } else if (val === undefined) {
    r = false
  } else if (val === '') {
    r = false
  } else if (val === extra) {
    r = false
  } else if (val === 'null') {
    r = false
  }
  return r
}

export const removeDuplicates = (data = []) => {
  // Create an array of objects

  const jsonObject = data.map(JSON.stringify)

  const uniqueSet = new Set(jsonObject)
  return Array.from(uniqueSet).map(JSON.parse)
}
export const isValidArray = (val = []) => {
  if (isValid(val)) {
    if (typeof val === 'object') {
      return val?.length > 0
    }
  }
  return false
}

/**
 * Translate
 * @param {*} id
 * @param {*} values
 * @param {*} create
 * @returns
 */
export const FM = (id, values) => {
  // try {
  //     const { i18n, t } = useTranslation()
  //     if (values === null) values = {}
  //     return t(id, { ...values })
  // } catch (error) {
  if (values === null) values = {}
  return i18n.t(id, { ...values })
  // }
}

const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase())

export const getInitials = (name) => {
  if (name?.length < 2) {
    name = capitalize(`${name}${name}`)
  } else {
    name = capitalize(`${name}`)
  }

  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')

  let initials = [...name.matchAll(rgx)] || []

  initials = ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase()
  return initials
}

/**
 * Create Ability
 */
export const createAbility = (permissions = []) => {
  let abilities = [
    {
      subject: 'profile',
      action: 'profile-browse'
    },
    {
      subject: 'profile',
      action: 'profile-edit'
    }
  ]
  if (isValid(permissions)) {
    abilities = [...abilities, ...permissions]
  }
  // log(permissions, abilities)
  return abilities
}
