import React, { useRef, useState, useEffect } from 'react'
import { Card, Space, Form, InputNumber, Input, DatePicker, Typography } from 'antd'
import { div } from '@nbfe/tools'
import moment from 'moment'

export default () => {
  const formRefHolidays = useRef()
  const formRefBonus = useRef()
  const formRefN = useRef()

  const [totalHolidaysMoney, setTotalHolidaysMoney] = useState(0)
  const [bonusMoney, setBonusMoney] = useState(0)

  const handleChangeMonthSalary = () => {
    const formNode = formRefHolidays.current
    const { month_salary, days } = formNode.getFieldsValue()
    const day_salary = Math.floor(div(month_salary, 21.75))
    formNode.setFieldsValue({
      day_salary
    })
    setTotalHolidaysMoney(day_salary * days || 0)
    handleUpdateMoney()
  }

  const handleChangeLastday = () => {
    const formNode = formRefBonus.current
    const { lastday } = formNode.getFieldsValue()
    const days = moment(lastday).diff(moment('2022-01-01'), 'days')
    formNode.setFieldsValue({
      days,
      ratio: div(days, 365)
    })
    handleChangeStartDay()
    handleUpdateMoney()
  }

  const handleChangeStartDay = () => {
    const formNode1 = formRefHolidays.current
    const { month_salary } = formNode1.getFieldsValue()

    const formNode2 = formRefBonus.current
    const { lastday, ratio } = formNode2.getFieldsValue()

    const formNode3 = formRefN.current
    const { startDay } = formNode3.getFieldsValue()

    const days = lastday.diff(startDay, 'days')

    formNode3.setFieldsValue({
      days
    })
  }

  const handleUpdateMoney = () => {
    const formNode1 = formRefHolidays.current
    const { month_salary } = formNode1.getFieldsValue()
    const formNode2 = formRefBonus.current
    const { achievement, ratio } = formNode2.getFieldsValue()
    const formNode3 = formRefN.current

    // 过去一年月平均薪资
    const average_month_salary = ((12 + 4 * achievement) / 12) * month_salary

    const money_n = Math.floor(Math.min(37840, average_month_salary))

    const money_n_1 = money_n + month_salary

    const money_2n = money_n * 2

    formNode3.setFieldsValue({
      money_n,
      money_n_1,
      money_2n
    })

    setBonusMoney(Math.floor(4 * month_salary * achievement * ratio) || 0)
  }

  useEffect(() => {
    handleChangeMonthSalary()
    handleChangeLastday()
  }, [])

  return (
    <div style={{ padding: 10 }}>
      <Card
        title={
          <Space>
            <span>年假金额: </span>
            <Typography.Text type="danger" copyable={{ text: totalHolidaysMoney }}>
              {totalHolidaysMoney}元
            </Typography.Text>
          </Space>
        }
      >
        <Form
          ref={formRefHolidays}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ month_salary: 38000, days: 1 }}
          autoComplete="off"
        >
          <Form.Item label="月薪" name="month_salary">
            <InputNumber step={1000} prefix="元" style={{ width: '100%' }} onChange={handleChangeMonthSalary} />
          </Form.Item>
          <Form.Item label="日薪" name="day_salary">
            <InputNumber step={1000} prefix="元" style={{ width: '100%' }} disabled />
          </Form.Item>
          <Form.Item label="未休年假" name="days">
            <InputNumber step={0.5} prefix="天" style={{ width: '100%' }} onChange={handleChangeMonthSalary} />
          </Form.Item>
        </Form>
      </Card>

      <Card
        title={
          <Space>
            <span>年终奖金额: </span>
            <Typography.Text type="danger" copyable={{ text: totalHolidaysMoney }}>
              {bonusMoney}元
            </Typography.Text>
          </Space>
        }
      >
        <Form
          ref={formRefBonus}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ achievement: 1, lastday: moment('2022-06-08') }}
          autoComplete="off"
        >
          <Form.Item label="绩效系数" name="achievement">
            <InputNumber step={0.1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="lastday" name="lastday">
            <DatePicker
              disabledDate={currentDate => {
                return currentDate < moment('2022-06-01')
              }}
              style={{ width: '100%' }}
              onChange={handleChangeLastday}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item label="今年天数" name="days">
            <Input disabled style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="时间系数" name="ratio">
            <Input disabled style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Card>

      <Card title="N的计算方式">
        <Form
          ref={formRefN}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{
            startDay: moment('2020-07-23')
          }}
          autoComplete="off"
        >
          <Form.Item label="入职日期" name="startDay">
            <DatePicker
              disabledDate={currentDate => {
                return currentDate > moment('2022-01-01')
              }}
              style={{ width: '100%' }}
              onChange={handleChangeStartDay}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item label="在职天数" name="days">
            <InputNumber prefix="天" style={{ width: '100%' }} disabled />
          </Form.Item>
          <Form.Item label="N" name="money_n">
            <InputNumber prefix="元" style={{ width: '100%' }} disabled />
          </Form.Item>
          <Form.Item label="N+1" name="money_n_1">
            <InputNumber prefix="元" style={{ width: '100%' }} disabled />
          </Form.Item>
          <Form.Item label="2N" name="money_2n">
            <InputNumber prefix="元" style={{ width: '100%' }} disabled />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
