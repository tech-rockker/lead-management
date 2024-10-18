// ** I18n Imports
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import httpConfig from '../../utility/http/httpConfig'
// const json = require('../../assets/data/locales/en.json')

const defaultLangID = '1'

i18n

  // Enables the i18next backend
  .use(HttpApi)

  // Enable automatic language detection
  .use(LanguageDetector)

  // Enables the hook initialization module
  .use(initReactI18next)
  .init({
    lng: defaultLangID,
    saveMissing: false,
    backend: {
      /* translation file path */
      // loadPath: '/assets/data/locales/{{lng}}.json',
      loadPath: `${httpConfig.baseUrl}get-label-by-language-id/{{lng}}`,
      // addPath: `${httpConfig.baseUrl}administration/label`,
      // parsePayload: (namespace, key, fallbackValue) => {
      //     return {
      //         entry_mode: "web-auto-save",
      //         language_id: 1,
      //         label_name: key,
      //         label_value: isValid(json[key]) ? json[key] : capitalize(String(fallbackValue).replaceAll("-", " "))
      //     }
      // },
      customHeaders: {
        authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
      }
      // request: (options, url, payload, callback) => {
      //     // callback()
      //     log(options)
      // }
    },
    fallbackLng: 'en',
    debug: false,
    keySeparator: false,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  })

export default i18n
