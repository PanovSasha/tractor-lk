import 'paginationjs/dist/pagination.min'
import qs from 'qs'

import {
  debounce,
  deleteSpinner,
  isEnterPressed, isEscPressed,
  numberAddSpace,
  renderSpinner,
  runFnByWinResize,
} from '../lib/utils'
import {
  $BODY, $DOCUMENT,
  $WINDOW,
  BODY_LOCK_CLASS,
  HIDDEN_CLASS,
  NO_RESULT_CLASS, OPEN_CLASS,
  PAGINATION_CLASS,
  SHOW_CART_BTN_CLASS,
  SHOW_CLASS,
  TABLET_WIDTH,
} from '../lib/constants'
import { selectFunctions } from '../common/select'

const $CATALOG = $('.js-catalog')
const $FOOTER = $('.js-footer')

export const catalogFns = (data) => {
  if ($CATALOG.length) {
    const $CATALOG_ASIDE = $('.js-catalog-aside')
    const $CATALOG_RESULT = $CATALOG.find('.js-catalog-results')
    const $CATALOG_LIST = $CATALOG.find('.js-catalog-results-items')

    const $CART = $CATALOG.find('.js-catalog-aside-cart')
    const $CART_LIST = $CATALOG.find('.js-catalog-aside-cart-list')
    const $CART_SUM = $CATALOG.find('.js-catalog-aside-cart-sum')
    const $CART_CLOSE_BTN = $CATALOG.find('.js-catalog-aside-cart-close')

    const $ARTICLE_INPUT = $CATALOG.find('[name="article"]')
    const $ARTICLE_INPUT_SHELL = $ARTICLE_INPUT.parent('.js-catalog-filters-input-box')
    const $ARTICLE_INPUT_ERASE_BTN = $ARTICLE_INPUT_SHELL.find('.js-input-erase-btn')
    const $ARTICLE_INPUT_SEARCH_BTN = $ARTICLE_INPUT_SHELL.find('.js-input-search-btn')
    const $ARTICLE_HINT_SHELL = $ARTICLE_INPUT_SHELL.find('.js-catalog-filters-input-hints')

    const $NAME_INPUT = $CATALOG.find('[name="name"]')
    const $NAME_INPUT_SHELL = $NAME_INPUT.parent('.js-catalog-filters-input-box')
    const $NAME_INPUT_ERASE_BTN = $NAME_INPUT_SHELL.find('.js-input-erase-btn')
    const $NAME_INPUT_SEARCH_BTN = $NAME_INPUT_SHELL.find('.js-input-search-btn')
    const $NAME_HINT_SHELL = $NAME_INPUT_SHELL.find('.js-catalog-filters-input-hints')

    const $SELECT = $CATALOG.find('.js-catalog-filters-select')
    const $SELECT_CURRENT_BTN = $SELECT.find('.js-select-current-btn')

    const $TITLE_COUNT = $CATALOG.find('.js-catalog-results-count')
    const $SHOW_MORE_BTN = $CATALOG.find('.js-catalog-result-show-more-btn')

    const $PAGINATION = $('.js-catalog-result-pagination')

    let STORE = []

    const scrollToTopCatalog = () => {
      $('html, body')
        .stop()
        .animate(
          {
            scrollTop: $CATALOG.offset().top - 100,
          },
          300,
        )
    }

    const filterInputFns = () => {
      const $filterInputsBox = $CATALOG.find('.js-catalog-filters-input-box')

      $.each($filterInputsBox, function(_, el) {
        const debounceFn = () => {
          queryFilterData()

          if ($inputOptions.children().length) {
            $inputOptions.addClass(SHOW_CLASS)
          }
        }

        const $el = $(el)

        const $input = $el.find('.js-catalog-filters-input-filters-input')
        const $inputPlaceholder = $el.find('.js-input-placeholder')
        const $inputOptions = $el.find('.js-catalog-filters-input-hints')
        const $inputOption = $el.find('.js-catalog-filters-input-hints-btn')

        $input.on('input', debounce(debounceFn, 1200))

        $inputOption.on('click', function() {
          const $t = $(this)

          $inputPlaceholder.addClass(HIDDEN_CLASS)
          $input.val($t.text().trim())
          $input.focus()
          console.log($input.attr('name'), 'ewrwer')
          queryData()
        })
      })

      // const closeSelects = () => {
      //   $DOCUMENT.on('click', ({ target }) => {
      //     if ($(target).closest($SELECTS).length) {
      //       return false
      //     }
      //
      //     $select.removeClass(OPEN_CLASS)
      //   })
      //
      //   $DOCUMENT.on('keyup.select', (event) => {
      //     if (isEscPressed(event)) {
      //       $select.removeClass(OPEN_CLASS)
      //     }
      //   })
      // }
    }

    const filterSelectFns = () => {
      const $options = $SELECT.find('.js-select-option')

      $options.on('click', function() {
        const $t = $(this)

        $SELECT_CURRENT_BTN.attr('data-tractor', $t.attr('data-tractor'))
        queryData()
      })
    }

    const closeFilterHints = () => {
      $ARTICLE_HINT_SHELL.removeClass(SHOW_CLASS)
      $NAME_HINT_SHELL.removeClass(SHOW_CLASS)
    }

    const openMobileCart = () => {
      const $btn = $('.js-catalog-cart-open-btn')

      $btn.on('click', function() {
        $CATALOG_ASIDE.addClass(SHOW_CLASS)
        $BODY.addClass(BODY_LOCK_CLASS)
      })
    }

    const closeMobileCart = () => {
      $CATALOG_ASIDE.removeClass(SHOW_CLASS)
      $BODY.removeClass(BODY_LOCK_CLASS)
    }

    const closeMobileCartByCloseBtnClick = () => {
      $CART_CLOSE_BTN.on('click', function() {
        closeMobileCart()
      })
    }

    const addItemToCart = (article, name, price) => {
      const deleteItemByPressDelCartBtn = () => {
        const $delBtns = $('.js-catalog-aside-cart-list-item-del')

        $delBtns.on('click', function() {
          const $cartItem = $(this).parents('.js-catalog-aside-cart-list-item')
          const article = $cartItem.attr('data-article')

          deleteItemFromStores(article)
          deleteItemFromCart(article)

          if ($CART_LIST.children().length === 0 && $WINDOW.width() > TABLET_WIDTH) {
            $CART.removeClass(SHOW_CLASS)
          }

          $.each($('.js-catalog-results-item'), function(_, el) {
            const $el = $(el)

            if ($el.attr('data-article') === article) {
              $el.attr('data-condition', 'add')
            }
          })
        })
      }

      $CART_LIST.append(
        `
               <div
                data-article="${article}"
                class="catalog__aside-cart-list-item js-catalog-aside-cart-list-item">
                <p class="catalog__aside-cart-item-name">
                  ${name.toLowerCase()}
                </p>
                
                <div class="catalog__aside-cart-item-price-shell">
                  <p class="catalog__aside-cart-item-price-name">
                    Цена с&nbsp;НДС
                  </p>
                  
                  <p class="catalog__aside-cart-item-price js-catalog-aside-cart-item-price">
                    ${price}
                  </p>
                </div>
                
                <button
                  class="catalog__aside-cart-list-item-del js-catalog-aside-cart-list-item-del btn btn--primary">
                </button>
              </div>
          `,
      )

      if ($WINDOW.width() > TABLET_WIDTH) {
        $CART.addClass(SHOW_CLASS)
      }

      deleteItemByPressDelCartBtn()
    }

    const setAddConditionForItemsFromStore = () => {
      const $currentItems = $('.js-catalog-results-item')

      $.each(STORE, function(_, elemStore) {
        $.each($currentItems, function(_, el) {
          const $el = $(el)

          if (elemStore.article === $el.attr('data-article')) {
            $el.attr('data-condition', 'del')
          }
        })
      })
    }

    const initStores = () => {
      const items = window.localStorage.getItem('items')

      if (items) {
        STORE = JSON.parse(items)
      }

      $.each(STORE, function(_, el) {
        const finalPrice = changeCartSum(el.price, 'add')
        addItemToCart(el.article, el.name, el.price)
        addTabletShowCartBtn(finalPrice)
      })
    }

    const changeCartSum = (price, operation) => {
      let cartSum = Number($CART_SUM.text().trim().replaceAll(',', '.').replaceAll('₽', '').replaceAll(' ', ''))

      const clearPrise = Number(price.replaceAll(' ', '').trim().replaceAll(',', '.').replaceAll('₽', ''))

      let finalSum

      if (operation === 'add') {
        finalSum = cartSum + clearPrise
      }

      if (operation === 'del') {
        finalSum = cartSum - clearPrise
      }

      finalSum = finalSum.toFixed(2).split('.')

      finalSum[0] = numberAddSpace(finalSum[0])

      const clearFinalSum = `${finalSum[0]}, ${finalSum[1]} ₽`

      $CART_SUM.text(clearFinalSum)

      return clearFinalSum
    }

    const addTabletShowCartBtn = (price) => {
      if ($WINDOW.width() < TABLET_WIDTH) {
        const $showCartBtnShell = $('.js-catalog-cart-open-btn-shell')
        const $showCartBtn = $showCartBtnShell.find('.js-catalog-cart-open-btn')

        if ($showCartBtnShell.length) {
          $showCartBtn.text(price)
        } else {
          $BODY.append(`
              <div class="catalog__cart-open-btn-shell js-catalog-cart-open-btn-shell">
                <button
                  class="btn btn--primary catalog__cart-open-btn js-catalog-cart-open-btn">
                   ${price}
                </button>
              </div>
            `)
        }

        openMobileCart()

        if ($WINDOW.width() < TABLET_WIDTH) {
          $FOOTER.addClass(SHOW_CART_BTN_CLASS)
          $CATALOG.addClass(SHOW_CART_BTN_CLASS)
        }
      }
    }

    const addItemToStores = (article, name, price) => {
      let isItemInStore = false

      if (STORE.length) {
        $.each(STORE, function(_, el) {
          if (el.article === article) {
            isItemInStore = true
          }
        })

        if (!isItemInStore) {
          STORE.push({ article, name, price })
        }
      } else {
        STORE.push({ article, name, price })
      }

      window.localStorage.setItem('items', JSON.stringify(STORE))

      addItemToCart(article, name, price)
      const cartPrice = changeCartSum(price, 'add')
      addTabletShowCartBtn(cartPrice)
    }

    const deleteItemFromCart = (article) => {
      const $cartItems = $('.js-catalog-aside-cart-list-item')

      $.each($cartItems, function(_, el) {
        const $el = $(el)
        const price = $el.find('.js-catalog-aside-cart-item-price').text()

        if ($el.attr('data-article') === article) {
          $el.remove()
          const cartPrice = changeCartSum(price, 'del')
          addTabletShowCartBtn(cartPrice)
        }
      })

      if ($CART_LIST.children().length === 0) {
        $FOOTER.removeClass(SHOW_CART_BTN_CLASS)
        $CATALOG.removeClass(SHOW_CART_BTN_CLASS)
        $('.js-catalog-cart-open-btn-shell').remove()

        if ($WINDOW.width() > TABLET_WIDTH) {
          $CART.removeClass(SHOW_CLASS)
        } else {
          closeMobileCart()
        }
      }
    }

    const deleteItemFromStores = (item) => {
      const tempStore = []

      $.each(STORE, function(_, el) {
        if (el.article !== item) {
          tempStore.push(el)
        }
      })

      STORE = tempStore

      window.localStorage.setItem('items', JSON.stringify(STORE))
    }

    const itemsFn = () => {
      const $items = $('.js-catalog-results-item')

      $.each($items, function(_, el) {
        const $item = $(el)
        const article = $item.attr('data-article')
        const name = $item.find('.js-catalog-results-item-name').text()
        const price = $item.find('.js-catalog-results-item-price-value').text()

        const $itemAddBtn = $item.find('.js-catalog-results-item-add-to-cart')
        const $itemDelBtn = $item.find('.js-catalog-results-item-del-from-cart')

        $itemAddBtn.on('click', function() {
          addItemToStores(article, name, price)
          $item.attr('data-condition', 'del')
        })

        $itemDelBtn.on('click', function() {
          deleteItemFromStores(article)
          deleteItemFromCart(article)
          $item.attr('data-condition', 'add')
        })
      })
    }

    const renderNames = (names) => {
      $NAME_HINT_SHELL.text('')

      $.each(names, function(_, el) {
        const elem = el.toLocaleLowerCase()

        $NAME_HINT_SHELL.append(
          `
            <button
              data-btn-article='${elem}'
              class="catalog__filters-input-hints-btn js-catalog-filters-input-hints-btn">
                ${elem}
            </button>
          `,
        )
      })
    }

    const renderCodes = (codes) => {
      $ARTICLE_HINT_SHELL.text('')

      $.each(codes, function(_, el) {
        const elem = el.toLocaleLowerCase()

        $ARTICLE_HINT_SHELL.append(
          `
            <button
              data-btn-article='${elem}'
              class="catalog__filters-input-hints-btn js-catalog-filters-input-hints-btn">
                ${elem}
            </button>
          `,
        )
      })
    }

    const renderTechnics = (technics) => {
      const $options = $SELECT.find('.select__options')
      const $nativeSelect = $SELECT.find('.js-select-native-select')

      $options.text('')
      $nativeSelect.text('')
      $nativeSelect.append(`
          <option value="0">all</option>
        `)

      $.each(technics, function(i, el) {
        $options.append(`
            <button type="button" data-id="${i}" data-tractor="${i}"
                        class="select__option js-select-option">
              ${el}
            </button>
        `)

        $nativeSelect.append(`
            <option value="${i}">${i}</option>
        `)
      })

      $SELECT_CURRENT_BTN.off()
      selectFunctions()
    }


    const renderData = (data) => {
      const renderTime = (productTime) => {
        if (/^\d+$/.test(productTime)) {
          return `
            ${productTime}
            
             <p class="catalog-results__item-time-descr">
              Срок изготовления
             </p>
          `
        }

        return productTime
      }

      const renderDataItem = (data) => {
        let items = ''

        $.each(data, function(_, el) {
          const {
            code,
            name,
            priceVat,
            priceWithVat,
            productTime,
            technics,
          } = el

          items =
            items +
            `
              <div
                data-condition=""
                data-article="${code}"
                class="catalog-results__item download js-catalog-results-item">
                <div class="catalog-results__item-body">
                  <h3 class="catalog-results__item-name js-catalog-results-item-name">${name}</h3>
                  
                  <div class="catalog-results__item-props">
                    <div class="catalog-results__item-article">
                      ${code}
                    </div>
                    
                    <div class="catalog-results__item-time">
                      ${renderTime(productTime)}
                    </div>
                    
                    <div class="catalog-results__item-tractor-name">
                      ${technics}
                    </div>
                    
                    <div class="catalog-results__item-price-shell">
                      <div class="catalog-results__item-price">
                        Цена без НДС
                        
                        <p
                          class="catalog-results__item-price-value">
                          ${priceVat}&nbsp;₽
                        </p>
                      </div>
                      
                      <div class="catalog-results__item-price">
                        Цена с&nbsp;НДС
                        
                        <p
                          class="catalog-results__item-price-value js-catalog-results-item-price-value">${priceWithVat}&nbsp;₽</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                class="catalog-results__item-add-to-cart js-catalog-results-item-add-to-cart"
                type="button">
                  <svg class="icon icon--24">
                    <use xlink:href="/assets/sprite/sprite.svg#cart"></use>
                  </svg>
                  
                  <span class="only-mobile">
                    Добавить в&nbsp;корзину
                  </span>
                </button>
                
                <button class="btn btn--primary catalog-results__item-del-from-cart js-catalog-results-item-del-from-cart">
                  Удалить
                </button>
                
                <button 
                class="catalog-results__item-add-to-cart catalog-results__item-add-to-cart--absolute js-catalog-results-item-add-to-cart"
                type="button">
                </button>
                
                <button class="btn btn--primary catalog-results__item-del-from-cart catalog-results__item-del-from-cart--absolute js-catalog-results-item-del-from-cart">
                </button>
              </div>
          `
        })

        return items
      }

      $CATALOG_LIST.removeClass(NO_RESULT_CLASS).append(renderDataItem(data))

      itemsFn()
    }

    const getDataParams = () => {
      const data = {}

      data.article = $ARTICLE_INPUT.val()
      data.name = $NAME_INPUT.val()
      data.tractor = $SELECT_CURRENT_BTN.attr('data-tractor')

      return data
    }

    const addFiltersValueToUrl = (filters) => {
      window.history.replaceState({}, document.title, window.location.pathname)

      const url = new URL(window.location.href)

      $.each(filters, function(i, el) {
        url.searchParams.set(i, el)
      })

      window.history.replaceState({}, document.title, url)
    }

    const queryData = (currentPage = 1) => {
      closeFilterHints()

      data = getDataParams()
      data.page = currentPage

      addFiltersValueToUrl(data)
      scrollToTopCatalog()

      setTimeout(() => {
        $CATALOG_LIST.html('').addClass(NO_RESULT_CLASS)
        $CATALOG_RESULT.removeClass(PAGINATION_CLASS)
        renderSpinner($CATALOG_LIST)

        $.ajax({
          type: 'post',
          url: '/api/v1/parts',
          headers: {
            'Api-Key': 'tUKdAP2Gmv/?Vyv23CI16rDsAB=UN7yFpQvirTa5Ix21BzP4w6lFfqr1qSoySJfKVhXCpH',
          },
          data: JSON.stringify(data),
          dataType: 'json',
          contentType: 'application/json',
          success: (data) => {
            deleteSpinner()

            if (data?.data) {
              const {
                codes,
                items,
                names,
                technics,
                countRecord,
                nav: { page, pageCount, pageEnd, pageSize } = {},
              } = data.data

              if (names && Object.keys(names).length !== 0) {
                renderNames(names)
              }

              if (codes && Object.keys(codes).length !== 0) {
                renderCodes(codes)
              }

              if ((names && Object.keys(names).length !== 0) || (codes && Object.keys(codes).length !== 0)) {
                filterInputFns()
              }

              if (technics && Object.keys(technics).length !== 0) {
                renderTechnics(technics)
                filterSelectFns()
              }

              if (pageEnd) {
                $SHOW_MORE_BTN.addClass(HIDDEN_CLASS)
              } else {
                $SHOW_MORE_BTN.removeClass(HIDDEN_CLASS)
                $SHOW_MORE_BTN.attr('data-page', currentPage + 1)
              }

              if (countRecord) {
                $TITLE_COUNT.text(countRecord)
              } else {
                $TITLE_COUNT.text(0)

                $CATALOG_LIST.html(`Запчасти по&nbsp;вашим параметрам не&nbsp;найдены, измените условия поиска.`)
                $CATALOG_RESULT.removeClass(PAGINATION_CLASS)
                $CATALOG_LIST.removeClass(NO_RESULT_CLASS)
              }

              if (items && items.length) {
                renderData(items)

                if (countRecord > pageSize) {
                  if (currentPage === 1 && pageCount > 1) {
                    $CATALOG_RESULT.addClass(PAGINATION_CLASS)
                    renderPagination(countRecord, pageSize)
                  }
                } else {
                  $CATALOG_RESULT.removeClass(PAGINATION_CLASS)
                }
              } else {
                $CATALOG_RESULT.removeClass(PAGINATION_CLASS)
              }

              setAddConditionForItemsFromStore()
            }
          },
          error: () => {
            deleteSpinner()
          },
        })
      }, 400)
    }

    const queryFilterData = () => {
      data = getDataParams()

      $.ajax({
        async: false,
        type: 'post',
        url: '/api/v1/parts',
        headers: {
          'Api-Key': 'tUKdAP2Gmv/?Vyv23CI16rDsAB=UN7yFpQvirTa5Ix21BzP4w6lFfqr1qSoySJfKVhXCpH',
        },
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: (data) => {
          if (data?.data) {
            const {
              codes,
              names,
            } = data.data

            if (names && Object.keys(names).length !== 0) {
              renderNames(names)
            } else {
              $NAME_HINT_SHELL.text('')
              closeFilterHints()
            }

            if (codes && Object.keys(codes).length !== 0) {
              renderCodes(codes)

            } else {
              $ARTICLE_HINT_SHELL.text('')
              closeFilterHints()
            }

            filterInputFns()
          }
        },
      })
    }

    const paginationFns = () => {
      const $range = $PAGINATION.find('.paginationjs-ellipsis')
      const $goInput = $PAGINATION.find('.paginationjs-go-input')
      const $goBtn = $PAGINATION.find('.paginationjs-go-button')

      $range.on('click', function() {
        $goInput.toggleClass(SHOW_CLASS)
        $goBtn.toggleClass(SHOW_CLASS)
      })
    }

    const firstRenderPagination = () => {
      const $lastPageNum = $PAGINATION.find('.paginationjs-last').attr('data-num')
      const maxPageElem = 10

      renderPagination($lastPageNum * maxPageElem)
    }

    const renderPagination = (items, pageSize = 10) => {
      const itemsArr = []
      let pageNumber = 1

      itemsArr.length = items

      $PAGINATION.text('')

      const { page } = qs.parse(window.location.search, { ignoreQueryPrefix: true })

      if (page) {
        pageNumber = page
      }

      $PAGINATION.pagination({
        pageNumber: pageNumber,
        pageSize: pageSize,
        showGoInput: true,
        showGoButton: true,
        dataSource: itemsArr,
        afterNextOnClick: () => {
          queryDataByActivePaginationElem()
        },
        afterPreviousOnClick: () => {
          queryDataByActivePaginationElem()
        },
        afterGoButtonOnClick: () => {
          queryDataByActivePaginationElem()
        },
        afterGoInputOnEnter: () => {
          queryDataByActivePaginationElem()
        },
        afterPageOnClick: () => {
          queryDataByActivePaginationElem()
        },
        callback: function(data, pagination) {
          paginationFns()
        },
      })
    }

    const queryDataByActivePaginationElem = () => {
      const activeElemNum = $PAGINATION.find('.active').attr('data-num')

      queryData(activeElemNum)
    }

    const queryBySearchBtns = () => {
      $ARTICLE_INPUT_SEARCH_BTN.on('click', function() {
        $ARTICLE_INPUT.focus()
        queryData()
      })

      $NAME_INPUT_SEARCH_BTN.on('click', function() {
        $NAME_INPUT.focus()
        queryData()
      })
    }

    const queryByShowMoreBtn = () => {
      $SHOW_MORE_BTN.on('click', function() {
        const $t = $(this)

        queryData(Number($t.attr('data-page')))
      })
    }

    const queryByEraseBtn = () => {
      $ARTICLE_INPUT_ERASE_BTN.on('click', function() {
        queryData()
      })

      $NAME_INPUT_ERASE_BTN.on('click', function() {
        queryData()
      })
    }

    const queryByEnterPressInInputs = () => {
      $ARTICLE_INPUT.on('keyup', (event) => {
        if (isEnterPressed(event)) {
          queryData()
        }
      })

      $NAME_INPUT.on('keyup', (event) => {
        if (isEnterPressed(event)) {
          queryData()
        }
      })
    }

    itemsFn()
    initStores()
    filterInputFns()
    filterSelectFns()
    queryByEraseBtn()
    queryBySearchBtns()
    queryByShowMoreBtn()
    firstRenderPagination()
    queryByEnterPressInInputs()
    closeMobileCartByCloseBtnClick()
    setAddConditionForItemsFromStore()

    runFnByWinResize(() => {
      if ($WINDOW.width() > TABLET_WIDTH) {
        //выполнить когда переходим на десктоп
        closeMobileCart()
        $CATALOG.removeClass(SHOW_CART_BTN_CLASS)

        if ($('.js-catalog-cart-open-btn-shell').length) {
          $CART.addClass(SHOW_CLASS)
        }
      } else {
        //выполнить когда переходим на мобилку
        if ($CART.hasClass(SHOW_CLASS)) {
          addTabletShowCartBtn($CART_SUM.text())
        }
      }
    })
  }
}
