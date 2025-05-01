import { ACTIVE_CLASS, SHOW_CLASS } from '../lib/constants'

const $btns = $('.js-accord-btn')

const toggleShowAccordionBody = () => {
  $btns.on('click', function () {
    const $btn = $(this)

    const $accordionContainer = $btn.parents('.js-accord')

    if ($accordionContainer.hasClass(SHOW_CLASS)) {
      $accordionContainer.removeClass(SHOW_CLASS)
    } else {
      $accordionContainer.toggleClass(ACTIVE_CLASS)
    }
  })
}

export const accordFunctions = () => {
  toggleShowAccordionBody()
}
