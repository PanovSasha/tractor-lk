import Swiper from 'swiper/bundle'
import { ACTIVE_CLASS, CLICKED_CLASS } from '../lib/constants'

export const swiperFunctions = () => {
  const partitionSliderFns = () => {
    const partitionSlider = new Swiper('.js-partition', {
      spaceBetween: 0,
      slidesPerView: 1,
      autoplay: {
        delay: 5500,
      },
      loop: true,
      speed: 1200,
      pagination: {
        el: '.js-partition__pagination',
        type: 'bullets',
        clickable: true,
      },

      navigation: {
        prevEl: '.js-partition-btn-prev',
        nextEl: '.js-partition-btn-next',
      },
    })
  }

  const partnersSliderFns = () => {
    const partnersSlider = new Swiper('.js-partners', {
      slidesPerView: 'auto',
      loop: true,
      spaceBetween: 0,
      grabCursor: true,
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
      },
      freeMode: true,
      freeModeMomentum: false,
      speed: 5000,
    })
  }

  const navPageSliderFns = () => {
    const partitionSlider = new Swiper('.js-nav-page', {
      spaceBetween: 0,
      mousewheel: true,
      slidesPerView: 'auto',
      freeMode: true,
      speed: 100,
    })

    const $slides = $('.js-nav-page-slide')

    const toggleActiveSlideByClick = () => {
      $slides.on('click', function () {
        const $t = $(this)
        $slides.removeClass(CLICKED_CLASS)
        $slides.removeClass('swiper-slide-active')
        $t.addClass(CLICKED_CLASS)
        $t.addClass('swiper-slide-active')
      })
    }

    const toggleActiveSlideByIO = () => {
      const toggleActiveSlide = (selector, callback) => {
        let options = {
          rootMargin: '-140px 0px -73%',
          threshold: 0,
        }

        let observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return
            // obs.unobserve(entry.target)
            callback()
          })
        }, options)

        observer.observe(selector[0])
      }

      const $anchors = $('[data-page-anchor]')

      let visibleSlideNumber

      $.each($anchors, function (_, el) {
        const $anchor = $(el)

        toggleActiveSlide($anchor, () => {
          $.each(partitionSlider.slides, function (i, slide) {
            if ($(slide).attr('href').substring(1, $(slide).attr('href').length) === $anchor.attr('data-page-anchor')) {
              visibleSlideNumber = i

              $slides.removeClass(CLICKED_CLASS)
              $slides.removeClass('swiper-slide-active')
              $(slide).addClass(CLICKED_CLASS)
              $(slide).addClass('swiper-slide-active')
              partitionSlider.slideTo(visibleSlideNumber, 100, () => {})
            }
          })
        })
      })
    }

    toggleActiveSlideByClick()
    toggleActiveSlideByIO()
  }

  const gallerySliderFns = () => {
    const $slides = $('.js-gallery-slide')

    const copyGallerySlidesToOverlay = () => {
      const $slidesWrapper = $('.js-gallery-lay-swiper-wrapper')

      const $newSlides = $slides.clone()

      $.each($newSlides, function (_, el) {
        const $slide = $(el)

        const $img = $slide.find('.js-gallery-slide-img')
        const $descr = $slide.find('.js-gallery-slide-descr')

        $slide.removeClass().addClass('swiper-slide gallery-lay__slide')
        $img.removeClass().addClass('gallery-lay__slide-img')

        if ($descr.length) {
          $descr.removeClass().addClass('gallery-lay__slide-descr')
        }

        $slidesWrapper.append($slide)
      })
    }

    copyGallerySlidesToOverlay()

    const galleryOverlaySlider = new Swiper('.js-gallery-lay-slider', {
      spaceBetween: 12,
      slidesPerView: 1,
      speed: 1000,
      loop: true,
      navigation: {
        prevEl: '.js-gallery-lay-btn-prev',
        nextEl: '.js-gallery-lay-btn-next',
      },
      pagination: {
        el: '.js-gallery-lay-slider-pagination',
        type: 'bullets',
        clickable: true,
      },
    })

    const gallerySlider = new Swiper('.js-gallery-slider', {
      spaceBetween: 12,
      slidesPerView: 'auto',
      speed: 1200,

      navigation: {
        prevEl: '.js-gallery-btn-prev',
        nextEl: '.js-gallery-btn-next',
      },
    })

    const setActiveLaySlideByGallerySlideClick = () => {
      $slides.on('click', function () {
        const $t = $(this)
        const slideIndex = $t.attr('aria-label').split('/')[0]

        galleryOverlaySlider.update()
        galleryOverlaySlider.slideTo(slideIndex, 1)
      })
    }

    setActiveLaySlideByGallerySlideClick()
  }

  const bonusSliderFns = () => {
    const $anchors = $('.js-bonus-img-anchor')

    const bonusSlider = new Swiper('.js-bonus-slider', {
      spaceBetween: 0,
      slidesPerView: 1,
      effect: 'fade',
      autoHeight: true,
      speed: 100,
      pagination: {
        el: '.js-partition__pagination',
        type: 'bullets',
        clickable: true,
      },

      navigation: {
        prevEl: '.js-bonus-btn-prev',
        nextEl: '.js-bonus-btn-next',
      },
    })

    const toggleActiveSlideByAnchorPress = () => {
      $anchors.on('click', function () {
        const $t = $(this)
        const anchorIndex = $t.attr('data-bonus-img-anchor-number')
        $anchors.removeClass(ACTIVE_CLASS)
        $t.addClass(ACTIVE_CLASS)
        bonusSlider.slideTo(anchorIndex - 1, 100)
      })
    }

    const toggleActiveAnchorBySlideChange = () => {
      const $activeNumberShell = $('.js-bonus-slider-active-number')

      bonusSlider.on('transitionEnd', function () {
        $.each(bonusSlider.slides, function (_, el) {
          const $slide = $(el)

          if ($slide.hasClass('swiper-slide-active')) {
            const activeIndex = $slide.attr('data-bonus-number-slide')

            $anchors.removeClass(ACTIVE_CLASS)
            $activeNumberShell.text(activeIndex)
            $(`[data-bonus-img-anchor-number=${activeIndex}]`).addClass(ACTIVE_CLASS)
          }
        })
      })
    }

    toggleActiveSlideByAnchorPress()
    toggleActiveAnchorBySlideChange()
  }

  const yearsSlidersFns = () => {
    const createYearsThumbs = () => {
      const $thumbsWrapper = $('.js-years-thumbs-slider-wrapper')

      $.each($('.js-detail-aside-date'), function (_, el) {
        const $el = $(el)
        const year = $el.clone().text().match(/\d+/g)

        $thumbsWrapper.append(`
             <button 
             type="button"
              class="btn btn--primary swiper-slide years-thumbs-slider__slide js-years-thumbs-slider-slide">
              ${year}
            </button>
          `)
      })
    }

    createYearsThumbs()

    const yearsThumbsSlider = new Swiper('.js-years-thumbs-slider', {
      spaceBetween: 28,
      slidesPerView: 'auto',
      speed: 200,
      freeMode: true,
      mousewheel: true,
    })

    $('.js-years-thumbs-slider-slide').on('click', function () {
      const $t = $(this)
      const slideIndex = $t.attr('aria-label').split('/')[0]
      console.log('clicked')

      yearsThumbsSlider.slideTo(slideIndex - 1, 200)
    })

    const yearsSlider = new Swiper('.js-years-slider', {
      spaceBetween: 0,
      effect: 'fade',
      slidesPerView: 1,
      autoHeight: true,
      speed: 200,
      thumbs: { swiper: yearsThumbsSlider },
      navigation: {
        prevEl: '.js-years-btn-prev',
        nextEl: '.js-years-btn-next',
      },
    })
  }

  partitionSliderFns()
  partnersSliderFns()
  navPageSliderFns()
  gallerySliderFns()
  yearsSlidersFns()
  bonusSliderFns()
}

export const pointsSlider = new Swiper('.js-buy-actions-points-slider', {
  spaceBetween: 12,
  direction: 'vertical',
  speed: 100,
  slidesPerView: 'auto',
  autoHeight: true,
  freeMode: true,
  mousewheel: true,
})
