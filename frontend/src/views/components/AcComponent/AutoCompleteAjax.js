import { useState, useEffect } from 'react'

import { loadParagraph } from '../../../utility/apis/paragraph'
import AC from '../ac'

const AutoCompleteAjax = () => {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  const loadPara = () => {
    loadParagraph({
      perPage: 100,
      success: (e) => setSuggestions(e?.payload?.data),
      loading: setLoading
    })
  }

  useEffect(() => {
    loadPara()
  }, [])

  return suggestions.length ? (
    <AC
      suggestions={suggestions}
      className='form-control'
      filterKey='paragraph'
      suggestionLimit={5}
      placeholder='Type anything'
    />
  ) : null
}
export default AutoCompleteAjax
