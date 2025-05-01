import { ACTIVE_CLASS, SHOW_CLASS } from '../lib/constants'

const showDockByTabsPress = () => {
  const $tabsContainers = $('.js-tabs-container')

  $.each($tabsContainers, function (_, el) {
    const $tabsContainer = $(el)
    const $tabs = $tabsContainer.find('[data-tab]')

    $tabs.on('click', function () {
      const $tab = $(this)
      const tabsGroup = $tab.parent().attr('data-tabs-group')
      const $docks = $(`[data-dock-group=${tabsGroup}]`)

      if (!$tab.hasClass(ACTIVE_CLASS)) {
        $tabs.removeClass(ACTIVE_CLASS)
        $tab.addClass(ACTIVE_CLASS)

        $docks.removeClass(SHOW_CLASS)
        $(`[data-dock="${$tab.attr('data-tab')}"]`).addClass(SHOW_CLASS)
      }
    })
  })
}

export const tabsFunctions = () => {
  showDockByTabsPress()
}
