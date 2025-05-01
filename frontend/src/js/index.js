//Styles
import 'paginationjs/dist/pagination.less'
import 'suggestions-jquery/less/suggestions.less'
import 'swiper/css/bundle'
import '../styles/styles.less'

import './common/share'

import 'paginationjs/dist/pagination.min'
import './common/swiper.js'
import './ui/icons'

import { blockFunctions } from './blocks'
import { commonFunctions } from './common'
import { pagesFunctions } from './pages'

// //block
blockFunctions()

//common
commonFunctions()

//allPages
pagesFunctions()
