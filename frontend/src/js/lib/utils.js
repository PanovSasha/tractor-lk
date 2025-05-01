import {
  $BODY,
  $TOPLINE,
  $WINDOW,
  BODY_LOCK_CLASS,
  MOBILE_CLASS,
  TABLET_WIDTH,
} from './constants'
import qs from 'qs'

export const isEscPressed = ({ which }) => which === 27
export const isEnterPressed = ({ which }) => which === 13

export const isSpasePressed = ({ which }) => which === 32
export const isBackspacePressed = ({ which }) => which === 8
export const isDeletePressed = ({ which }) => which === 46

export const smoothScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export const smoothScrollTo = (anchorOffset, behavior = 'smooth') => {
  window.scrollTo({ top: anchorOffset, behavior: behavior })
}

export const animateScrollWhileClickToAnchor = () => {
  $('.js-animate-scroll').on('click', function(e) {
    e.preventDefault()
    const $t = $(this)

    const anchor = $t.attr('href')

    if ($(anchor).css('display') !== 'none') {
      $('html, body')
        .stop()
        .animate(
          {
            scrollTop: $(anchor).offset().top - 130,
          },
          600,
        )
    }
  })
}

animateScrollWhileClickToAnchor()

export const renderSpinner = (target) => {
  target.append(`<div class="spinner spinner--data js-spinner"></div>`)
}

export const deleteSpinner = () => {
  const $spinners = $('.js-spinner')

  $spinners.remove()
}

export const morph = (int, array) => {
  return `${int} ${
    array && array[int % 100 > 4 && int % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][int % 10 < 5 ? int % 10 : 5]]
  }`
}

export const addQueryParamsToUrl = (param, date, url) => {
  if (url) {
    let newUrl = `${window.location.origin}/${url}?` + qs.stringify({ ...param })
    window.location.replace(newUrl)
  } else {
    let search = qs.parse(window.location.search, { ignoreQueryPrefix: true })

    if (date === 'range') {
      delete search.period
    } else {
      if (date === 'period') {
        delete search.from
        delete search.to
      }
    }

    window.location.search = qs.stringify({ ...search, ...param })
  }
}

export const swipeFunction = (elems, elemFunction, swipeDirection = 'upToDown') => {
  let startX
  let startY
  let endX
  let endY

  const minSwipeLength = 10

  $.each(elems, function(_, elem) {
    elem.addEventListener('mousedown', (e) => {
      startX = e.clientX
      startY = e.clientY
    })

    elem.addEventListener('mouseup', (e) => {
      endX = e.clientX
      endY = e.clientY

      const swipedX = endX - startX
      const swipedY = endY - startY

      if (Math.abs(swipedY) > minSwipeLength || Math.abs(swipedX) > minSwipeLength) {
        if (Math.abs(swipedX) < Math.abs(endY - startY)) {
          if (swipedY > 0 && swipeDirection === 'upToDown') {
            elemFunction()
          } else {
            if (swipeDirection === 'downToUp') {
              elemFunction()
            }
          }
        } else {
          if (swipedX > 0 && swipeDirection === 'leftToRight') {
            elemFunction()
          } else {
            if (swipeDirection === 'rightToLeft') {
              elemFunction()
            }
          }
        }
      }
    })
  })
}

export const runFnByWinResize = (fn, size = TABLET_WIDTH) => {
  let desktop
  let mobile

  if ($WINDOW.width() > size) {
    desktop = true
  } else {
    mobile = true
  }

  $WINDOW.on('resize', () => {
    if ($WINDOW.width() > size) {
      if (desktop) {
        fn()
        desktop = false
        mobile = true
      }
    } else {
      if (mobile) {
        fn()
        mobile = false
        desktop = true
      }
    }
  })
}

export const IS_DEV = () => {
  return window.location.hostname === 'localhost'
}

export const numberAddSpace = (value) => {
  return String(value).replace(/(\d)(?=(\d{3})+\b)/g, '$1 ')
}

export function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall
    this.lastCall = Date.now()
    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer)
    }
    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
  }
}
