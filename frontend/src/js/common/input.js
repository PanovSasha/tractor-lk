import { HIDDEN_CLASS, SHOW_CLASS } from '../lib/constants'

export const inputFunctions = () => {
  const $INPUTS = $('.js-input')

  $.each($INPUTS, function(_, el) {
    const $input = $(el)
    const $inputBox = $(el).parent('.js-input-box')

    if (!$inputBox.hasClass('js-topline-block-search-box')) {
      $input.val('')
    }

    const $eraseBtn = $inputBox.find('.js-input-erase-btn')
    const $placeholder = $inputBox.find('.js-input-placeholder')

    const toggleShowEraseBtn = () => {
      $input.on('input', function() {
        if ($input.val().trim() !== '') {
          $eraseBtn.addClass(SHOW_CLASS)
        } else {
          $eraseBtn.removeClass(SHOW_CLASS)
        }
      })
    }

    const eraseInputValByBtn = () => {
      $eraseBtn.on('click', function() {
        $input.val('').focus()
        $eraseBtn.removeClass(SHOW_CLASS)
        $placeholder.removeClass(HIDDEN_CLASS)
      })
    }

    const showEraseBtnOnFocusInput = () => {
      $input.on('focus', function() {
        if ($input.val().trim() !== '') {
          $eraseBtn.addClass(SHOW_CLASS)
        }
      })
    }

    const hidePlaceholder = () => {
      $input.on('input', function() {
        if ($input.val().trim() !== '') {
          $placeholder.addClass(HIDDEN_CLASS)
        } else {
          $placeholder.removeClass(HIDDEN_CLASS)
        }
      })
    }

    hidePlaceholder()
    toggleShowEraseBtn()
    eraseInputValByBtn()
    showEraseBtnOnFocusInput()
  })
}
