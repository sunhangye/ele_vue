<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <!--current-->
          <li class="menu-item" v-for="(good, index) in goods"
              :class="{current: index===currentIndex}" @click="clickMenuItem(index, $event)">
            <span class="text border-1px">
              <span class="icon" v-if="good.type>=0" :class="classMap[good.type]"></span>{{good.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li class="food-list food-list-hook" v-for="good in goods">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item border-1px" v-for="food in good.foods">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" :update-food-count="updateFoodCount"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="food"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  const OK = 0
  export default {
    data () {
          return {
            goods: [],
            tops: [],
            scrollY: 0
          }
      },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      axios.get('/api/goods')
        .then(response => {
          const result = response.data
          console.log(result);
          if (result.code === OK) {
            this.goods = result.data
            // 在下次 DOM 更新循环结束之后执行延时回调。（必须等DOM结构完全加载结束后调用回调才会生效）在修改数据之后立即使用这个方法，获取更新后的 DOM -- nextTick from website
            /*
             1. 在Vue生命周期的created()钩子函数进行的DOM操作一定要放在Vue.nextTick()的回调函数中。之对应的就是mounted钩子函数，因为该钩子函数执行时所有的DOM挂载和渲染都已完成，此时在该钩子函数中进行任何DOM操作都不会有问题 。
             2. 在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的DOM结构的时候，这个操作都应该放进Vue.nextTick()的回调函数中。
             */
            Vue.nextTick(() => {
              // 初始化滚动条
              this._initScroll()
              // 读取右侧所有分类的top值
              this._initTops()
            })
          }
        })
    },

    methods: {
      _initScroll () {
        // 创建分类列表的Scoll对象
         new BScroll(this.$refs.menuWrapper, {
            click: true
        })
        // 创建food列表的Scoll对象
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
            /*bs插件为我们提供了一个实时获取y值的方法，我们在初始化this.foodScroll的时候加一个·属性probeType: 3，其作用就是实时获取y值，相当于探针的作用。
             probeType: 1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发 - scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
            * */

          probeType: 3,
          click: true
        })
        // 绑定 scroll监听
        this.foodsScroll.on('scroll', (pos) => {
          console.log(pos,pos.y);
          // Math.abs 去绝对值
          this.scrollY = Math.abs(pos.y)
        })
      },
      _initTops () {
        let tops = this.tops
        let top = 0
        tops.push(top)
        let lis = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        ;[].slice.call(lis).forEach(li => {
            top += li.clientHeight
            tops.push(top)
        })
        console.log(tops)
      },
      clickMenuItem (index, event) {
        // 自己默认派发事件时候(BScroll),_constructed被置为true,但是浏览器原生并没有这个属性
        if (!event._constructed) {
            return
        }
        console.log(index, event)
        let li = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')[index]
        this.foodsScroll.scrollToElement(li, 300)
      },
      updateFoodCount (food, idAdd,event) {
          console.log(idAdd, food.count);
          if (!event._constructed) {
              return
          }
          if(idAdd){ // 增加
              if(!food.count){ // 判断第一次
                console.log('updateFoodCount() 第一次')
                // 新增count属性
                // food.count = 1
                // 没有监视-->没有数据绑定，界面不会更新
                Vue.set(food, 'count', 1)
              }else {
                  food.count--
              }

          }else {
              if(food.count){
                food.count--
              }
          }
      }
    },
    computed: {
      currentIndex () {
        const {tops, scrollY} = this
        // scrollY 大于或等于当前的top, 且小于下一个top
        // 判断当currentIndex在height1和height2之间的时候显示
        return tops.findIndex((top, index) => {
            return scrollY>=top && scrollY< tops[index+1]
        })
      }
    },
    components: {
      cartcontrol
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  [v-cloak]
    display none
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display inline-block
          vertical-align middle
          width: 12px
          height: 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          width: 56px
          vertical-align middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size 12px
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            height 14px
            line-height: 14px
            font-size 14px
            color rgb(7, 17, 27)
          .desc, .extra
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
          .desc
            line-height 12px
            margin-bottom 8px
          .extra
            .count
              margin-right 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position absolute
            right 0px
            bottom 12px

</style>

