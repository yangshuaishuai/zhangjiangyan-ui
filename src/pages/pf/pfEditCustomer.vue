<template>
  <div class="pf-edit-customer">
    <div class="form-section">
      <div class="section-title">客户信息</div>
      <van-cell-group>
        <van-field v-model="form.custNo" label="客户编号" placeholder="如填写客户编号，其他字段自动查询反显；如不填写，姓名和手机号必填" />
        <van-field v-model="form.name" label="姓名" placeholder="请输入姓名" required />
        <van-field v-model="form.phone" label="手机号" placeholder="请输入手机号" required />
        <van-field v-model="form.branchName" label="当前管户网点" placeholder="请输入管户网点" />
        <van-field
          v-model="form.isSelfOperated"
          is-link
          readonly
          label="是否自营"
          placeholder="请选择"
          @click="showSelfPicker = true"
        />
        <van-field
          v-model="form.custLevel"
          is-link
          readonly
          label="客户等级"
          placeholder="请选择客户等级"
          @click="showLevelPicker = true"
        />
        <van-field v-model="form.currentAUM" label="当前AUM(万元)" type="number" placeholder="请输入当前AUM" />
      </van-cell-group>
    </div>

    <div class="footer-btn">
      <van-button type="default" block @click="$router.go(-1)">取消</van-button>
      <van-button type="primary" block @click="onSave">保存</van-button>
    </div>

    <van-popup v-model="showSelfPicker" position="bottom" round>
      <van-picker :columns="['是', '否']" @confirm="onSelfConfirm" @cancel="showSelfPicker = false" />
    </van-popup>

    <van-popup v-model="showLevelPicker" position="bottom" round>
      <van-picker :columns="levelColumns" @confirm="onLevelConfirm" @cancel="showLevelPicker = false" />
    </van-popup>
  </div>
</template>

<script>
import { getCustomerById, updateCustomer, addCustomer, custLevelOptions } from './mockData'

export default {
  name: 'pfEditCustomer',
  data() {
    return {
      isEdit: false,
      customerId: '',
      form: {
        custNo: '',
        name: '',
        phone: '',
        branchName: '',
        isSelfOperated: '',
        custLevel: '',
        currentAUM: '',
      },
      showSelfPicker: false,
      showLevelPicker: false,
      levelColumns: custLevelOptions.map(o => o.text),
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true
      this.customerId = id
      const customer = getCustomerById(id)
      if (customer) {
        this.form = {
          custNo: customer.custNo || '',
          name: customer.name || '',
          phone: customer.phone || '',
          branchName: customer.branchName || '',
          isSelfOperated: customer.isSelfOperated || '',
          custLevel: customer.custLevel || '',
          currentAUM: customer.currentAUM || '',
        }
      }
    }
  },
  methods: {
    onSelfConfirm(value) {
      this.form.isSelfOperated = value
      this.showSelfPicker = false
    },
    onLevelConfirm(value) {
      this.form.custLevel = value
      this.showLevelPicker = false
    },
    onSave() {
      if (!this.form.custNo && (!this.form.name || !this.form.phone)) {
        this.$toast('如不填写客户编号，姓名和手机号必填')
        return
      }
      if (this.isEdit) {
        updateCustomer(this.customerId, { ...this.form, currentAUM: Number(this.form.currentAUM) || 0 })
        this.$toast('保存成功')
      } else {
        addCustomer({
          ...this.form,
          currentAUM: Number(this.form.currentAUM) || 0,
          maskedPhone: this.form.phone ? this.form.phone.substring(0, 3) + '****' + this.form.phone.substring(7) : '',
          companyId: '',
          companyName: '',
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
.pf-edit-customer {
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
