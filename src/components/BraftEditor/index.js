import React, {Component} from 'react';
import {connect} from 'dva';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';

export default class Section extends Component {
  state = {
    htmlContent: ''
  }
  render() {
    const editorProps = {
      placeholder: 'Hello World!',
      contentFormat: 'html',
      initialContent: this.props.content,
      onChange : this.handleChange.bind(this),
      viewWrapper: '.demo',
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
  content: ""
};