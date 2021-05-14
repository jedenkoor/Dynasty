import Swiper from 'swiper/swiper-bundle.js'
import 'swiper/swiper-bundle.css'
import IMask from 'imask'

import ScrollMagic from 'scrollmagic'
import { gsap, TweenMax } from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
gsap.registerPlugin(ScrollToPlugin)

class Init {
  constructor() {
    this.init()

    // Init smothscroll
    this.controller = new ScrollMagic.Controller()
    this.controller.scrollTo(function (newpos) {
      TweenMax.to(window, 0.6, { scrollTo: { y: newpos } })
    })

    this.directionScroll = []
  }

  init() {
    this.events()

    this.actions().initPhoneMask()

    setTimeout(() => {
      this.actions().showBody()
      this.actions().scrollToBlockOnLoading()
    }, 300)

    if (document.querySelectorAll('.case__slider').length) {
      const caseSliders = document.querySelectorAll('.case__slider')
      caseSliders.forEach((item) => {
        this.actions().initCaseSlider(item)
      })
    }
  }

  events() {
    const _this = this

    document.addEventListener('scroll', (e) => {
      _this.actions().toggleHeaderOnScroll()
    })

    window.ap(document).on('click', '.header-theme', (e) => {
      e.preventDefault()
      _this.actions().themeToggle()
    })

    window.ap(document).on('click', 'a.header-list__link', function (e) {
      e.preventDefault()
      _this.actions().scrollToBlock(this)
      if (document.documentElement.clientWidth < 1024) {
        _this.actions().toggleMenu(this)
      }
    })

    window.ap(document).on('click', '.footer-list__link', function (e) {
      e.preventDefault()
      _this.actions().scrollToBlock(this)
    })

    const emailInput = document.querySelectorAll('input[data-type="email"]')
    emailInput.forEach((item) => {
      item.addEventListener('blur', function () {
        _this.actions().checkEmail(this)
      })
    })

    const noTelAndEmailInput = document.querySelectorAll(
      'input:not([data-type="tel"]):not([data-type="email"]), textarea'
    )
    noTelAndEmailInput.forEach((item) => {
      item.addEventListener('blur', function () {
        _this.actions().checkOtherInputs(this)
      })
    })

    window.ap(document).on('click', '.popup-btn', function (e) {
      e.preventDefault()
      _this.actions().showPopup(this)
    })

    window.ap(document).on('click', '.overlay, .popup__close', function (e) {
      e.preventDefault()
      _this.actions().hidePopup(this)
    })

    const inputs = document.querySelectorAll('input')
    if (inputs.length) {
      inputs.forEach((item) => {
        item.addEventListener('focus', function () {
          this.select()
        })
      })
    }

    window.ap(document).on('click', '.header-list__link.btn-secondary', function (e) {
      e.preventDefault()
      _this.actions().toggleMenu(this)
    })
    document.addEventListener('click', (e) => {
      const menuBtn = document.querySelector('.header-list__link.btn-secondary')
      const menuContainer = document.querySelector('.header-list__level')
      if (
        e.target !== menuContainer &&
        e.target.closest('.header-list__level') === null &&
        e.target !== menuBtn &&
        e.target.closest('.header-list__link.btn-secondary') === null
      ) {
        menuBtn.classList.remove('header-list__link--active')
        menuContainer.classList.remove('header-list__level--active')
      }
    })

    window.ap(document).on('click', '.btn-primary', function (e) {
      _this.actions().btnClick(this, e)
    })
  }

  actions() {
    const _this = this

    return {
      scrollToBlockOnLoading() {
        if (localStorage.getItem('idBLock')) {
          const element = document.querySelector(`#${localStorage.getItem('idBLock')}`)
          const topPos = element.getBoundingClientRect().top + window.pageYOffset
          window.scrollTo({
            top: topPos
          })
          localStorage.removeItem('idBLock')
        }
      },
      scrollToBlock(el) {
        const id = el.getAttribute('href').split('#')[1] || ''
        const linkPathname = el.getAttribute('href').split('#')[0]
        const currentPathname = location.pathname
        if (id.length > 0 && currentPathname === linkPathname) {
          _this.controller.scrollTo(`#${id}`)
        }
        if (currentPathname !== linkPathname) {
          localStorage.setItem('idBLock', id)
          location.href = linkPathname
        }
      },
      toggleHeaderOnScroll() {
        if (window.pageYOffset > 50) {
          document.querySelector('.header').classList.add('header--blur')
        } else {
          document.querySelector('.header').classList.remove('header--blur')
        }
      },
      initPhoneMask() {
        document.querySelectorAll('[data-type="tel"]').forEach((item) => {
          const telMask = IMask(item, {
            mask: '+{7} 000 000 00 00'
          })
          let flagInput = true
          item.addEventListener('input', (e) => {
            if ((e.target.value === '+7 8' || e.target.value === '+7') && flagInput === true) {
              e.target.value = '+7'
              telMask.masked.reset()
              telMask.value = '+7'
              flagInput = false
            } else if (e.target.value === '') {
              flagInput = true
            }
          })
          telMask.on('accept', function () {
            item.classList.remove('input-border')
          })
          telMask.on('complete', function () {
            item.classList.add('input-border')
          })
        })
      },
      checkEmail(el) {
        const pattern = /^[a-z0-9_.-]+@[a-z0-9_.-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i
        if (el.value !== '') {
          if (el.value.search(pattern) === 0) {
            el.classList.remove('input-err')
            el.classList.add('input-border')
          } else {
            el.classList.add('input-err')
            el.classList.remove('input-border')
          }
        } else {
          el.classList.remove('input-err')
          el.classList.remove('input-border')
        }
      },
      checkOtherInputs(el) {
        if (el.value !== '') {
          el.classList.add('input-border')
        } else {
          el.classList.remove('input-border')
        }
      },
      themeToggle() {
        const htmlClassList = document.querySelector('html').classList
        htmlClassList.toggle('light-theme')
        if (htmlClassList.contains('light-theme')) {
          localStorage.setItem('theme', 'light')
        } else {
          localStorage.removeItem('theme')
        }
      },
      showBody() {
        if (localStorage.getItem('theme') === 'light') {
          document.querySelector('html').classList.add('light-theme')
        }
        document.querySelector('body').style.opacity = 1
      },
      getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth
      },
      showPopup(el) {
        const overlay = document.querySelector('.overlay')
        const popupSelector = el.getAttribute('data-popup')
        const popup = document.querySelector(`.popup[data-popup="${popupSelector}"]`)
        const popupClose = popup.querySelector('.popup__close')
        const popupServices = el.getAttribute('data-services')

        el.classList.add('popup-trigger')
        popup.classList.add('popup--active')
        overlay.classList.add('overlay--active')
        if (this.getScrollbarWidth()) {
          document.querySelector('html').classList.add('compensate-for-scrollbar')
        }
        document.querySelector('html').classList.add('fixed')
        if (document.documentElement.clientWidth > 1024) {
          popupClose.focus()
        }

        if (popupServices) {
          popup.querySelector('.select-open span').innerText = popupServices
          popup.querySelector(`.select-block input[value="${popupServices}"]`).checked = true
        }
      },
      hidePopup(el) {
        if (el.classList.contains('overlay--menu')) {
          el.classList.remove('overlay--menu')
          document.querySelector('.header__wrap').classList.remove('header__wrap--active')
          document.querySelector('.header__burger').classList.remove('header__burger--active')
        } else {
          const overlay = document.querySelector('.overlay')
          const popup = document.querySelector('.popup--active')
          const popupTrigger = document.querySelector('.popup-trigger')
          popup.classList.remove('popup--active')
          overlay.classList.remove('overlay--active')
          popupTrigger.focus()
          popupTrigger.classList.remove('popup-trigger')
        }
        document.querySelector('html').classList.remove('compensate-for-scrollbar')
        document.querySelector('html').classList.remove('fixed')
      },
      initCaseSlider(el) {
        const prevArr = el.querySelector('.swiper-button-prev')
        const nextArr = el.querySelector('.swiper-button-next')
        const pagination = el.querySelector('.swiper-pagination')
        ;(() =>
          new Swiper(el, {
            loop: true,
            spaceBetween: 15,
            slidesPerView: 'auto',
            navigation: {
              prevEl: prevArr,
              nextEl: nextArr
            },
            pagination: {
              el: pagination,
              clickable: true
            },
            breakpoints: {
              768: {
                slidesPerView: 2
              }
            }
          }))()
      },
      toggleMenu(el) {
        const menu = document.querySelector('.header-list__level')

        el.classList.toggle('header-list__link--active')
        menu.classList.toggle('header-list__level--active')
      },
      btnClick(el, event) {
        const button = el.getBoundingClientRect()
        const buttonEffect = el.querySelector('.btn-primary__click')
        const buttonEffectHtml = `<div class="btn-primary__click" style="top:${event.clientY - 10 - button.y}px; left:${
          event.clientX - 10 - button.x
        }px;"></div>`
        if (buttonEffect) buttonEffect.remove()
        el.insertAdjacentHTML('afterbegin', buttonEffectHtml)
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.controller = new Init()
})
