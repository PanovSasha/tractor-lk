import { isEnterPressed } from '../lib/utils'
import { DISABLE_CLASS, HIDDEN_CLASS, SHOW_CLASS } from '../lib/constants'

export const pressFns = () => {
  // вот  api http://x92617p0.beget.tech/api/v1/news
  //   принимает search - текст,  year - число, month - число, page - число
  // post запрос x-www-from-urlencoded

  const $PRESS = $('.js-press')
  const $NEWS_SHELL = $PRESS.find('.js-press-news-shell')
  const $NEWS = $PRESS.find('.js-press-news')
  const $NEWS_NO_RESULT = $PRESS.find('.js-press-news-no-result')
  const $MORE_BTN = $PRESS.find('.js-press-news-next-page-btn')

  const $PRESS_INPUT = $PRESS.find('.js-buy-actions-filters-input')
  const $PRESS_INPUT_SUBMIT_BTN = $PRESS.find('.js-input-search-btn')

  const $PRESS_SELECT_YEARS = $PRESS.find('.js-press-filters-select-year')
  const $PRESS_SELECT_YEARS_CURRENT_BTN = $PRESS_SELECT_YEARS.find('.js-select-current-btn')
  const $PRESS_SELECT_YEARS_OPTIONS = $PRESS_SELECT_YEARS.find('.js-select-option')

  const $PRESS_SELECT_MONTH = $PRESS.find('.js-press-filters-select-month')
  const $PRESS_SELECT_MONTH_CURRENT_BTN = $PRESS_SELECT_MONTH.find('.js-select-current-btn')
  const $PRESS_SELECT_MONTH_OPTIONS = $PRESS_SELECT_MONTH.find('.js-select-option')

  const renderNews = (items, page) => {
    if (page === 1) {
      $NEWS.text('')
    }

    $.each(items, function (_, el) {
      const { activeFrom, name, previewPicture, url } = el

      const preview = previewPicture?.src ? previewPicture.src : '/assets/img/prev-news.webp'

      $NEWS.append(`
          <a
            href="${url}"
            class="news__item">
            <div class="news__picture picture">
              <img
                class="picture__img"
                loading="lazy" src="${preview}"
                alt="">
            </div>
            
            <p class="news__date">${activeFrom}</p>
            
            <h3 class="news__title">
              ${name}
            </h3>
          </a>
      `)
    })
  }

  const getNews = (page = 1) => {
    const month = $PRESS_SELECT_MONTH_CURRENT_BTN.attr('data-month')
    const search = $PRESS_INPUT.val().trim()

    let data = `page=${page}&year=${$PRESS_SELECT_YEARS_CURRENT_BTN.attr('data-year')}`

    if (month) {
      data += `&month=${month}`
    }

    if (search) {
      data += `&search=${search}`
    }

    $.ajax({
      url: `/api/v1/news`,
      method: 'post',
      dataType: 'json',
      data: data,
      contentType: 'application/x-www-form-urlencoded',
      headers: {
        'Api-Key': 'tUKdAP2Gmv/?Vyv23CI16rDsAB=UN7yFpQvirTa5Ix21BzP4w6lFfqr1qSoySJfKVhXCpH',
      },
      success: function (result) {
        if (result.status === 'success' && result?.data?.items?.length) {
          $NEWS.removeClass(HIDDEN_CLASS)
          $MORE_BTN.removeClass(HIDDEN_CLASS)
          $NEWS_NO_RESULT.removeClass(SHOW_CLASS)

          const { items, nav } = result.data
          const { page, pageEnd } = nav

          renderNews(items, page)

          if (pageEnd) {
            $MORE_BTN.addClass(HIDDEN_CLASS)
          } else {
            $MORE_BTN.attr('data-next-page', page + 1)
          }
        } else {
          $NEWS.addClass(HIDDEN_CLASS)
          $MORE_BTN.addClass(HIDDEN_CLASS)
          $NEWS_NO_RESULT.addClass(SHOW_CLASS)
        }
      },
    })
  }

  const onInputFns = () => {
    $PRESS_INPUT_SUBMIT_BTN.on('click', function () {
      getNews()
    })

    $PRESS_INPUT.on('keyup', (event) => {
      if (isEnterPressed(event)) {
        getNews()
      }
    })
  }

  const onSelectFns = () => {
    $PRESS_SELECT_YEARS_OPTIONS.on('click', function () {
      const $t = $(this)

      $PRESS_SELECT_YEARS_CURRENT_BTN.attr('data-year', $t.attr('data-year'))
      $PRESS_SELECT_MONTH_CURRENT_BTN.attr('data-month', 0)
      $PRESS_SELECT_MONTH_CURRENT_BTN.text('Месяц')

      $PRESS_SELECT_YEARS_CURRENT_BTN.attr('data-year') === '0'
        ? $PRESS_SELECT_MONTH.addClass(DISABLE_CLASS)
        : $PRESS_SELECT_MONTH.removeClass(DISABLE_CLASS)

      getNews()
    })

    $PRESS_SELECT_MONTH_OPTIONS.on('click', function () {
      const $t = $(this)

      $PRESS_SELECT_MONTH_CURRENT_BTN.attr('data-month', $t.attr('data-month'))
      getNews()
    })
  }

  const getNewsByMoreBtn = () => {
    $MORE_BTN.on('click', function () {
      const $t = $(this)

      getNews($t.attr('data-next-page'))
    })
  }

  onInputFns()
  onSelectFns()
  getNewsByMoreBtn()
}
