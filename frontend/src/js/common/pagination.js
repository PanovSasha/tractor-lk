import qs from 'qs'
import { SHOW_CLASS } from '../lib/constants'
import { addQueryParamsToUrl } from '../lib/utils'

export const paginationFns = () => {
  const $PAGINATION_BTNS = $('.main--press-detail .js-pagination-page-btns')

  if ($PAGINATION_BTNS.length) {
    const paginationFns = () => {
      const $range = $PAGINATION_BTNS.find('.paginationjs-ellipsis')
      const $goInput = $PAGINATION_BTNS.find('.paginationjs-go-input')
      const $goBtn = $PAGINATION_BTNS.find('.paginationjs-go-button')

      $range.on('click', function () {
        $goInput.toggleClass(SHOW_CLASS)
        $goBtn.toggleClass(SHOW_CLASS)
      })
    }

    const renderPagination = (items) => {
      const $paginationShell = $('.js-pagination-page-btns')
      const itemsArr = []
      let pageNumber = 1

      itemsArr.length = items

      const { PAGEN_1 } = qs.parse(window.location.search, { ignoreQueryPrefix: true })

      if (PAGEN_1) {
        pageNumber = PAGEN_1
      } else {
        pageNumber = $('.paginationjs-page.J-paginationjs-page.active').attr('data-num')
      }
      $paginationShell.text('')

      $paginationShell.pagination({
        pageNumber: pageNumber,
        pageSize: 12,
        showGoInput: true,
        showGoButton: true,
        dataSource: itemsArr,
        afterNextOnClick: () => {
          addQueryParamsToUrl({ PAGEN_1: $('.paginationjs-page.J-paginationjs-page.active').attr('data-num') })
        },
        afterPreviousOnClick: () => {
          addQueryParamsToUrl({ PAGEN_1: $('.paginationjs-page.J-paginationjs-page.active').attr('data-num') })
        },
        afterGoButtonOnClick: () => {
          addQueryParamsToUrl({ PAGEN_1: $('.paginationjs-page.J-paginationjs-page.active').attr('data-num') })
        },
        afterGoInputOnEnter: () => {
          addQueryParamsToUrl({ PAGEN_1: $('.paginationjs-page.J-paginationjs-page.active').attr('data-num') })
        },
        afterPageOnClick: () => {
          addQueryParamsToUrl({ PAGEN_1: $('.paginationjs-page.J-paginationjs-page.active').attr('data-num') })
        },
        callback: function (data, pagination) {
          paginationFns()
        },
      })
    }

    const firstRenderPagination = () => {
      const $lastPageNum = $('.paginationjs-last').attr('data-num')
      const maxPageElem = 12

      renderPagination($lastPageNum * maxPageElem)
    }

    paginationFns()
    firstRenderPagination()
  }
}
