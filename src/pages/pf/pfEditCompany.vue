<template>
  <div class="pf-edit-company">
    <div class="form-section">
      <div class="section-title">公司信息</div>
      <van-cell-group>
        <van-field
          v-model="form.type"
          is-link
          readonly
          label="公司类型"
          placeholder="请选择"
          @click="showTypePicker = true"
        />
        <van-field v-model="form.name" label="公司名称" placeholder="请输入公司名称" required />
        <van-field v-model="form.enterpriseNo" label="企业客户号" placeholder="请输入企业客户号" />
        <van-field v-model="form.creditAmount" label="授信金额(万元)" type="number" placeholder="请输入授信金额" />
        <van-field v-model="form.loanBalance" label="贷款余额(万元)" type="number" placeholder="请输入贷款余额" />
        <van-field v-model="form.contactPerson" label="联系人" placeholder="请输入联系人" />
        <van-field v-model="form.contactPhone" label="联系电话" placeholder="请输入联系电话" />
        <van-field v-model="form.address" label="地址" placeholder="请输入地址" />
        <van-field v-model="form.category" label="分类" placeholder="请输入分类" />
      </van-cell-group>
    </div>

    <div class="footer-btn">
      <van-button type="default" block @click="$router.go(-1)">取消</van-button>
      <van-button type="primary" block @click="onSave">保存</van-button>
    </div>

    <!-- 公司类型选择 -->
    <van-popup v-model="showTypePicker" position="bottom" round>
      <van-picker
        :columns="typeColumns"
        @confirm="onTypeConfirm"
        @cancel="showTypePicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getCompanyById, updateCompany, addCompany, companyTypeOptions } from './mockData'

export default {
  name: 'pfEditCompany',
  data() {
    return {
      isEdit: false,
      companyId: '',
      form: {
        type: '',
        name: '',
        enterpriseNo: '',
        creditAmount: '',
        loanBalance: '',
        contactPerson: '',
        contactPhone: '',
        address: '',
        category: '',
      },
      showTypePicker: false,
      typeColumns: companyTypeOptions.map(o => o.text),
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      this.isEdit = true
      this.companyId = id
      const company = getCompanyById(id)
      if (company) {
        this.form = {
          type: company.type || '',
          name: company.name || '',
          enterpriseNo: company.enterpriseNo || '',
          creditAmount: company.creditAmount || '',
          loanBalance: company.loanBalance || '',
          contactPerson: company.contactPerson || '',
          contactPhone: company.contactPhone || '',
          address: company.address || '',
          category: company.category || '',
        }
      }
    }
  },
  methods: {
    onTypeConfirm(value) {
      this.form.type = value
      this.showTypePicker = false
    },
    onSave() {
      if (!this.form.name) {
        this.$toast('请输入公司名称')
        return
      }
      if (this.isEdit) {
        updateCompany(this.companyId, this.form)
        this.$toast('保存成功')
      } else {
        addCompany({ ...this.form, creditAmount: Number(this.form.creditAmount) || 0, loanBalance: Number(this.form.loanBalance) || 0 })
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
.pf-edit-company {
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
