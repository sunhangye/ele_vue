<template>
  <transition name="move">
    <div class="food" v-show="isShow" ref="food">
      <div class="food-content">
      <!--商品封面-->
      <div class="image-header">
        <img :src="food.image" alt="">
        <div class="back" @click="show(false)">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <!--主内容去-->
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="now">￥{{food.price}}</span>
          <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div>
        <!--引进cartcontrol组件，并且用一个div包裹她-->
        <div class="cartcontrol-wrapper">
          <cartcontrol :update-food-count="updateFoodCount" :food="food"></cartcontrol>
        </div>
        <transition name="fade">
          <!--使用.stop.prevent阻止冒泡和默认行为，避免穿透-->
          <!--加入购物车按钮有一个动画fade,并且因为他的位置跟cartcontrol有重叠,避免穿透,所以直接.click.stop.prevent-->
          <div class="buy" v-if="!food.count" @click.stop.prevent="updateFoodCount(food, true, $event)">加入购物车</div>
        </transition>
        </div>

      <split></split>

      <div class="info">
        <h1 class="title">商品消息</h1>
        <p class="text">{{food.info}}</p>
      </div>

      <split></split>

      <div class="rating">
        <h1 class="title">商品评价</h1>
        <!--ratingSelect组件-->
        <ratingselect :desc="desc" :only-content="onlyContent"
                      :ratings="food.ratings"
                      :select-type="selectType"
                      @setSelectType="setSelectType"
                      @swichOnlyConyent="switchOnlyContent"></ratingselect>
        <div class="rating-wrapper">
          <!--根据rating长度来显示ratings-->
          <ul v-show="food.ratings && food.ratings.length">
            <li class="rating-item border-1px" v-for="rating in filterRatings">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img width="12" height="12"class="avater" :src="rating.avatar" alt="" >
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span :class="rating.rateType===0 ? 'icon-thumb_up' : 'icon-thunb_down'"></span>
                {{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.rating || food.rating.length===0">
            暂无评价
          </div>
        </div>

      </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import split from  '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'
  import { formatDate } from '../../common/date'
  const ALL = 2
  export default {
    props: {
      food: {
        type: Object,
      },
      updateFoodCount: Function
    },
    data () {
      return {
        isShow: false,
        onlyContent: true,
        selectType: ALL
      }
    },
    created () {
      this.desc = {
        all: '全部',
        positive: '满意',
        nagetive: '不满意'
      }
    },
    methods: {
      show(isShow){
        this.isShow = !this.isShow
        if(isShow){
          this.$nextTick(() => {// 异步添加滚动绑定
            if(!this.scroll){
              this.scroll = new BScroll(this.$refs.food, {
                click: true
              })
            }else {
              this.scroll.refresh()
            }
          })
        }
      },
      addFirst (event) {
        if(!event._constructed){
            return
        }
        this.$emit(updateFoodCount(food, true, event), event.target)
        Vue.set(this.food, 'count', 1)
      },

      setSelectType (selectType) {
        this.selectType = selectType

        this.$nextTick(() => {
          // 刷新列表的Scroll对象
          this.scroll.refresh()
        })
      },

      switchOnlyContent () {// 切换显示是否有内容的rate
        this.onlyContent = !this.onlyContent
        console.log(this.onlyContent);
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    },
    computed: {
      filterRatings () {
        if(!this.food.ratings){
            return
        }
        const {selectType, onlyContent} = this
        // selectType: 0, 1, 2
        // onlyContent: true false
        return this.food.ratings.filter(rating => {
          if(selectType===2){
            // 如果onlyContent为false,直接返回true,否则还要看text有没有值
            return !onlyContent || !!rating.text
          }else {
            return selectType === rating.rateType && (!onlyContent || !!rating.text)
          }
        })
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"

  .food
    position absolute
    top 0px
    left 0px
    bottom 48px
    z-index: 30
    width 100%
    background: #fff
    transform translate3d(0, 0, 0)

    &.move-enter-active, &.move-leave-active
      transition all 0.2s linear

    &.move-enter, &.move-leave-active
      transform translate3d(100%, 0, 0)

    .image-header
      position: relative
      width 100%
      height 0
      padding-top 100%// css-hack 实现高度自适应
      img
        position absolute
        top:0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top: 10px
        left 0
        .icon-arrow_lift
          display block
          padding 20px
          font-size 20px
          color #fff

    .content
      position relative
      padding 18px
      .title
        line-height 14px
        margin-bottom 8px
        font-size 16px
        font-weight 700
        color rgb(7, 17, 27)
      .detail
        margin-bottom 18px
        line-height 10px
        height 10px
        font-size 0px
        .sell-count, .rating
          font-size 10px
          color rgb(147, 153, 159)
        .sell-count
          margin-right 12px
      .price
        font-weight 700
        line-height 24px
        .now
          margin-right 8px
          font-size 15px
          color rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size 11px
          color rgb(147, 153, 159)
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10 // 显示在cartcontrol外面
        height 24px
        line-height 24px
        padding 0 12px
        box-sizing border-box
        border-radius 12px
        font-size 10px
        color #ffff
        background: rgb(0, 160, 220)
        &.fade-transiton
          transition all 0.2s
          opacity 1
        &.fade-enter, &-fade-leave
          opacity 0
          z-index -1

    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7, 17, 27)
        .text
          line-height 24px
          padding 0 8px
          font-size 12px
          color rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)

        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>

