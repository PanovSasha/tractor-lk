import { OPEN_CLASS } from '../lib/constants'

export const spoilerFns = () => {
  const $spoilers = $('.js-spoiler')

  $.each($spoilers, function (_, spoiler) {
    const $spoiler = $(spoiler)
    const $btn = $spoiler.find('.js-spoiler-btn')
    const $btnText = $spoiler.find('.js-spoiler-btn-text')

    $btn.on('click', function () {
      $spoiler.toggleClass(OPEN_CLASS)

      if ($spoiler.hasClass(OPEN_CLASS)) {
        $btnText.text('Свернуть текст')
      } else {
        $btnText.text('Развернуть текст')
      }
    })
  })
}
