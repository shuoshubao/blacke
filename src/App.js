import React, { useRef, useState, useEffect } from 'react'
import { Card, Space, Descriptions, Form, InputNumber, Select, Input, DatePicker, Typography } from 'antd'
import { formatTime, add, mul, div } from '@nbfe/tools'
import moment from 'moment'
import { omit } from 'lodash'

const { Text } = Typography

const YearEndBonusMonthEnum = [12, 13, 14, 15, 15.5, 16].map(v => {
  return {
    value: v,
    label: v
  }
})

const DamagesModeEnum = [
  {
    label: '2N',
    value: '2n'
  },
  {
    label: 'N+1',
    value: 'n1'
  },
  {
    label: 'N',
    value: 'n'
  }
]

const columns = [
  { label: '年假折现', name: 'money_holidays' },
  { label: '年终奖', name: 'money_bonus' },
  { label: '赔偿金', name: 'money_damages' },
  { label: '合计', name: 'money_total' }
]

let defaultData = {
  start_day: '2020-01-01',
  end_day: formatTime(Date.now()),
  month_salary: 50000,
  year_end_bonus_month: 16,
  achievement: 1,
  unused_days: 1,
  damages_mode: '2n'
}

if (!window.localStorage.getItem('blackData')) {
  window.localStorage.setItem('blackData', JSON.stringify(defaultData))
} else {
  const cacheData = window.localStorage.getItem('blackData')
  defaultData = JSON.parse(cacheData)
}

const getFormData = data => {
  data.start_day = moment(data.start_day)
  data.end_day = moment(data.end_day)
  return data
}

const getCacheData = data => {
  const result = { ...data }
  result.start_day = formatTime(result.start_day)
  result.end_day = formatTime(result.end_day)
  return result
}

const getSubmitData = formData => {
  const { start_day, end_day, month_salary, year_end_bonus_month, achievement, unused_days, damages_mode } = formData

  // 今年的在职天数
  const days_this_year = end_day.diff(moment(1, 'MM'), 'days')

  // 年终奖
  const year_end_bonus = (year_end_bonus_month - 12) * achievement * month_salary

  // 年度月薪
  const average_month_salary = (12 * month_salary + year_end_bonus) / 12

  // 北京社平3倍
  const max_month_salary = 37840

  // N
  const money_n = Math.floor(Math.min(37840, average_month_salary))

  // 日薪
  const day_salary = div(month_salary, 21.75)

  // 补偿金
  const money_damages_map = {
    '2n': mul(money_n, 2),
    n1: add(money_n, month_salary),
    n: money_n
  }

  const money_holidays = mul(unused_days, day_salary, 2)
  const money_bonus = year_end_bonus * (days_this_year / 365)
  const money_damages = money_damages_map[damages_mode]

  return {
    money_holidays,
    money_bonus,
    money_damages,
    money_total: add(money_holidays, money_bonus, money_damages)
  }
}

export default () => {
  const formRef = useRef()

  const [formData, setFormData] = useState(getFormData({ ...defaultData }))

  const onValuesChange = (changedValues, allValues) => {
    setFormData(allValues)
    window.localStorage.setItem('blackData', JSON.stringify(getCacheData(allValues)))
  }

  return (
    <div style={{ padding: 10 }}>
      <Card title="基本信息" size="small">
        <Form
          ref={formRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={omit(defaultData, ['start_day', 'end_day'])}
          onValuesChange={onValuesChange}
          autoComplete="off"
        >
          <Form.Item label="入职日期" name="start_day" initialValue={moment(defaultData.start_day)}>
            <DatePicker style={{ width: '100%' }} allowClear={false} />
          </Form.Item>
          <Form.Item label="end_day" name="end_day" initialValue={moment(defaultData.end_day)}>
            <DatePicker style={{ width: '100%' }} allowClear={false} />
          </Form.Item>
          <Form.Item label="月薪" name="month_salary">
            <InputNumber step={1000} prefix="元" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="年终奖模式" name="year_end_bonus_month">
            <Select style={{ width: '100%' }} options={YearEndBonusMonthEnum} />
          </Form.Item>
          <Form.Item label="绩效" name="achievement">
            <InputNumber step={0.1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="未休年假" name="unused_days">
            <InputNumber step={0.5} prefix="天" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="赔偿金模式" name="damages_mode">
            <Select style={{ width: '100%' }} options={DamagesModeEnum} />
          </Form.Item>
        </Form>
      </Card>

      <Card title="赔偿金" size="small">
        <Descriptions column={1} labelStyle={{ width: 100, textAlign: 'right' }}>
          {columns.map(v => {
            const { name, label } = v
            const value = getSubmitData(formData)[name]
            const money = Math.floor(value)
            return (
              <Descriptions.Item label={label} key={name}>
                <Text copyable={{ text: money }}>{money} 元</Text>
              </Descriptions.Item>
            )
          })}
        </Descriptions>
      </Card>
    </div>
  )
}
