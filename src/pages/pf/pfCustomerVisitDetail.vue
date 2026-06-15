<template>
  <div class="pf-customer-visit-detail">
    <!-- 走访信息 -->
    <div class="info-card" v-if="visit">
      <div class="card-header">
        <span class="title">走访日期</span>
        <span class="title-value">{{ visit.visitDate }}</span>
      </div>
      <van-cell-group>
        <van-cell title="走访日期" :value="visit.visitDate" />
        <van-cell title="走访地址" :value="visit.address" />
        <van-cell title="走访人员" :value="visit.visitorType + ' / ' + visit.visitorNames" />
        <van-cell title="家庭AUM" :value="visit.familyAUM + '万元'" />
        <van-cell title="储备AUM" :value="visit.reserveAUM + '万元'" />
        <van-cell title="AUM预计引入时间" :value="visit.aumExpectedTime || '暂无'" />
        <van-cell title="储备富嘉" :value="visit.reserveFujia + '户'" />
        <van-cell title="储备钻石" :value="visit.reserveZuanshi + '户'" />
        <van-cell title="储备私行" :value="visit.reserveSixing + '户'" />
      </van-cell-group>
    </div>

    <!-- 走访照片 -->
    <div class="info-card" v-if="visit && visit.photos && visit.photos.length">
      <div class="card-header">
        <span class="title">走访照片</span>
      </div>
      <div class="photo-grid">
        <van-image
          v-for="(photo, idx) in visit.photos"
          :key="idx"
          width="200px"
          height="200px"
          fit="cover"
          :src="photo"
          @click="previewImage(idx)"
        />
      </div>
    </div>

    <!-- 走访说明 -->
    <div class="info-card" v-if="visit && visit.description">
      <div class="card-header">
        <span class="title">走访说明</span>
      </div>
      <div class="description-text">{{ visit.description }}</div>
    </div>

    <!-- 走访记录列表 -->
    <div class="info-card" v-if="customerId && allVisits.length">
      <div class="card-header">
        <span class="title">走访记录</span>
        <van-button type="warning" size="small" @click="goAddVisit">新增走访</van-button>
      </div>
      <div class="visit-total">该客户共 {{ allVisits.length }} 条走访</div>
      <div
        class="visit-item"
        v-for="item in allVisits"
        :key="item.id"
        @click="switchVisit(item)"
      >
        <div class="visit-tag">走访记录 #{{ item.id }}</div>
        <div class="visit-info">
          {{ item.visitDate }} · 储备AUM {{ item.reserveAUM }}万元{{ item.reserveFujia ? ' · 富嘉 ' + item.reserveFujia + '户' : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { customerVisitList, getCustomerVisitsByCustomerId } from './mockData'

export default {
  name: 'pfCustomerVisitDetail',
  data() {
    return {
      visit: null,
      customerId: '',
      allVisits: [],
    }
  },
  created() {
    const id = this.$route.query.id
    this.customerId = this.$route.query.customerId || ''
    this.visit = customerVisitList.find(v => v.id === id)
    if (this.customerId) {
      this.allVisits = getCustomerVisitsByCustomerId(this.customerId)
    } else if (this.visit) {
      this.customerId = this.visit.customerId
      this.allVisits = getCustomerVisitsByCustomerId(this.visit.customerId)
    }
  },
  methods: {
    previewImage(idx) {
      this.$ImagePreview(this.visit.photos, idx)
    },
    switchVisit(item) {
      this.visit = item
    },
    goAddVisit() {
      this.$router.push({ name: 'pfAddCustomerVisit', query: { id: this.customerId } })
    },
  },
}
</script>

<style lang="less" scoped>
.pf-customer-visit-detail {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 40px;

  .info-card {
    background: #fff;
    margin: 20px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #f0f0f0;
      .title {
        font-size: 30px;
        font-weight: 600;
        color: #323233;
      }
      .title-value {
        font-size: 28px;
        color: #1989fa;
        font-weight: 600;
      }
    }
  }

  .photo-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 20px 24px;
  }

  .description-text {
    padding: 20px 24px;
    font-size: 28px;
    color: #646566;
    line-height: 1.6;
  }

  .visit-total {
    text-align: center;
    padding: 20px;
    font-size: 24px;
    color: #969799;
  }

  .visit-item {
    padding: 20px 24px;
    border-bottom: 1px solid #f5f5f5;
    .visit-tag {
      font-size: 26px;
      color: #1989fa;
      font-weight: 500;
    }
    .visit-info {
      font-size: 24px;
      color: #969799;
      margin-top: 8px;
      line-height: 1.5;
    }
  }
}
</style>
