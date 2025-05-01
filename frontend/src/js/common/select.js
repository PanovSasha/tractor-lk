import { $DOCUMENT, ACTIVE_CLASS, OPEN_CLASS } from '../lib/constants'
import { isEscPressed } from '../lib/utils'

//TODO - переписать селект
export function selectFunctions() {
  const $SELECTS = $('.js-select')

  if ($SELECTS.length) {
    $.each($SELECTS, function (_, select) {
      const $select = $(select)

      const $currentBtn = $select.find('.js-select-current-btn')
      const $options = $select.find('.js-select-option')
      const $nativeSelect = $select.find('.js-select-native')

      const closeSelects = () => {
        $DOCUMENT.on('click', ({ target }) => {
          if ($(target).closest($SELECTS).length) {
            return false
          }

          $select.removeClass(OPEN_CLASS)
        })

        $DOCUMENT.on('keyup.select', (event) => {
          if (isEscPressed(event)) {
            $select.removeClass(OPEN_CLASS)
          }
        })
      }

      const openSelect = () => {
        $currentBtn.on('click', function () {
          if ($select.hasClass(OPEN_CLASS)) {
            $select.toggleClass(OPEN_CLASS)
          } else {
            $SELECTS.removeClass(OPEN_CLASS)
            $select.toggleClass(OPEN_CLASS)
          }
        })
      }

      const chooseOption = () => {
        $options.on('click', function () {
          const $t = $(this)

          $options.removeClass(ACTIVE_CLASS)
          $t.addClass(ACTIVE_CLASS)

          if ($select.hasClass('js-catalog-result-title-sort-select')) {
            if ($t.hasClass('js-select-option-up')) {
              $select.removeClass('down').addClass('up')
            }

            if ($t.hasClass('js-select-option-down')) {
              $select.removeClass('up').addClass('down')
            }
          } else {
            $currentBtn.text($t.text())
          }

          $select.removeClass(OPEN_CLASS)
          $nativeSelect.attr('selected', 'selected')
        })
      }

      openSelect()
      chooseOption()
      closeSelects()
    })
  }
}
