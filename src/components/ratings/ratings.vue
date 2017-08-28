<template>
  <div class="ratings" ref="ratings">
    <scroller>
      <div class="ratings-content">
        <div class="overview">
          <div class="overview-left">
            <h1 class="score">{{seller.score}}</h1>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}</div>
          </div>
          <div class="overview-right">
            <!--三个一样的模块：服务态度，商品评分，送达时间-->
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <star :score="seller.serviceScore" :size="36"></star>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">商品评分</span>
              <star :size="36" :score="seller.foodScore"></star>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery-wrapper">
              <span class="title">送达时间</span>
              <span class="delivery">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>

        <split></split>

        <!--ratingSelect组件-->
        <ratingselect :desc="desc" :only-content="onlyContent"
                      :ratings="food.ratings"
                      :select-type="selectType"
                      @setSelectType="setSelectType"
                      @swichOnlyConyent="switchOnlyContent"></ratingselect>

        <div class="rating-wrapper">
          <ul>
            <li class="rating-item" v-for="rating in filterRatings">
              <div class="avatar">
                <img width="28" height="28" :src="rating.avatar">
              </div>
              <div class="content">
                <h1 class="name">{{rating.username}}</h1>
                <div class="star-wrapper">
                  <star :score="rating.score" :size="24"></star>
                  <span class="delivery">{{rating.deliveryTime}}</span>
                </div>
                <p class="text">{{rating.text}}</p>
                <div class="recommend">
                  <span :class="rating.rateType===0?'icon-thumb_up':'icon-thumb_down'"></span>
                  <span class="item" v-for="item in rating.recommend">{{item}}</span>
                </div>
                <div class="time">
                  {{rating.rateTime | date-string}}
                </div>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </scroller>

  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'

  export default {
    props: {
      seller: Object
    },
    created: {
      /*this.$nextTick(() => {
       this.scroll = new BScroll(this.$refs.ratings, {
       click: true
       })
       })*/
    },
    components: {
      star,
      split,
      ratingselect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"

  .ratings
    position relative
    //top: 174px // 留空一部分，给header使用
    bottom:0
    left 0
    width 100%
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .overview-left
        flex 0 0 137px
        padding 6px 0
        width: 137px
        border-right 1px solid rgba(7,17,27, 0.1)
        text-align center
        @media only screen and (max-width 320px)
          flex 0 0 120
          width: 120px
        .score
          margin-bottom 8px
          line-height 28px
          height 24px
          font-size 24px
          color rgb(255, 153, 0)
        .title
          margin-bottom: 10px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        @media only screen and (max-width 320px)
          padding-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0px
          .title
            display inline-block
            line-height 18px
            vertical-align top
            font-size 12px
            color rgb(7, 17, 127)
          .star
            display inline-block
            margin 0 12px
            vertical-align top
          .score
            display inline-block
            line-height 18px
            vertical-align top
            font-size 12px
            color rgb(255, 153, 0)
        .delivery-wrapper
          font-size 0px
          .title
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
          .delivery
            margin-left 12px
            font-size 12px
            color rgb(147, 153, 159)

</style>
