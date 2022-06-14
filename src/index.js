import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider, Button, Modal, notification } from 'antd'
import DownloadOutlined from '@ant-design/icons/DownloadOutlined'
import moment from 'moment'
import { getAntdLocaleZhCN, defineMomentLocaleZhCn } from '@nbfe/tools'
import App from './App'
import './index.css'

document.title = '黑壳'

defineMomentLocaleZhCn(moment)

moment.locale('zh-cn', {
  week: {
    dow: 1
  }
})

const Index = () => {
  return (
    <ConfigProvider locale={getAntdLocaleZhCN()}>
      <App />
    </ConfigProvider>
  )
}

ReactDOM.render(<Index />, document.getElementById('root'))
