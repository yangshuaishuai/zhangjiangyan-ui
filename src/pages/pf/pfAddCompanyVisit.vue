<template>
  <div class="pf-add-company-visit">
    <!-- 公司信息卡片 -->
    <div class="info-card" v-if="company">
      <div class="card-header">
        <span class="title">公司信息</span>
        <van-button type="primary" size="mini" @click="goEditCompany">编辑</van-button>
      </div>
      <van-cell-group>
        <van-cell title="公司类型" :value="company.type || '暂无'" />
        <van-cell title="公司名称" :value="company.name || '暂无'" />
        <van-cell title="企业客户号" :value="company.enterpriseNo || '暂无'" />
        <van-cell title="授信金额" :value="(company.creditAmount || 0) + '万元'" />
        <van-cell title="贷款余额" :value="(company.loanBalance || 0) + '万元'" />
      </van-cell-group>
    </div>

    <!-- 走访表单 -->
    <div class="form-section">
      <div class="section-title">公司走访情况</div>
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
        <van-field v-model="form.payrollReserveAmount" label="代发储备金额(万元)" type="number" placeholder="请输入代发储备金额" />
        <van-field v-model="form.address" label="走访地址" placeholder="请输入走访地址" required />
        <van-field name="photos" label="走访照片" required>
          <template #input>
            <van-uploader v-model="fileList" :max-count="9" multiple :after-read="afterRead" />
          </template>
        </van-field>
        <van-field
          v-model="form.description"
          rows="3"
          autosize
          label="走访说明"
          type="textarea"
          placeholder="请输入走访说明"
        />
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
import { getCompanyById, addCompanyVisit, visitorTypeOptions } from './mockData'

export default {
  name: 'pfAddCompanyVisit',
  data() {
    return {
      company: null,
      visitorTypes: [],
      visitorTypeList: ['二分行领导', '二分个金总', '一支行领导', '二支行长', '财富顾问', '私行客户经理', '理财经理', '客户经理', '渠道专员'],
      form: {
        visitDate: '',
        payrollReserveAmount: '',
        address: '',
        description: '',
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
      this.company = getCompanyById(id)
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
    goEditCompany() {
      this.$router.push({ name: 'pfEditCompany', query: { id: this.company.id } })
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
      addCompanyVisit({
        companyId: this.company.id,
        visitDate: this.form.visitDate,
        visitorType: this.visitorTypes[0] || '',
        visitorNames: this.visitorTypes.slice(1).join(' / ') || this.visitorTypes[0],
        address: this.form.address,
        photos: [],
        payrollReserveAmount: Number(this.form.payrollReserveAmount) || 0,
        description: this.form.description,
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
.pf-add-company-visit {
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
