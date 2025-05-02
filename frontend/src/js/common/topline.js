import {
  $BODY,
  $TOPLINE,
  BODY_LOCK_CLASS,
  MOBILE_CLASS,
} from '../lib/constants'

export const topLineFunctions = () => {
  const toggleMobileMenu = () => {
    const $burger = $('.js-lk-topline-title-open-btn')

    $burger.on('click', function() {
      $TOPLINE.toggleClass(MOBILE_CLASS)
      $BODY.toggleClass(BODY_LOCK_CLASS)
    })
  }

  const logoutFromLk = () => {


    const $logoutBtn = $('.js-lk-aside-bottom')

    $logoutBtn.on('click', function() {
      const $t = $(this)

      $.ajax({
        type: 'post',
        // /api/v1/logout выход
        //  url: '/api/v1/login',
        url: '/api/v1/logout',
        headers: {
          'Api-Key': 'tUKdAP2Gmv/?Vyv23CI16rDsAB=UN7yFpQvirTa5Ix21BzP4w6lFfqr1qSoySJfKVhXCpH',
        },
        // data: 'login=test&password=123456',
        contentType: 'application/x-www-form-urlencoded',
        success: (response) => {
          console.log(response)
          location.reload()

          // if (response.status === 'success' && response.data.personal_link) {
          //   window.location.href = response.data.personal_link;
          // }
        },
        error: () => {
        },
      })
    })
  }
  
  toggleMobileMenu()
  logoutFromLk()
}
