<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
        <div class="dots">
            <span class="dot" v-for="(item,k) in dots" :class="{active:currentIndex === k}"></span>
        </div>
    </div>
</template>
<script>
    import BScroll from 'better-scroll'
    import {addClass} from 'common/js/dom'
    export default {
        data() {
            return {
                dots: [],//获取轮播的长度，
                currentIndex: 0 //当前的所在的位置
            }
        },
        props: {
            loop: {
                type: Boolean,
                default: true
            },
            autoPlay: {
                type: Boolean,
                default: true
            },
            interval: {
                type: Number,
                default: 4000
            }
        },
        //挂载
        mounted() {
            setTimeout(() => {
                this._setSliderWidth()
                this._initDots()
                this._initSlider()

                if(this.autoPlay) {
                    this._play()
                }
            },20)

            //优化版本。当切换分辨率大小时（未刷新），不可点击
            window.addEventListener('resize', () => {
                if(!this.slider) {
                    return
                }
                this._setSliderWidth(true)
                this.slider.refresh()
            })
        },
        methods: {
            _setSliderWidth(isResize) {
                this.children = this.$refs.sliderGroup.children   //获取节点的子节点
                let width = 0 //定义宽度
                let sliderWidth = this.$refs.slider.clientWidth //获取窗口的大小
                for(let i = 0;i<this.children.length;i++) {
                    let child = this.children[i]
                    addClass(child, 'slider-item') //添加class
                    child.style.width = sliderWidth + 'px' //赋值
                    width += sliderWidth
                }
                if(this.loop && !isResize) {
                    width += 2 * sliderWidth
                }
                //获取所有图片的总长度
                this.$refs.sliderGroup.style.width = width+'px'
            },
            _initSlider() {
                //better-scroll 的一些参数
                this.slider = new BScroll(this.$refs.slider,{
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: true,
                    snapLoop: this.loop,
                    snapThreshold: 0.3,
                    snapSpeed: 400
                })

                this.slider.on('scrollEnd', () => {
                    let pageIndex = this.slider.getCurrentPage().pageX

                    //显示当前节点的下标
                    if(this.loop) {
                        pageIndex -= 1
                    }
                    this.currentIndex = pageIndex

                    if(this.autoPlay) {
                        clearTimeout(this.timer);
                        this._play()
                    }
                })

            },
            _initDots() {
                this.dots= new Array(this.children.length)
            },
            //自动轮播
            _play() {
                let pageIndex = this.currentIndex + 1
                if(this.loop) {
                    pageIndex += 1
                }
                this.timer = setTimeout(() => {
                    this.slider.goToPage(pageIndex,0,400)
                },this.interval)
            }
        },
        destroyed() {
            clearTimeout(this.timer)
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>