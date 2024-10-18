import { parse } from 'query-string'

const useQueryParams = () => {
  return parse(window.location.search)
}

export default useQueryParams
