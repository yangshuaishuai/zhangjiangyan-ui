<template>
  <div class="pf-edit-reserve">
    <div class="form-section">
      <div class="section-title">储备客户信息</div>
      <van-cell-group>
        <van-field v-model="form.name" label="姓名" placeholder="请输入姓名" required />
        <van-field v-model="form.phone" label="手机号" placeholder="请输入手机号" required />
        <van-field
          v-model="form.custLevel"
          is-link
          readonly
          label="客户等级"
          placeholder="请选择客户等级"
          @click="showLevelPicker = true"
        />
        <van-field v-model="form.reserveAUM" label="储备AUM(万元)" type="number" placeholder="请输入储备AUM" />
        <van-field v-model="form.expectedTime" label="预计引入时间" placeholder="如 2026-07" />
        <van-field v-model="form.source" label="来源" placeholder="如 公司走访/客户推荐/代发转化" />
        <van-field v-model="form.companyName" label="关联公司" placeholder="请输入关联公司" />
      </van-cell-group>
    </div>

    <div class="footer-btn">
      <van-button type="default" block @click="$router.go(-1)">取消</van-button>
      <van-button type="primary" block @click="onSave">保存</van-button>
    </div>

    <van-popup v-model="showLevelPicker" position="bottom" round>
      <van-picker :columns="levelColumns" @confirm="onLevelConfirm" @cancel="showLevelPicker = false" />
    </van-popup>
  </div>
</template>

<script>
import { reserveCustomerList, custLevelOptions } from './mockData'

export default {
  name: 'pfEditReserveCustomer',
  data() {
    return {
      isEdit: false,
      reserveId: '',
      form: {
        name: '',
        phone: '',
        custLevel: '',
        reserveAUM: '',
        expectedTime: '',
        source: '',
        companyName: '',
      },
      showLevelPicker: false,
      levelColumns: custLevelOptions.map(o => o.text),
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true
      this.reserveId = id
      const item = reserveCustomerList.find(c => c.id === id)
      if (item) {
        this.form = {
          name: item.name || '',
          phone: item.phone || '',
          custLevel: item.custLevel || '',
          reserveAUM: item.reserveAUM || '',
          expectedTime: item.expectedTime || '',
          source: item.source || '',
          companyName: item.companyName || '',
        }
      }
    }
  },
  methods: {
    onLevelConfirm(value) {
      this.form.custLevel = value
      this.showLevelPicker = false
    },
    onSave() {
      if (!this.form.name || !this.form.phone) {
        this.$toast('请输入姓名和手机号')
        return
      }
      if (this.isEdit) {
        const idx = reserveCustomerList.findIndex(c => c.id === this.reserveId)
        if (idx >= 0) {
          reserveCustomerList[idx] = {
            ...reserveCustomerList[idx],
            ...this.form,
            reserveAUM: Number(this.form.reserveAUM) || 0,
            maskedPhone: this.form.phone ? this.form.phone.substring(0, 3) + '****' + this.form.phone.substring(7) : '',
          }
        }
        this.$toast('保存成功')
      } else {
        reserveCustomerList.push({
          ...this.form,
          id: 'RC' + String(reserveCustomerList.length + 1).padStart(3, '0'),
          reserveAUM: Number(this.form.reserveAUM) || 0,
          maskedPhone: this.form.phone ? this.form.phone.substring(0, 3) + '****' + this.form.phone.substring(7) : '',
          companyId: '',
        })
        this.$toast('新增成功')
      }
      setTimeout(() => {
        this.$router.go(-1)
      }, 500)
    },
  },
}
</script>

<style lang="less" scoped>
.pf-edit-reserve {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 120px;

  .form-section {
    margin: 20px;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;

    .section-title {
      padding: 20px 24px;
      font-size: 30px;
      font-weight: 600;
      color: #323233;
      border-bottom: 1px solid #f0f0f0;
    }
  }

  .footer-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 20px;
    padding: 20px 30px;
    background: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  }
}
</style>
