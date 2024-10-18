import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, CardBody, Row } from 'reactstrap'
import { useRedux } from '../../../redux/useRedux'
import { loadWord, loadWordAll } from '../../../utility/apis/redWord'
import Filter from '../../../utility/helpers/BadWord'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import BsTooltip from '../tooltip'
let timer
const waitTime = 1500
const filter = new Filter()

const BadWordsFilter = ({ target = null, text = '', setValue = () => {} }) => {
  const dispatch = useDispatch()
  const {
    reduxStates: {
      redWord: { words }
    }
  } = useRedux()
  const [loading, setLoading] = useState(false)
  const [filtered, setFiltered] = useState(null)
  const [added, setAdded] = useState(false)
  const [typing, setTyping] = useState(true)
  const [total, setTotal] = useState(0)

  // Loading RedWords
  const redWords = () => {
    if (!isValidArray(words)) {
      loadWordAll({
        dispatch,
        loading: setLoading
      })
    }
  }

  useEffect(() => {
    redWords()
  }, [])

  const handleScrollArea = (e) => {
    // log("e", e)
    const backdrop = document.getElementById(`xx-backdrop-${target}`)
    const highlight = document.getElementById(`xx-highlight-${target}`)
    const textarea = document.getElementById(target)
    const textScrollTop = textarea.scrollTop
    const textScrollLeft = textarea.scrollLeft
    const length = textarea.scrollHeight
    const height = `${textarea.clientHeight + 1}`
    const width = `${textarea.clientWidth + 1}`
    if (textScrollTop > 0) {
      backdrop.scrollTop = textScrollTop
      backdrop.scrollLeft = textScrollLeft
      highlight.scrollLeft = textScrollLeft
      highlight.scrollTop = textScrollTop
    }
    // backdrop.setAttribute("style", `width:${width}px; height:${height}px`)
    highlight.setAttribute('style', `width: 100%; height:${length}px`)
  }

  useEffect(() => {
    if (target) {
      const textarea = document.getElementById(target)
      textarea.addEventListener('scroll', handleScrollArea)

      const backdrop = document.getElementById(`xx-backdrop-${target}`)
      const highlight = document.getElementById(`xx-highlight-${target}`)

      const resize_ob = new ResizeObserver(function (entries) {
        // since we are observing only a single element, so we access the first element in entries array
        const rect = entries[0].borderBoxSize[0]
        // log(entries[0])
        // current width & height
        const width = rect.inlineSize
        const height = rect.blockSize

        // console.log(`Current Width : ${width}`)
        // console.log(`Current Height : ${height}`)

        backdrop.setAttribute('style', `width:${width}px; height:${height}px`)
      })

      // start observing for resize
      resize_ob.observe(textarea)
    }
  }, [target, text, typing, words])

  // Creating Method for RedWords
  const blockWords = () => {
    if (isValidArray(words)) {
      filter.addWords(...words)
      log(words?.length)
      // setAdded(true)
    }
  }

  const checkWords = () => {
    if (isValid(text)) {
      const a = filter.clean(text ?? 'test hello')
      const count = filter.getWrongCount()
      // log(a)
      setTotal(count)
      setFiltered(a)
    }
  }

  useEffect(() => {
    setValue(filtered)
  }, [filtered])

  useEffect(() => {
    log('typing.....')
    setTyping(Math.random())
  }, [text])

  useEffect(() => {
    // log("cheanged")

    if (typing === false) {
      // log("checking")
      checkWords()
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        setTyping(false)
        log('started..')
      }, waitTime)
    }
  }, [typing])

  useEffect(() => {
    blockWords()
  }, [words, text])

  const replaceTemp = (text = '') => {
    return text
      ?.replace(/©start©/g, '<marktext>')
      ?.replace(/©end©/g, '</marktext>')
      ?.replace(/©start_rest©/g, '<resttext>')
      ?.replace(/©end_rest©/g, '</resttext>')
  }
  return (
    <>
      <div class='backdrop' id={`xx-backdrop-${target}`}>
        {/* <Hide IF={typing !== false}> */}
        <div
          className='highlights'
          id={`xx-highlight-${target}`}
          dangerouslySetInnerHTML={{ __html: replaceTemp(String(filtered)) }}
        ></div>
        {/* </Hide> */}
      </div>
      <Show IF={total > 0}>
        <BsTooltip className='show-count' title={FM('used-not-allowed-words', { count: total })}>
          {total}
        </BsTooltip>
      </Show>
    </>
  )
}

export default BadWordsFilter
