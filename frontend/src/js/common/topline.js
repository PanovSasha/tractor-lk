import { $BODY, $TOPLINE, BODY_LOCK_CLASS, MOBILE_CLASS, ROTATE_CLASS, SHOW_CLASS } from '../lib/constants'

export const topLineFunctions = () => {
  const toggleMobileMenu = () => {
    const $burger = $('.js-topline-burger')

    $burger.on('click', function () {
      $TOPLINE.toggleClass(MOBILE_CLASS)
      $BODY.toggleClass(BODY_LOCK_CLASS)
      $('.js-hover-block').removeClass(SHOW_CLASS)
    })
  }

  const toggleShowToplineSubmenu = () => {
    const $navItemsWithSubMenu = $('.js-with-hover')

    $.each($navItemsWithSubMenu, function (_, el) {
      const $el = $(el)

      const $openBtn = $el.find('.js-topline-block-arrow')
      const $closeBtn = $el.find('.js-hover-block-back-btn')
      const $submenu = $el.find('.js-hover-block')

      const $withHoverLink = $el.find('.js-with-hover-link')
      const $submenuTitleM = $el.find('.js-hover-block-part-name')

      $submenuTitleM.text($withHoverLink.text())

      $openBtn.on('click', function () {
        $submenu.addClass(SHOW_CLASS)
      })

      $closeBtn.on('click', function () {
        $submenu.removeClass(SHOW_CLASS)
      })
    })
  }

  const toggleShowModelPicture = () => {
    const $links = $('[data-model]')
    const $modelPictures = $('[data-model-picture]')

    $links.on('mouseenter', function () {
      const $t = $(this)

      $.each($modelPictures, function (_, el) {
        const $el = $(el)

        if ($t.attr('data-model').toLowerCase() === $el.attr('data-model-picture').toLowerCase()) {
          $el.addClass(SHOW_CLASS)
        }
      })
    })

    $links.on('mouseleave', function () {
      $modelPictures.removeClass(SHOW_CLASS)
    })
  }

  toggleMobileMenu()
  toggleShowModelPicture()
  toggleShowToplineSubmenu()
}
