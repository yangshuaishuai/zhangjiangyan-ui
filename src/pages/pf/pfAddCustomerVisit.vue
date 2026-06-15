<template>
  <div class="pf-add-customer-visit">
    <!-- 客户信息卡片 -->
    <div class="info-card" v-if="customer">
      <div class="card-header">
        <span class="title">客户信息</span>
        <van-button type="primary" size="mini" plain @click="goEditCustomer">编辑</van-button>
      </div>
      <van-cell-group>
        <van-cell title="客户编号" :value="customer.custNo || '暂无'" />
        <van-cell title="姓名" :value="customer.name || '暂无'" />
        <van-cell title="手机号" :value="customer.maskedPhone || '暂无'" />
        <van-cell title="当前管户网点" :value="customer.branchName || '暂无'" />
        <van-cell title="是否自营" :value="customer.isSelfOperated || '暂无'" />
        <van-cell title="客户等级" :value="customer.custLevel || '暂无'" />
        <van-cell title="当前AUM" :value="(customer.currentAUM || 0) + '万元'" />
      </van-cell-group>
    </div>

    <!-- 走访表单 -->
    <div class="form-section">
      <div class="section-title">客户走访情况</div>
      <div class="checkbox-group">
        <div class="field-label required">走访人员类型</div>
        <van-checkbox-group v-model="visitorTypes" direction="horizontal">
          <van-checkbox
            v-for="item in visitorTypeList"
            :key="item"
            :name="item"
            shape="square"
          >{{ item }}</van-checkbox>
        </van-checkbox-group>
      </div>
      <van-cell-group>
        <van-field
          v-model="form.visitDate"
          is-link
          readonly
          label="走访日期"
          placeholder="请选择"
          required
          @click="showDatePicker = true"
        />
        <van-field v-model="form.address" label="走访地址" placeholder="请输入走访地址" required />
        <van-field name="photos" label="走访照片" required>
          <template #input>
            <van-uploader v-model="fileList" :max-count="9" multiple :after-read="afterRead" />
          </template>
        </van-field>
        <van-field v-model="form.familyAUM" label="家庭AUM(万元)" type="number" placeholder="请输入家庭AUM" />
        <van-field v-model="form.reserveAUM" label="储备AUM(万元)" type="number" placeholder="请输入储备AUM" />
        <van-field v-model="form.aumExpectedTime" label="AUM预计引入时间" placeholder="如 2026-08" />
        <van-field v-model="form.reserveFujia" label="储备富嘉(户)" type="number" placeholder="请输入" />
        <van-field v-model="form.reserveZuanshi" label="储备钻石(户)" type="number" placeholder="请输入" />
        <van-field v-model="form.reserveSixing" label="储备私行(户)" type="number" placeholder="请输入" />
      </van-cell-group>
    </div>

    <div class="footer-btn">
      <van-button type="default" block @click="$router.go(-1)">取消</van-button>
      <van-button type="primary" block @click="onSubmit">提交</van-button>
    </div>

    <van-popup v-model="showDatePicker" position="bottom" round>
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择走访日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getCustomerById, addCustomerVisit, visitorTypeOptions } from './mockData'

export default {
  name: 'pfAddCustomerVisit',
  data() {
    return {
      customer: null,
      visitorTypes: [],
      visitorTypeList: ['二分行领导', '二分个金总', '一支行领导', '二支行长', '财富顾问', '私行客户经理', '理财经理', '客户经理', '渠道专员'],
      form: {
        visitDate: '',
        address: '',
        familyAUM: '',
        reserveAUM: '',
        aumExpectedTime: '',
        reserveFujia: '',
        reserveZuanshi: '',
        reserveSixing: '',
      },
      fileList: [],
      showDatePicker: false,
      currentDate: new Date(),
      minDate: new Date(2025, 0, 1),
      maxDate: new Date(2027, 11, 31),
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      this.customer = getCustomerById(id)
    }
  },
  methods: {
    onDateConfirm(value) {
      const d = new Date(value)
      this.form.visitDate = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
      this.showDatePicker = false
    },
    afterRead(file) {
      console.log('上传照片', file)
    },
    goEditCustomer() {
      this.$router.push({ name: 'pfEditCustomer', query: { id: this.customer.id } })
    },
    onSubmit() {
      if (!this.visitorTypes.length) {
        this.$toast('请选择走访人员类型')
        return
      }
      if (!this.form.visitDate) {
        this.$toast('请选择走访日期')
        return
      }
      if (!this.form.address) {
        this.$toast('请输入走访地址')
        return
      }
      addCustomerVisit({
        customerId: this.customer.id,
        visitDate: this.form.visitDate,
        visitorType: this.visitorTypes[0] || '',
        visitorNames: this.visitorTypes.slice(1).join(' / ') || this.visitorTypes[0],
        address: this.form.address,
        photos: [],
        familyAUM: Number(this.form.familyAUM) || 0,
        reserveAUM: Number(this.form.reserveAUM) || 0,
        aumExpectedTime: this.form.aumExpectedTime,
        reserveFujia: Number(this.form.reserveFujia) || 0,
        reserveZuanshi: Number(this.form.reserveZuanshi) || 0,
        reserveSixing: Number(this.form.reserveSixing) || 0,
        description: '',
      })
      this.$toast('提交成功')
      setTimeout(() => {
        this.$router.go(-1)
      }, 500)
    },
  },
}
</script>

<style lang="less" scoped>
.pf-add-customer-visit {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 120px;

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
    }
  }

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

    .checkbox-group {
      padding: 20px 24px;
      border-bottom: 1px solid #f0f0f0;

      .field-label {
        font-size: 28px;
        color: #646566;
        margin-bottom: 16px;
        &.required::before {
          content: '*';
          color: #ee0a24;
          margin-right: 4px;
        }
      }

      .van-checkbox-group--horizontal {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .van-checkbox {
        margin-right: 0;
        margin-bottom: 8px;
      }
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
