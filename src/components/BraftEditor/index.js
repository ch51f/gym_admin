import React, {Component} from 'react';
import {connect} from 'dva';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import {upyun_sign, upyun } from '../../services/api';
export default class Section extends Component {
  state = {
    htmlContent: ''
  }



  uploadFn = (param) => {
    const response = upyun_sign({
      method: 'POST', 
      ext: param.file.type.split('/')[1] || 'jpg', 
      sizes: '100_100' || "600_600", 
    }); 
    response.then((res) => {
      if (res.status === 0) {
        let formData = new FormData(); 
        formData.append('policy', res.data.signatures[0].policy); 
        formData.append('signature', res.data.signatures[0].signature); 
        formData.append('file', param.file); 
        console.log(formData) 
        const res1 = upyun(formData);
        res1.then((re) => {
          param.success({
            url: res.data.host + re.url
          })
        })
      }
    })
  }

  render() {
    let {dispatch} = this.props;
    const editorProps = {
      placeholder: this.props.placeholder,
      contentFormat: 'html',
      initialContent: this.props.content,
      onChange : this.handleChange.bind(this),
      viewWrapper: '.demo',
      media: {
        allowPasteImage: true,
        image: true,
        video: true,
        audio: true,
        uploadFn: this.uploadFn
      }
    }

    return (
      <div className="demo" style={{'border': '1px solid #ddd'}}>
        <BraftEditor {...editorProps}  ref={instance => this.editorInstance = instance} />
      </div>
    )

  }

  handleChange = (htmlContent) => {
    console.log(this)
    this.props.change(htmlContent, this.editorInstance ? this.editorInstance.isEmpty() : false);
  }
}

Section.defaultProps = {
  content: "",
  placeholder: ''
};