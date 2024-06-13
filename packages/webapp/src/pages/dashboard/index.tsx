import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload, Card, Button } from 'antd';
import { analysis, exportToExcel } from '~/utils';
import { fileUpload } from '~/pages/dashboard/service';

const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: true,
  accept: '.xlsx,.xls',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, 'uploading');
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  beforeUpload(file) {
    analysis(file).then((res: any) => {
      if (res.length === 0) {
        message.error('上传的文件没有内容, 请重新上传');
        return;
      }
      fileUpload(res[0].sheet).then((res: any) => {
        if (res.statusCode === 1 && res.data.length === 0) {
          message.success('处理成功');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
        if (res.data.length !== 0) {
          exportToExcel(res.data, '发送失败的名单.xlsx');
          message.error('处理失败');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    });
    return false;
  },
};

const download = () => {
  exportToExcel(
    [
      {
        姓名: '',
        工号: '',
        部门: '',
        职位: '',
        邮箱: '',
        月薪: '',
        个人所得税: '',
        社保扣款: '',
        公积金扣款: '',
        '工资总额（税前）': '',
        '应发工资（税后）': '',
        '实发工资（税后）': '',
        工资条日期: '',
        工资发放日期: '',
      },
    ],
    '工资条-模板.xlsx'
  );
};

const DashboardPage: React.FC = () => (
  <Card style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div>
      <div style={{ textAlign: 'center', fontSize: 18, marginBottom: 15, fontWeight: 'bold' }}>选择文件, 并发送通知</div>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
        <p className="ant-upload-hint">支持单次或批量上传。严禁上传公司数据或其他被禁止的文件。</p>
      </Dragger>
      <Button type="link" onClick={download}>
        下载模板
      </Button>
    </div>
  </Card>
);

export { DashboardPage };
