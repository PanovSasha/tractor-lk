import { $BODY, $DOCUMENT, BODY_LOCK_CLASS, SHOW_CLASS } from '../lib/constants'
import { isEscPressed } from '../lib/utils'

export function overlaysFunctions() {
  const $overlay = $('.js-overlay')
  const $overlayItems = $('.js-overlay-item')
  const $BTNS = $('.js-show-overlay-btn')
  const $videoShell = $('.js-videos-lay-item')

  const closeOverlay = () => {
    $BODY.removeClass(BODY_LOCK_CLASS)
    $videoShell.html('')
    $overlay.removeClass(SHOW_CLASS)
    $overlayItems.removeClass(SHOW_CLASS)
  }

  const toggleOverlay = () => {
    if ($overlay.hasClass(SHOW_CLASS)) {
      $BODY.addClass(BODY_LOCK_CLASS)
    } else {
      closeOverlay()
    }
  }

  const openOverlay = () => {
    $BTNS.on('click', function(event) {
      const $btn = $(this)
      const overlayVal = $btn.attr('data-overlay-anchor')

      $overlay.addClass(SHOW_CLASS)
      $overlayItems.removeClass(SHOW_CLASS)
      $(`[data-overlay="${overlayVal}"]`).addClass(SHOW_CLASS)

      toggleOverlay()
    })
  }

  const closeOverlayByActions = () => {
    $overlay.on('click', ({ target }) => {
      if ($(target).hasClass('js-overlay')) {
        closeOverlay()
      }
    })

    $DOCUMENT.on('keyup', (event) => {
      if (isEscPressed(event)) {
        closeOverlay()
      }
    })
  }

  const closeOverlayByCloseBtn = () => {
    const $closeBtn = $('.js-overlay-close-btn')
    const $closeFormBtn = $('.js-close-overlay-btn')

    $closeBtn.on('click', function() {
      closeOverlay()
    })

    $closeFormBtn.on('click', function() {
      const $t = $(this)
      const $formShell = $t.parents('.js-call-form-shell')
      $formShell.find('.js-call-form-success').removeClass(SHOW_CLASS)
      $formShell.find('.js-call-form-success').removeClass(SHOW_CLASS)
      $formShell.find('.js-call-form').addClass(SHOW_CLASS)

      closeOverlay()
    })
  }

  const closeOverlayByOrderBtn = () => {
    const $closeBtn = $('.js-topline-order-btn')

    $closeBtn.on('click', function() {
      closeOverlay()
    })
  }

  openOverlay()
  closeOverlayByActions()
  closeOverlayByCloseBtn()
  closeOverlayByOrderBtn()
}
