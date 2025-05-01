import { HOVER_CLASS, LEAVE_CLASS } from '../lib/constants'

export const productFns = () => {
  const $productionItems = $('.production__item')

  $productionItems.on('mouseenter', function () {
    $(this).addClass(HOVER_CLASS)
    $(this).removeClass(LEAVE_CLASS)
  })

  $productionItems.on('mouseleave', function () {
    $productionItems.removeClass(HOVER_CLASS)
    $(this).addClass(LEAVE_CLASS)
  })
}
